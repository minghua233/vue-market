<template>
  <header class="home-header">
    <div class="header-title">
      <p>口袋菜场</p>
    </div>
    <div
      class="search"
      @click="tosearch"
    >
      <svg
        class="icon"
        aria-hidden="true"
      >
        <use xlink:href="#icon-search"></use>
      </svg>
      <label>随时随地 新鲜到家</label>
    </div>
    <router-link
      to="./login"
      tag="span"
      v-if="!isLogin"
    >登录</router-link>
    <router-link
      to="./user"
      tag="span"
      v-else
      class="usericon"
    >
      <van-icon name="manager-o" />
    </router-link>
  </header>
  <swiper :list="homeSwiper" />
  <!-- 分类列表 -->
  <div class="classify">
    <div class="category-list">
      <div
        v-for="item in categoryList"
        :key="item.type"
        @click="goToTab(item.type, item.name)"
      >
        <!-- <i :class="item.class"/> -->
        <svg
          class="icon"
          aria-hidden="true"
        >
          <use :xlink:href="item.class"></use>
        </svg>
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
  <goodlist
    :title="'今日热卖'"
    :goods="homeGoodsList"
  />
  <goodlist
    :title="'每日上新'"
    :goods="todayNewList"
    :style="{paddingBottom: '60px'}"
  />
  <snavbar />
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import snavbar from "../components/navbar";
import swiper from "../components/swiper";
import goodlist from "../components/goodlist";
import good from "../components/goodlist";
import { useRouter } from "vue-router";
import { home } from "../../axios/interface/home";
import { getLocal } from "../utils/utils";
import { Toast } from "vant";
import { useStore } from "vuex";

export default {
  components: {
    snavbar,
    swiper,
    goodlist,
    good,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const state = reactive({
      categoryList: [
        {
          name: "时令蔬菜",
          type: 0,
          class:
            "#icon-shucaishuangseban",
        },
        {
          name: "新鲜水果",
          type: 1,
          class:
            "#icon-shengxian-shuiguo",
        },
        {
          name: "速冻食品",
          type: 2,
          class:
            "#icon-sudongshipin",
        },
        {
          name: "粮油调味",
          type: 3,
          class:
            "#icon-liangyou",
        },
        {
          name: "肉蛋水产",
          type: 4,
          class:
            "#icon-roudanx",
        },
        {
          name: "方便速食",
          type: 5,
          class:
            "#icon-fangbiansushi",
        },
        {
          name: "酒水饮料",
          type: 6,
          class:
            "#icon-yinliao",
        },
        {
          name: "乳品冲饮",
          type: 7,
          class:
            "#icon-niunainaiping",
        },
      ],
      isLogin: false,
      homeSwiper: [],
      homeGoodsList: [],
      todayNewList: [],
    });
    const tosearch = () => {
      router.push("/search");
    };
    onMounted(async () => {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      const token = getLocal("token");
      if (token) {
        state.isLogin = true;
      }
      const { data } = await home();
      Toast.clear();
      console.log(data);
      state.homeGoodsList = data.homeGoodsList;
      state.todayNewList = data.todayNewList;
    });
    const goToTab = (type, name) => {
      router.push({ path: '/tab', query: { type: type, name: name } })
    }
    return {
      ...toRefs(state),
      tosearch,
      goToTab,
    };
  },
};
</script>
<style lang="less" scoped >
@import "../assets/mixin";
.home-header {
  position: fixed;
  left: 0;
  top: 0;
  .wh(100%, 1rem);
  .fj();
  padding: 0 0.4rem;
  background: @primary;
  line-height: 1rem;
  .boxSizing();
  z-index: 1000;
  box-shadow: 0 0 0.1rem #666;
}
.header-title {
  font-family: "YouYuan", "Arial", "Microsoft YaHei";
  font-size: 0.5rem;
  color: #fff;
  label {
    font-size: 15px;
  }
}
.search {
  height: 0.8rem !important;
  width: 50%;
  background-color: @bc;
  color: #666;
  border-radius: 0.5rem;
  padding: 0 0.2rem;
  line-height: 0.8rem;
  .boxSizing();
  label {
    padding-left: 10px;
    
  }
}
.usericon {
  font-size: 0.5rem;
  padding-top: 0.1rem;
}
.classify {
  .boxSizing();
  padding: 0.3rem 0.2rem;
  margin-top: -0.1rem;
  background-color: @primary;
  border-bottom-left-radius: 0.1rem;
  border-bottom-right-radius: 0.1rem;
}
.category-list {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  width: 100%;
  padding-bottom: 0.3rem;
  background-color: @primary;
  border-radius: 0.1rem;
  div {
    display: flex;
    flex-direction: column;
    width: 25%;
    text-align: center;
    svg {
      margin: 0.2rem auto 0.2rem auto;
      .wh(1rem, 1rem);
    }
  }
}
.todayNew {
  padding-bottom: 1.8rem;
}
</style>