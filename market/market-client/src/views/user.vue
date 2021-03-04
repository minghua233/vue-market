<template>
  <sheader :name="'我的'" />
  <div class="main">
    <div class="user-info">
      <img :src="userInfo.avatar" alt="" /><span class="name">{{
        userInfo.username
      }}</span>
    </div>
    <div class="mine">
      <van-cell-group class="van-cell-group">
        <van-cell title="我的订单" is-link to="myorder" />
        <van-cell title="我的地址" is-link to="address?from=/user" />
      </van-cell-group>
    </div>
  </div>
  <snavbar />
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import sheader from "../components/header";
import snavbar from "../components/navbar";
import { getuserInfo } from "../../axios/interface/user";
export default {
  components: {
    sheader,
    snavbar,
  },
  setup() {
    const state = reactive({
      userInfo: {},
    });
    onMounted(async () => {
      let { data } = await getuserInfo();
      state.userInfo = data;
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped>
@import "../assets/mixin";
.main {
  padding:1.5rem 0.2rem;
  .user-info{
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 0.2rem;
    margin-bottom: 0.6rem;
    padding: 0.4rem 0.6rem;
    box-shadow: 0 0 0.2rem rgb(190, 189, 189);
    img{
      .wh(2rem,2rem);
      border-radius: 50%;
      margin-right: 0.4rem;
    }
  }
  .mine{
    padding: 0.2rem;
    border-radius: 0.2rem;
    background-color: #fff;
    box-shadow: 0 0 0.2rem rgb(190, 189, 189);

    .van-cell-group{
      border-radius: 0.2rem;
    }
  }
}
</style>