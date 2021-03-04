<template>
  <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#1baeae">
    <van-swipe-item v-for="item in list" :key="item.id">
      <img :src="item.url" alt="" @click="goTo(item.id)" />
    </van-swipe-item>
  </van-swipe>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  props: {
    list: Array,
    default: function () {
      return {};
    },
  },
  setup() {
    const router = useRouter();
    function goTo(id) {
      router.push({ path: `/goodDetail/${id}` });
    }
    return { goTo };
  },
};
</script>

<style lang='less' scoped>
@import "../assets/mixin";
.my-swipe {
  background-color: @primary;
  margin-top: 1rem;
  img {
    width: 100%;
    height: 7rem;
  }
}
</style>
