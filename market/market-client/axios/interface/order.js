import axios from "../api";

export const createOrder = (data) => {
  return axios({
    url: "order/createOrder",
    method: "post",
    data,
  });
};

export const getOrderDetail = (data) => {
  return axios({
    url: "order/getOrderDetail",
    method: "get",
    params:data,
  });
};

//根据tab名和页数获取订单列表
export const getOrderList = (data) =>{
  return axios({
    url: "order/getOrderList",
    method: "get",
    params:data,
  });
}

//取消或者支付完成
export const updateOrder = (data) =>{
    return axios({
    url: "order/updateOrder",
    method: "post",
    data:data,
  });
}







