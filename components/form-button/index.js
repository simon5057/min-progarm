// components/form-button/index.js
const formMessage = require('../../tools/form-message.js');
Component({

    // 组件的初始数据
    data: {
        show: true,
    },
    attached() {
        this.checkFormId();
    },
    // 组件的方法列表
    methods: {
        // 判断是否收集用户模板消息
        checkFormId() {
            let nowTime = parseInt((Date.parse(new Date()) / 1000));
            if (!!wx.getStorageSync('formIdData')) {
                let expire = Number(wx.getStorageSync('formIdData')['form_time']) + 3600 * 24 * 7;
                if (expire < nowTime) {
                    this.setData({
                        show: true
                    })
                } else {
                    this.setData({
                        show: false
                    })
                }
            } else {
                this.setData({
                    show: true
                })
            }
        },
        // 存储推送码(收集模板消息)
        submitFormId: function (e) {
            this.setData({
                show: false
            })
            // console.log(e);
            let formId = e.detail.formId;
            if (wx.getStorageSync('token')) {
                formMessage.dealFormId(formId, () => {
                    this.triggerEvent('sendFormMessage');
                })
            }
        },
    }
})