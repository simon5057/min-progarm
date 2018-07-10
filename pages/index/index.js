const app = getApp()
const Api = require('../../api/api.js')

Page({
    data: {
        AuthorizationModal: true,
        bannerAdInfo: null,

        text: '大帅哥撒多所所所所所所所所所安徽省过付扩军哈所扩过或扩啦所军多过绿扩扩扩扩扩扩扩扩扩扩',
        scrollable: 'xxx',
		isShow: false
    },

    onLoad: function () {
        this._init();
        Api.adListBytype(1).then(res => {
            this.setData({
                bannerAdInfo: res.data.data[0]
            })
        })
    },
	test() {
		console.log(1);
	},
	togglePopup() {
		this.setData({
			isShow: !this.data.isShow
		});
	},
    onShow() {},
    // 初始化
    _init() {
        // 检查用户是否授权  获取用户信息之前执行回调函数(关闭授权蒙层)
        Api.checkAuthorizationGetUserInfo(() => {
            this.setData({
                AuthorizationModal: false
            })
        }).then(res => {
            // 用户已授权
            console.log(res);
        }, err => {
            // 用户未授权
            console.log(err);
        })
    },
    // 授权成功后隐藏授权蒙层
    hideAuthorizationModal(e) {
        console.log(e);
        this.setData({
            AuthorizationModal: false
        })
    },
    // 点击广告上报
    openAd(e) {
        console.log(e.detail);
        let data = e.detail;
        Api.showAdByAdId(data.adid).then(res => {
            console.log(res);
            let adData = res.data.data;
            return Api.clickAdReport(data.adid, adData.token);
        }).then(res => {
            console.log(res);
        })
    },
    // 存储并发送模板消息
    sendFormMessage(e) {
        console.log(e.detail);
        let data = e.detail;
        let fn = data.formMessage;
        fn.dealFormId(data.formId, this.data.token, () => {
            console.log(1)
        })
    },
    /**
     * TokenExpiredLoginAgain token过期，重新登录
     * @param {Object} err 请求错误对象
     * @param {functio} callback 重新登录成功后的回调
     */
    TokenExpiredLoginAgain(err, callback) {
        if (!!err && err.statusCode === 403) {
            if (callback && typeof callback !== 'function') throw new Error('TokenExpiredLoginAgain callback参数类型必须为function');
            app.login().then(res => {
                this.setData({
                    token: app.globalData.token
                }, () => {
                    if (callback) callback(res);
                })
            })
        }
    }
})