"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/request.js");
const __default__ = {
  data() {
    return {};
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "invoice",
  setup(__props) {
    const orders = common_vendor.ref([]);
    const formatAmount = (value) => {
      const num = Number(value);
      return isNaN(num) ? "0.00" : num.toFixed(2);
    };
    const load = async () => {
      try {
        const result = await utils_api.api.order.getUserOrders(1, 50);
        if (result.code === 200) {
          orders.value = (result.rows || []).filter((item) => item.status === "2");
        }
      } catch (err) {
      }
    };
    common_vendor.onShow(() => {
      load();
    });
    return (_ctx, _cache) => {
      return {
        a: orders.value.length > 0,
        b: common_vendor.f(orders.value, (order, index, i0) => {
          return {
            a: common_vendor.t(order.orderNo || order.id),
            b: common_vendor.t(order.startTime),
            c: common_vendor.t(formatAmount(order.totalAmount)),
            d: order.id || index
          };
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/liuyuan/Desktop/test/guli-chongdian/pages/invoice/invoice.vue"]]);
wx.createPage(MiniProgramPage);
