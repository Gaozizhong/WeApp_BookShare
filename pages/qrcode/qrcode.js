//qrcode.js
//获取应用实例
var app = getApp()
Page({
    data: {
        picUrl:null
    },

    onLoad: function (options) {
        var sharingId = options.sharingId + "@" + app.globalData.userId;//添加 userId 防止漏洞
        var that = this;
        wx.request({
            url: ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=createQRcode&sharingId=' + sharingId).replace(/\s+/g, ""),
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
                    picUrl: "https://"+app.globalData.apiUrl+res.data
                })
                
            },
            fail: function () {
                wx.showToast({
                    title: '生成二维码失败，请重试',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })
    },
    onShow:function(){
        
    },

    openCommentBorrower:function(){
        var that = this 
        wx.navigateTo({
            url: '../commentBorrower/commentBorrower?bookId=25',
        })
    }
})
