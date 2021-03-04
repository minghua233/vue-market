<template>
  <sheader
    :name="'口袋菜场'"
    :back="'-1'"
  />
  <div class="main">
    <van-tabs
      v-model:active="active"
      :color="'#FF6B01'"
      class="tabs"
      @click="onChangeTab"
    >
      <van-tab
        :title="item.name"
        v-for="item in categoryList"
        :key="item.type"
        :name="item.type"
      ></van-tab>
    </van-tabs>
    <div class="content">
      <goodlist :goods="goodlist" />
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import sheader from "../components/header";
import goodlist from "../components/goodlist";
import { useRoute } from "vue-router";
import { getTabFoodData } from "../../axios/interface/good";
import { Toast } from "vant";
export default {
  components: {
    sheader,
    goodlist,
  },
  setup() {
    const route = useRoute();
    const state = reactive({
      active: route.query.type,
      categoryList: [
        {
          name: "时令蔬菜",
          type: 0,
        },
        {
          name: "新鲜水果",
          type: 1,
        },
        {
          name: "速冻食品",
          type: 2,
        },
        {
          name: "粮油调味",
          type: 3,
        },
        {
          name: "肉蛋水产",
          type: 4,
        },
        {
          name: "方便速食",
          type: 5,
        },
        {
          name: "酒水饮料",
          type: 6,
        },
        {
          name: "乳品冲饮",
          type: 7,
        },
      ],
      goodlist: [],
    });
    onMounted(() => {
      init(route.query.type);
    });
    const onChangeTab = (type, title) => {
      init(type);
    };

    const init = async (type) => {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      let res = await getTabFoodData({ type: type });
      console.log(res);
      if (res.code == "80000") {
        state.goodlist = res.data;
        Toast.clear();
      } else {
        Toast(res.message);
      }
    };
    return {
      ...toRefs(state),
      onChangeTab,
    };
  },
};
</script>

<style lang="less" scoped >
@import "../assets/mixin";
.main {
  margin-top: 1.8rem;
  .tabs {
    position: fixed;
    top: 1rem;
    left: 0;
  }
}
</style>