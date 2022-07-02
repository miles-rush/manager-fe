<template>
  <div>
  <h1>欢迎来到主界面</h1>
  <el-button @click="goHome">回首页</el-button>
  </div>
</template>


<script>
export default {
    name: "login",
    mounted() {

    },
    methods: {
        goHome() {
            // this.$request.get('/login', {name:'miles'},{mock:true,loading:true}).then((res)=>{
            //     console.log(res);
            // })
            this.$router.push("/welcome");
        }
    },
}
</script>



<style scoped>

</style>
