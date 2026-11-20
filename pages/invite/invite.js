"use strict";
const common_vendor = require("../../common/vendor.js");
const __default__ = {
  data() {
    return {};
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "invite",
  setup(__props) {
    common_vendor.onShareAppMessage(() => {
      return {
        title: "邀请你使用共享充电，随借随还",
        path: "/pages/index/index"
      };
    });
    return (_ctx, _cache) => {
      return {};
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/liuyuan/Desktop/test/guli-chongdian/pages/invite/invite.vue"]]);
wx.createPage(MiniProgramPage);
