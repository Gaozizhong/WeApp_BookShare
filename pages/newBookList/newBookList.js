var app = getApp()
// pages/newBookList/newBookList.js
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

    addBook: function () {
        //打开添加图书
        wx.navigateTo({
            url: '../addBook/addBook',
        })
    },

    setName: function (e) {
        var that = this;
        that.setData({
            name: e.detail.value
        })

    },

    setDescription: function (e) {
        var that = this;
        that.setData({
            description: e.detail.value
        })

    },

    //添加图书书单
    addBookList: function () {
        var that = this;
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=createPrivateBookList&user_id=' + app.globalData.userId + "&name=" + that.data.name + "&description=" + that.data.description,
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                if(res.data == "success"){
                    wx.showToast({
                        title: '创建成功',
                        icon: 'success',
                        duration: 2000
                    })
                    wx.navigateBack({
                        delta:1
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '获取数据失败，请稍后重试！',
                    icon: 'false',
                    duration: 2000
                })
            }
        })
    }
})