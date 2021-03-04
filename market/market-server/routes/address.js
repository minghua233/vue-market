const router = require("koa-router")();
const {
  findGoodDetail,
  getAddress,
  getDefaultAddress,
  addAddress,
  updateDefaultAddress,
  getAllAddress,
  deleteAddress,
  editAddress,
} = require("../controllers/mysqlConfig");

router.prefix("/address");

//结算
router.get("/account", async (ctx, next) => {
  // console.log(ctx.request.query);
  let data = Object.values(ctx.request.query);
  let arr = [];
  // console.log(data);
  for (let i = 0; i < data.length; i++) {
    let item = JSON.parse(data[i]);
    let res = await findGoodDetail(item.id);
    if (res.length) {
      let obj = res[0];
      obj.count = item.count;
      arr.push(obj);
    }
  }
  if (arr.length == data.length) {
    ctx.body = {
      code: "80000",
      data: arr,
      message: "查询成功",
    };
  } else {
    ctx.body = {
      code: "80004",
      data: "error",
      message: "查询失败",
    };
  }
});

//查询指定地址
router.get("/getAddress", async (ctx, next) => {
  let { id } = ctx.request.query;
  let r = ''
  console.log(id);
  await getAddress(id)
    .then((res) => {
      console.log(res);
      if (res.length) {
        r = "ok";
        ctx.body = {
          code: "80000",
          data: res[0],
          message: "获取成功",
        };
      } else {
        r = "error";
        ctx.body = {
          code: "80002",
          data: r,
          message: "获取失败",
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: "80004",
        data: err,
      };
    });
});

//获取默认地址
router.get("/getDefaultAddress", async (ctx, next) => {
  let token = ctx.request.header.token;
  let r = ''
  await getDefaultAddress(token)
    .then((res) => {
      console.log(res);
      if (res.length) {
        r = "ok";
        ctx.body = {
          code: "80000",
          data: res[0],
          message: "获取成功",
        };
      } else {
        r = "error";
        ctx.body = {
          code: "80002",
          data: r,
          message: "获取失败",
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: "80004",
        data: err,
      };
    });
});

//增加地址
router.post('/addAddress', async (ctx, next) =>{
  let {token} = ctx.request.header
  let {name,tel,province,city,county,addressDetail,postalCode,isDefault} = ctx.request.body
  console.log(ctx.request.body);
  let r = ''
  isDefault = isDefault == 'true' ? 1 : 0
  if(isDefault){
    let res = await getDefaultAddress(token)
    if(res.length){
      await updateDefaultAddress(res[0].id)
    }
  }
  let res = await addAddress([token,name,tel,province,city,county,addressDetail,postalCode,isDefault])
  if (res.affectedRows != 0) {
    r = "ok";
    ctx.body = {
      code: "80000",
      data: r,
      message: "添加成功",
    };
  } else {
    r = "error";
    ctx.body = {
      code: "80004",
      data: r,
      message: "添加失败",
    };
  }
})

//获取所有地址
router.get('/getAllAddress', async (ctx, next) =>{
  let {token} = ctx.request.header
  await getAllAddress(token)
  .then((res) => {
    let r = "";
    console.log(res);
    if (res.length) {
      r = "ok";
      ctx.body = {
        code: "80000",
        data: res,
        message: "获取成功",
      };
    } else {
      r = "error";
      ctx.body = {
        code: "80002",
        data: r,
        message: "获取错误",
      };
    }
  })
  .catch((err) => {
    ctx.body = {
      code: "80004",
      data: err,
    };
  });
})

//删除地址
router.delete('/deleteAddress', async (ctx, next) =>{
  let id = ctx.request.query.id;
  console.log(id);
  await deleteAddress(id)
    .then((res) => {
      console.log(res);
      if (res.affectedRows) {
        ctx.body = {
          code: "80000",
          message: "删除成功",
        };
      } else {
        ctx.body = {
          code: "80002",
          message: "删除失败",
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: "80004",
        data: err,
      };
    });
})

//修改地址
router.post('/editAddress', async (ctx, next) =>{
  let {id,name,tel,province,city,county,addressDetail,postalCode,isDefault} = ctx.request.body
  console.log(ctx.request.body);
  let r = ''
  isDefault = isDefault == 'true' ? 1 : 0
  await editAddress([name,tel,province,city,county,addressDetail,postalCode,isDefault,id]).then(res =>{
    if (res.affectedRows) {
    r = "ok";
    ctx.body = {
      code: "80000",
      data: r,
      message: "修改成功",
    };
  } else {
    r = "error";
    ctx.body = {
      code: "80002",
      data: r,
      message: "修改失败",
    };
  }
  }).catch(err =>{
    ctx.body = {
      code: "80004",
      data: err,
    };
  })

})
module.exports = router;
