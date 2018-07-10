// component/authorization-button/authorization-button.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 用户授权蒙层
        userInfoHandler(e) {
            // console.log(e);
            if (!!e.detail.userInfo) {
                let data = e.detail;
                this.triggerEvent('authorization', data)
            }
        },
    }
})