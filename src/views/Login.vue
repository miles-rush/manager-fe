<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form ref="userForm" :model="user" status-icon :rules="rules">
        <div class="title">VEK后台管理系统</div>
        <el-form-item prop="userName">
          <el-input
            type="text"
            prefix-icon="User"
            v-model="user.userName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input
            type="password"
            prefix-icon="View"
            v-model="user.userPwd"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary" @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
import utils from "./../util/utils";
import storage from "./../util/storage";
const modules = import.meta.glob("./../views/*.vue");
export default {
  name: "login",
  data() {
    return {
      user: {
        userName: "admin",
        userPwd: "admin",
      },
      rules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        userPwd: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.$api.login(this.user).then(async (res) => {
            this.$store.commit("saveUserInfo", res);
            await this.loadAsyncRoutes();
            this.$router.push("/welcome");
          });
        } else {
          return false;
        }
      });
    },
    async loadAsyncRoutes() {
      let userInfo = storage.getItem("userInfo") || {};
      if (userInfo.token) {
        const { menuList } = await this.$api.getPermissionList();
        let routes = utils.generateRoutes(menuList);
        routes.map((route) => {
          let url = `./../views/${route.component}.vue`;
          // route.component = () => import(/* @vite-ignore */url);
          route.component = modules[url];
          this.$router.addRoute("home", route);
        });
      }
    },
  },
};
</script>



<style lang="scss">
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;
  .modal {
    width: 500px;
    padding: 50px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    .title {
      font-size: 50px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
      color: #142aa185;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>
