import { $wuxPrompt } from '../../components/wux'
const sliderWidth = 96

//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        borrowIn: null,
        borrowInRecord:null
    },

    onLoad: function () {
        var that = this;
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getBorrowIn&userId=' + app.globalData.userId,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "noBorrowIn") {
                    $wuxPrompt.init('msg1', {
                        title: '空空如也',
                        text: '暂时没有相关数据',
                    }).show()
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
    onShow:function(){
        this.onLoad();
    },

    //联系书主
    callOwner: function (e) {
        var sharingId = e.currentTarget.dataset.sharingid;
        var openId = e.currentTarget.dataset.openid;
        var phoneNum = e.currentTarget.dataset.phonenum;
        wx.makePhoneCall({
            phoneNumber: phoneNum //仅为示例，并非真实的电话号码
        })
    },

    //升级后的扫码功能
    creatBorrowQRcode: function (e) {
        var that = this;
        var sharingId = e.currentTarget.dataset.sharingid;
        wx.navigateTo({
            url: '../qrcode/qrcode?sharingId=' + sharingId
        })
    },

    //借书完成
    finishBorrow:function(e){
        var sharingId = e.currentTarget.dataset.sharingid;
        var that = this;
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=finishBorrow&sharingId=' + sharingId,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "finished") {
                    wx.showToast({
                        title: '您已确认借书，无需重复操作',
                        icon: 'false',
                        duration: 2000
                    })
                } else if (res.data == "success"){
                    wx.showToast({
                        title: '确认借书成功',
                        icon: 'false',
                        duration: 2000
                    })
                } else if (res.data == "fail"){
                    wx.showToast({
                        title: '确认借书失败',
                        icon: 'false',
                        duration: 2000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '确认借书失败',
                    icon: 'false',
                    duration: 2000
                })
            }
        })
    },

    



})
