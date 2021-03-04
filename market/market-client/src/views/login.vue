<template>
  <div class="login">
    <sheader :name="type == 'login' ? '登录' : '注册'" :back="'/home'" />
    <img class="logo" src="../assets/购物车.png" alt="" />
    <!-- 登录 -->
    <div class="login-body">
      <van-form @submit="onSubmit">
        <van-field
          v-model="username"
          name="username"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 0.5rem" v-if="type == 'login'">
          <div class="link-register" @click="toggle">立即注册</div>
          <van-button round block color="#14c965" native-type="submit"
            >登录</van-button
          >
        </div>
        <div style="margin: 0.5rem" v-else>
          <div class="link-register" @click="toggle">立即登录</div>
          <van-button round block color="#14c965" native-type="submit"
            >注册</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { login, register } from "../../axios/interface/user";
import sheader from "../components/header";
import { useRouter } from "vue-router";
import { Toast } from "vant";
import { setLocal } from "../utils/utils";
export default {
  components: {
    sheader,
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      type: "login",
      username: "",
      password: "",
    });
    const toggle = () => {
      state.type = state.type === "login" ? "register" : "login";
      state.username = "";
      state.password = "";
    };
    //登录注册
    const onSubmit = async (values) => {
      console.log(values);
      if (state.type === "login") {
        const res = await login({
          username: values.username.trim(),
          password: values.password.trim(),
        });
        console.log(res);
        if (res.code === "80000") {
          setLocal("token", res.data.id);
          setTimeout(() => {
            router.push("/home");
          }, 500);
          
        }
        if (res.code === "80004") {
          Toast.fail(res.message);
        }
      } else {
        const res = await register({
          username: values.username.trim(),
          password: values.password.trim(),
        });
        if (res.code == "80000") {
          state.type = "login";
          state.username = "";
          state.password = "";
          Toast.success(res.message)
        }else{
          Toast.fail(res.message);
        }
        console.log(res);
      }
    };
    return {
      ...toRefs(state),
      toggle,
      onSubmit,
    };
  },
};
</script>

<style lang="less" scoped>
@import "../assets/mixin";
.login {
  .logo {
    width: 4rem;
    height: 4rem;
    display: block;
    margin: 4rem auto 1rem;
  }
  .login-body {
    padding: 0 1rem;
  }

  .link-register {
    font-size: 0.3rem;
    margin-bottom: 0.4rem;
    color: @btncol;
    display: inline-block;
  }
}
</style>