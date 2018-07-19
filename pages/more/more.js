const Api = require('../../api/api.js')
Page({
    data: {},
    onLoad: function (options) {
        this.init();
    },
    //初始化
    init() {
        wx.showLoading({
            title: "正在载入",
            mask: true
        });
        Api.showAllAd().then(res => {
            this.setData({
                adList: res.data
            })
            wx.hideLoading();
        })
    },
    //点击广告
    tryIt(e) {
        var adid = e.currentTarget.dataset.adid;
        var token = e.currentTarget.dataset.token;
        api.clickAdReport(adid, token).then(res => {
            console.log(res)
        })
    },
})