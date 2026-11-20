"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/request.js");
const __default__ = {
  data() {
    return {};
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "message",
  setup(__props) {
    const messages = common_vendor.ref([]);
    const load = async () => {
      try {
        const result = await utils_api.api.order.getUserOrders(1, 20);
        if (result.code === 200) {
          const list = [];
          (result.rows || []).forEach((order) => {
            if (order.status === "0") {
              list.push({
                title: "充电中订单",
                desc: "你的充电宝正在使用中，归还成功后停止计费",
                time: order.startTime,
                type: "charging",
                orderId: order.id,
                key: "c" + order.id
              });
            } else if (order.status === "1") {
              list.push({
                title: "待支付订单",
                desc: "你有订单待支付，请及时完成支付",
                time: order.startTime,
                type: "unpaid",
                orderId: order.id,
                key: "u" + order.id
              });
            }
          });
          messages.value = list;
        }
      } catch (err) {
      }
    };
    common_vendor.onShow(() => {
      load();
    });
    const toOrderDetail = (orderId) => {
      common_vendor.index.navigateTo({
        url: "/pages/orderDetail/orderDetail?orderId=" + orderId
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(messages.value, (msg, index, i0) => {
          return {
            a: common_vendor.t(msg.title),
            b: common_vendor.t(msg.desc),
            c: common_vendor.t(msg.time),
            d: msg.type === "unpaid" ? "msgDot--unpaid" : "msgDot--charging",
            e: common_vendor.o(($event) => toOrderDetail(msg.orderId), msg.orderId),
            f: msg.key
          };
        }),
        b: messages.value.length === 0
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/liuyuan/Desktop/test/guli-chongdian/pages/message/message.vue"]]);
wx.createPage(MiniProgramPage);
