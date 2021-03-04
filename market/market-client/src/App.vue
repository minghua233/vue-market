<template>
  <div id="app">
    <router-view
      class="router-view"
      v-slot="{ Component }"
    >
      <transition :name="transitionName">
        <!-- <keep-alive include="search,myorder"> -->
        <component :is="Component" />
        <!-- </keep-alive> -->
      </transition>
    </router-view>
  </div>
</template>
<script>
import { onMounted, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { getLocal } from "./utils/utils";

export default {
  setup() {
    const store = useStore();
    const state = reactive({
      transitionName: "slide-left",
    });
    onMounted(() => {
      const token = getLocal("token");
      if (token) {
        store.dispatch("updateCart");
      }
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less">
@import "./assets/mixin.less";
html,
body {
  overflow-x: hidden;
  height: 100%;
  overflow-y: scroll;
  margin: 0;
  padding: 0;
  background-color: @bc;
}
html::-webkit-scrollbar,
body::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
ul li {
  list-style: none;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  height: 100%;
  will-change: transform;
  transition: all 500ms;
  position: absolute;
  backface-visibility: hidden;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.van-badge--fixed {
  z-index: 1000;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
