<template>
  <sheader :name="'订单详情'" :back="'/myorder?id=1'" />
  <div class="main">
    <div class="order-info">
      <div class="item-desc">
        <span class="tip">订单号</span
        ><span class="content">{{ orderDetail.orderid }}</span>
      </div>
      <div class="item-desc">
        <span class="tip">状态</span><span class="content">{{ classify }}</span>
      </div>
      <div class="item-desc">
        <span class="tip">创建时间</span
        ><span class="content">{{ orderDetail.time }}</span>
      </div>
      <div class="item-desc">
        <span class="tip">配送地址</span
        ><span class="content">{{ orderDetail.address }}</span>
      </div>
      <div class="item-desc">
        <span class="tip">花费金额</span
        ><span class="content">￥{{ orderDetail.total }}</span>
      </div>
    </div>
    <orderlist :orderDetailList="goodList" />
    <div class="bottom-btn" v-if="classify != '已取消'">
      <div class="btn">
        <van-button
          hairline
          round
          type=""
          color="#FF6B01"
          class="btnsize"
          @click.stop="cancel"
        >
          取消订单
        </van-button>
      </div>
      <div class="btn" v-if="classify == '待付款'">
        <van-button
          hairline
          round
          type=""
          color="#14c965"
          class="btnsize"
          @click.stop="goPay"
        >
          完成支付
        </van-button>
      </div>
    </div>
  </div>
  <van-popup
    v-model:show="show"
    closeable
    @click-close-icon="cancelPay"
    position="bottom"
    :style="{ height: '30%' }"
    class="van-popup"
  >
    <div class="zw">
      <p>请支付</p>
      <img src="../assets/指纹.png" alt="" v-if="payicon" @click="finishPay" />
      <img src="../assets/指纹-绿.png" alt="" v-else />
    </div>
  </van-popup>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import sheader from "../components/header";
import orderlist from "../components/orderlist";
import { useRoute } from "vue-router";
import { getOrderDetail, updateOrder } from "../../axios/interface/order";
import { Toast } from "vant";

export default {
  components: {
    sheader,
    orderlist,
  },
  setup() {
    const route = useRoute();
    const state = reactive({
      goodList: [],
      orderDetail: {
        orderid: "",
        time: "",
        address: "",
        total: "",
      },
      classify: "",
      id: route.query.id,
      payicon: true,
      show: false,
    });

    onMounted(async () => {
      init();
    });

    const init = async () => {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      let res = await getOrderDetail({ id: state.id });
      console.log(res);
      state.classify = res.data.status;
      state.goodList = res.data.orderDetailList;
      state.orderDetail = res.data.orderDetail;
      Toast.clear();
    };
    //取消订单
    const cancel = async () => {
      let res = await updateOrder({ id: state.id, type: 0 });
      console.log(res);
      if (res.code == "80000") {
        Toast("已取消");
        setTimeout(() => {
          init();
        }, 500);
      }
    };
    //显示支付界面
    const goPay = () => {
      console.log(123);
      state.show = true;
    };
    //完成支付
    const finishPay = async () => {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      state.payicon = false;
      let res = await updateOrder({ id: state.id, type: 1 });
      console.log(res);
      if (res.code == "80000") {
        Toast.success("支付成功");
        state.show = false;
        setTimeout(() => {
          init();
        }, 500);
      } else {
        Toast.fail(res.message);
      }
    };
    const cancelPay = () => {};
    return {
      ...toRefs(state),
      cancel,
      goPay,
      finishPay,
      cancelPay,
    };
  },
};
</script>

<style lang='less' scoped>
@import "../assets/mixin";

.main {
  padding: 1.2rem 0.2rem 2rem;
  .order-info {
    background-color: #fff;
    border-radius: 0.2rem;
    padding: 0.2rem;
    box-sizing: border-box;
    margin-bottom: 0.2rem;
    .item-desc {
      width: 100%;
      margin-bottom: 0.2rem;
      span {
        display: inline-block;
      }
      .tip {
        width: 20%;
        color: #999;
      }
      .content {
        width: 80%;
      }
    }
    .item-desc:last-child {
      margin-bottom: 0;
      .content {
        color: @primary;
      }
    }
  }
  .bottom-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    background-color: #fff;
    z-index: 99;
    .btn {
      flex: 1;
      padding: 0.2rem;
      .btnsize {
        width: 100%;
      }
    }
  }
}
.van-popup {
  z-index: 999;
  .zw {
    text-align: center;
    img {
      .wh(1.8rem,1.8rem);
      display: block;
      margin-left: 50%;
      margin-top: 15%;
      transform: translate(-50%);
    }
  }
}
</style>