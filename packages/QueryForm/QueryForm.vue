<template>
  <el-form ref="queryForm" :inline="true" :model="queryModel">
    <template v-for="(item, index) in form" :key="index">
      <FormItem :item="item" v-bind="item" v-model="queryModel[item.model]" />
    </template>
    <el-form-item>
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getCurrentInstance, reactive } from "@vue/runtime-core";
/**
 * form = [
 *  {
 *      type: "input",
 *      model: "userId",
 *      label: "用户ID",
 *      placeholder: "请输入用户ID"
 *  }
 * ]
 */
import FormItem from "./FormItem.vue";
export default {
  name: "QueryForm",
  // v-model -> modelValue
  props: ["modelValue", "form"],
  emits: ["update:modelValue"],
  components: { FormItem },
  emits: ["handleQuery", "handleReset"], // 记录当前组件emit的事件
  setup(props, context) {
    const proxy = getCurrentInstance();
    const form = props.form;
    const queryModel = reactive({
      ...props.modelValue,
    });
    const handleReset = () => {
      proxy.refs.queryForm.resetFields();
    };
    const handleQuery = () => {
      // todo
      context.emit("update:modelValue", { ...queryModel }); // 优先
      context.emit("handleQuery", { ...queryModel });
    };

    return {
      queryModel,
      handleReset,
      handleQuery,
    };
  },
};
</script>
