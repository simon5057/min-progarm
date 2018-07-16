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
    // 点击广告后的回调
    openAd(e) {
        console.log(e.detail)
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

})