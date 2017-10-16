var utils = require('../../utils/util.js');

var app = getApp();
// pages/home/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //加载自营点数据
        var that = this;
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getPilotBorrowIn&userId=' + app.globalData.userId,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "noBorrowIn") {
                    wx.showToast({
                        title: '您还没有借过书！',
                        icon: 'false',
                        duration: 2000
                    })
                } else {
                    that.setData({
                        borrowIn: res.data[0],
                        borrowInRecord: res.data[1]
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
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.onLoad();
        wx.hideLoading()
    },

    cancelBorrow:function(e){
        var sharingId = e.currentTarget.dataset.sharingid;
        var canShareId = e.currentTarget.dataset.canshareid;
        wx.navigateTo({
            url: '../cancelReason/cancelReason?sharingId=' + sharingId + "&canShareId=" + canShareId,
        })
    },

    pilotBorrowIn:function(e){
        var sharingId = e.currentTarget.dataset.sharingid;
        var canShareId = e.currentTarget.dataset.canshareid;
        wx.navigateTo({
            url: '../pilotBorrowIn/pilotBorrowIn?sharingId='+sharingId + "&canShareId=" + canShareId,
        })
    }


})