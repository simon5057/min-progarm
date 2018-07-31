// component/authorization-button/authorization-button.js
const Api = require('../../api/api.js')

Component({
    // 组件的属性列表
    properties: {

    },

    // 组件的初始数据
    data: {
        userAuthorized: false
    },
    attached() {
        // 检查用户是否授权
        Api.wxGetSetting('userInfo').then(res => {
            this.setData({
                userAuthorized: true
            })
            // 授权成功获取用户信息并返回
            return Api.wxPack(wx.getUserInfo);
        }).catch(err => {
            this.setData({
                userAuthorized: false
            })
            return Promise.reject(err);
        }).then(res => {
            this.triggerEvent('authorization', res);
        }).catch(console.log);
    },
    // 组件的方法列表
    methods: {
        // 用户授权蒙层
        userInfoHandler(e) {
            // console.log(e);
            if (!!e.detail.userInfo) {
                let data = e.detail;
                this.setData({
                    userAuthorized: true
                })
                this.triggerEvent('authorization', data);
            }
        },
    }
})