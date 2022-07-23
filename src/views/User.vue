<template>
  <div class="user-manage">
    <div class="query-form">
      <query-form :form="form" v-model="user" @handleQuery="handleQuery" />
      <!-- <el-form ref="form" :inline="true" :model="user">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery" type="primary">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form> -->
    </div>
    <base-table
      :columns="columns"
      :data="userList"
      :pager="pager"
      @selection-change="handleSelectionChange"
      @handleAction="handleAction"
      @handleCurrentChange="handleCurrentChange"
    >
      <!-- 插槽 -->
      <template v-slot:action>
        <el-button @click="handleCreate" type="primary" v-has="'user-create'"
          >新增</el-button
        >
        <el-button
          @click="handlePatchDel"
          type="danger"
          v-has="'user-patch-delete'"
          >批量删除</el-button
        >
      </template>
    </base-table>
    <!-- <div class="base-table">
      <div class="action">
        <el-button @click="handleCreate" type="primary" v-has="'user-create'"
          >新增</el-button
        >
        <el-button
          @click="handlePatchDel"
          type="danger"
          v-has="'user-patch-delete'"
          >批量删除</el-button
        >
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button
              @click="handleEdit(scope.row)"
              size="small"
              v-has="'user-edit'"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
              v-has="'user-delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        @current-change="handleCurrentChange"
      />
    </div> -->
    <el-dialog
      :title="action == 'add' ? '用户新增' : '用户编辑'"
      v-model="showModal"
      @close="handleReset('dialogForm')"
    >
      <el-form
        ref="dialogForm"
        :model="userForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="userForm.userName"
            :disabled="action == 'edit'"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            v-model="userForm.userEmail"
            :disabled="action == 'edit'"
            placeholder="请输入用户邮箱"
          >
            <template #append>@imooc.com</template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择用户系统角色"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :label="role.roleName"
              :value="role._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取 消</el-button>
        <el-button @click="handleSubmit" type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from "vue";
