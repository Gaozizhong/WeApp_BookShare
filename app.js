//app.js
App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        //登录
        var that = this;
        wx.request({
            url: 'http://' + that.globalData.apiUrl + '/bookshare?m=home&c=User&a=getAccessToken',
            success: function (res) {
                that.globalData.access_token = res.data.access_token
            }
        })
        
        //定时器获取access_token
        var timename = setInterval(function(){
            wx.request({
                url: 'http://' + that.globalData.apiUrl + '/bookshare?m=home&c=User&a=getAccessToken',
                success: function (res) {
                    that.globalData.access_token = res.data.access_token
                }
            })
        }, that.globalData.timer);


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
        certificationOk: 0,//是否认证
        appId: 'wxe0a4d0328b2d85cb',
        appSecret: '25f225cee1b8da033ecbd23ac68beb1a',
        session_key: null,
        openId: null,
        apiUrl: "139.199.171.106",//"localhost:8081",//www.1949science.cn
        userId:null,//用户userId
        timer: 30000,//定时器设置时间
        access_token:null,
        pilotKeepTime:7 //自营点时间
    },
})