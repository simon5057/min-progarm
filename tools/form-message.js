import Api from '../api/api.js';

/**
 * ` dealFormId ` 添加模板消息处理函数
 * @param {number} formId 模板id
 * @param {function} callback 回调函数
 */
function dealFormId(formId, callback) {
    let formIdBirthTime = (Date.parse(new Date()) / 1000);
    let formIdData = {
        form_time: formIdBirthTime,
        form_id: formId
    };
    wx.setStorageSync('formIdData', formIdData);
    sendFormIds(callback);
}

/**
 * ` sendFormIds ` 发送推送码
 * @param {function} callback 回调函数
 */
function sendFormIds(callback) {
    if (callback) callback();
    // 如果没有token
    if (!wx.getStorageSync('token')) return;
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
    Api.sendFormId(formIdData).then(console.log);
}

module.exports = {
    dealFormId,
    sendFormIds
}