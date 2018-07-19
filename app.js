const Api = require('./api/api.js')

//app.js
App({
    globalData: {
        token: null
    },
    onLaunch: function () {},
    // 用户登录并存储token等数据
    login() {
        return new Promise((_, $) => {
            Api.login().then(res => {
                this.globalData.token = res.token;
                wx.setStorageSync('userData', res);
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
})