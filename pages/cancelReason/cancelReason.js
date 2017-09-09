var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this; 
        that.setData({
            sharingId: options.sharingId,
            canShareId: options.canShareId
        })
        console.log(options)
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

    //取消借书
    cancelBorrow: function () {
        var that = this;
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=cancelBorrow&sharingId=' + that.data.sharingId + "&canShareId=" + that.data.canShareId,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "canceled") {
                    wx.showToast({
                        title: '已取消借书，无需重复！',
                        icon: 'false',
                        duration: 2000
                    })
                } else if (res.data == "success") {
                    wx.showToast({
                        title: '取消成功',
                        icon: 'true',
                        duration: 2000
                    })
                } else if (res.data == "fail") {
                    wx.showToast({
                        title: '取消失败，请稍后重试',
                        icon: 'true',
                        duration: 2000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '取消失败，请稍后重试',
                    icon: 'false',
                    duration: 2000
                })
            }
        })
    }
})