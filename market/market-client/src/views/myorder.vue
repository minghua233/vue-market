<template>
  <sheader :name="'我的订单'" :back="'/user'" />
  <div class="main">
    <van-tabs
      v-model:active="status"
      :color="'#FF6B01'"
      class="order-tab"
      @click="onChangeTab"
    >
      <van-tab title="全部" name=""></van-tab>
      <van-tab title="待付款" name="0"></van-tab>
      <van-tab title="待发货" name="1"></van-tab>
      <van-tab title="待收货" name="2"></van-tab>
      <van-tab title="已发货" name="3"></van-tab>
      <van-tab title="已取消" name="4"></van-tab>
    </van-tabs>
    <div class="content">
      <van-pull-refresh
        v-model="refreshing"
        @refresh="onRefresh"
        class="order-list-refresh"
      >
        <van-list
          v-model:loading="loading"
          :finished="finished"
          @load="onLoad"
          :offset="10"
          :immediate-check="check"
          finished-text="没有更多了"
          class="van-list"
          id="position"
        >
          <div
            class="order-item-box"
            v-for="(item, index) in list"
            :key="item.orderDetail.id"
            @click="goToDetail(item.orderDetail.orderid)"
          >
            <div class="order-item-header">
              <span>订单时间：{{ item.orderDetail.time }}</span>
              <span>{{ item.status }}</span>
            </div>
            <orderlist :orderDetailList="item.orderDetailList" />
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, nextTick } from "vue";
import sheader from "../components/header";
import orderlist from "../components/orderlist";
import { getOrderList } from "../../axios/interface/order";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { setLocal, getLocal } from "../utils/utils";
import { Toast } from "vant";

export default {
  components: {
    sheader,
    orderlist,
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      status: "",
      page: 0,
      totalpage: 0,
      check: false,
      scrollTop: 0,
    });
    //进入详情页面缓存
    onBeforeRouteLeave((to, from, next) => {
      console.log("离开");
      if (to.name == "user") {
        if (getLocal("keepalive")) {
          localStorage.removeItem("keepalive");
        }
        next();
      }
      if (to.name == "orderdetail") {
        setLocal("keepalive", JSON.stringify(state));
        next();
      }
    });
    onMounted(() => {
      window.addEventListener("scroll", scrollTop, true);
      if (getLocal("keepalive")) {
        for (let key in state) {
          state[key] = JSON.parse(getLocal("keepalive"))[key];
        }
      } else {
        onRefresh();
      }
    });
    const scrollTop = (e) => {
      state.scrollTop = e.target.scrollTop;
      // let top = document.getElementById("position");
      // console.log(top.scrollTop);
    };
    //自动聚焦和滚动事件
    nextTick(() => {
      if (state.scrollTop) {
        let top = document.getElementById("position");
        top.scrollTop = state.scrollTop;
      }
    });
    const onLoad = async () => {
      if (!state.refreshing && state.page < state.totalpage) {
        state.page += 1;
      }
      if (state.refreshing) {
        state.list = [];
        state.refreshing = false;
      }
      let { data } = await getOrderList({
        pagenumber: state.page,
        status: state.status,
      });
      Toast.clear();
      console.log(data);
      let { pageNum, orderlist } = data;

      state.list = state.list.concat(orderlist);
      state.totalpage = pageNum;
      state.loading = false;
      if (state.page >= pageNum) {
        state.finished = true;
      }

      console.log(state.page);
    };

    const onRefresh = () => {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      // 清空列表数据
      state.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      state.loading = true;
      state.refreshing = true;
      state.page = 0;
      onLoad();
    };
    const onChangeTab = (name, title) => {
      console.log(name, title);
      state.status = name;
      onRefresh();
    };

    //去订单详情
    const goToDetail = (id) => {
      router.push({ path: "/orderdetail", query: { id: id } });
    };
    return {
      ...toRefs(state),
      onLoad,
      onRefresh,
      onChangeTab,
      goToDetail,
    };
  },
};
</script>

<style lang='less' scoped>
@import "../assets/mixin";
.main {
  padding-top: 2.2rem;
  box-sizing: border-box;
  .order-tab {
    position: fixed;
    top: 1rem;
    left: 0;
    z-index: 99;
    width: 100%;
  }
  .content {
    // overflow-y: scroll;
    height: 100%;
    padding: 0 0.2rem;
    .van-list {
      overflow-y: scroll;
      // height: 17.2rem;
      height: 15.5rem;
    }
    .van-list::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
    .order-item-box {
      background-color: #fff;
      margin-bottom: 0.2rem;
      border-radius: 0.2rem;
      .order-item-header {
        .fj();
        padding: 0.2rem;
      }
    }
  }
}
</style>