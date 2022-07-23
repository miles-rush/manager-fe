<template>
  <router-view></router-view>
  <!-- <v-input
    v-model="userName"
    v-model:title="title"
    @handleSubmit="handleSubmit"
  ></v-input> -->
</template>
<script>
import VInput from "./components/VInput.vue";
import { ref } from "@vue/reactivity";
export default {
  components: { VInput },
  name: "app",
  setup() {
    let userName = ref("miles");
    let title = ref("Vue3");
    const handleSubmit = (values) => {
      console.log("接收数据", values);
      console.log("当前对象:", userName);
    };
    return {
      userName,
      title,
      handleSubmit,
    };
  },
};
</script>

<style lang="scss">
@import "./assets/style/reset.css";
@import "./assets/style/index.scss";
</style>
