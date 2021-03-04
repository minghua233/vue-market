const router = require("koa-router")();
const {
  userLogin,
  findUser,
  insertUser,
  getuserInfo,
} = require("../controllers/mysqlConfig");

router.prefix("/users");

//登录
router.get("/login", async (ctx, next) => {
  let username = ctx.request.query.username;
  let password = ctx.request.query.password;
  //把参数拿到数据库查询
  console.log(ctx.request.query);
  await userLogin(username, password)
    .then((res) => {
      console.log(res);
      let r = "";
      if (res.length) {
        r = "ok";
        let result = {
          id: res[0].id,
          username: res[0].username,
          password: res[0].password,
        };
        ctx.body = {
          code: "80000",
          data: result,
          message: "登录成功",
        };
      } else {
        r = "error";
        ctx.body = {
          code: "80002",
          data: r,
          message: "账号或密码错误",
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

//注册
router.get("/register", async (ctx, next) => {
  let username = ctx.request.query.username;
  let password = ctx.request.query.password;
  //把参数拿到数据库查询
  console.log(ctx.request.query);
  await findUser(username).then(async (res) => {
    if (!res.length) {
      let avatar = 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1509430250,3181105591&fm=26&gp=0.jpg'
      await insertUser([username, password,avatar]).then((res1) => {
        let r = "";
        if (res1.affectedRows != 0) {
          r = "ok";
          ctx.body = {
            code: "80000",
            data: r,
            message: "注册成功",
          };
        } else {
          r = "error";
          ctx.body = {
            code: "80004",
            data: r,
            message: "注册失败",
          };
        }
      });
    } else {
      ctx.body = {
        code: "80003",
        message: "用户名已存在",
      };
    }
  });
});

//根据id查询用户信息
router.post('/getuserInfo', async (ctx, next) =>{
  let {token} = ctx.request.header
  await getuserInfo(token)
  .then((res) => {
    let r = "";
    if (res.length) {
      r = "ok";
      ctx.body = {
        code: "80000",
        data: res[0],
        message: "查询成功",
      };
    } else {
      r = "error";
      ctx.body = {
        code: "80002",
        data: r,
        message: "请登录",
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
module.exports = router;
