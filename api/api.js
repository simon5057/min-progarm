const {
    APIURL
} = require('./config.js');
import request from './interceptor';

//  自定义请求拦截器
request.interceptors.request.use((data) => {
    console.log(`url:${data.url} method:${data.method}`);
    wx.showLoading({
        title: '加载中',
    })
    return data;
}, error => {
    return Promise.reject(error);
});

//  自定义返回拦截器
request.interceptors.response.use((data) => {
    wx.hideLoading();
    return data;
}, error => {
    // 如果token过期 返回错误时，先调用登录，并将登录后的信息存储再返回
    if (error.data.code == 10000) {
        return new Promise((resolve, reject) => {
            Api.login(res.userInfo).then(res => {
                wx.hideLoading();
                wx.setStorageSync('userData', res);
                reject(res);
            })
        })
    } else {
        return Promise.reject(error);
    }
})
// 继承公共api
class Api extends require('./common-api') {
    constructor() {
        super();
    }

    // 需要拦截的token的 接口（使用request）
    static test(data) {
        return request.post(`${APIURL}/test`, {
            data: data
        })
    }
    // 不要需要拦截的 接口
    static example(value) {
        return this.post({
            url: `${APIURL}/example`,
            data: {
                key: value
            }
        })
    }
    // 用户登录
    static loginToApp(code) {
        return this.post({
            url: `${APIURL}/login`,
            data: {
                code: code
            }
        })
    }
    // 微信登录获取code，并登录
    static login() {
        return new Promise((_, $) => {
            this.wxPack(wx.login).then(res => {
                return this.loginToApp(res.code);
            }).then(res => {
                _(res);
            }).catch(err => {
                $(err);
            })
        })
    }
}
module.exports = Api;