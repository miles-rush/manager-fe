<template>
  <div>
  <h1>欢迎来到主界面</h1>
  <Welcome msg="miles"/>
  <el-button @click="goHome">回首页</el-button>
  </div>
</template>


<script>
import Welcome from "./Welcome.vue";
export default {
    name: "login",
    methods: {
        goHome() {
            this.$router.push("/welcome");
        }
    },
    components: { Welcome }
}
</script>



<style scoped>

</style>
