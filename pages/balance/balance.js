"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/request.js");
const __default__ = {
  data() {
    return {};
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "balance",
  setup(__props) {
    const userInfo = common_vendor.ref(common_vendor.index.getStorageSync("userInfo") || {});
    const records = common_vendor.ref([]);
    const formatAmount = (value) => {
      const num = Number(value);
      return isNaN(num) ? "0.00" : num.toFixed(2);
    };
    const load = async () => {
      userInfo.value = common_vendor.index.getStorageSync("userInfo") || {};
      try {
        const userResult = await utils_api.api.user.getInfo();
        if (userResult.code === 200) {
          userInfo.value = userResult.data;
          common_vendor.index.setStorageSync("userInfo", userResult.data);
        }
      } catch (err) {
      }
      try {
        const result = await utils_api.api.order.getUserOrders(1, 20);
        if (result.code === 200) {
          records.value = (result.rows || []).filter((item) => item.status === "2");
        }
      } catch (err) {
      }
    };
    common_vendor.onShow(() => {
      load();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(formatAmount(userInfo.value.balance)),
        b: records.value.length > 0,
        c: common_vendor.f(records.value, (record, index, i0) => {
          return {
            a: common_vendor.t(formatAmount(record.totalAmount)),
            b: common_vendor.t(record.startTime),
            c: common_vendor.t(record.startStationName),
            d: record.id || index
          };
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/liuyuan/Desktop/test/guli-chongdian/pages/balance/balance.vue"]]);
wx.createPage(MiniProgramPage);
