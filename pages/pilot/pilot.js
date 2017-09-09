var utils = require('../../utils/util.js');

var app = getApp();
// pages/home/index.js
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
        //加载自营点数据
        var that = this;
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=getPilotBorrowIn&userId=' + app.globalData.userId,
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
                    console.log(res.data)

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
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        utils.checkSettingStatu();
    },

    cancelBorrow:function(e){
        var sharingId = e.currentTarget.dataset.sharingid;
        var canShareId = e.currentTarget.dataset.canshareid;
        console.log(canShareId)
        wx.navigateTo({
            url: '../cancelReason/cancelReason?sharingId=' + sharingId + "&canShareId=" + canShareId,
        })
    },

    pilotBorrowIn:function(){
        wx.navigateTo({
            url: '../pilotBorrowIn/pilotBorrowIn',
        })
    }


})