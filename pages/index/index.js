const app = getApp()
const Api = require('../../api/api.js')

Page({
    data: {
        text: '大帅哥撒多所所所所所所所所所安徽省过付扩军哈所扩过或扩啦所军多过绿扩扩扩扩扩扩扩扩扩扩',
        scrollable: 'xxx',
        isShow: false
    },

    onLoad: function () {},
    test() {
        console.log(1);
    },
    togglePopup() {
        this.setData({
            isShow: !this.data.isShow
        });
    },
    // 授权成功返回userinfo
    authorizationHandle(e) {
        console.log(e);
    },
    // 点击广告后的回调
    openAd(e) {
        console.log(e.detail)
    },
    // 存储并发送模板消息并执行回调函数
    sendFormMessage(e) {
        console.log(e);
    },

})