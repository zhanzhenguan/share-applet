"use strict";
const common_vendor = require("../../common/vendor.js");
const __default__ = {
  data() {
    return {};
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "coupon",
  setup(__props) {
    const tabs = ["可用", "已使用", "已过期"];
    const tab = common_vendor.ref(0);
    const switchTab = (index) => {
      tab.value = index;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabs, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: tab.value === index,
            c: common_vendor.o(($event) => switchTab(index), index),
            d: index
          };
        }),
        e: common_vendor.t(tab.value === 0 ? "暂无可用卡券" : tab.value === 1 ? "暂无已使用卡券" : "暂无已过期卡券")
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/liuyuan/Desktop/test/guli-chongdian/pages/coupon/coupon.vue"]]);
wx.createPage(MiniProgramPage);
