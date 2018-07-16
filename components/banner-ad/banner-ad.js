// components/banner-ad/banner-ad.js
const Api = require('../../api/api.js')

Component({
    // 组件的属性列表
    properties: {},
    externalClasses: ['wrap-class'],
    // 组件的初始数据
    data: {
        show: true,
        bannerAdInfo: null, // 广告adid等数据
        showAdInfo: null, // 广告token等数据
        adType: 1 // 广告类型
    },
    attached() {
        this._init();
    },
    // 组件的方法列表
    methods: {
        _init() {
            this.getAndShowAd();
        },
        // 获取并展现广告
        getAndShowAd() {
            let clickedAdList;
            if (wx.getStorageSync('clickedAdList')) {
                clickedAdList = wx.getStorageSync('clickedAdList');
            }
            // 请求广告列表
            Api.adListBytype(this.data.adType).then(res => {
                let adList = res.data;
                // console.log(adList)
                if (clickedAdList) {
                    for (let i = 0; i < adList.length; i++) {
                        const ele = adList[i];
                        if (!(~clickedAdList.indexOf(ele.adid))) {
                            this.setData({
                                bannerAdInfo: ele
                            })
                            // console.log(ele)
                            return Api.showAdByAdId(ele.adid);
                        }
                    }
                } else {
                    this.setData({
                        bannerAdInfo: adList[0]
                    })
                    return Api.showAdByAdId(adList[0].adid);
                }
            }).then(res => {
                if(res) {
                    this.setData({
                        showAdInfo: res.data
                    })
                }
            })
        },
        _open() {
            if (this.data.bannerAdInfo.content.banner_url) {
                let url = encodeURIComponent(this.data.bannerAdInfo.content.banner_url);
                wx.navigateTo({
                    url: `/pages/webview/webview?webUrl=${url}`
                })
                return;
            }
            this.clickAd();
        },
        // 点击广告
        clickAd() {
            let adid = this.data.bannerAdInfo.adid;
            let adInfo = this.data.showAdInfo;
            let clickedAdList = [];
            Api.clickAdReport(adid, adInfo.token).then(res => {
                if (wx.getStorageSync('clickedAdList')) {
                    clickedAdList = wx.getStorageSync('clickedAdList');
                    if (!(~clickedAdList.indexOf(adid))) {
                        clickedAdList.push(adid);
                        wx.setStorageSync('clickedAdList', clickedAdList);
                    }
                } else {
                    clickedAdList.push(adid);
                    wx.setStorageSync('clickedAdList', clickedAdList);
                }
                this.setData({
                    show: false
                })
                this.triggerEvent("open", this.data.bannerAdInfo);
                this.toOtherMinProgram(adInfo, console.log);
            })
        },
        // 跳转到小程序
        toOtherMinProgram(currentAdInfo, callback) {
            wx.navigateToMiniProgram({
                appId: currentAdInfo.appid,
                path: currentAdInfo.path,
                extraData: currentAdInfo.extraData,
                // envVersion: 'release',
                success(res) {
                    if (callback) callback(res);
                },
                fail(err) {
                    // console.log(err)
                }
            })
        },
    }
})