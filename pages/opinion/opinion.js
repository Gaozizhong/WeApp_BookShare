//opinion.js 意见反馈
//获取应用实例
var app = getApp()
Page({
    data: {
        
    },
    //事件处理函数
    onLoad: function () {
        
    },
    onReady: function () {

    },

    //设置反馈内容
    setContent: function (e) {
        var that = this;
        that.setData({
            opinion: e.detail.value
        })
    },

    submitOpinion:function(){
        var that = this
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=submitOpinion&opinion=' + that.data.opinion + "&userId=" + app.globalData.userId,
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                if(res.data == "success"){
                    
                    wx.showModal({
                        title: '通知',
                        content: '我们收到您的反馈会及时联系您，感谢您的参与！',
                        showCancel:false,
                        success: function (res) {
                            if (res.confirm) {
                                wx.navigateBack({
                                    delta:1
                                })
                            }
                        }
                    })
                }else{
                    wx.showToast({
                        title: '反馈失败，请稍后重试！',
                        icon: 'false',
                        duration: 2000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '反馈失败，请稍后重试！',
                    icon: 'false',
                    duration: 2000
                })
            }
        })
    }
})
