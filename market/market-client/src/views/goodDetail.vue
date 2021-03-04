<template>
  <sheader
    :name="'商品详情'"
    :back="'-1'"
  />
  <van-swipe
    class="my-swipe"
    :autoplay="3000"
    indicator-color="#1baeae"
  >
    <van-swipe-item v-for="item in 1">
      <img
        :src="goodDetail.goodPicture"
        alt=""
      />
    </van-swipe-item>
  </van-swipe>
  <div class="goodDetail">
    <div class="goodDetail-header">
      <div class="title">{{ goodDetail.goodName }}</div>
      <div class="price">
        ￥{{ goodDetail.goodPrice }}
      </div>
    </div>
    <div class="goodDetail-desc">
      <div class="desc">
        <img :src="goodDetail.goodDescPic">
      </div>
    </div>
  </div>
  <van-action-bar>
    <van-action-bar-icon
      icon="chat-o"
      text="客服"
      dot
    />
    <van-action-bar-icon
      icon="cart-o"
      text="购物车"
      :badge="count ? count : ''"
      @click="goTo"
    />
    <van-action-bar-button
      type="warning"
      text="加入购物车"
      @click="goAddCart"
    />
    <van-action-bar-button
      color="#14c965"
      text="立即购买"
      @click="goToBuy"
    />
  </van-action-bar>
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import sheader from "../components/header";
import cartlist from "../components/cartlist";
import { setLocal, getLocal } from "../utils/utils";

import { getGoodDetail, addFoodCart ,addCart} from "../../axios/interface/good"
import { useStore } from "vuex";
import { Toast } from "vant";

export default {
  components: {
    sheader,
    cartlist,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const state = reactive({
      goodDetail: {}
    });

    onMounted(async () => {
      console.log(route.params);

      let { data } = await getGoodDetail({ id: route.params.id });
      state.goodDetail = data;
      console.log(data);
    });

    // 角标
    const count = computed(() => {
      return store.state.cartCount;
    });
    //加入购物车
    const goAddCart = async () => {
      let res = await addCart({ id: state.goodDetail.goodId, count: 1 });
      console.log(res);
      if (res.code == "80000") {
        store.dispatch("updateCart");
        Toast.success(res.message);
      } else {
        Toast.fail(res.message);
      }
    };
    //去购物车
    const goTo = () => {
      router.push("/cart");
    };
    //立即购买
    const goToBuy = () => {
      if (getLocal("token")) {
        setLocal(
          "account",
          JSON.stringify([{ id: state.good.id, count: 1 }])
        );
        router.push({ path: "/account" });
      } else {
        router.push({ path: "/login" });
      }
    };


    // //加入购物车
    // const goAddCart = async () => {
    //   console.log("加入购物车");
    //   console.log(store.state.cartselected); 
    //   if (!store.state.cartselected.length) {
    //     Toast("请选择商品");
    //     return;
    //   }
    //   let res = await addFoodCart(store.state.cartselected);
    //   if (res.code == "80000") {
    //     store.dispatch("updateCart");
    //     Toast.success(res.message);
    //   } else {
    //     Toast(res.message);
    //   }
    // };
    // //去购物车
    // const goTo = () => {
    //   router.push("/cart");
    // };

    // //立即购买
    // const goToBuy = () => {
    //   if (getLocal("token")) {
    //     if (!store.state.cartselected.length) {
    //       Toast("请选择商品");
    //       return;
    //     }
    //     setLocal("account", JSON.stringify(store.state.cartselected));
    //     router.push({ path: "/account" });
    //   } else {
    //     router.push({ path: "/login" });
    //   }
    // };
    return {
      ...toRefs(state),
      count,
      goAddCart,
      goTo,
      goToBuy,
    };
  },
};
</script>

<style lang='less' scoped>
@import "../assets/mixin";
.my-swipe {
  margin-top: 1rem;
  img {
    width: 100%;
    height: 10rem;
  }
}
.goodDetail {
  padding: 0.2rem;
  background-color: @bc;
  .goodDetail-header {
    background-color: #fff;
    border-radius: 0.2rem;
    padding: 0.2rem;
    margin-bottom: 0.2rem;
    .title {
      color: #333;
      font-weight: 500;
      font-size: 0.4rem;
      margin-bottom: 0.2rem;
    }
    .price {
      color: red;
      font-weight: 700;
      span {
        font-size: 0.5rem;
      }
    }
  }
  .goodDetail-desc {
    background-color: #fff;
    border-radius: 0.2rem;
    padding: 0.2rem;
    .distribution,
    .desc {
      display: flex;
      align-items: center;
      margin-bottom: 0.2rem;
      img {
        display: block;
        width: 100%;
      }
    }
  }
}
.goodle {
  text-align: center;
  font-weight: 500;
}
</style>