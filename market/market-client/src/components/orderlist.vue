<template>
  <div class="good-list">
    <div
      class="cart-item"
      v-for="good in orderDetailList"
      :key="good.id"
    >
      <div class="item-img">
        <img :src="good.url" alt="" />
      </div>
      <div class="desc">
        <div class="title">{{ good.name }}</div>
        <div class="count">X{{ good.count }}</div>
        <div class="bottom">
          <div class="price">
            ￥<span>{{ good.price }}</span
            >.00
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    orderDetailList:{
      type:Array,
      default:function(){
        return []
      }
    }
  }
};
</script>

<style lang='less' scoped>
@import "../assets/mixin";
.good-list {
  .cart-item:first-child {
    border-top-right-radius: 0.2rem;
    border-top-left-radius: 0.2rem;
  }
  .cart-item:last-child {
    border-bottom-right-radius: 0.2rem;
    border-bottom-left-radius: 0.2rem;
  }
  .cart-item {
    display: flex;
    background-color: #fff;
    padding: 0.2rem;
    .item-img {
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
}
</style>