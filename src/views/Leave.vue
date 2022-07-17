<template>
  <div class="leave-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getApplyList" type="primary">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>
      <el-table :data="applyList">
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
            <el-button size="small" @click="handleDetail(scope.row)"
              >查看</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row._id)"
              v-if="[1, 2].includes(scope.row.applyState)"
              >作废</el-button
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
    </div>
    <el-dialog title="申请休假" v-model="showModal" width="70%">
      <el-form
        ref="dialogForm"
        :model="leaveForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="休假类型" prop="applyType" required>
          <el-select v-model="leaveForm.applyType">
            <el-option label="事假" :value="1"></el-option>
            <el-option label="调休" :value="2"></el-option>
            <el-option label="年假" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假时间" prop="applyType" required>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="startTime" required>
                <!-- 两个时间选择器共用一个change方法 所以需要传入标识来区分 -->
                <el-date-picker
                  v-model="leaveForm.startTime"
                  type="date"
                  placeholder="请选择开始日期"
                  @change="(val) => handleDateChange('startTime')"
                />
              </el-form-item>
            </el-col>
            <el-col style="margin-left: 10px" :span="1"> - </el-col>
            <el-col :span="8">
              <el-form-item prop="endTime" required>
                <el-date-picker
                  v-model="leaveForm.endTime"
                  type="date"
                  placeholder="请选择结束日期"
                  @change="(val) => handleDateChange('endTime')"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长" required>
          {{ leaveForm.leaveTime }}
        </el-form-item>
        <el-form-item label="休假原因" prop="reasons" required>
          <el-input
            type="textarea"
            :row="3"
            placeholder="请输入休假原因"
            v-model="leaveForm.reasons"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取 消</el-button>
        <el-button @click="handleSubmit" type="primary">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 申请休假详情 -->
    <el-dialog title="申请休假详情" width="50%" v-model="showDetailModal">
      <!-- 使用destroy-on-close清除缓存-->
      <el-steps
        :active="detail.applyState > 2 ? 3 : detail.applyState"
        destroy-on-close
        align-center
      >
        <el-step title="待审批"></el-step>
        <el-step title="审批中"></el-step>
        <el-step title="审批通过/拒绝"></el-step>
      </el-steps>
      <el-form label-width="120px" label-suffix=":">
        <el-form-item label="休假类型">
          <div>{{ detail.applyTypeName }}</div>
        </el-form-item>
        <el-form-item label="休假时间">
          <div>{{ detail.time }}</div>
        </el-form-item>
        <el-form-item label="休假时长">
          <div>{{ detail.leaveTime }}</div>
        </el-form-item>
        <el-form-item label="休假原因">
          <div>{{ detail.reasons }}</div>
        </el-form-item>
        <el-form-item label="审批状态">
          <div>{{ detail.applyStateName }}</div>
        </el-form-item>
        <el-form-item label="审批人">
          <div>{{ detail.curAuditUserName }}</div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from "vue";
import utils from "./../util/utils";
const { proxy } = getCurrentInstance();

