// components/banner-ad/banner-ad.js
const Api = require('../../api/api.js')
const orders = ['normal', 'inverted'];

Component({
    // 组件的属性列表
    properties: {
        order: {
            type: String,
            value: 'normal'
        }
    },
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
                    if (this.data.order === orders[0]) {
                        for (let i = 0; i < adList.length; i++) {
                            const ele = adList[i];
                            if (!(~clickedAdList.indexOf(ele.adid))) {
                                this.setData({
                                    bannerAdInfo: ele
                                })
                                return Api.showAdByAdId(ele.adid);
                            }
                        }
                    } else {
                        for (let i = adList.length - 1; i >= 0; i--) {
                            const ele = adList[i];
                            if (!(~clickedAdList.indexOf(ele.adid))) {
                                this.setData({
                                    bannerAdInfo: ele
                                })
                                return Api.showAdByAdId(ele.adid);
                            }
                        }
                    }
                } else {
                    let data;
                    if (this.data.order === orders[0]) {
                        data = adList[0];
                    } else {
                        data = adList[adList.length - 1];
                    }
                    this.setData({
                        bannerAdInfo: data
                    })
                    return Api.showAdByAdId(data.adid);
                }
            }).then(res => {
                if (res) {
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
            })
        }
    }
})