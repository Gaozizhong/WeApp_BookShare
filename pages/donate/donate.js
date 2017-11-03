
var app = getApp();
// pages/donate/donate.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bookObj: null,
        loading:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var donateType = options.donateType
        //加载捐赠和代为运营的数目
        var that = this;
        that.setData({
            donateType: donateType
        })
        wx.request({
            url: ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getDonateList&userId=' + app.globalData.userId + "&donateType=" + donateType).replace(/\s+/g, ""),
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
                    bookObj: res.data,
                    loading: true
                })
            },
            fail: function () {
                wx.showToast({
                    title: '获取数据失败，请稍后重试！',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })
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
        var that = this
        that.onLoad(that.data)
    },

    uploadPilot:function(){
        var that = this
        wx.navigateTo({
            url: '../uploadPilot/uploadPilot?donateType=' + that.data.donateType
        })
    }

})