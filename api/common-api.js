const {
    APIURL,
    ADURL,
    CHANNELID
} = require('./config.js');

const mobile = wx.getSystemInfoSync()['model'];

class CommonApi {
    constructor() {}
    // http
    static http(options) {
        return new Promise((_, $) => {
            wx.request({
                ...options,
                success(res) {
                    if (res.statusCode === 200 && res.data.code == 200) {
                        _(res.data);
                    } else {
                        $(res);
                    }
                },
                fail(err) {
                    $(err);
                }
            })
        })
    }
    // get
    static get(options) {
        return this.http({
            method: "GET",
            ...options
        })
    }
    // post
    static post(options) {
        return this.http({
            method: "POST",
            ...options
        })
    }
    // 微信登录
    static wxLogin() {
        return new Promise((_, $) => {
            wx.login({
                success(res) {
                    _(res);
                },
                fail(err) {
                    $(err);
                }
            })
        })
    }
    // 微信获取用户信息
    static wxGetUserInfo() {
        return new Promise((_, $) => {
            wx.getUserInfo({
                success(res) {
                    _(res);
                },
                fail(err) {
                    $(err);
                }
            })
        })
    }
    // 验证用户是否授权
    static checkAuthorization() {
        return new Promise((_, $) => {
            wx.getSetting({
                success(res) {
                    if (res.authSetting['scope.userInfo']) {
                        _(res);
                    } else {
                        $(res);
                    }
                }
            })
        })
    }
    /**
     * 验证用户是否授权（并获取用户信息）
     * @param {function} callback 检查用户授权之后执行的回调函数 `非必填`
     */
    static checkAuthorizationGetUserInfo(callback) {
        if (callback && typeof callback !== 'function') throw new Error('checkAuthorizationGetUserInfo 参数类型必须为function');
        return new Promise((_, $) => {
            this.checkAuthorization().then(res => {
                if (callback) callback();
                return this.wxGetUserInfo();
            }).then(res => {
                _(res);
            }, err => {
                $(err);
            })
        })
    }

    /**
     *` adListBytype ` 获取广告数据列表
     * @param {number} type 广告类型 1:(banner) 2:(float)  `必填`
     */
    static adListBytype(type) {
        if (!type) throw new Error('adListBytype 缺少参数type');
        return this.post({
            url: `${ADURL}/ad/adTypeList`,
            data: {
                channelid: CHANNELID,
                type: type
            }
        })
    }
    /**
     * ` showAdByAdId ` 通过广告id获取广告详情
     * @param {number} adId 广告id `必填`
     */
    static showAdByAdId(adId) {
        if (!adId) throw new Error('showAdByAdId 缺少参数adId');
        return this.post({
            url: `${ADURL}/ad/show`,
            data: {
                channelid: CHANNELID,
                mobile: mobile,
                adid: adId,
            }
        })
    }
    /**
     * ` showAllAd ` 批量展示广告
     */
    static showAllAd() {
        return this.post({
            url: `${ADURL}/ad/showList`,
            data: {
                channelid: CHANNELID,
                mobile: mobile,
            }
        })
    }
    /**
     * ` clickAdReport ` 广告点击统计
     * @param {number} adId 广告id `必填`
     * @param {string} adToken 当前广告令牌 `必填`
     */
    static clickAdReport(adId, adToken) {
        if (!adId || !adToken) throw new Error('clickAdReport 缺少参数adId/adToken');
        return this.post({
            url: `${ADURL}/ad/click`,
            data: {
                channelid: CHANNELID,
                mobile: mobile,
                adid: adId,
                token: adToken
            }
        })
    }
    /**
     * ` jumpMinProgramReport ` 通过模板消息进入，跳转小程序并上报
     * @param {number} adId 广告id `必填`
     * @param {string} adToken 当前广告令牌 `必填`
     */
    static jumpMinProgramReport(adId, adToken) {
        if (!adId || !adToken) throw new Error('jumpMinProgramReport 缺少参数adId/adToken');
        return this.post({
            url: `${ADURL}/ad/jump`,
            data: {
                channelid: CHANNELID,
                mobile: mobile,
                adid: adId,
                token: adToken
            }
        })
    }
}
module.exports = CommonApi;