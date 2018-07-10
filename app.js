const Api = require('./api/api.js')

//app.js
App({
    globalData: {},
    onLaunch: function () {},
    // 用户登录并存储token等数据
    login() {
        return new Promise((_, $) => {
            Api.login().then(res => {
                this.globalData.token = res.token;
                wx.setStorageSync('userData', res);
                _(res);
            }, err => {
                $(err);
            })
        })
    },
})