<template>
  <div class="cart-detail" v-if="cartlistcv.length">
    <div class="cart-list">
      <van-checkbox-group v-model="checked" @change="selectChange">
        <van-swipe-cell v-for="item in cartlistcv" :key="item.id">
          <div class="cart-item" @click="goToDetail(item.goodid)">
            <van-checkbox
              :name="item.goodid"
              checked-color="#14c965"
              @click.stop="stopBob"
            ></van-checkbox>
            <div class="item-img">
              <img :src="item.good.url" alt="" />
            </div>
            <div class="desc">
              <div class="title">{{ item.good.name }}</div>
              <div class="count">X{{ item.count }}</div>
              <div class="bottom">
                <div class="price">
                  ￥<span>{{ item.good.price }}</span
                  >.00
                </div>
                <div class="btn">
                  <van-stepper
                    v-model="value"
                    integer
                    :model-value="item.count"
                    :name="item.goodid"
                    @change="numChange"
                    @click.stop="stopBob"
                  />
                </div>
              </div>
            </div>
          </div>

          <template #right v-if="cart">
            <van-button
              square
              type="danger"
              icon="delete-o"
              class="delete-button"
              @click="deleteOne(item.id)"
            />
          </template>
        </van-swipe-cell>
      </van-checkbox-group>
    </div>
    <div class="account">
      <div class="checkbox">
        <van-checkbox
          v-model="allchecked"
          checked-color="#14c965"
          @click="checkAll"
          >全选</van-checkbox
        >
      </div>

      <div class="btn">
        <div class="price">
          ￥<span>{{ price ? price : 0 }}</span
          >.00
        </div>
        <van-button
          hairline
          round
          type="small"
          color="#14c965"
          class="btnsize"
          @click.stop="goToAccount"
          v-if="cart"
        >
          结算
        </van-button>
      </div>
    </div>
  </div>
  <div class="empty" v-else>
    <van-empty
      class="custom-image"
      description="购物车是空的哦~"
      image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
    >
      <van-button round color="#14c965" class="bottom-button" @click="goTo"
        >去选购</van-button
      >
    </van-empty>
  </div>
</template>

<script>
import { computed, reactive, toRefs, watch } from "vue";
import { Toast } from "vant";
import { updateCart, deleteCart } from "../../axios/interface/good";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { setLocal } from "../utils/utils";

