//operateShare.js 关于我们
//获取应用实例
var app = getApp()
Page({
    data: {
        checked: false,
        loading: true
    },
    //事件处理函数
    onLoad: function () {
        var that = this;
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '?m=home&c=User&a=getProtectInfo&userId=' + app.globalData.userId,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "fail") {
                    wx.showToast({
                        title: '获取失败，请稍后重试！',
                        icon: 'success',
                        duration: 2000
                    })
                } else {
                    if (res.data[0]["protect"] == 0) {
                        that.setData({
                            checked: false
                        })
                    } else if (res.data[0]["protect"] == 1) {
                        that.setData({
                            checked: true
                        })
                    }

                }
                
            },
            fail: function () {
                wx.showToast({
                    title: '获取失败，请稍后重试！',
                    icon: 'false',
                    duration: 2000
                })
            },
            complete: function () {
                that.setData({
                    loading: false
                })
            }
        })
    },
    onReady: function () {

    },

    //切换状态
    changeProtect: function (e) {
        var that = this;
        var protectStatu;
        var checkStatus = e.detail.value;
        
        if (checkStatus == true) {
            protectStatu = 1;
        } else {
            protectStatu = 0;
        }
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '?m=home&c=User&a=editProtectInfo&userId=' + app.globalData.userId + "&protect=" + protectStatu,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "fail") {
                    wx.showToast({
                        title: '修改失败，请稍后重试！',
                        icon: 'success',
                        duration: 2000
                    })
                } else {
                    // wx.showToast({
                    //     title: '修改成功！',
                    //     icon: 'success',
                    //     duration: 2000
                    // })
                }

            },
            fail: function () {
                wx.showToast({
                    title: '修改失败，请稍后重试！',
                    icon: 'false',
                    duration: 2000
                })
            }
        })
    }

})
