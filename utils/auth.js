"use strict";
const common_vendor = require("../common/vendor.js");
const utils_api = require("./request.js");
let loginPromise = null;
let redirecting = false;
async function doLogin(options) {
  if (options.force) {
    common_vendor.index.removeStorageSync("token");
  }
  const loginRes = await new Promise((resolve, reject) => {
    common_vendor.index.login({
      provider: "weixin",
      success: resolve,
      fail: reject
    });
  });
  const result = await utils_api.api.auth.loginByCode(loginRes.code);
  if (!result || result.code !== 200) {
    throw new Error(result && result.msg || "授权登录失败");
  }
  common_vendor.index.setStorageSync("token", result.data.access_token);
  const userResult = await utils_api.api.auth.getUserInfo();
  if (!userResult || userResult.code !== 200) {
    common_vendor.index.removeStorageSync("token");
    throw new Error(userResult && userResult.msg || "获取用户信息失败");
  }
  common_vendor.index.setStorageSync("userInfo", userResult.data);
  return userResult.data;
}
function login(options = {}) {
  if (loginPromise) {
    return loginPromise;
  }
  loginPromise = doLogin(options).then(
    (value) => {
      loginPromise = null;
      return value;
    },
    (err) => {
      loginPromise = null;
      throw err;
    }
  );
  return loginPromise;
}
function isLoggedIn() {
  return !!common_vendor.index.getStorageSync("token");
}
function getCurrentRoute() {
  const pages = typeof getCurrentPages === "function" ? getCurrentPages() : [];
  if (!pages.length) {
    return "/pages/index/index";
  }
  const page = pages[pages.length - 1];
  const route = page.route || page.__route__ || "";
  if (!route) {
    return "/pages/index/index";
  }
  const options = page.options || page.$page && page.$page.options || {};
  const keys = Object.keys(options);
  const query = keys.length ? "?" + keys.map((key) => key + "=" + encodeURIComponent(options[key])).join("&") : "";
  return "/" + route + query;
}
function redirectToLogin(redirect) {
  const current = getCurrentRoute();
  if (current.indexOf("/pages/login/login") === 0) {
    return;
  }
  if (redirecting) {
    return;
  }
  redirecting = true;
  const target = redirect || current;
  const url = "/pages/login/login" + (target ? "?redirect=" + encodeURIComponent(target) : "");
  setTimeout(() => {
    common_vendor.index.reLaunch({
      url,
      fail: () => {
        redirecting = false;
      },
      complete: () => {
        setTimeout(() => {
          redirecting = false;
        }, 800);
      }
    });
  }, 100);
}
function ensureLogin(redirect) {
  if (isLoggedIn()) {
    return true;
  }
  redirectToLogin(redirect);
  return false;
}
async function logout() {
  if (isLoggedIn()) {
    try {
      await utils_api.api.auth.logout();
    } catch (err) {
    }
  }
  common_vendor.index.removeStorageSync("token");
  common_vendor.index.removeStorageSync("userInfo");
  redirecting = false;
}
async function handleUnauthorized() {
  if (!isLoggedIn()) {
    redirectToLogin(getCurrentRoute());
    throw new Error("未登录");
  }
  try {
    await login({ force: true });
  } catch (err) {
    common_vendor.index.removeStorageSync("token");
    common_vendor.index.removeStorageSync("userInfo");
    redirectToLogin(getCurrentRoute());
    throw err;
  }
}
exports.login = login;
exports.logout = logout;
exports.isLoggedIn = isLoggedIn;
exports.ensureLogin = ensureLogin;
exports.redirectToLogin = redirectToLogin;
exports.handleUnauthorized = handleUnauthorized;
exports.getCurrentRoute = getCurrentRoute;
