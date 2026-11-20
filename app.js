"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_auth = require("./utils/auth.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/nearbystores/nearbystores.js";
  "./pages/detail/detail.js";
  "./pages/center/center.js";
  "./pages/order/order.js";
  "./pages/orderDetail/orderDetail.js";
  "./pages/verify/verify.js";
}
const _sfc_main = {
  onLaunch: function() {
    if (utils_auth.isLoggedIn()) {
      utils_auth.login().catch(() => {
      });
    }
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/liuyuan/Desktop/test/guli-chongdian/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
