// pages/webview/webview.js
Page({
	data: {
		// webUrl: "https://www.baidu.com/",
		webUrl: "",
	},
	onLoad: function (option) {
		console.log(option.webUrl)
		if (!!option.webUrl) {
			// wx.showLoading({
			// 	title: '加载中',
			// })
			let url = decodeURIComponent(option.webUrl);
			this.setData({
				webUrl: url
			});
		}
	},
	// 接收到消息
	acceptMessage(e) {
		// wx.hideLoading();
	}
})