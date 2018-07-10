
var channelid = "example";
const adUrl = "https://ad.example.com"; // 广告接口地址
Page({

  data: {
    openshare:1
  },

  onLoad: function (options) {
    this.init()
  },
  //初始化
  init() {
    wx.showToast({
      title: "正在载入",
      icon: "loading",
      duration: 10000,
      mask: true
    });
    var _this = this
    //获取手机型号信息
    var mobile = wx.getSystemInfoSync().model;
    var datas = {
      channelid: channelid,
      mobile: mobile
    }
    this.allAdList(datas)
      .then((res) => {
        console.log(res)
        _this.setData({
          adList: res.data.data
        })
        wx.hideToast()
      })

  },
  //点击广告
  tryIt(e) {
    var appid = e.currentTarget.dataset.appid;
    var adid = e.currentTarget.dataset.adid;
    var token = e.currentTarget.dataset.token;
    var mobile = this.data.mobile
    var datas = {
      adid: adid,
      mobile: mobile,
      channelid: channelid,
      token: token,
    }
    this.enterAd(datas)
      .then((res) => {
        console.log(res)
        console.log(appid)
        wx.navigateToMiniProgram({
          appId: appid,
          success: res => {
            console.log(res)
          },
          fail: res => {
            console.log(res)
          }
        })
      })
  },

  //批量广告列表
  allAdList: function (datas) {
    return new Promise((resolve, reject) => {
      console.log(datas)
      wx.request({
        url: `${adUrl}/ad/showList`,
        data: datas,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        }, // 默认值
        success: res => {
          resolve(res)
        },
        fail: res => {
          console.log(res)
        }
      })

    })
  },

  //获取广告详细信息
  getAdDetail: function (datas) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${adUrl}/ad/show`,
        data: datas,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        }, // 默认值
        success: res => {
          resolve(res)
        },
        fail: res => {
          console.log(res)
        }
      })
    })
  },

  //点击广告跳转
  enterAd: function (datas) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${adUrl}/ad/click`,
        data: datas,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        }, // 默认值
        success: res => {
          resolve(res)
        },
        fail: res => {
          console.log(res)
        }
      })

    })
  },

})