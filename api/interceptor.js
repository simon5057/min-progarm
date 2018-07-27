import util from './util.js'
const request = (function () {
    //系统参数;
    let defaults = {
        timeout: 5000,
        reqState: false,
        url: '',
        header: '',
        data: '',
        method: '',
        dataType: 'json',
        success: (res) => {},
        fail: (res) => {},
        complete: function (res) {},
    };

    function xhrAdapter(config) {
        return new Promise(function dispatchXhrRequest(resolve, reject) {
            config.success = (res) => {
                // 状态码为200时resolve
                // 否则reject
                if (res.statusCode === 200 && res.data.code == 200) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            };
            config.fail = (err) => {
                reject(err);
            };
            wx.request(config);
        });
    }

    function dispatchRequest(config) {
        var adapter = new xhrAdapter(config);
        return adapter.then(function onAdapterResolution(response) {
            return response;
        }, function onAdapterRejection(reason) {
            return Promise.reject(reason);
        });
    }

    function InterceptorManager() {
        this.handlers = [];
    }
    InterceptorManager.prototype.use = function use(fulfilled, rejected) {
        this.handlers.push({
            fulfilled: fulfilled,
            rejected: rejected
        });
        return this.handlers.length - 1;
    };
    InterceptorManager.prototype.forEach = function forEach(fn) {
        util.forEach(this.handlers, function forEachHandler(h) {
            if (h !== null) {
                fn(h);
            }
        });
    };

    function Axios(defaultConfig) {
        this.defaults = defaultConfig;
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
        };
    };

    util.forEach(['delete', 'get'], (method) => {
        Axios.prototype[method] = function (url, config) {
            return this.request(util.merge({
                header: config || {}
            } || {}, {
                method: method,
                url: url
            }))
        }
    })
    util.forEach(['post', 'put'], (method) => {
        Axios.prototype[method] = function (url, data, config) {
            return this.request(util.merge({
                header: config || {}
            } || {}, {
                method: method,
                url: url,
                data: data,
            }))
        }
    })
    Axios.prototype.request = function request(config) {
        config.method = config.method.toLowerCase();
        config = util.merge(defaults, this.defaults, config);
        var chain = [dispatchRequest, undefined];
        var promise = Promise.resolve(config);
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
            chain.unshift(interceptor.fulfilled, interceptor.rejected);
        });
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
            chain.push(interceptor.fulfilled, interceptor.rejected);
        });
        while (chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
        }
        return promise;
    }

    function createInstance(defaultConfig) {
        let context = new Axios(defaultConfig);
        return context;
    }
    let axios = createInstance(defaults);
    return axios;
})();

module.exports = request;