<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList" v-has="'role-query'"
            >查询</el-button
          >
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate" v-has="'role-create'"
          >创建</el-button
        >
      </div>
      <el-table :data="roleList" row-key="_id">
        <!--:formatter="item.formatter"-->
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.row)"
              v-has="'role-edit'"
              >编辑
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="handleOpenPermission(scope.row)"
              v-has="'role-setting'"
              >设置权限
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row._id)"
              v-has="'role-delete'"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :page-size="pager.pageSize"
        :total="pager.total"
        background
        class="pagination"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <!-- 角色新增表单 -->
    <el-dialog
      :title="action === 'create' ? '角色创建' : '角色编辑'"
      v-model="showModal"
    >
      <el-form
        ref="dialogForm"
        :model="roleForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="roleForm.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            rows="2"
            v-model="roleForm.remark"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!--权限弹窗-->
    <el-dialog title="权限设置" v-model="showPermission">
      <el-form label-width="100px">
        <el-form-item label="角色名称">{{ curRoleName }}</el-form-item>
        <el-form-item label="选择权限">
          <el-tree
            ref="permissionTree"
            :data="menuList"
            show-checkbox
            node-key="_id"
            default-expand-all
            :props="{ label: 'menuName' }"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handlePermissionClose">取 消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref, reactive } from "vue";
import utils from "./../util/utils";

const { proxy } = getCurrentInstance();

// 头部的搜索表单
const queryForm = reactive({
  roleName: "",
  remark: "",
});
// 角色列表
const roleList = ref([]);
// tree ref
const permissionTree = ref(null);
// 列表头
//列表头
const columns = ref([
  {
    label: "角色名称",
    prop: "roleName",
  },
  {
    label: "备注",
    prop: "remark",
  },
  {
    label: "权限列表",
    prop: "permissionList",
    // 做格式化
    formatter(row, column, value) {
      let names = [];
      // 从value 该条数据中取得halfCheckedKeys
      let list = value.halfCheckedKeys || [];
      list.map((key) => {
        let name = actionMap[key];
        if (key && name) {
          names.push(actionMap[key]);
        }
      });
      return names.join(",");
    },
  },
  {
    label: "更新时间",
    prop: "updateTime",
    formatter(row, column, value) {
      return utils.formateDate(new Date(value));
    },
  },
  {
    label: "创建时间",
    prop: "createTime",
    formatter(row, column, value) {
      return utils.formateDate(new Date(value));
    },
  },
]);
// 分页数据
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
// 弹窗对应的表单数据
const roleForm = reactive({
  roleName: "",
  remark: "",
});

// 弹窗显示
const showModal = ref(false);

//表单校验
const rules = reactive({
  roleName: [
    {
      required: true,
      message: "请输入角色名称",
    },
  ],
});

// 操作的标识
const action = ref("");

// 权限弹窗
const showPermission = ref(false);
const curRoleName = ref("");
const curRoleId = ref("");
// 菜单树
const menuList = ref([]);
// 映射表
const actionMap = reactive({});

onMounted(() => {
  getRoleList();
  getMenuList();
});

// 获取菜单列表
const getMenuList = async () => {
  let list = await proxy.$api.getMenuList();
  menuList.value = list;
  getActionMap(list);
};

// 获取角色列表
const getRoleList = async () => {
  let { list, page } = await proxy.$api.getRoleList({ ...queryForm, ...pager });
  roleList.value = list;
  pager.total = page.total;
};

// 创建表单 弹窗显示
const handleCreate = () => {
  showModal.value = true;
  action.value = "create";
};
// 角色 修改编辑 注意点-还是不要直接赋值
const handleEdit = (row) => {
  showModal.value = true;
  action.value = "edit";
  let params = {
    _id: row._id,
    roleName: row.roleName,
    remark: row.remark,
  };
  proxy.$nextTick(() => {
    Object.assign(roleForm, params);
  });
};
// 角色 删除
const handleDelete = (_id) => {
  proxy
    .$confirm("是否删除角色", "", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.$api.roleOperate({ _id, action: "delete" });
      proxy.$message.success("删除成功");
      getRoleList();
    });
};
// 表单重置
const handleReset = (form) => {
  proxy.$refs[form].resetFields();
};

// 分页页码切换
const handleCurrentChange = (current) => {
  pager.pageNum = current;
  getRoleList();
};
// 编辑弹框关闭-关闭时重置表单
const handleClose = () => {
  showModal.value = false;
  handleReset("dialogForm");
};

// 表单提交逻辑
const handleSubmit = () => {
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = {
        action: action.value,
        ...roleForm,
      };
      let res = await proxy.$api.roleOperate(params);
      if (res) {
        if (action.value == "create") {
          proxy.$message.success("创建成功");
        } else {
          proxy.$message.success("编辑成功");
        }
        handleClose();
        getRoleList();
      }
    }
  });
};

// 打开权限弹窗
const handleOpenPermission = (row) => {
  curRoleId.value = row._id;
  curRoleName.value = row.roleName;
  showPermission.value = true;
  const { checkedKeys } = row.permissionList;
  // setTimeout(() => {})
  proxy.$nextTick(() => {
    // 通过句柄来调用函数 给el-tree添加ref
    // 通过ref调用函数 设置选中的节点
    // 这里需要定义数据 permissionTree来获取到句柄
    permissionTree.value.setCheckedKeys(checkedKeys);
  });
};
// 关闭权限弹窗
const handlePermissionClose = () => {
  showPermission.value = false;
};
// 权限弹窗的提交
const handlePermissionSubmit = async () => {
  // 选中的节点
  let nodes = permissionTree.value.getCheckedNodes();
  // 半选中的父节点
  let halfKeys = permissionTree.value.getHalfCheckedKeys();
  let checkedKeys = [];
  let parendKeys = [];
  // 选中的按钮和选中的菜单需要区别保存
  nodes.map((node) => {
    if (!node.children) {
      checkedKeys.push(node._id);
    } else {
      parendKeys.push(node._id);
    }
  });
  let params = {
    _id: curRoleId.value,
    permissionList: {
      checkedKeys: checkedKeys,
      halfCheckedKeys: parendKeys.concat(halfKeys),
    },
  };
  let res = await proxy.$api.updatePermission(params);
  showPermission.value = false;
  proxy.$message.success("操作成功");
  getRoleList();
};
// 数据加工
const getActionMap = (list) => {
  let actionArr = {};
  const deep = (arr) => {
    while (arr.length) {
      let item = arr.pop();
      if (item.children && item.action) {
        // id 和 name 映射
        actionArr[item._id] = item.menuName;
      }
      if (item.children && !item.action) {
        deep(item.children);
      }
    }
  };
  // 不能在原对象上做操作 先做一层处理
  deep(JSON.parse(JSON.stringify(list)));
  Object.assign(actionMap, actionArr);
};
</script>

<style lang="scss"></style>