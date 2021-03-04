import axios from '../api'
export const detail = (data) =>{
  return axios({
    url: 'good/detail',
    method: 'get',
    params:data
  })
}

export const addCart = (data) =>{
  return axios({
    url: 'good/addCart',
    method: 'post',
    data:data
  })
}

export const getCart = () =>{
  return axios({
    url: 'good/getCart',
    method: 'post',
  })
}

export const updateCart = (data) =>{
  return axios({
    url: 'good/updateCart',
    method: 'get',
    params:data
  })
}

export const deleteCart = (data) =>{
  return axios({
    url: 'good/deleteCart',
    method: 'delete',
    params:data
  })
}
//商品的详情数据
export const getGoodDetail = (data) =>{
  return axios({
    url: 'good/getGoodDetail',
    method: 'get',
    params:data
  })
}

//商品加入购物车
export const addFoodCart = (data) =>{
  return axios({
    url: 'good/addFoodCart',
    method: 'post',
    data:data
  })
}

//商品加入购物车
export const searchGoods = (data) =>{
  return axios({
    url: 'good/searchGoods',
    method: 'get',
    params:data
  })
}

//获取分类数据
export const getCategoryData = () =>{
  return axios({
    url: 'good/getCategoryData',
    method: 'get',
  })
}

//获取分类Tab数据
export const getTabFoodData = (data) =>{
  return axios({
    url: 'good/getTabFoodData',
    method: 'get',
    params:data
  })
}

