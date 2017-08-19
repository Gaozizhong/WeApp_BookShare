//app.js
App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        //登录
        var that = this;
        // wx.checkSession({
        //     success: function () {
        //         //session 未过期，并且在本生命周期一直有效
        //     },
        //     fail: function () {
        //         //登录态过期

        //     }
        // })


    },

    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.getUserInfo({
                withCredentials: false,
                success: function (res) {
                    that.globalData.userInfo = res.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                }
            })
        }
    },

    globalData: {
        userInfo: null,
        loginStatus: true,
        appId: 'wxe0a4d0328b2d85cb',
        appSecret: '25f225cee1b8da033ecbd23ac68beb1a',
        session_key: null,
        openId: null,
        apiUrl: "localhost:8081",//"139.199.171.106:80",//
        userId:null
    },
})