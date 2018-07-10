const {
    APIURL
} = require('./config.js');
// 继承公共api
class Api extends require('./common-api') {
    constructor() {
        super();
    }

    // 业务api
    // static example() {
    //     return new Promise((_, $) => {

    //     })
    // }
    // 用户登录
    static loginToApp(code) {
        return new Promise((_, $) => {
            wx.request({
                method: 'POST',
                url: `${APIURL}/login`,
                data: {
                    code: code
                },
                success(res) {
                    if (res.statusCode === 200) {
                        _(res.data);
                    } else {
                        $(res);
                    }
                }
            })
        })
    }
    // 微信登录获取code，并登录
    static login() {
        return new Promise((_, $) => {
            this.wxLogin().then(res => {
                return this.loginToApp(res.code);
            }).then(res => {
                _(res);
            }, err => {
                $(err);
            })
        })
    }
}
module.exports = Api;