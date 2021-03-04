import axios from "../api";

// 结算
export const account = (data) => {
  return axios({
    url: "address/account",
    method: "get",
    params: data,
  });
};

export const getAddress = (data) => {
  return axios({
    url: "address/getAddress",
    method: "get",
    params: data,
  });
};

export const getDefaultAddress = () => {
  return axios({
    url: "address/getDefaultAddress",
    method: "get",
  });
};

export const addAddress = (data) => {
  return axios({
    url: "address/addAddress",
    method: "post",
    data:data
  });
};

export const getAllAddress = () => {
  return axios({
    url: "address/getAllAddress",
    method: "get",
  });
};

export const deleteAddress = (id) => {
  return axios({
    url: "address/deleteAddress",
    method: "delete",
    params:id
  });
};

export const editAddress = (data) => {
  return axios({
    url: "address/editAddress",
    method: "post",
    data
  });
};






