// pages/payment/payment.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        integral: 2,
        minusStatus: 'disabled',

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

    reduce: function () {
        var integral = this.data.integral;
        if (integral > 1) {
            integral--;
        }
        var minusStatus = integral <= 1 ? 'disabled' : 'normal';
        this.setData({
            integral: integral,
            minusStatus: minusStatus
        });
    },
    add: function () {
        var integral = this.data.integral;
        if (integral < 99) {
            integral++;
        }
        var minusStatus = integral <= 1 ? 'disabled' : 'normal';
        this.setData({
            integral: integral,
            minusStatus: minusStatus
        });
    },
    add1: function () {
        var integral = this.data.integral;
        if (integral < 99) {
            integral++;
        }
        var minusStatus = integral <= 1 ? 'disabled' : 'normal';
        this.setData({
            integral: integral,
            minusStatus: minusStatus
        });
    },
    add2: function () {
        var integral = this.data.integral;
        if (integral < 98) {
            integral = integral + 2;
        }
        var minusStatus = integral <= 1 ? 'disabled' : 'normal';
        this.setData({
            integral: integral,
            minusStatus: minusStatus
        });
    },
    add3: function () {
        var integral = this.data.integral;
        if (integral < 99) {
            integral++;
        }
        var minusStatus = integral <= 1 ? 'disabled' : 'normal';
        this.setData({
            integral: integral,
            minusStatus: minusStatus
        });
    },
    add4: function () {
        var integral = this.data.integral;
        if (integral < 99) {
            integral++;
        }
        var minusStatus = integral <= 1 ? 'disabled' : 'normal';
        this.setData({
            integral: integral,
            minusStatus: minusStatus
        });
    },
    bindManual: function (e) {
        var integral = e.detail.value;
        // 将数值与状态写回  
        this.setData({
            integral: integral
        });
    }
})