import { $wuxCountUp } from '../../components/wux'

var app = getApp()
// pages/integralBalance/integralBalance.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        integral: 0,
        integralRecord: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=User&a=getIntegral&userId=' + app.globalData.userId,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
                    integral: res.data[0]["integral"],
                    integralRecord: res.data[1]["record"]
                })
                this.integral = new $wuxCountUp(1, res.data[0]["integral"], 0, 2, {
                    printValue(value) {
                        this.setData({
                            integral: value,
                        })
                    }
                })
                this.integral.start()
            },
            fail: function () {
                wx.showToast({
                    title: '获取数据失败，请稍后重试！',
                    icon: 'false',
                    duration: 2000
                })
            }
        })
        
    },
    start() {
        this.c3.start(() => {
            wx.showToast({
                title: '已完成',
            })
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

    }
})