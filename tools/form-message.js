const {
    APIURL
} = require('../api/config.js');

/**
 * ` sendFormId ` 发送模板消息
 * @param {string} token 用户令牌
 * @param {object} formIdData 模板数据
 */
function sendFormId(token, formIdData) {
    return new Promise((_, $) => {
        wx.request({
            method: 'POST',
            url: `${APIURL}`,
            data: {
                token: token,
                form_id: formIdData.form_id,
                form_time: formIdData.form_time
            },
            success: res => {
                if (res.statusCode === 200 && res.data.code == 200) {
                    _(res);
                } else {
                    $(res);
                }
            }
        })
    })
}

/**
 * ` dealFormId ` 添加模板消息处理函数
 * @param {number} formId 模板id
 * @param {string} token 用户令牌
 * @param {function} callback 回调函数
 */
function dealFormId(formId, token, callback) {
    let formIdBirthTime = (Date.parse(new Date()) / 1000);
    let formIdData = {
        form_time: formIdBirthTime,
        form_id: formId
    };
    wx.setStorageSync('formIdData', formIdData);
    sendFormIds(token, callback);
}

/**
 * ` sendFormIds ` 发送推送码
 * @param {string} token 用户令牌
 * @param {function} callback 回调函数
 */
function sendFormIds(token, callback) {
    if (callback) callback();
    //判登录信息过期了么
    if (!token) return;
    //判断是否有缓存form_id
    if (!wx.getStorageSync('formIdData')) return;

    let formIdData = wx.getStorageSync('formIdData');
    let nowTime = parseInt((Date.parse(new Date()) / 1000));
    let formIdBirthTime = parseInt(formIdData.form_time);

    //判断缓存form_id过期了么
    if ((formIdBirthTime + 3600 * 24 * 7) < nowTime) return;
    //判断上次提交form时间
    if (wx.getStorageSync('addFormIdLastTime')) {
        let addFormIdLastTime = parseInt(wx.getStorageSync('addFormIdLastTime'));
        let expire = addFormIdLastTime + 3600 * 6;
        if (expire > nowTime) return;
    }
    wx.setStorageSync('addFormIdLastTime', nowTime.toString());
    sendFormId(token, formIdData).then(console.log);
}

module.exports = {
    dealFormId,
    sendFormIds
}