export default {
  props: {
    cartlist: {
      type: Array,
      default: function () {
        return [];
      },
    },
    cart: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      checked: [],
      allchecked: true,
      cartlistcv: [],
      total: 0,
    });
    //监听父组件第一次传过来的值
    watch(
      () => props.cartlist,
      (newval, oldval) => {
        console.log("值传过来了");
        state.cartlistcv = props.cartlist;
        checkAll();
        selectChange(state.checked);
      }
    );

    //全局选中商品数据
    const globalGood = (check) => {
      let arr = [];
      check.forEach((item) => {
        let obj = {};
        obj.id = item;
        obj.count = state.cartlistcv.filter(
          (item1) => item1.goodid == item
        )[0].count;
        arr.push(obj);
      });
      store.commit("selectCart", arr);
    };
    //增减数量
    const numChange = async (value, detail) => {
      if (props.cart) {
        Toast.loading({
          message: "修改中...",
          forbidClick: true,
        });
      }

      console.log(value, detail.name);
      console.log(
        state.cartlistcv.filter((item) => item.goodid == detail.name)
      );
      if (
        state.cartlistcv.filter((item) => item.goodid == detail.name)[0]
          .count == value
      ) {
        return;
      }
      if (props.cart) {
        let res = await updateCart({ id: detail.name, count: value });
        console.log(res);
        if (res.code == "80000") {
          Toast.success(res.message);
          state.cartlistcv.filter(
            (item) => item.goodid == detail.name
          )[0].count = value;
        } else {
          Toast.fail(res.message);
        }
      } else {
        state.cartlistcv.filter(
          (item) => item.id == detail.name
        )[0].count = value;
      }
      globalGood(state.checked);
    };

    //选中与否
    const selectChange = (check) => {
      console.log(check);
      globalGood(check);
      if (check.length < state.cartlistcv.length) {
        state.allchecked = false;
      } else {
        state.allchecked = true;
      }
    };

    //全选反选
    const checkAll = () => {
      // state.allchecked = !state.allchecked
      console.log(state.allchecked);
      if (state.allchecked) {
        state.checked = state.cartlistcv.map((item) => item.goodid);
        console.log(state.checked);
      } else {
        state.checked = [];
      }
    };
    //计算总价格
    let price = computed(() => {
      let sum = 0;
      state.cartlistcv.forEach((item) => {
        if (state.checked.includes(item.goodid)) {
          sum += item.count * item.good.price;
        }
      });
      state.total = sum;
      return sum;
    });
    //去结算
    const goToAccount = () => {
      if (!state.checked.length) {
        Toast("请选择商品");
        return;
      }
      setLocal("account", JSON.stringify(store.state.cartselected));
      router.push({ path: "/account", query: { total: state.total } });
    };
    //删除某件商品
    const deleteOne = async (id) => {
      Toast.loading({
        message: "删除中...",
        forbidClick: true,
      });
      let res = await deleteCart({ id: id });
      if (res.code == "80000") {
        Toast.success(res.message);
        store.dispatch("updateCart");
        state.cartlistcv = state.cartlistcv.filter((item) => item.id !== id);
        console.log(state.cartlistcv);
      } else {
        Toast.fail(res.message);
      }
    };

    //购物车为空去首页
    const goTo = () => {
      router.push("/home");
    };
    //商品详情
    const goToDetail = (id) => {
      router.push({ path: `/gooddetail/${id}` });
    };

    //阻止vant组件冒泡
    const stopBob = () => {
      console.log("阻止冒泡");
    };
    return {
      ...toRefs(state),
      selectChange,
      numChange,
      checkAll,
      price,
      deleteOne,
      goTo,
      goToDetail,
      stopBob,
      goToAccount,
    };
  },
};
</script>

<style lang="less" scoped >
@import "../assets/mixin";
.cart-detail {
  background-color: @bc;
  padding: 0.2rem 0.2rem 3rem;
  .boxSizing();
  .cart-list {
    .cart-item {
      display: flex;
      background-color: #fff;
      padding: 0.2rem;
      border-radius: 0.2rem;
      margin-bottom: 0.2rem;
      .item-img {
        margin-left: 0.3rem;
        img {
          .wh(2.5rem,2.5rem);
          border-radius: 0.2rem;
        }
      }
      .desc {
        margin-left: 0.2rem;
        display: flex;
        width: 5.6rem;
        justify-content: space-between;
        flex-direction: column;

        .title {
          width: 5.4rem;
          overflow: hidden;
          white-space: nowrap;
          font-size: 0.4rem;
        }
        .count {
          color: #999;
        }
        .bottom {
          .fj();
          .price {
            color: @primary;
            span {
              font-size: 0.5rem;
            }
          }
        }
      }
    }
    .delete-button {
      margin-right: 0.01rem;
      height: 100%;
      width: 1.8rem;
    }
  }
  .account {
    .fj();
    width: 100%;
    padding: 0.2rem 0.4rem;
    box-sizing: border-box;
    position: fixed;
    left: 0;
    bottom: 1.33rem;
    background-color: #fff;
    .btn {
      display: flex;
      align-items: center;
      .price {
        color: @primary;
        span {
          font-size: 0.5rem;
        }
      }
      .btnsize {
        margin-left: 0.2rem;
        width: 2rem;
      }
    }
  }
}
.empty {
  .custom-image .van-empty__image {
    .wh(3rem,3rem);
  }
  .bottom-button {
    .wh(2.6rem,1rem);
  }
}
</style>