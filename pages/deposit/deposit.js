"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/request.js");
const __default__ = {
  data() {
    return {};
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "deposit",
  setup(__props) {
    const needDeposit = common_vendor.ref(true);
    const statusDesc = common_vendor.ref("开通免押后即可扫码租借充电宝");
    const applyStatus = (info) => {
      const pending = !info || info.depositStatus === void 0 || String(info.depositStatus) === "0";
      needDeposit.value = pending;
      statusDesc.value = pending ? "开通免押后即可扫码租借充电宝" : "当前账号已开通免押租借，无需缴纳押金";
    };
    const loadStatus = async () => {
      applyStatus(common_vendor.index.getStorageSync("userInfo"));
      try {
        const result = await utils_api.api.user.getInfo();
        if (result.code === 200) {
          common_vendor.index.setStorageSync("userInfo", result.data);
          applyStatus(result.data);
        }
      } catch (err) {
      }
    };
    common_vendor.onShow(() => {
      loadStatus();
    });
    const goVerify = () => {
      common_vendor.index.navigateTo({
        url: "/pages/verify/verify"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: needDeposit.value,
        b: common_vendor.t(statusDesc.value),
        c: common_vendor.o(goVerify)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/liuyuan/Desktop/test/guli-chongdian/pages/deposit/deposit.vue"]]);
wx.createPage(MiniProgramPage);
