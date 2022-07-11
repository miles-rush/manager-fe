<template>
  <div class="dept-manage">
    <div class="query-form">
      <!--通过设置 inline 属性为 true 可以让表单域变为行内的表单域 -->
      <el-form :inline="true" ref="queryFormRef" :model="queryForm">
        <el-form-item label="部门名称">
          <el-input
            placeholder="请输入部门名称"
            v-model="queryForm.deptName"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDeptList" type="primary">查询</el-button>
          <el-button @click="queryHandleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleOpen">创建</el-button>
      </div>
      <!-- 树形结构 -->
      <el-table
        :data="deptList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
        stripe
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          v-bind="item"
        ></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="action === 'create' ? '创建部门' : '编辑部门'"
      v-model="showModel"
      @close="handleReset('dialogForm')"
    >
      <el-form
        ref="dialogForm"
        :model="deptForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            :options="deptList"
            show-all-levels
            placeholder="请选择上级部门"
            v-model="deptForm.parentId"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="部门名称" prop="deptName">
          <el-input
            placeholder="请输入部门名称"
            v-model="deptForm.deptName"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="userName">
          <el-select
            placeholder="请输入部门负责人名称"
            v-model="deptForm.userName"
            style="width: 100%"
            @change="handleUser"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="userEmail">
          <el-input
            placeholder="请输入负责人邮箱"
            v-model="deptForm.userEmail"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="handleSubmit" type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted, reactive, toRaw } from "vue";
import utils from "../util/utils";
// this
const { proxy } = getCurrentInstance();
// 搜索表单数据项
const queryForm = reactive({
  deptName: "",
});
// 列表头
const columns = ref([
  {
    label: "部门名称",
    prop: "deptName",
  },
  {
    label: "负责人",
    prop: "userName",
  },
  {
    label: "更新时间",
    prop: "updateTime",
    formatter(roe, column, value) {
      return utils.formateDate(new Date(value));
    },
  },
  {
    label: "创建时间",
    prop: "createTime",
    formatter(roe, column, value) {
      return utils.formateDate(new Date(value));
    },
  },
]);
// 部门列表
const deptList = ref([]);
// 分页
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
});
// 操作标识action
const action = ref("");
// 弹窗显示 关闭
const showModel = ref(false);
// 用户列表
const userList = ref([]);
// 创建部门表单
const deptForm = reactive({
  parentId: [null],
});

// 创建部门表单验证规则
const rules = reactive({
  deptName: [
    {
      required: true,
      message: "请输入部门名称",
      trigger: "blur",
    },
  ],
  userName: [
    {
      required: true,
      message: "请选择负责人",
      trigger: "change",
    },
  ],
});

onMounted(() => {
  getDeptList();
  getUserAllList();
});

//获取负责人列表(所有用户列表)
const getUserAllList = async () => {
  const res = await proxy.$api.getAllUserList();
  userList.value = res;
};

// 获取部门列表
const getDeptList = async () => {
  const res = await proxy.$api.getDeptList(queryForm);
  deptList.value = res;
};
// 重置表单
const handleReset = (form) => {
  proxy.$refs[form].resetFields();
};
// 查询表单重置
const queryHandleReset = () => {
  queryForm.deptName = "";
  getDeptList();
};
// 打开弹窗
const handleOpen = () => {
  action.value = "create";
  showModel.value = true;
};
// 关闭弹窗
const handleClose = () => {
  showModel.value = false;
  handleReset("dialogForm");
};
// 部门 编辑
const handleEdit = (row) => {
  action.value = "edit";
  showModel.value = true;
  proxy.$nextTick(() => {
    Object.assign(deptForm, row);
  });
};
// 部门 删除
const handleDelete = (_id) => {
  proxy
    .$confirm("是否确认删除部门", "", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(() => {
      action.value = "delete";
      let params = {
        _id,
        action: action.value,
      };
      proxy.$api.deptOperate(params);
      proxy.$message.success("删除成功");
      getDeptList();
    });
};
// 操作提交
const handleSubmit = () => {
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = {
        ...toRaw(deptForm),
        action: action.value,
      };
      //   delete params.userId;
      //   delete params.userEmail;
      //   delete params.userName;
      const res = await proxy.$api.deptOperate(params);
      proxy.$message.success("操作成功");
      handleClose("dialogForm");
      getDeptList();
    }
  });
};
// 监听切换负责人 显示对应邮箱
const handleUser = (value) => {
  const [userId, userName, userEmail] = value.split("/");
  Object.assign(deptForm, { userId, userName, userEmail });
};
</script>
