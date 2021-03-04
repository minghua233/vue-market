const mysql = require("mysql");
const config = require("./defaultConfig");

let pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  port: config.database.PORT,
});

let allServices = {
  query: function (sql, values) {
    return new Promise((resolve, reject) => {
      pool.getConnection(function (err, connection) {
        if (err) {
          reject(err);
        } else {
          connection.query(sql, values, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
            connection.release();
          });
        }
      });
    });
  },
};

// 登录
let userLogin = function (username, userpwd) {
  let _sql = `select * from users where username=${username} AND password=${userpwd}`;
  return allServices.query(_sql);
};

// 查找用户
let findUser = function (username) {
  let _sql = `select * from users where username=${username}`;
  return allServices.query(_sql);
};

// 根据id查找用户
let getuserInfo = function (id) {
  let _sql = `select * from users where id=${id}`;
  return allServices.query(_sql);
};

// 注册
let insertUser = function (value) {
  let _sql = `insert into users set username=?,password=?,avatar=?`;
  return allServices.query(_sql, value);
};

//查找首页轮播列表
let getHomeSwiper = function () {
  let _sql = `select * from homeswiper`;
  return allServices.query(_sql);
};

//查找今日热卖
let getHomeGoods = function () {
  let _sql = `select * from goods where todayHot = 1`;
  return allServices.query(_sql);
};

//查找每日上新
let getTodayNew = function () {
  let _sql = `select * from goods where todayNew = 1`;
  return allServices.query(_sql);
};

//加入购物车
let addCart = function (value) {
  let _sql = `insert into cart set userid=?,goodid=?,count=?`;
  return allServices.query(_sql, value);
};
//查找购物车里是否有商品
let findCartGood = function (token, goodid) {
  let _sql = `select * from cart where userid=${token} and goodid=${goodid}`;
  return allServices.query(_sql);
};
//查询用户购物车
let findUserCart = function (token) {
  let _sql = `select * from cart where userid=${token}`;
  return allServices.query(_sql);
};

//修改购物车数据
let updateCart = function (value) {
  let _sql = `update cart set count=? where userid=? and goodid=?`;
  return allServices.query(_sql, value);
};

//根据id删除购物车某件商品
let deleteCart = function (id) {
  let _sql = `delete from cart where id=${id}`;
  return allServices.query(_sql);
};

//根据用户id和商品id删除购物车某件商品
let deleteCartByToken = function (token, id) {
  let _sql = `delete from cart where userid=${token} and goodid=${id}`;
  return allServices.query(_sql);
};

//查询商品详情
let getGoodDetail = function (id) {
  let _sql = `select * from goods where goodId=${id}`;
  return allServices.query(_sql);
};

//根据id查询商品需要的商品
let getFoodGood = function (id) {
  let _sql = `select * from foodgood where foodid=${id}`;
  return allServices.query(_sql);
};

//得到指定地址
let getAddress = function (id) {
  let _sql = `select * from address where id=${id}`;
  return allServices.query(_sql);
};

//得到默认地址
let getDefaultAddress = function (id) {
  let _sql = `select * from address where userid=${id} and isDefault=1`;
  return allServices.query(_sql);
};

//增加地址
let addAddress = function (value) {
  let _sql = `insert into address set userid=?,name=?,tel=?,province=?,city=?,county=?,addressDetail=?,postalCode=?,isDefault=?`;
  return allServices.query(_sql, value);
};

//修改默认地址
let updateDefaultAddress = function (id){
  let _sql = `update address set isDefault=0 where id=${id}`;
  return allServices.query(_sql);
}

//获取所有地址
let getAllAddress = function (id){
  let _sql = `select * from address where userid=${id}`;
  return allServices.query(_sql);
}

//删除地址
let deleteAddress = function (id) {
  let _sql = `delete from address where id=${id}`;
  return allServices.query(_sql);
};

//修改地址
let editAddress = function(value){
  let _sql = `update address set name=?,tel=?,province=?,city=?,county=?,addressDetail=?,postalCode=?,isDefault=? where id=?`;
  return allServices.query(_sql, value);
}

//创建订单
let createOrder = function (value) {
  let _sql = `insert into orders set orderid=?,userid=?,time=?,address=?,total=?,ispay=?,isclose=?`;
  // let _sql = `select * from order`; //为啥不能用order?order是MySQL保留字
  return allServices.query(_sql, value);
};

//创建订单商品信息
let createOrderList = function (value){
  let _sql = `insert into orderlist set orderid=?,goodid=?,count=?`;
  return allServices.query(_sql, value);
}

//查询订单详情
let getOrderDetail = function(id){
  let _sql = `select * from orders where orderid=${id}`;
  return allServices.query(_sql);
}

//查询订单商品列表
let getOrderDetailList = function(id){
  let _sql = `select * from orderlist where orderid=${id}`;
  return allServices.query(_sql);
}

//根据page和status获取订单列表
let getOrderList = function(status,token){
  let _sql = ''
  if(status == ''){
    _sql = `select * from orders where userid=${token} order by id desc`;
  }else if(status == '0'){
    _sql = `select * from orders where userid=${token} and ispay=0 and isclose=0 order by id desc`;
  }else if(status == '4'){
    _sql = `select * from orders where userid=${token} and isclose=1 order by id desc`;
  }else{
    _sql = `select * from orders where userid=${token} and ispay=1 and isclose=0 order by id desc`;
  }
  return allServices.query(_sql);
}

//修改订单
let updateOrder = function(id,type){
  let _sql = ''
  if(Number(type)){
    _sql = `update orders set ispay=1 where orderid=${id}`;
  }else{
    _sql = `update orders set isclose=1 where orderid=${id}`;
  }
  return allServices.query(_sql);
}

//搜索
let searchGoods = function(type,mhText){
  let _sql = ''
  if(mhText == '%'){
    if(Number(type) == 1){
      _sql = `select * from foods`;
    }else{
      _sql = `select * from good`;
    }
  }else if(Number(type) == 1){
    _sql = `select * from foods where name like '${mhText}'`;
  }else{
    _sql = `select * from good where name like '${mhText}'`;
  }
  return allServices.query(_sql);
}
// where name like ${mhText}

let getCategoryFoodData = function(type){
  let _sql = `select * from goods where goodType='${type}'`;
  return allServices.query(_sql);
}

//分类-商品
let getCategoryGoodData = function(){
  let _sql = `select * from goods group by goodType`;
  return allServices.query(_sql);
}
module.exports = {
  userLogin,
  findUser,
  getuserInfo,
  insertUser,
  getHomeSwiper,
  getHomeGoods,
  getTodayNew,
  // findGoodDetail,
  addCart,
  findCartGood,
  findUserCart,
  updateCart,
  deleteCart,
  deleteCartByToken,
  getGoodDetail,
  getFoodGood,
  getAddress,
  getDefaultAddress,
  addAddress,
  updateDefaultAddress,
  getAllAddress,
  deleteAddress,
  editAddress,
  createOrder,
  createOrderList,
  getOrderDetail,
  getOrderDetailList,
  getOrderList,
  updateOrder,
  searchGoods,
  getCategoryFoodData,
  getCategoryGoodData,
};
