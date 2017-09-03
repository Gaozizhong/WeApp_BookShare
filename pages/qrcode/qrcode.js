//qrcode.js
//获取应用实例
var app = getApp()
Page({
    data: {
        picUrl:null
    },

    onLoad: function (options) {
        var sharingId = options.sharingId + "@" + app.globalData.userId;//添加 userId 防止漏洞
        console.log(sharingId)

        var that = this;
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=createQRcode&sharingId=' + sharingId,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
                    picUrl: "http://"+app.globalData.apiUrl+res.data
                })
                console.log(that.data)
            },
            fail: function () {
                wx.showToast({
                    title: '生成二维码失败，请重试',
                    icon: 'false',
                    duration: 2000
                })
            }
        })
    },
    onShow:function(){
        
    }
})
