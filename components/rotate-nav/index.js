// components/rotate-nav/index.js
Component({
    // 组件的属性列表
    properties: {
        lists: {
            type: Array,
            value: ['一', '二', '三', '四', '五']
        }
    },
    startRotateAngle: null,
    startX: null,
    moveX: 0,
    // 组件的初始数据
    data: {
        rotateAngle: 0,
        currentIndex: 0,
        r: 165 / Math.tan(Math.PI / 5) + 20
    },
    attached() {
        this.setData({
            r: 165 / Math.tan(360 / this.data.lists.length / 2 / 180 * Math.PI) + 20
        })
    },

    // 组件的方法列表
    methods: {
        // 触摸开始
        startChange(e) {
            console.log(e)
            if (e.touches.length ==1 && e.changedTouches[0]) {
                this.startX = e.changedTouches[0].pageX;
                this.startRotateAngle = this.data.rotateAngle;
            }else {
                this.startX = null;
            }
        },
        // 触摸中
        moveChange(e) {
            if (e.touches.length !== 1){
                this.moveX = this.startX;
                return;
            }
            // let moveDistance = !this.moveX ? 0 : this.moveX - e.changedTouches[0].pageX;
            this.moveX = e.changedTouches[0].pageX;
            // // if (Math.abs(this.startX - this.moveX) > 72) {
            // //     moveDistance = this.startX - this.moveX < 0 ? -72 : 72;
            // // } else {
            // //     moveDistance = this.startX - this.moveX;
            // // }
            // console.log(moveDistance)
            // this.setData({
            //     rotateAngle: this.data.rotateAngle - moveDistance
            // })
        },
        // 触摸结束
        endChange(e) {
            if(this.startX === null) return;
            // this.startRotateAngle = null;
            let currentIndex = this.data.currentIndex;
            // 左滑
            if (this.moveX - this.startX > 30) {
                if (currentIndex <= 0) {
                    currentIndex = this.data.lists.length - 1;
                } else {
                    currentIndex -= 1;
                }
                this.setData({
                    rotateAngle: this.startRotateAngle + 72,
                    currentIndex: currentIndex
                })
            } else if (this.moveX - this.startX < -30) {
                // 右滑
                if (currentIndex >= this.data.lists.length - 1) {
                    currentIndex = 0;
                } else {
                    currentIndex += 1;
                }
                this.setData({
                    rotateAngle: this.startRotateAngle - 72,
                    currentIndex: currentIndex
                })
            }
            // console.log(e)
        }
    }
})