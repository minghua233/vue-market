import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "lib-flexible/flexible";
import {
  Toast,
  Icon,
  Button,
  Form,
  Field,
  Search,
  Swipe,
  SwipeItem,
  ActionBar,
  ActionBarIcon,
  ActionBarButton,
  Checkbox,
  CheckboxGroup,
  Stepper,
  SubmitBar,
  Empty,
  SwipeCell,
  AddressList,
  AddressEdit,
  Popup,
  Tab, Tabs,List,PullRefresh,Cell,CellGroup,
} from "vant";
import "vant/lib/index.css";
const app = createApp(App);
//全局过滤器
app.config.globalProperties.$filters = {
  prefix(url) {
    if (url !== undefined) {
      let _u = url.substring(8);
      return "https://images.weserv.nl/?url=" + _u;
    }
  },
};
import VueVideoPlayer from "vue-video-player";

// require videojs style
import "video.js/dist/video-js.css";
// import 'vue-video-player/src/custom-theme.css'
app.directive('focus', {
  // 当被绑定的元素挂载到 DOM 中时……
  onMounted(el) {
    // 聚焦元素
    el.focus()
  }
})
app.use(VueVideoPlayer);

app
  .use(Icon)
  .use(Toast)
  .use(Button)
  .use(Form)
  .use(Field)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(ActionBar)
  .use(ActionBarButton)
  .use(ActionBarIcon)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Stepper)
  .use(SubmitBar)
  .use(Empty)
  .use(SwipeCell)
  .use(AddressList)
  .use(AddressEdit)
  .use(Popup)
  .use(Tab)
  .use(Tabs)
  .use(List)
  .use(PullRefresh)
  .use(store)
  .use(router)
  .use(Cell)
  .use(CellGroup)
  .mount("#app");
