// components/open-type/index.js
const Api = require('../../api/api.js');
let SCOPES = ['userLocation', 'address', 'invoiceTitle', 'werun', 'record', 'writePhotosAlbum', 'camera'];
Component({
    // 组件的属性列表
    properties: {
        scope: {
            type: String,
            value: 'address'
        }
    },
    externalClasses: ['wrap-class'],

    // 组件的初始数据
    data: {
        showMask: true,
    },
    attached() {
        if (!this._checkScope(this.data.scope)) {
            this.setData({
                scope: 'address'
            })
        }
        this.check();
        console.log(this.data.scope);
    },
    // 组件的方法列表
    methods: {
        // 检查允许的scope
        _checkScope(val) {
            var isValidScope = ~SCOPES.indexOf(val);
            if (!isValidScope) {
                console.warn('mode only accept value of ' + SCOPES + ', now get ' + val + '.\n' + 'and use defalut address now!');
            }
            return isValidScope;
        },
        // 发起授权或打开设置
        check() {
            let scope = this.data.scope;
            // 检查授权
            Api.wxGetSetting(scope).then(res => {
                this.setData({
                    showMask: false
                })
                this.triggerEvent("authorized", `scope.${this.data.scope} 授权成功`);
            }).catch(err => {
                console.log(err);
                // 未授权 发起授权
                return Api.wxPack(wx.authorize, {
                    scope: `scope.${scope}`
                });
            }).then(res => {
                if (res) {
                    this.setData({
                        showMask: false
                    })
                    this.triggerEvent("authorized", `scope.${this.data.scope} 授权成功`);
                }
            }).catch(console.log);
        },
        // 关闭setting的回调函数
        openSetting(e) {
            let auth = e.detail.authSetting;
            if (auth[`scope.${this.data.scope}`]) {
                this.setData({
                    showMask: false
                })
                // 已经授权成功
                this.triggerEvent("authorized", `scope.${this.data.scope} 授权成功`);
            }
        }
    }
})