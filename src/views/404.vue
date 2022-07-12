<template>
  <div class="exception">
    <h1 class="text">404</h1>
    <el-button @click="goHome" type="primary" class="btn" size="large"
      >回首页</el-button
    >
  </div>
</template>
<script setup>
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const goHome = () => {
  proxy.$router.push("/");
};
</script>
<style lang="scss">
.exception {
  position: relative;
  .text {
    text-align: center;
    font-size: 100px;
  }
  .btn {
    position: fixed;
    bottom: 100px;
    left: 50%;
    margin-left: -34px;
  }
}
</style>
