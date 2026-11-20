"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/request.js");
const utils_config = require("../../utils/config.js");
const utils_auth = require("../../utils/auth.js");
const __default__ = {
  data() {
    return {};
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "nearbystores",
  setup(__props) {
    const toDetail = (near) => {
      common_vendor.index.navigateTo({
        url: "/pages/detail/detail?near=" + JSON.stringify(near)
      });
    };
    var QQMapWX = require("../../static/js/qqmap-wx-jssdk.min.js");
    new QQMapWX({
      key: "BGBBZ-S3ZWI-6GIGD-UUYSX-5WSQO-ZSBQJ"
      // 必填
    });
    const defaultLocation = { latitude: 39.984104, longitude: 116.307503 };
    const centerPosition = common_vendor.ref(defaultLocation);
    const markers = common_vendor.ref([]);
    const getCurrentLocation = () => new Promise((resolve) => {
      if (!utils_config.config.enableLocation) {
        resolve(defaultLocation);
        return;
      }
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (res) => {
          resolve({
            latitude: res.latitude,
            longitude: res.longitude
          });
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "定位失败，已使用默认位置",
            icon: "none"
          });
          resolve(defaultLocation);
        }
      });
    });
    const scollViewId = common_vendor.ref("");
    const clickMark = (e) => {
      console.log(e);
      scollViewId.value = e.markerId;
      currentItemId.value = e.markerId;
    };
    const currentItemId = common_vendor.ref("");
    const nearbyList = common_vendor.ref([]);
    const getNearbyStation = async (latitude = defaultLocation.latitude, longitude = defaultLocation.longitude) => {
      const result = await utils_api.api.device.getNearbyStations(latitude, longitude);
      if (result.code === 200) {
        console.log(result.data);
        nearbyList.value = result.data;
        currentItemId.value = nearbyList.value[0].id;
        var mks = [];
        for (var i = 0; i < nearbyList.value.length; i++) {
          mks.push({
            // 获取返回结果，放到mks数组中
            title: nearbyList.value[i].name,
            id: nearbyList.value[i].id,
            latitude: nearbyList.value[i].latitude,
            longitude: nearbyList.value[i].longitude,
            iconPath: "../../static/images/Flag.png",
            //图标路径
            width: 20,
            height: 20
          });
        }
        markers.value = [...markers.value, ...mks];
      } else {
        common_vendor.index.showToast({
          title: "获取附近门店失败"
        });
      }
    };
    common_vendor.onMounted(async () => {
      if (!utils_auth.ensureLogin("/pages/nearbystores/nearbystores")) {
        return;
      }
      const location = await getCurrentLocation();
      centerPosition.value = location;
      markers.value = [{
        id: 0,
        latitude: location.latitude,
        longitude: location.longitude,
        width: 30,
        height: 30,
        title: "我的位置"
      }];
      getNearbyStation(location.latitude, location.longitude);
    });
    return (_ctx, _cache) => {
      return {
        a: markers.value,
        b: centerPosition.value.latitude,
        c: centerPosition.value.longitude,
        d: common_vendor.o(clickMark),
        e: common_vendor.f(nearbyList.value, (near, k0, i0) => {
          return {
            a: near.imageUrl,
            b: common_vendor.t(near.name),
            c: common_vendor.t(near.fullAddress),
            d: common_vendor.t(near.businessHours),
            e: common_vendor.t(near.distance),
            f: common_vendor.t(near.isUsable === "1" ? "可借" : "不可借"),
            g: common_vendor.t(near.isReturn === "1" ? "可还" : "不可还"),
            h: common_vendor.o(($event) => toDetail(near), near.id),
            i: near.id,
            j: "scroll" + near.id,
            k: common_vendor.n(near.id === currentItemId.value && "active")
          };
        }),
        f: "scroll" + scollViewId.value
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/liuyuan/Desktop/test/guli-chongdian/pages/nearbystores/nearbystores.vue"]]);
wx.createPage(MiniProgramPage);
