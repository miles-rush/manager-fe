<template>
  <div class="base-table">
    <div class="action">
      <slot name="action"></slot>
    </div>
    <!-- 注意这里用$attrs -->
    <el-table v-bind="$attrs">
      <template v-for="item in columns" :key="item.prop">
        <el-table-column
          type="selection"
          v-if="item.type == 'selection'"
          width="55"
          key="selection"
        />
        <el-table-column v-bind="item" v-else-if="!item.type">
        </el-table-column>
        <el-table-column v-if="item.type == 'action'" v-bind="item">
          <!-- 自定义列模板 -->
          <!-- 需要包裹一层template 获得scope -->
          <template #default="scope">
            <template v-for="(btn, index) in item.list" :key="index">
              <el-button
                :type="btn.type || 'text'"
                size="small"
                @click="handleAction(index, scope.row)"
              >
                {{ btn.text }}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      class="pagination"
      :currentPage="pager.pageNum"
      background
      layout="prev, pager, next"
      :total="pager.total"
      :page-size="pager.pageSize"
      :page-sizes="[5, 10, 20, 100]"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
export default {
  name: "BaseTable",
  props: ["columns", "pager"],
  emits: ["handleAction", "handleCurrentChange"],
  setup(props, { emit }) {
    /**
     * 列按钮点击
     * @param {number} 索引
     * @param {object} 行数据
     */
    const handleAction = (index, row) => {
      // 需要对row做结构 将其变成一个普通对象
      emit("handleAction", { index, row: { ...row } });
    };
    /**
     * 页码变化
     * @param pageNum {number} 页码
     */
    const handleCurrentChange = (pageNum) => {
      emit("handleCurrentChange", pageNum);
    };
    return {
      handleAction,
      handleCurrentChange,
    };
  },
};
</script>