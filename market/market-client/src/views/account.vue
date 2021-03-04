<template>
  <sheader :name="'生成订单'" :back="from" />
  <div class="main">
    <div class="address" @click="goToAddress">
      <div class="tip" v-if="!hasAddress">请选择地址</div>
      <div class="left" v-else>
        <div class="top">
          <span class="name">{{ address.name }}</span
          ><span class="phone">{{ address.tel }}</span>
        </div>
        <div class="bottom">
          {{ address.province }} {{ address.city }} {{ address.county }}
          {{ address.addressDetail }}
        </div>
      </div>
      <van-icon name="arrow" class="arrow-icon" />
    </div>
    <orderlist :orderDetailList="goodList"/>
    <div class="create-order">
      <i>&nbsp;</i>
      <div class="total">
        <span class="num">共{{ goodList.length }}件，</span>
        <span class="heji">合计：</span>
        <span class="price"
          >￥<span>{{ total }}</span
          >.00</span
        >
      </div>
      <van-button
        hairline
        round
        type="small"
        color="#14c965"
        class="btnsize"
        @click.stop="goToAccount"
      >
        提交订单
      </van-button>
    </div>
  </div>
  <van-popup
    v-model:show="show"
    closeable
    @click-close-icon="cancelPay"
    position="bottom"
    :style="{ height: '30%' }"
  >
    <div class="zw">
      <p>请支付</p>
      <img src="../assets/指纹.png" alt="" v-if="payicon" @click="finishPay" />
      <img src="../assets/指纹-绿.png" alt="" v-else />
    </div>
  </van-popup>
</template>

<script>
import { computed, onMounted, reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import sheader from "../components/header";
import orderlist from "../components/orderlist";
import { getLocal } from "../utils/utils";
import {
  account,
  getAddress,
  getDefaultAddress,
} from "../../axios/interface/address";
import { createOrder } from "../../axios/interface/order";
import { Toast } from "vant";
import { useStore } from "vuex";
export default {
  components: {
    sheader,
    orderlist
  },
  setup(){
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      from: "/cart",
      goodList: [],
      address: {},
      hasAddress: true,
      show: false,
      payicon: true,
      accountdata: [],
      curprice: 0,
    });
    onMounted(async () => {
      console.log(JSON.parse(getLocal("account")));
      state.accountdata = JSON.parse(getLocal("account"));
      if (route.query.addressid) {
        let res = await getAddress({ id: route.query.addressid });
        console.log(res);
        if (res.code == "80000") {
          state.address = res.data;
        }
      } else {
        state.from = "-1";
        let res = await getDefaultAddress();
        if (res.code == "80000") {
          state.address = res.data;
        } else {
          state.hasAddress = false;
          Toast("请选择地址");
        }
      }
      let res = await account(state.accountdata);
      console.log(res);
      if (res.code == "80000") {
        state.goodList = res.data;
      }
    });
    let total = computed(() => {
      let sum = 0;
      state.goodList.forEach((item) => {
        sum += item.price * item.count;
      });
      state.curprice = sum;
      return sum;
    });
    const goToAddress = () => {
      router.push({ path: "/address", query: { from: "/account" } });
    };
    //结算
    const goToAccount = () => {
      if (!state.hasAddress) {
        Toast("请选择地址");
        return;
      }
      state.show = true;
    };

    //完成支付
    const finishPay = async () => {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      state.payicon = false;
      let obj = {};
      obj.id = Date.now();
      obj.address =
        state.address.province +
        state.address.city +
        state.address.county +
        state.address.addressDetail;
      obj.total = state.curprice;
      obj.ispay = true;
      obj.orderlist = state.accountdata;
      let res = await createOrder(obj);
      console.log(res);
      if (res.code == "80000") {
        store.dispatch("updateCart");
        localStorage.removeItem('account')

        Toast.success(res.message);
        setTimeout(() => {
          router.push({path:'/orderdetail',query:{id:obj.id}})

        }, 500);
      } else {
        Toast.fail(res.message);
      }
    };

    //取消支付
    const cancelPay = async () => {
            let obj = {};
      obj.id = Date.now();
      obj.address =
        state.address.province +
        state.address.city +
        state.address.county +
        state.address.addressDetail;
      obj.total = state.curprice;
      obj.ispay = false;
      obj.orderlist = state.accountdata;
      let res = await createOrder(obj);
      console.log(res);
      if (res.code == "80000") {
        Toast('取消支付')
        store.dispatch("updateCart");
        localStorage.removeItem('account')
        setTimeout(() => {
          router.push({path:'/orderdetail',query:{id:obj.id}})
        }, 500)
      }
    };
    return {
      ...toRefs(state),
      total,
      goToAddress,
      goToAccount,
      cancelPay,
      finishPay,
    };
  },
};
</script>

<style lang="less" scoped >
@import "../assets/mixin";
.main {
  background-color: @bc;
  padding: 1.2rem 0.2rem 3rem;
  .boxSizing();
  .address {
    background-color: #fff;
    padding: 0.2rem;
    margin-bottom: 0.2rem;
    border-radius: 0.2rem;
    .fj();
    .left {
      .name {
        font-size: 0.4rem;
        margin: 0 0.2rem 0.2rem 0;
      }
      .phone {
        color: #999;
      }
    }
    .arrow-icon {
      font-size: 0.5rem;
    }
  }
  .create-order {
    box-sizing: border-box;
    padding: 0.2rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99;
    background-color: #fff;
    width: 100%;
    .fj();
    .total {
      margin-left: 3.5rem;
      .num {
        color: #999;
      }
      .heji {
        font-size: 0.4rem;
      }
      .price {
        color: @primary;
        span {
          font-size: 0.4rem;
        }
      }
    }
    .btnsize {
      margin-left: 0.2rem;
      width: 2rem;
    }
  }
}
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
</style>