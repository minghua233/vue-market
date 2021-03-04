const router = require("koa-router")();
const {
  createOrder,
  createOrderList,
  deleteCartByToken,
  findCartGood,
  getOrderDetail,
  getOrderDetailList,
  findGoodDetail,
  getOrderList,
  updateOrder,
} = require("../controllers/mysqlConfig");
const { formatDate } = require("../controllers/util");

router.prefix("/order");

//生成订单
router.post("/createOrder", async (ctx, next) => {
  console.log(ctx.request.body);
  let { token } = ctx.request.header;
  let { id, address, total, ispay, orderlist } = ctx.request.body;
  let time = Number(id);
  time = formatDate(time);
  console.log(time, id);
  ispay = ispay == "true" ? 1 : 0;

  await createOrder([id, token, time, address, total, ispay, 0])
    .then(async (res) => {
      console.log(res);
      let r = "";
      let sum = 0;
      for (let i = 0; i < orderlist.length; i++) {
        let res1 = await createOrderList([
          id,
          orderlist[i].id,
          orderlist[i].count,
        ]);
        let res3 = await findCartGood(token, orderlist[i].id);
        if (res3.length) {
          await deleteCartByToken(token, orderlist[i].id);
        }

        if (res1.affectedRows) {
          sum++;
        }
      }
      if (res.affectedRows && sum == orderlist.length) {
        r = "ok";
        ctx.body = {
          code: "80000",
          data: r,
          message: "下单成功",
        };
      } else {
        r = "error";
        ctx.body = {
          code: "80002",
          data: r,
          message: "下单失败",
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: "80004",
        message: err,
      };
    });
});

//查询指定订单详情
router.get("/getOrderDetail", async (ctx, next) => {
  let { id } = ctx.request.query;
  await getOrderDetail(id)
    .then(async (res) => {
      if (res.length) {
        let obj = {};
        let arr = [];
        if (res[0].isclose.includes(1)) {
          obj.status = "已取消";
        } else {
          if (res[0].ispay.includes(1)) {
            obj.status = "已支付";
          } else {
            obj.status = "待付款";
          }
        }
        obj.orderDetail = res[0];
        let res1 = await getOrderDetailList(id);
        if (res1.length) {
          for (let i = 0; i < res1.length; i++) {
            let res2 = await findGoodDetail(res1[i].goodid);
            let obj2 = res2[0];
            obj2.count = res1[i].count;
            arr.push(obj2);
          }
        }
        obj.orderDetailList = arr;
        ctx.body = {
          code: "80000",
          data: obj,
          message: "某订单详情",
        };
      } else {
        ctx.body = {
          code: "80002",
          data: "err",
          message: "某订单详情获取失败",
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: "80004",
        message: err,
      };
    });
});

//根据page数和status查询订单列表
router.get("/getOrderList", async (ctx, next) => {
  let { pagenumber, status } = ctx.request.query;
  let { token } = ctx.request.header;
  console.log(pagenumber * 5, status);
  await getOrderList(status, token)
    .then(async (res) => {
      let order = {};
      let orderlist = [];
      order.pageNum = Math.floor(res.length / 5);
      for (
        let i = 0 + pagenumber * 5;
        i < pagenumber * 5 + 5 && i < res.length;
        i++
      ) {
        let obj = {};
        let arr = [];
        obj.orderDetail = res[i];
        // if(res[i].isclose.includes(1)){
        //   console.log(123);
        // }
        // console.log(res[i].isclose);
        if (res[i].isclose.includes(1)) {
          obj.status = "已取消";
        } else {
          if (res[i].ispay.includes(1)) {
            obj.status = "已支付";
          } else {
            obj.status = "待付款";
          }
        }

        let res1 = await getOrderDetailList(res[i].orderid);
        if (res1.length) {
          for (let j = 0; j < res1.length; j++) {
            let res2 = await findGoodDetail(res1[j].goodid);
            if (res2.length) {
              let obj2 = res2[0];
              obj2.count = res1[j].count;
              arr.push(obj2);
            }
          }
          obj.orderDetailList = arr;
        }
        orderlist.push(obj);
      }
      order.orderlist = orderlist;
      ctx.body = {
        code: "80000",
        data: order,
        message: "订单列表",
      };
    })
    .catch((err) => {
      ctx.body = {
        code: "80004",
        message: err,
      };
    });
});

//修改订单状态
router.post("/updateOrder", async (ctx, next) => {
  let { id, type } = ctx.request.body;
  await updateOrder(id, type)
    .then((res) => {
      if (res.changedRows) {
        ctx.body = {
          code: "80000",
          message: "修改成功",
        };
      } else {
        ctx.body = {
          code: "80002",
          message: "修改失败",
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: "80004",
        data: err,
        message: "出错了",
      };
    });
});
module.exports = router;
