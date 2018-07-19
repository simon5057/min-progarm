## 小程序初始化项目

##### 目录结构描述

```                     
│  app.js
│  app.json
│  app.wxss
│  project.config.json
│  README.md                            // 帮助
├─api
│  ├─config.js                          // 接口地址等参数配置文件
│  ├─common-api.js                      // 公用接口
│  └─api.js                             // 业务接口
├─images
├─components
│  ├─authorization-button               // 授权按钮蒙层组件
│  ├─banner-ad                          // 横幅广告组件
│  ├─float-ad                           // 悬浮广告组件
│  └─form-button                        // 模板消息蒙层组件
│  ...
├─pages
│  ├─index                              // 首页
│  ├─share                              // 分享页
│  ├─webview                            // webview页
│  └─more                               // 更多好玩页
├─modules                
│  ├─oneWxs                             // 一个工具模块
│  └─otherWxs                           // 另一个工具模块
├─tools                
│  ├─formMessage.js                     // 模板消息处理
│  └─otherTools                         // 其他工具
└─utils
    └─util.js                           // 工具函数
```

##### api
``` js
    /* config.js */
    const APIURL = 'https://example.com'; // 接口地址
    const ADURL = "https://ad.example.com"; // 广告接口地址
    const CHANNELID = "example"; // 渠道id

```
``` js
    /* app.js */
    const Api = require('./api/api.js');
    
    Api.wxLogin()     // 微信登录
    Api.wxGetUserInfo()     // 微信获取用户信息
    Api.checkAuthorization()     // 验证用户是否授权
    Api.checkAuthorizationGetUserInfo([,callback])     // 验证用户是否授权并获取用户信息(callback 检查用户授权之后执行的回调函数 `非必填`)
    // ...

    Api.adListBytype(type)      // 获取广告数据列表(type 1:(banner) 2:(float)  `必填`)
    Api.showAdByAdId(adId)      // 通过广告id获取广告详情(adId 广告id `必填`)
    Api.showAllAd()         // 批量展示广告
    Api.clickAdReport(adId, adToken)         // 广告点击统计(adId 广告id `必填` adToken 当前广告令牌 `必填`)
    Api.jumpMinProgramReport(adId, adToken)         // 通过模板消息进入，跳转小程序并上报(adId 广告id `必填` adToken 当前广告令牌 `必填`)
```
#### app.js 公用方法封装
``` js
    /* app.js */
    login() {
        return new Promise((_, $) => {
            Api.login().then(res => {
                this.globalData.token = res.token;
                wx.setStorageSync('userData', res);
                _(res);
            }.catch(err => {
                $(err);
            })
        })
    },
    // 获取token
    tokenInit(callback) {
        if (!callback || typeof callback !== 'function') throw new Error('tokenInit callback(必传)参数类型必须为function');
        // 检查是否存储用户信息
        if (!!this.globalData.token) {
            callback(this.globalData.token);
        } else if (!!wx.getStorageSync('userData')) {
            let userData = wx.getStorageSync('userData');
            this.globalData.token = userData.token;
            callback(this.globalData.token);
        } else {
            // 用户登录
            this.login().then(res => {
                callback(this.globalData.token);
            })
        }
    },
    /**
     * TokenExpiredLoginAgain token过期，重新登录
     * @param {Object} err 请求错误对象
     * @param {functio} callback 重新登录成功后的回调
     */
    TokenExpiredLoginAgain(err, callback) {
        if (!!err && err.statusCode === 403) {
            if (callback && typeof callback !== 'function') throw new Error('TokenExpiredLoginAgain callback参数类型必须为function');
            this.login().then(res => {
                if (callback) callback(this.globalData.token);
            })
        }
    }
```
``` js
    /* index.js */
    const app = getApp();

    // 获取token并请求
    app.tokenInit((token) => {
        this.setData({
            token: token
        }, () => {
            // 请求接口
        })
    })
```
##### 组件
- 授权蒙层按钮
``` html
    <!-- index.wxml -->
    <!-- bind:authorization 用户授权成功后的回调 -->
    <authorization-button wx:if='{{AuthorizationModal}}' bind:authorization='hideAuthorizationModal'></authorization-button>
```
``` js
    /* index.js */
    // 授权成功后隐藏授权蒙层
    hideAuthorizationModal(e) {
        console.log(e);
        this.setData({
            AuthorizationModal: false
        })
    }
```
``` json
    // index.json
    "usingComponents": {
        "authorization-button": "/components/authorization-button/authorization-button"
    }
```

- 横幅广告(浮窗广告类似)
``` html
    <!-- index.wxml -->
    <!-- bind:open 打开广告的回调  -->
    <!-- wrap-class 组件调用的外部类 -->
    <banner-ad bind:open='openAd' wrap-class='banner-ad-bg'></banner-ad>

    <!-- <float-ad></float-ad> -->
```
``` css
    /* index.wxss */
    .banner-ad-bg {
        background-color: yellow;
    }
```
``` js
    /* index.js */
    openAd(e) {
        console.log(e.detail);
    },
```
``` json
    // index.json
    "usingComponents": {
        "banner-ad": "/components/banner-ad/banner-ad"
    }
```

- 模板消息蒙层
``` html
    <!--用法  -->
    <!--  sendFormMessage 点击模板蒙层的回调函数-->
    <form-button bind:sendFormMessage="sendFormMessage"></form-button>
```
``` json
    // index.json
    "usingComponents": {
        "form-button": "/components/form-button/index"
    }
```
``` js
    // 存储并发送模板消息
    // e.detail: Object
    //     formId:string, // property：模板消息
    //     dealFormId:function, // method：存储模板消息并发送模板消息 
    //     sendFormIds:function // method：发送模板消息 
    sendFormMessage(e) {
        console.log(e.detail);
        let data = e.detail;
        let fn = data.formMessage;
        fn.dealFormId(data.formId, this.data.token, () => {
            console.log(1)
        })
    }
```
- ZanUI 
[小程序UI框架](https://www.youzanyun.com/zanui/weapp "官方文档")
