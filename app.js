const Api = require('./api/api.js');

//app.js
App({
    globalData: {},
    onLaunch: function () {},
    // 用户登录并存储token等数据
    login() {
        return new Promise((_, $) => {
            Api.login().then(res => {
                wx.setStorageSync('token', res);
                _(res);
            }).catch(err => {
                $(err);
            })
        })
    },
    // 获取token
    tokenInit(callback) {
        if (!callback || typeof callback !== 'function') throw new Error('tokenInit callback(必传)参数类型必须为function');
        // 检查是否存储用户信息
        if (!!wx.getStorageSync('token')) {
            callback();
        } else {
            // 用户登录
            this.login().then(res => {
                callback();
            })
        }
    },
})