import utils from "./../util/utils";
export default {
  name: "user",
  setup() {
    // 获取Composition API 上下文对象
    const { proxy } = getCurrentInstance();
    const form = [
      {
        type: "input",
        label: "用户ID",
        model: "userId",
        placeholder: "请输入用户ID",
      },
      {
        type: "input",
        label: "用户名称",
        model: "userName",
        placeholder: "请输入用户名称",
      },
      {
        type: "select",
        label: "状态",
        model: "state",
        placeholder: "请选择状态",
        options: [
          {
            label: "所有",
            value: 0,
          },
          {
            label: "在职",
            value: 1,
          },
          {
            label: "离职",
            value: 2,
          },
          {
            label: "试用期",
            value: 3,
          },
        ],
      },
    ];
    const user = ref({
      state: 0,
    });
    // const user = reactive({
    //   state: 0,
    // });
    const userList = ref([]);
    const showModal = ref(false);
    const pager = reactive({
      pageNum: 1,
      pageSize: 5,
    });
    const columns = reactive([
      {
        type: "selection",
      },
      {
        label: "用户ID",
        prop: "userId",
      },
      {
        label: "用户名",
        prop: "userName",
      },
      {
        label: "用户邮箱",
        prop: "userEmail",
      },
      {
        label: "用户角色",
        prop: "role",
        formatter(row, column, value) {
          return {
            0: "管理员",
            1: "普通用户",
          }[value];
        },
      },
      {
        label: "用户状态",
        prop: "state",
        formatter(row, column, value) {
          return {
            1: "在职",
            2: "离职",
            3: "试用期",
          }[value];
        },
      },
      {
        label: "注册时间",
        prop: "createTime",
        formatter: (row, column, value) => {
          return utils.formateDate(new Date(value));
        },
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
        formatter: (row, column, value) => {
          return utils.formateDate(new Date(value));
        },
      },
      {
        label: "操作",
        type: "action",
        width: 150,
        list: [
          { text: "编辑", type: "primary" },
          { text: "删除", type: "danger" },
        ],
      },
    ]);
    // 选中用户列表的对象
    const checkedUserIds = ref([]);
    // 新增用户Form对象
    const userForm = reactive({
      userName: "",
      state: 3,
    });
    // 所有角色列表
    const roleList = ref([]);
    // 部门列表
    const deptList = ref([]);
    // 定义用户操作的行为
    const action = ref("add");

    // 定义表单校验规则
    const rules = reactive({
      userName: [
        {
          required: true,
          message: "请输入用户名称",
          trigger: "blur",
        },
      ],
      userEmail: [
        { required: true, message: "请输入用户邮箱", trigger: "blur" },
      ],
      mobile: [
        {
          pattern: /1[3-9]\d{9}/,
          message: "请输入正确的手机号格式",
          trigger: "blur",
        },
      ],
      deptId: [
        {
          required: true,
          message: "请输入用户邮箱",
          trigger: "blur",
        },
      ],
    });
    onMounted(() => {
      getUserList();
      getDeptList();
      getRoleAllList();
    });
    // 获取用户列表
    const getUserList = async () => {
      let params = { ...user.value, ...pager };
      const { list, page } = await proxy.$api.getUserList(params);
      userList.value = list;
      pager.total = page.total;
    };
    // 查询事件 获取用户列表
    const handleQuery = () => {
      getUserList();
    };
    // 重置查询表单
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    };
    // 分页事件处理
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
      getUserList();
    };
    // 用户单个删除
    const handleDelete = (row) => {
      proxy
        .$confirm("是否删除角色", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(async () => {
          await proxy.$api.userDel({
            userIds: [row.userId],
          });
          proxy.$message.success("删除成功");
          getUserList();
        });
    };
    // 批量删除
    const handlePatchDel = () => {
      if (checkedUserIds.value.length == 0) {
        proxy.$message.info("请选择要删除的用户");
        return;
      }
      proxy
        .$confirm("是否删除角色", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(async () => {
          const res = await proxy.$api.userDel({
            userIds: checkedUserIds.value,
          });
          if (res.modifiedCount > 0) {
            proxy.$message.success("删除成功");
            getUserList();
          } else {
            proxy.$message.error("删除失败");
          }
        });
    };
    // 表格多选
    const handleSelectionChange = (list) => {
      let arr = [];
      list.map((item) => {
        arr.push(item.userId);
      });
      checkedUserIds.value = arr;
    };
    // 用户新增
    const handleCreate = () => {
      action.value = "add";
      showModal.value = true;
    };
    // 角色列表查询
    const getRoleAllList = async () => {
      const list = await proxy.$api.getRoleAllList();
      roleList.value = list;
    };
    // 部门列表查询
    const getDeptList = async () => {
      const list = await proxy.$api.getDeptList();
      deptList.value = list;
    };
    // 用户弹窗关闭
    const handleClose = () => {
      showModal.value = false;
      handleReset("dialogForm");
    };
    // 用户提交
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = toRaw(userForm);
          params.userEmail += "@imooc.com";
          params.action = action.value;
          let res = await proxy.$api.userSubmit(params);
          showModal.value = false;
          if (action.value === "edit") {
            proxy.$message.success("用户修改成功");
          } else {
            proxy.$message.success("用户创建成功");
          }
          handleReset("dialogForm");
          getUserList();
        }
      });
    };
    const handleAction = ({ index, row }) => {
      if (index == 0) {
        handleEdit(row);
      } else if (index == 1) {
        handleDelete(row);
      }
    };
    // 用户编辑
    const handleEdit = (row) => {
      action.value = "edit";
      showModal.value = true;
      proxy.$nextTick(() => {
        Object.assign(userForm, row);
      });
    };
    return {
      form,
      user,
      userList,
      columns,
      checkedUserIds,
      showModal,
      getUserList,
      getRoleAllList,
      getDeptList,
      roleList,
      deptList,
      pager,
      userForm,
      rules,
      action,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleDelete,
      handlePatchDel,
      handleSelectionChange,
      handleCreate,
      handleClose,
      handleSubmit,
      handleEdit,
      handleAction,
    };
  },
};
</script>

<style lang="scss">
</style>
