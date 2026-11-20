"use strict";
const common_vendor = require("../../common/vendor.js");
const __default__ = {
  data() {
    return {};
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "help",
  setup(__props) {
    const faqs = [
      {
        q: "如何租借充电宝？",
        a: "在首页或门店详情页点击“扫码充电”，扫描机柜上的二维码。确认免押或押金状态后，仓门会自动弹出，取走充电宝即可开始计费。"
      },
      {
        q: "如何归还充电宝？",
        a: "在小程序内找到附近可归还的门店，将充电宝插入任意空闲仓，仓门锁止并提示成功，或在订单页确认订单已结束，即归还成功。"
      },
      {
        q: "归还失败怎么办？",
        a: "请先将充电宝重新插回仓内并确认指示灯正常。若仍未结束订单，请保留充电宝并联系客服处理，避免持续计费。"
      },
      {
        q: "如何计费？",
        a: "计费标准以门店详情页展示为准，从取走充电宝开始计时，归还成功后停止计费。具体金额以订单详情为准。"
      },
      {
        q: "押金如何退还？",
        a: "开通微信支付分免押后无需缴纳押金。如已缴纳押金，可在“押金管理”中查看状态，并联系客服核实后退还。"
      },
      {
        q: "充电宝丢失或损坏怎么办？",
        a: "请及时联系客服说明情况，我们将根据设备情况和订单规则协助处理。"
      }
    ];
    const openIndex = common_vendor.ref(-1);
    const toggle = (index) => {
      openIndex.value = openIndex.value === index ? -1 : index;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(faqs, (item, index, i0) => {
          return {
            a: common_vendor.t(item.q),
            b: common_vendor.t(item.a),
            c: openIndex.value === index,
            d: common_vendor.o(($event) => toggle(index), index),
            e: index
          };
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/liuyuan/Desktop/test/guli-chongdian/pages/help/help.vue"]]);
wx.createPage(MiniProgramPage);
