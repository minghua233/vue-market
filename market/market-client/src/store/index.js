import { createStore } from "vuex";
import { getCart } from "../../axios/interface/good";
export default createStore({
  state: {
    cartCount: 0,
    cartselected: [],
  },
  mutations: {
    addCart(state, payload) {
      state.cartCount = payload.count;
    },
    selectCart(state, payload) {
      state.cartselected = payload;
    },
  },
  actions: {
    async updateCart(ctx) {
      const res = await getCart();
      if (res.code == "80000") {
        // console.log(res.data);
        ctx.commit("addCart", {
          count: res.data.length || 0,
        });
      }
    },
  },
  modules: {},
});
