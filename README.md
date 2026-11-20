# share-applet（共享充电小程序）

共享充电宝微信小程序，提供附近门店查找、扫码租借、订单与支付、押金/免押、个人中心等能力。

> 说明：当前仓库是 **uni-app 编译后的微信小程序产物**，没有 `package.json`、`src/` 或 `.vue` 源文件，无法在此仓库内重新构建。直接修改 `.js/.wxml/.wxss` 可生效，但若用原始 uni-app 工程重新编译，本仓库中的改动会被覆盖。长期维护建议找回原工程源码。

## 技术栈

- 平台：微信小程序
- 产物来源：uni-app（Vue 3）编译输出，运行时代码位于 `common/vendor.js`
- 项目配置：`project.config.json`（AppID：`wx515c5bc4d8a1595b`，项目名：`guli-chongdian`）

## 目录结构

```
share-applet/
├── app.js                  # 小程序入口，启动时恢复登录会话
├── app.json                # 页面路由、窗口、定位权限声明
├── app.wxss                # 全局设计变量与基础样式
├── project.config.json     # 微信开发者工具项目配置
├── common/
│   └── vendor.js           # uni-app 运行时
├── utils/
│   ├── config.js           # 后端地址、定位开关
│   ├── request.js          # 请求封装、401 重登、统一接口定义 api
│   └── auth.js             # 登录、退出、登录守卫、未授权处理
├── pages/                  # 业务页面（见下表）
└── static/                 # 图片与腾讯地图 SDK
```

## 页面与功能

| 页面 | 路径 | 主要功能 |
| --- | --- | --- |
| 首页 | `pages/index/index` | 地图、定位、扫码充电、附近门店/个人中心入口 |
| 附近门店 | `pages/nearbystores/nearbystores` | 真实定位、门店列表与地图标记、选中联动 |
| 门店详情 | `pages/detail/detail` | 门店信息、可借状态、扫码充电、导航距离 |
| 个人中心 | `pages/center/center` | 用户信息、进行中订单卡、功能菜单、退出登录 |
| 我的订单 | `pages/order/order` | 订单列表、下拉加载、状态标签 |
| 订单详情 | `pages/orderDetail/orderDetail` | 订单信息、待支付拉起微信支付、状态轮询 |
| 免押验证 | `pages/verify/verify` | 微信支付分免押验证 |
| 登录 | `pages/login/login` | 微信一键登录、协议勾选、回跳 |
| 协议 | `pages/agreement/agreement` | 用户服务协议与隐私政策 |
| 押金 | `pages/deposit/deposit` | 押金状态、免押开通、退还说明 |
| 帮助中心 | `pages/help/help` | 常见问题折叠面板、在线客服 |
| 招募合作 | `pages/recruit/recruit` | 合作说明、客服洽谈入口 |
| 卡券 | `pages/coupon/coupon` | 可用/已使用/已过期（暂无后端接口，空态骨架） |
| 余额 | `pages/balance/balance` | 余额展示、消费记录 |
| 消息通知 | `pages/message/message` | 由订单状态推导的提醒 |
| 邀请有礼 | `pages/invite/invite` | 活动说明、分享 |
| 开具发票 | `pages/invoice/invoice` | 可开票订单、客服开票引导 |

## 快速开始

1. 用微信开发者工具打开本目录（导入项目，AppID 使用 `project.config.json` 中的值）。
2. 修改后端地址：`utils/config.js` 中的 `baseUrl`。
3. 本地联调时 `project.config.json` 已关闭 `urlCheck`；真机或正式环境需在微信后台配置 HTTPS 合法域名。
4. 若需真实定位，确保微信后台「开发管理 - 接口设置」已开通 `wx.getLocation`。
5. 点击「编译」；若新增页面或工具未扫描到文件，重启开发者工具。

## 配置说明

`utils/config.js`：

```js
const config = {
  baseUrl: "http://192.168.28.216:18080", // 后端地址
  enableLocation: true                    // 是否开启真实定位
};
```

- `enableLocation: false` 时首页与附近门店使用默认坐标，适合模拟器或无定位权限场景。
- `baseUrl` 目前为内网 HTTP 地址，仅供调试；上线前必须替换为 HTTPS 域名。

## 登录与鉴权

- **自动登录**：启动时若本地存在 `token`，静默重新获取用户信息；无 `token` 时以游客身份进入。
- **按需登录**：扫码充电、附近门店、个人中心等入口会调用 `auth.ensureLogin()`，未登录跳转 `pages/login/login`，支持 `redirect` 回跳。
- **登录态存储**：`token`、`userInfo`。
- **401 处理**：`request` 检测到 401 后尝试静默重登并重试原请求；失败则清会话并跳登录页，登录页内不会重复跳转。
- **退出登录**：调用 `GET /h5/logout`（失败不阻塞），清空本地会话后返回登录页。

