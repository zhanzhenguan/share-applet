"use strict";
const common_vendor = require("../common/vendor.js");
const utils_config = require("./config.js");
let reloginPromise = null;
function send(url, data = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: utils_config.config.baseUrl + url,
      method,
      data,
      header: {
        "Authorization": "Bearer " + common_vendor.index.getStorageSync("token")
      },
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}
async function requestRaw(url, data = {}, method = "GET") {
  const res = await send(url, data, method);
  return res.data;
}
function isUnauthorized(res) {
  return res.statusCode === 401 || !!(res.data && res.data.code === 401);
}
async function request(url, data = {}, method = "GET") {
  const res = await send(url, data, method);
  if (!isUnauthorized(res)) {
    return res.data;
  }
  if (!reloginPromise) {
    const utils_auth = require("./auth.js");
    reloginPromise = utils_auth.handleUnauthorized().then(
      (value) => {
        reloginPromise = null;
        return value;
      },
      (err) => {
        reloginPromise = null;
        throw err;
      }
    );
  }
  await reloginPromise;
  const retry = await send(url, data, method);
  return retry.data;
}
exports.request = request;
exports.requestRaw = requestRaw;
const api = {
  auth: {
    loginByCode(code) {
      return requestRaw(`/auth/h5/login/${code}`);
    },
    getUserInfo() {
      return requestRaw("/user/userInfo/getLoginUserInfo");
    },
    logout() {
      return requestRaw("/auth/h5/logout");
    }
  },
  user: {
    getInfo() {
      return request("/user/userInfo/getLoginUserInfo");
    },
    verifyFreeDeposit() {
      return request("/user/userInfo/isFreeDeposit");
    }
  },
  device: {
    getStation(stationId, latitude, longitude) {
      return request(`/device/device/getStation/${stationId}/${latitude}/${longitude}`);
    },
    getNearbyStations(latitude, longitude) {
      return request(`/device/device/nearbyStation/${latitude}/${longitude}`);
    },
    scanCharge(cabinetNo) {
      return request(`/device/device/scanCharge/${encodeURIComponent(cabinetNo)}`);
    }
  },
  order: {
    getNoFinishOrder() {
      return request("/order/orderInfo/getNoFinishOrder");
    },
    getUserOrders(page, size) {
      return request(`/order/orderInfo/userOrderInfoList/${page}/${size}`);
    },
    getOrderInfo(orderId) {
      return request(`/order/orderInfo/getOrderInfo/${orderId}`);
    }
  },
  payment: {
    createWxPayment(orderNo) {
      return request("/payment/wxPay/createWxPayment", {
        orderNo
      }, "POST");
    },
    queryPayStatus(orderNo) {
      return request(`/payment/wxPay/queryPayStatus/${orderNo}`);
    }
  }
};
exports.api = api;
