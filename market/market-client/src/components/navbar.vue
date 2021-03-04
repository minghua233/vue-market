<template>
  <div class="nav-bar van-hairline--top">
    <ul class="nav-list">
      <router-link tag="li" class="nav-list-item active" to="home">
        <van-icon name="wap-home-o" />
        <span>首页</span>
      </router-link>
      <router-link tag="li" class="nav-list-item" to="category">
        <van-icon name="apps-o" />
        <span>分类</span>
      </router-link>
      <router-link tag="li" class="nav-list-item" to="cart">
        <van-icon name="shopping-cart-o" :badge="!count ? '' : count" />
        <span>购物车</span>
      </router-link>
      <router-link tag="li" class="nav-list-item" to="user">
        <van-icon name="user-o" />
        <span>我的</span>
      </router-link>
    </ul>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// import { getLocal } from '../common/js/utils';
import router from '../router';
import { useStore } from 'vuex';
export default {
  setup(){
    const route = useRoute()
    const store = useStore()
    onMounted(()=>{
  
    })

    const count = computed(()=>{
      return store.state.cartCount
    })

    return {count}
  }
};
</script>

<style lang="less" scoped >
@import "../assets/mixin";
.nav-bar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 0.2rem 0;
  z-index: 1000;
  background: #fff;
  .nav-list {
    width: 100%;
    display: flex;
    .nav-list-item {
      display: flex;
      flex: 1;
      flex-direction: column;
      text-align: center;
      color: #666;
      &.router-link-active {
        color: @primary;
      }
      i {
        text-align: center;
        font-size: 0.5rem;
      }
      span {
        font-size: 0.3rem;
      }
      .van-icon-shopping-cart-o {
        margin: 0 auto 0.08rem;
        width: 1rem;
      }
    }
  }
}
</style>
