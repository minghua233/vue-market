import { createRouter, createWebHistory } from "vue-router";
import home from "../views/home.vue";

const routes = [
  {
    path:'/',
    redirect:'/home'
  },
  {
    path: "/home",
    name: "home",
    component: home,
  },

  {
    path: "/login",
    name: "login",
    component: () => import("../views/login"),
  },
  // {
  //   path: "/gooddetail/:id",
  //   name: "gooddetail",
  //   component: () => import("../views/gooddetail"),
  // },
  {
    path: "/gooddetail/:id",
    name: "gooddetail",
    component: () => import("../views/goodDetail"),
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("../views/cart"),
  },
  {
    path: "/video",
    name: "video",
    component: () => import("../views/video"),
  },
  {
    path: "/account",
    name: "account",
    component: () => import("../views/account"),
  },
  {
    path: "/address",
    name: "address",
    component: () => import("../views/address"),
  },
  {
    path: "/addAddress",
    name: "addAddress",
    component: () => import("../views/addAddress"),
  },
  {
    path: "/orderdetail",
    name: "orderdetail",
    component: () => import("../views/orderdetail"),
  },
  {
    path: "/myorder",
    name: "myorder",
    component: () => import("../views/myorder"),
  },
  {
    path: "/user",
    name: "user",
    component: () => import("../views/user"),
  },
  {
    path: "/category",
    name: "category",
    component: () => import("../views/category"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../views/search"),
    // meta: { title: '搜索', keepAlive: true }
  },
  {
    path: "/tab",
    name: "tab",
    component: () => import("../views/tab"),
    // meta: { title: '搜索', keepAlive: true }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to,from,savePosition){
    if(savePosition){
      return savePosition
    }else{
      return {x:0,y:0}
    }
  },
});

export default router;
