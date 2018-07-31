// components/float-ad/float-ad.js
const Api = require('../../api/api.js')

Component({
    // 组件的属性列表
    properties: {

    },

    // 组件的初始数据
    data: {
        floatAdInfo: null, // 广告adid等数据
        showAdInfo: null, // 广告token等数据
        adType: 2 // 广告类型
    },

    attached() {
        this.getAndShowAd();
    },
    methods: {
        // 获取并展现广告
        getAndShowAd() {
            Api.adListBytype(this.data.adType).then(res => {
                if (res.data.length) {
                    this.setData({
                        floatAdInfo: res.data[0]
                    })
                    return Api.showAdByAdId(res.data[0].adid);
                }
            }).then(res => {
                if (res) {
                    this.setData({
                        showAdInfo: res.data
                    })
                }
            })
        },
        // 点击广告
        _open() {
            let adid = this.data.floatAdInfo.adid;
            let adInfo = this.data.showAdInfo;
            Api.clickAdReport(adid, adInfo.token).then(res => {
                this.triggerEvent("open", this.data.floatAdInfo);
            })
        }
    }
})