// 查询表单
const queryForm = reactive({
  applyState: "",
});
// 表单数据项
const columns = reactive([
  {
    label: "单号",
    prop: "orderNo",
  },
  {
    label: "休假时间",
    prop: "",
    width: "200px",
    formatter(row) {
      return (
        utils.formateDate(new Date(row.startTime), "yyyy-MM-dd") +
        " 到 " +
        utils.formateDate(new Date(row.endTime), "yyyy-MM-dd")
      );
    },
  },
  {
    label: "休假时长",
    prop: "leaveTime",
  },
  {
    label: "休假类型",
    prop: "applyType",
    formatter(row, column, value) {
      return {
        1: "事假",
        2: "调休",
        3: "年假",
      }[value];
    },
  },
  {
    label: "休假原因",
    prop: "reasons",
  },
  {
    label: "申请时间",
    prop: "createTime",
    formatter: (row, column, value) => {
      return utils.formateDate(new Date(value));
    },
  },
  {
    label: "审批人",
    prop: "auditUsers",
  },
  {
    label: "当前审批人",
    prop: "curAuditUserName",
  },
  {
    label: "审批状态",
    prop: "applyState",
    formatter: (row, column, value) => {
      return {
        1: "待审批",
        2: "审批中",
        3: "审批拒绝",
        4: "审批通过",
        5: "作废",
      }[value];
    },
  },
]);
// 分页对象
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
// 申请列表
const applyList = ref([]);
// 创建休假弹框表单
const leaveForm = reactive({
  applyType: 1,
  startTime: "",
  endTime: "",
  leaveTime: "0天",
  reasons: "",
});
// 弹窗显隐
const showModal = ref(false);
// 申请休假弹窗
const showDetailModal = ref(false);
// 操作行为
const action = ref("create");
// 校验规则
const rules = reactive({
  startTime: [
    {
      type: "date",
      required: true,
      message: "请输入开始日期",
      trigger: "change",
    },
  ],
  endTime: [
    {
      type: "date",
      required: true,
      message: "请输入结束日期",
      trigger: "change",
    },
  ],
  reasons: [
    {
      required: true,
      message: "请输入休假原因",
      trigger: ["change", "blur"],
    },
  ],
});
// 详情
const detail = ref({});
onMounted(() => {
  getApplyList();
});
// 获取审批列表
const getApplyList = async () => {
  // 拼接参数 包括查询表单和分页
  let params = { ...queryForm, ...pager };
  let { list, page } = await proxy.$api.getApplyList(params);
  applyList.value = list;
  pager.total = page.total;
};
// 分页切换
const handleCurrentChange = (current) => {
  pager.pageNum = current;
  getApplyList();
};
// 点击 申请休假 展示弹框
const handleApply = () => {
  showModal.value = true;
  action.value = "create";
};
// 重置表单
const handleReset = (form) => {
  proxy.$refs[form].resetFields();
};
// 弹框关闭
const handleClose = () => {
  showModal.value = false;
  handleReset("dialogForm");
  leaveForm.leaveTime = "0天";
};
// 获取休假时长
const handleDateChange = (key, val) => {
  let { startTime, endTime } = leaveForm;
  if (!startTime || !endTime) return;
  if (startTime > endTime) {
    proxy.$message.error("开始日期不能晚于结束日期");
    leaveForm.leaveTime = "0天";
    setTimeout(() => {
      leaveForm[key] = "";
    }, 0);
  } else {
    leaveForm.leaveTime =
      (endTime - startTime) / (24 * 60 * 60 * 1000) + 1 + "天";
  }
};
// 弹框提交
const handleSubmit = () => {
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = { ...leaveForm, action: action.value };
      let res = await proxy.$api.leaveOperate(params);
      proxy.$message.success("申请成功");
      // 关闭清空弹框
      handleClose();
      // 重新加载数据
      getApplyList();
    }
  });
};
// 审批详细显示
const handleDetail = (row) => {
  showDetailModal.value = true;
  let data = { ...row };
  data.applyTypeName = {
    1: "事假",
    2: "调休",
    3: "年假",
  }[data.applyType];
  data.time =
    utils.formateDate(new Date(row.startTime), "yyyy-MM-dd") +
    " 到 " +
    utils.formateDate(new Date(row.endTime), "yyyy-MM-dd");
  data.applyStateName = {
    1: "待审批",
    2: "审批中",
    3: "审批拒绝",
    4: "审批通过",
    5: "作废",
  }[data.applyState];
  detail.value = data;
};
// 作废
const handleDelete = async (_id) => {
  let params = { action: "delete", _id };
  await proxy.$api.leaveOperate(params);
  proxy.$message.success("删除成功");
  getApplyList();
};
</script>

<style lang="scss">
</style>
