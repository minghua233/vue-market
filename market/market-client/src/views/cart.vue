<template>
  <div class="cart">
    <sheader :name="'购物车'" />
    <div class="cart-list">
      <cartlist :cartlist="cartlist" />
    </div>
  </div>
  <snavbar />
</template>

<script>
import sheader from "../components/header";
import snavbar from "../components/navbar";
import cartlist from "../components/cartlist";
import { onMounted, reactive, toRefs } from "vue";
import { getCart } from "../../axios/interface/good";
import { Toast } from "vant";

export default {
  components: {
    sheader,
    snavbar,
    cartlist,
  },
  setup() {
    const state = reactive({
      cartlist: [],
    });
    onMounted(async () => {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      let res = await getCart();
      if (res.code == "80000") {
        state.cartlist = res.data;
        Toast.clear();
      } else {
        Toast(res.message);
      }
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped >
@import "../assets/mixin";
.cart {
  background-color: @bc;
  height: 100%;
  .cart-list {
    padding-top: 1rem;
  }
}
</style>