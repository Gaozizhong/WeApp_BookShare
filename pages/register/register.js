//register.js 登录
//获取应用实例
var app = getApp()
Page({
    data: {
        motto: '欢 迎 来 到 BookShare！',
        userInfo: {}
    },
    //事件处理函数
    onLoad: function () {
        var that = this
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })
    },
    onReady: function () {

    },
    login: function () {
        
    }
})