## 接口清单

所有接口统一定义在 `utils/request.js` 的 `api` 对象中，页面通过 `utils_api.api.<分组>.<方法>()` 调用。除特殊说明外均为 GET，并自动携带 `Authorization: Bearer <token>`。

| 分组 | 方法 | 路径 |
| --- | --- | --- |
| auth | `loginByCode(code)` | `/auth/h5/login/{code}` |
| auth | `getUserInfo()` | `/user/userInfo/getLoginUserInfo` |
| auth | `logout()` | `/h5/logout` |
| user | `getInfo()` | `/user/userInfo/getLoginUserInfo` |
| user | `verifyFreeDeposit()` | `/user/userInfo/isFreeDeposit` |
| device | `getStation(id, lat, lng)` | `/device/device/getStation/{id}/{lat}/{lng}` |
| device | `getNearbyStations(lat, lng)` | `/device/device/nearbyStation/{lat}/{lng}` |
| device | `scanCharge(cabinetNo)` | `/device/device/scanCharge/{cabinetNo}` |
| order | `getNoFinishOrder()` | `/order/orderInfo/getNoFinishOrder` |
| order | `getUserOrders(page, size)` | `/order/orderInfo/userOrderInfoList/{page}/{size}` |
| order | `getOrderInfo(orderId)` | `/order/orderInfo/getOrderInfo/{orderId}` |
| payment | `createWxPayment(orderNo)` | `/payment/wxPay/createWxPayment`（POST） |
| payment | `queryPayStatus(orderNo)` | `/payment/wxPay/queryPayStatus/{orderNo}` |

新增接口时在对应分组补充方法即可，页面无需关心路径与鉴权。

## 扫码充电流程

1. 校验登录，检查押金状态（`depositStatus === "0"` 时先走免押验证）。
2. 调起 `wx.scanCode`，从二维码中解析 `cabinetNo`（支持纯编号与 URL 参数/路径）。
3. 调用 `scanCharge` 开仓：
   - `status = "1"`：开仓中，开始轮询订单；
   - `status = "2"`：开仓失败，展示后端提示；
   - `status = "3"`：已有进行中订单，查询后跳转详情。
4. 轮询 `getNoFinishOrder`，间隔 2 秒、最多 15 次；成功后跳订单详情，超时提示重试。
5. 页面卸载或离开时停止轮询，异常统一关闭 loading 与遮罩。

## 订单状态

| status | 含义 | 展示 |
| --- | --- | --- |
| `0` | 充电中 | 主色标签，进行中订单卡 |
| `1` | 未支付 | 橙色标签，可拉起支付 |
| `2` | 已支付 | 绿色/灰色标签，已完成 |

后端可能返回数字或字符串，页面在数据入口统一转为字符串处理。

## 设计规范

设计变量定义在 `app.wxss` 的 `page` 选择器中，修改主色只需改这里：

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--color-primary` | `#2FAE87` | 品牌主色 |
| `--color-primary-dark` | `#23805F` | 渐变深色、强调 |
| `--color-primary-light` | `#E9F7F1` | 浅色背景、选中态 |
| `--color-success` | `#16A34A` | 成功状态 |
| `--color-warning` | `#F59E0B` | 待支付/警告 |
| `--color-danger` | `#EF4444` | 危险操作 |
| `--text-1/2/3` | `#1F2329` / `#646A73` / `#8F959E` | 主/次/弱文字 |
| `--bg-page` | `#F5F6F7` | 页面背景 |
| `--bg-card` | `#FFFFFF` | 卡片背景 |
| `--radius-card` | `24rpx` | 卡片圆角 |
| `--radius-pill` | `999rpx` | 胶囊圆角 |

约定：间距使用 8rpx 基准（8/16/24/32/40），按钮统一胶囊形，卡片使用 `--shadow-card` 轻阴影。

## 注意事项

- 本仓库为编译产物，`common/vendor.js` 中已补充 `onShow`、`onUnload`、`onShareAppMessage` 等 hook 导出；重新编译会丢失这些补充。
- 登录页为原生 `Page` 页面，与 uni-app 编译页面共存。
- 客服入口依赖微信后台已开通客服功能，否则 `open-type="contact"` 无响应。
- 卡券暂无后端接口；余额字段假设为 `userInfo.balance`；发票暂以客服开票承接。
- 协议与 FAQ 文案为通用模板，上线前需替换为正式版本。
- 附近门店、门店详情等接口若后端要求鉴权，游客会被引导至登录页，需与后端确认公开范围。
