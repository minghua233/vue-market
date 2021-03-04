const router = require("koa-router")();
const {
  // findHomeSwiper,
  // findHomeGoodList,
  // findHomeFoodlist,
  getHomeGoods,
  getTodayNew
} = require("../controllers/mysqlConfig");

router.get("/", async (ctx, next) => {
  await ctx.render("index", {
    title: "Hello Koa 2!",
  });
});

router.get("/home", async (ctx, next) => {
  let data = {};
  let r = "";
  let res_homeGoods = await getHomeGoods()
  data.homeGoodsList = res_homeGoods
  let res_todayNew = await getTodayNew()
  data.todayNewList = res_todayNew
  // let res = await getHomeSwiper();
  // data.homeSwiper = res;
  // let res1 = await getHomeGoods();
  // data.homeFoodList = res1.slice(0, 5);
  // let res2 = await findHomeGoodList();
  // data.homeGoodList = res2.slice(0, 5);
  // console.log(data);
  if (
    res_homeGoods.length&&res_todayNew.length
    // res.length &&
    // res1.length &&
    // res2.length
  ) {
    r = "ok";
    ctx.body = {
      code: "80000",
      data: data,
      message: "首页数据获取成功",
    };
  } else {
    r = "error";
    ctx.body = {
      code: "80000",
      data: r,
      message: "首页数据获取失败",
    };
  }
});

module.exports = router;
