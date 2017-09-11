// pages/comment/comment.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        flag1: 5,
        flag2: 5,
        flag3: 5
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 书主态度星级评价
     */
    changeColor11: function () {
        var that = this;
        that.setData({
            flag1: 1
        });
    },
    changeColor12: function () {
        var that = this;
        that.setData({
            flag1: 2
        });
    },
    changeColor13: function () {
        var that = this;
        that.setData({
            flag1: 3
        });
    },
    changeColor14: function () {
        var that = this;
        that.setData({
            flag1: 4
        });
    },
    changeColor15: function () {
        var that = this;
        that.setData({
            flag1: 5
        });
    },
    /**
     * 图书质量星级评价
     */
    changeColor21: function () {
        var that = this;
        that.setData({
            flag2: 1
        });
    },
    changeColor22: function () {
        var that = this;
        that.setData({
            flag2: 2
        });
    },
    changeColor23: function () {
        var that = this;
        that.setData({
            flag2: 3
        });
    },
    changeColor24: function () {
        var that = this;
        that.setData({
            flag2: 4
        });
    },
    changeColor25: function () {
        var that = this;
        that.setData({
            flag2: 5
        });
    },
    /**
     * 图书内容星级评价
     */
    changeColor31: function () {
        var that = this;
        that.setData({
            flag3: 1
        });
    },
    changeColor32: function () {
        var that = this;
        that.setData({
            flag3: 2
        });
    },
    changeColor33: function () {
        var that = this;
        that.setData({
            flag3: 3
        });
    },
    changeColor34: function () {
        var that = this;
        that.setData({
            flag3: 4
        });
    },
    changeColor35: function () {
        var that = this;
        that.setData({
            flag3: 5
        });
    }
})