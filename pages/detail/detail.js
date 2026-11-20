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
  __name: "detail",
  setup(__props) {
    const currentNear = common_vendor.ref({});
    const nearDetail = common_vendor.ref({});
    common_vendor.onLoad((option) => {
      currentNear.value = JSON.parse(option.near);
      console.log(currentNear.value);
    });
    const getNearDetail = async () => {
      const result = await utils_api.api.device.getStation(currentNear.value.id, currentNear.value.latitude, currentNear.value.longitude);
      if (result.code === 200) {
        nearDetail.value = result.data;
      } else {
        console.log("获取门店详情失败");
      }
    };
    common_vendor.onMounted(() => {
      getNearDetail();
    });
    const isShowMask = common_vendor.ref(false);
    const POLL_INTERVAL = 2e3;
    const POLL_MAX_ATTEMPTS = 15;
    let pollTimer = null;
    let pollAttempts = 0;
    let pageActive = true;
    const stopPolling = () => {
      if (pollTimer) {
        clearTimeout(pollTimer);
      }
      pollTimer = null;
      pollAttempts = 0;
    };
    const showMessage = (title) => {
      common_vendor.index.showToast({
        title: title || "操作失败，请重试",
        icon: "none",
        duration: 3e3
      });
    };
    const finishScan = () => {
      stopPolling();
      common_vendor.index.hideLoading();
      isShowMask.value = false;
    };
    const isCurrentPage = () => {
      const pages = getCurrentPages();
      const current = pages[pages.length - 1];
      return current && current.route === "pages/detail/detail";
    };
    const openOrderDetail = (orderId) => {
      if (!pageActive || !isCurrentPage()) {
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/orderDetail/orderDetail?orderId=" + orderId,
        fail: () => {
          showMessage("订单页面打开失败");
        }
      });
    };
    const extractCabinetNo = (raw) => {
      if (!raw || typeof raw !== "string") {
        return "";
      }
      const value = raw.trim();
      if (!value) {
        return "";
      }
      if (/^https?:\/\//i.test(value)) {
        const queryIndex = value.indexOf("?");
        if (queryIndex !== -1) {
          const query = value.slice(queryIndex + 1).split("#")[0];
          const keys = ["cabinetNo", "cabinet_no", "cabinetno", "deviceNo", "device_no", "no", "code"];
          const parts = query.split("&");
          for (let i = 0; i < parts.length; i++) {
            const pair = parts[i].split("=");
            const key = decodeURIComponent(pair[0] || "");
            if (keys.indexOf(key) !== -1 && pair[1]) {
              return decodeURIComponent(pair.slice(1).join("="));
            }
          }
        }
        const path = value.split("?")[0].replace(/\/+$/, "");
        const segment = path.split("/").pop();
        return segment ? decodeURIComponent(segment) : "";
      }
      return value;
    };
    const pollOrder = async () => {
      if (!pageActive) {
        stopPolling();
        return;
      }
      pollAttempts += 1;
      try {
        const result = await utils_api.api.order.getNoFinishOrder();
        if (!pageActive) {
          stopPolling();
          return;
        }
        const orderId = result && Number(result.code) === 200 && result.data ? result.data.id : null;
        if (orderId) {
          finishScan();
          openOrderDetail(orderId);
          return;
        }
      } catch (error) {
        console.error("查询进行中订单失败", error);
      }
      if (pollAttempts >= POLL_MAX_ATTEMPTS) {
        finishScan();
        showMessage("开仓超时，请稍后重试");
        return;
      }
      pollTimer = setTimeout(pollOrder, POLL_INTERVAL);
    };
    const startPolling = () => {
      if (pollTimer) {
        return;
      }
      pollAttempts = 0;
      pollTimer = setTimeout(pollOrder, POLL_INTERVAL);
    };
    const handleScanResult = async (raw) => {
      const cabinetNo = extractCabinetNo(raw);
      if (!cabinetNo) {
        finishScan();
        showMessage("二维码无效，请重新扫码");
        return;
      }
      try {
        const result = await utils_api.api.device.scanCharge(cabinetNo);
        if (!result || Number(result.code) !== 200) {
          finishScan();
          showMessage(result && (result.msg || result.message) || "开仓失败，请重试");
          return;
        }
        const data = result.data || {};
        const status = data.status === void 0 || data.status === null ? "" : String(data.status);
        if (status === "1") {
          startPolling();
          return;
        }
        if (status === "2") {
          finishScan();
          showMessage(data.message || "开仓失败，请重试");
          return;
        }
        if (status === "3") {
          try {
            const current = await utils_api.api.order.getNoFinishOrder();
            const orderId = current && Number(current.code) === 200 && current.data ? current.data.id : null;
            if (orderId) {
              finishScan();
              openOrderDetail(orderId);
              return;
            }
          } catch (error) {
            console.error("查询进行中订单失败", error);
          }
          finishScan();
          showMessage("未找到进行中订单，请重试");
          return;
        }
        finishScan();
        showMessage(data.message || "开仓失败，请重试");
      } catch (error) {
        console.error("扫码充电失败", error);
        finishScan();
        showMessage("网络异常，请稍后重试");
      }
    };
    const scan = () => {
      if (isShowMask.value) {
        return;
      }
      if (nearDetail.value.isUsable !== "1") {
        common_vendor.index.showToast({
          title: "该门店暂不可借",
          icon: "none"
        });
        return;
      }
      const userInfo = common_vendor.index.getStorageSync("userInfo") || {};
      const near = currentNear.value;
      const redirect = "/pages/detail/detail?id=" + near.id + "&near=" + encodeURIComponent(JSON.stringify(near));
      if (!utils_auth.ensureLogin(redirect)) {
        return;
      }
      if (userInfo.depositStatus === "0") {
        common_vendor.index.navigateTo({
          url: "/pages/verify/verify"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "正在扫描"
      });
      isShowMask.value = true;
      common_vendor.index.scanCode({
        success: (res) => {
          handleScanResult(res.result);
        },
        fail: (err) => {
          finishScan();
          const errMsg = err && err.errMsg || "";
          if (errMsg.indexOf("cancel") !== -1) {
            return;
          }
          console.error("扫描失败：" + err);
          showMessage("扫描失败，请重试");
        }
      });
    };
    common_vendor.onUnload(() => {
      pageActive = false;
      stopPolling();
      common_vendor.index.hideLoading();
    });
    return (_ctx, _cache) => {
      return {
        a: nearDetail.value.imageUrl,
        b: common_vendor.t(nearDetail.value.name),
        c: common_vendor.t(nearDetail.value.fullAddress),
        d: common_vendor.t(nearDetail.value.businessHours),
        e: common_vendor.t(nearDetail.value.feeRule),
        f: common_vendor.t(nearDetail.value.isUsable === "1" ? "可借" : "不可借"),
        g: common_vendor.t(nearDetail.value.isReturn === "1" ? "可还" : "不可还"),
        h: common_vendor.o(scan),
        i: common_vendor.t(nearDetail.value.distance),
        j: isShowMask.value,
        m: nearDetail.value.isUsable !== "1"
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/liuyuan/Desktop/test/guli-chongdian/pages/detail/detail.vue"]]);
wx.createPage(MiniProgramPage);
