// pages/share/share.js
Page({

    /**
     * 页面的初始数据
     */
	data: {
		//   weather: 'cloud-blue',
		//   weather: 'cloud-gray',
		//   weather: 'cloud-overcast',
		//   weather: 'sunny',
		weather: 'rain',
		// weather: 'snow',
		weatherLevel: 'small',
		//   weatherLevel:'middle',
		// weatherLevel: 'large',
		levelCounts: 8,

		weathers: ['cloud-blue', 'cloud-gray', 'cloud-overcast', 'sunny', 'rain', 'snow'],
		weatherLevels: ['small', 'middle', 'large']
	},

    /**
     * 生命周期函数--监听页面加载
     */
	onLoad: function (options) {
		this._init();
	},
	_init() {
		this.setLevelCounts();

	},
	// 设置雨点和雪花个数
	setLevelCounts() {
		switch (this.data.weatherLevel) {
			case 'small':
				this.setData({
					levelCounts: this.randomSnowflakes(10, 364, 374)
				})
				break;
			case 'middle':
				this.setData({
					levelCounts: this.randomSnowflakes(20, 487, 393)
				})
				break;
			case 'large':
				this.setData({
					levelCounts: this.randomSnowflakes(32, 600, 393)
				})
				break;
			default:
				break;
		}
	},
	// 随机雪花样式
	randomSnowflakes(length, width, height) {
		let arr = [];
		let _this = this;
		for (let i = 0; i < length; i++) {
			arr.push(randomStyle(width, height));
		}
		return arr;
		function randomStyle(w = 373, h = 368) {
			let obj = {};
			let scale = Math.random();
			scale = scale < 0.15 ? 0.35 : scale;
			obj.content = (Math.random() < 0.55) ? true : false;
			obj.style = `top:${Math.random() * w}rpx;right:${Math.random() * h}rpx; transform:scale(${scale},${scale});`;
			return obj;
		}
	},
	changeWeather(e) {
		this.setData({
			weather: e.currentTarget.dataset.weather
		})
	},
	changeWeatherLevel(e) {
		console.log(e)
		this.setData({
			weatherLevel: e.currentTarget.dataset.weatherlevel
		},()=>{
			this.setLevelCounts();
		})
	}
})