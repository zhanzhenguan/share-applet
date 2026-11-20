"use strict";
const utils_auth = require("../../utils/auth.js");
Page({
  data: {
    agreed: false,
    loading: false,
    errorMsg: "",
    redirect: ""
  },
  onLoad(options) {
    this.setData({
      redirect: options && options.redirect ? decodeURIComponent(options.redirect) : ""
    });
  },
  onShow() {
    if (utils_auth.isLoggedIn()) {
      this.goAfterLogin();
    }
  },
  toggleAgree() {
    this.setData({
      agreed: !this.data.agreed
    });
  },
  toAgreement() {
    wx.navigateTo({
      url: "/pages/agreement/agreement"
    });
  },
  handleLogin() {
    if (this.data.loading) {
      return;
    }
    if (!this.data.agreed) {
      wx.showToast({
        title: "请先阅读并同意协议",
        icon: "none"
      });
      return;
    }
    this.setData({
      loading: true,
      errorMsg: ""
    });
    utils_auth.login({
      force: true
    }).then(() => {
      this.setData({
        loading: false
      });
      this.goAfterLogin();
    }).catch((err) => {
      this.setData({
        loading: false,
        errorMsg: err && (err.message || err.errMsg) || "登录失败，请稍后重试"
      });
    });
  },
  goAfterLogin() {
    if (this.navigating) {
      return;
    }
    this.navigating = true;
    const redirect = this.data.redirect;
    const valid = redirect && redirect.indexOf("/pages/") === 0 && redirect.indexOf("/pages/login/login") !== 0;
    wx.reLaunch({
      url: valid ? redirect : "/pages/index/index",
      complete: () => {
        this.navigating = false;
      }
    });
  },
  goHome() {
    wx.reLaunch({
      url: "/pages/index/index"
    });
  }
});
