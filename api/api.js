const {
    APIURL
} = require('./config.js');
// 继承公共api
class Api extends require('./common-api') {
    constructor() {
        super();
    }

    // 业务api
    // static example(value) {
    //     return this.post({
    //         url: `${APIURL}/example`,
    //         data: {
    //             key: value
    //         }
    //     })
    // }
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