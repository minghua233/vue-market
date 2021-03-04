<template>
  <div class="good">
    <header class="good-header">{{ title }}</header>
    <div class="good-box">
      <div
        class="good-item"
        v-for="item in goods"
        :key="item.goodId"
        @click="goToDetail(item.goodId)"
      >                                                                                                                                                                              
        <img :src="item.goodPicture"/>
        <div class="good-desc">
          <div class="title">{{ item.goodName }}</div>
          <div class="price">￥{{ item.goodPrice }}</div>
          <div class="desc">{{ item.goodDescribe }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
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
    const router = useRouter();
    // 跳转至详情页
    const goToDetail = (goodId) => {
      router.push({ path: `/goodDetail/${goodId}` });
    };

    return {
      goToDetail,
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
          font-size: 0.4rem;
          font-weight: 700;
          margin-bottom: 0.1rem;
        }
        .price {
          color: red;
          margin-bottom: 0.2rem;
        }
        .desc {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>