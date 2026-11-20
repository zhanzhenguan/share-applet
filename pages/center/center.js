"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/request.js");
const utils_auth = require("../../utils/auth.js");
const __default__ = {
  data() {
    return {};
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "center",
  setup(__props) {
    const userInfo = common_vendor.ref(common_vendor.index.getStorageSync("userInfo") || {});
    const currentOrder = common_vendor.ref(null);
    const formatPhone = (phone) => {
      if (!phone) {
        return "";
      }
      return String(phone).replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
    };
    const loadUserInfo = async () => {
      userInfo.value = common_vendor.index.getStorageSync("userInfo") || {};
      try {
        const result = await utils_api.api.user.getInfo();
        if (result.code === 200) {
          userInfo.value = result.data;
          common_vendor.index.setStorageSync("userInfo", result.data);
        }
      } catch (err) {
      }
    };
    const loadCurrentOrder = async () => {
      try {
        const result = await utils_api.api.order.getNoFinishOrder();
        if (result.code === 200 && result.data && result.data.id) {
          currentOrder.value = {
            ...result.data,
            status: result.data.status === null || result.data.status === void 0 ? "" : String(result.data.status)
          };
        } else {
          currentOrder.value = null;
        }
      } catch (err) {
        currentOrder.value = null;
      }
    };
    common_vendor.onShow(() => {
      if (!utils_auth.isLoggedIn()) {
        utils_auth.redirectToLogin("/pages/center/center");
        return;
      }
      loadUserInfo();
      loadCurrentOrder();
    });
    const toOrder = () => {
      common_vendor.index.navigateTo({
        url: "/pages/order/order"
      });
    };
    const toCurrentOrder = () => {
      if (!currentOrder.value || !currentOrder.value.id) {
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/orderDetail/orderDetail?orderId=" + currentOrder.value.id
      });
    };
    const toDeposit = () => {
      common_vendor.index.navigateTo({
        url: "/pages/deposit/deposit"
      });
    };
    const toHelp = () => {
      common_vendor.index.navigateTo({
        url: "/pages/help/help"
      });
    };
    const toRecruit = () => {
      common_vendor.index.navigateTo({
        url: "/pages/recruit/recruit"
      });
    };
    const toCoupon = () => {
      common_vendor.index.navigateTo({
        url: "/pages/coupon/coupon"
      });
    };
    const toBalance = () => {
      common_vendor.index.navigateTo({
        url: "/pages/balance/balance"
      });
    };
    const toMessage = () => {
      common_vendor.index.navigateTo({
        url: "/pages/message/message"
      });
    };
    const toInvite = () => {
      common_vendor.index.navigateTo({
        url: "/pages/invite/invite"
      });
    };
    const toInvoice = () => {
      common_vendor.index.navigateTo({
        url: "/pages/invoice/invoice"
      });
    };
    const toAgreement = () => {
      common_vendor.index.navigateTo({
        url: "/pages/agreement/agreement"
      });
    };
    const comingSoon = () => {
      common_vendor.index.showToast({
        title: "功能建设中，敬请期待",
        icon: "none"
      });
    };
    const logout = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: async (res) => {
          if (!res.confirm) {
            return;
          }
          common_vendor.index.showLoading({
            title: "正在退出",
            mask: true
          });
          await utils_auth.logout();
          userInfo.value = {};
          common_vendor.index.hideLoading();
          common_vendor.index.reLaunch({
            url: "/pages/login/login"
          });
        }
      });
    };
    return (_ctx, _cache) => {
      const order = currentOrder.value;
      const status = order ? order.status : "";
      const statusText = status === "0" ? "充电中" : status === "1" ? "未支付" : status === "2" ? "已支付" : "处理中";
      const statusClass = status === "1" ? "orderCard--unpaid" : status === "2" ? "orderCard--paid" : "orderCard--charging";
      const actionText = status === "1" ? "去支付" : status === "2" ? "查看详情" : "查看订单";
      let orderDesc = "";
      if (order) {
        if (status === "0") {
          orderDesc = order.duration ? "已使用 " + order.duration + " 分钟" : order.startTime ? "租借时间 " + order.startTime : "订单进行中";
        } else if (status === "1") {
          orderDesc = order.totalAmount !== void 0 && order.totalAmount !== null ? "待支付 ￥" + order.totalAmount : "订单待支付，请及时完成支付";
        } else if (status === "2") {
          orderDesc = order.totalAmount !== void 0 && order.totalAmount !== null ? "已支付 ￥" + order.totalAmount : "订单已完成，感谢使用";
        } else {
          orderDesc = "订单处理中";
        }
      }
      return {
        a: common_vendor.t(userInfo.value.nickname || "微信用户"),
        b: common_vendor.t(userInfo.value.depositStatus === "0" ? "未缴押金" : "免押金"),
        c: common_vendor.o(toOrder),
        d: common_vendor.t(formatPhone(userInfo.value.phone)),
        e: common_vendor.o(logout),
        f: common_vendor.o(toAgreement),
        g: common_vendor.o(comingSoon),
        h: order ? true : false,
        i: common_vendor.t(orderDesc),
        j: common_vendor.o(toCurrentOrder),
        k: common_vendor.o(toDeposit),
        l: common_vendor.o(toHelp),
        m: common_vendor.o(toRecruit),
        n: common_vendor.o(toCoupon),
        o: common_vendor.o(toBalance),
        p: common_vendor.o(toMessage),
        q: common_vendor.o(toInvite),
        r: common_vendor.o(toInvoice),
        s: statusClass,
        t: common_vendor.t(statusText),
        u: common_vendor.t(actionText)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3f122818"], ["__file", "C:/Users/liuyuan/Desktop/test/guli-chongdian/pages/center/center.vue"]]);
wx.createPage(MiniProgramPage);
