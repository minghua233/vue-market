<template>
  <div class="main">
    <header class="header">
      <router-link to="/search">
        <i class="iconfont icon--search"></i>
      </router-link>
    </header>
    <div class="content">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li
            class="menu-item"
            @click="selectMenu(index)"
            v-for="(item, index) in categoryData"
            :key="item.id"
            :class="{ current: currentIndex === index }"
          >
            <span class="text">
              {{ item.name }}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li
            class="food-list"
            v-for="(item, index) in categoryData"
            :key="item.id"
            :ref="foodList"
          >
            <h1 class="title">{{ item.name }}</h1>
            <ul>
              <li
                class="food-item"
                v-for="(food, idx) in item.categoryData"
                :key="food.id"
                @click="goToDetail(food.id, item.type)"
              >
                <div class="icon">
                  <img :src="food.url" alt="" />
                </div>
                <div class="right">
                  <div class="name">{{ food.name }}</div>
                  <div class="desc">{{ food.desc }}</div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <snavbar />
</template>

<script>
import { computed, nextTick, onMounted, reactive, ref, toRefs } from "vue";
import sheader from "../components/header";
import snavbar from "../components/navbar";
import { getCategoryData } from "../../axios/interface/good";
import BScroll from "better-scroll";
import { useRouter } from "vue-router";
export default {
  components: {
    sheader,
    snavbar,
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      categoryData: [],
      // currentIndex: 0,
      listHeight: [],
      scrollY: 0,
      allDom: [],
    });
    const menuWrapper = ref(null);
    const foodsWrapper = ref(null);
    const foodList = (e) => {
      // console.log(e);
      state.allDom.push(e);
    };
    onMounted(async () => {
      let res = await getCategoryData();
      console.log(res);
      if (res.code == "80000") {
        state.categoryData = res.data;
        nextTick(() => {
          _initScroll();
          _calculateHeight();
        });
      }
    });

    //选择菜单
    const selectMenu = (id) => {
      // state.currentIndex = id;
      let el = state.allDom[id];
      // console.log(el);
      state.foodsScroll.scrollToElement(el, 300);
    };
    const _initScroll = () => {
      // 出现滚动效果
      state.menuScroll = new BScroll(menuWrapper.value, {
        click: true,
      });
      state.foodsScroll = new BScroll(foodsWrapper.value, {
        click: true,
        probeType: 3,
      });
      state.foodsScroll.on("scroll", (pos) => {
        // console.log(pos);
        state.scrollY = Math.abs(Math.round(pos.y));
      });
    };

    const _calculateHeight = () => {
      //计算每个分类需要滚动的高度
      let height = 0;
      state.listHeight.push(height);
      for (let i = 0; i < state.allDom.length; i++) {
        let item = state.allDom[i];
        height += item.clientHeight; // 获取dom结构的高度
        state.listHeight.push(height);
      }
      // console.log(this.listHeight);
    };
    let currentIndex = computed(() => {
      for (let i = 1; i < state.listHeight.length; i++) {
        let height1 = state.listHeight[i - 1];
        let height2 = state.listHeight[i];
        if (state.scrollY >= height1 && state.scrollY < height2) {
          return i - 1;
        }
      }
      return 0;
    });
    //去详情
    const goToDetail = (id, type) => {
      console.log(id, type);
      if (type) {
        router.push({name:`gooddetail`,params:{id:id}});
      }else{
        router.push(`/goodDetail/${id}`);
        
      }
    };
    return {
      ...toRefs(state),
      selectMenu,
      menuWrapper,
      foodsWrapper,
      foodList,
      currentIndex,
      goToDetail,
    };
  },
};
</script>

<style lang="less" scoped >
@import "../assets/mixin";
.main {
  .header {
    .wh(100%, 1rem);
    .fj();
    padding: 0 0.4rem;
    background: @primary;
    line-height: 1rem;
    position: fixed;
    top: 0;
    left: 0;
    .boxSizing();
    z-index: 10000;
    box-shadow: 0 0 0.1rem #666;
  }
  .content {
    display: flex;
    position: absolute;
    top: 1rem;
    bottom: 1rem;
    width: 100%;
    overflow: hidden;
    // overflow-y: scroll;
    .menu-wrapper {
      flex: 0 0 2.5rem;
      width: 2.5rem;
      background: @bc;
      font-size: 0.4rem;
      .menu-item {
        padding: 0.3rem 0.4rem;
        text-align: center;
        &.current {
          background: #fff;
          font-weight: 700;
        }
      }
    }
    .foods-wrapper {
      flex: 1;
      .title {
        font-size: 0.3rem;
        color: #999;
        margin-left: 0.2rem;
      }
      .food-item {
        display: flex;
        background-color: #fff;
        padding: 0.2rem;
        box-sizing: border-box;
        .icon {
          img {
            border-radius: 0.1rem;
            .wh(2rem,2rem);
          }
        }
        .right {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          width: 5rem;
          margin-left: 0.2rem;
          .desc {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2; //行数
            -webkit-box-orient: vertical;
          }
          .name {
            font-size: 0.3rem;
            font-weight: 700;
          }
        }
      }
    }
  }
}
</style>