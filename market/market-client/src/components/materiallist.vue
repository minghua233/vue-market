<template>
  <div class="good">
    <header class="good-header">{{ title }}</header>
    <div class="good-box">
      <div
        class="good-item"
        v-for="item in goods"
        :key="item.id"
        @click="goToDetail(item.id)"
      >
        <img :src="item.url" alt="" />
        <div class="good-desc">
          <div class="title">{{ item.name }}</div>
          <div class="desc">{{ item.desc }}</div>

          <div class="price-btn">
            <div class="price">
              ￥<span>{{ item.price }}</span
              >.00
            </div>
            <van-button
              hairline
              round
              type="small"
              color="#14c965"
              @click.stop="goAddCart(item.id)"
            >
              加入购物车
            </van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { Toast } from "vant";
import { addCart } from "../../axios/interface/good";
import { useStore } from "vuex";

export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    goods: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const goToDetail = (id) => {
      router.push({ path: `/gooddetail/${id}` });
    };
    const goAddCart = async (id) => {
      let res = await addCart({ id: id, count: 1 });
      console.log(res);
      if (res.code == "80000") {
        store.dispatch("updateCart");
        Toast.success(res.message);
      } else {
        Toast.fail(res.message);
      }
    };
    return {
      goToDetail,
      goAddCart,
    };
  },
};
</script>

<style lang="less" scoped >
@import "../assets/mixin";
.good {
  padding: 0.2rem;
  background-color: @bc;
  .boxSizing();
  .good-header {
    text-align: center;
  }
  .good-box {
    width: 100%;
    .good-item {
      padding: 0.2rem;
      display: flex;
      background-color: #fff;
      margin-top: 0.3rem;
      border-radius: 0.2rem;
      img {
        .wh(2rem,2rem);
        border-radius: 0.1rem;
      }
      .good-desc {
        margin-left: 0.2rem;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        width: 7rem;        
        .title {
          font-weight: 700;
          margin-bottom: 0.1rem;
        }
        .desc {
          color: #666;
      
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-bottom: 0.2rem;
        }
        .price-btn {
          .fj();
          .price {
            color: @primary;
            font-weight: 700;
            span {
              font-size: 0.5rem;
            }
          }
        }
      }
    }
  }
}
</style>