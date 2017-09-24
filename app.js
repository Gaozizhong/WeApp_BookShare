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
            url: 'https://' + that.globalData.apiUrl + '?m=home&c=User&a=getAccessToken',
            success: function (res) {
                that.globalData.access_token = res.data.access_token
            }
        })
        
        //定时器获取access_token
        var timename = setInterval(function(){
            wx.request({
                url: 'https://' + that.globalData.apiUrl + '?m=home&c=User&a=getAccessToken',
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
        apiUrl: "35978598.1949science.cn/",//"localhost:8081",//www.1949science.cn  139.199.171.106/bookshare
        userId:null,//用户userId
        timer: 30000,//定时器设置时间
        access_token:null,
        pilotKeepTime:7 ,//自营点时间
        latitude: 39.2349700000,//团队所在纬度
        longitude: 117.0582000000,//团队所在经度

        borrow:1,           //借书 减去图书原价的积分

        c2cUploadBook: 0.5, //C2C上传书获得原价一半的积分
        c2cOwnerGet:   0.5, //C2C 借书人借书 书主获得原价一半的积分
        c2cStationGet: 0.5, //C2C 借书人借书 平台获得原价一半的积分
        c2cPenalty: 1,      //C2C 超时罚金 原价积分/天
        c2cPenaltyOwner: 0.5,//C2C 超时罚金 书主获得原价积分的一半/天
        c2cPenaltyStation: 0.5,//C2C 超时罚金 平台获得原价积分的一半/天
        c2cGuideOwner: 1,    //C2C 引导支付 书主获得所有积分
        c2cGuideStation: 0,  //C2C 引导支付 平台获得所有积分

        b2cOperate: 1,      //b2C 代为运营书 捐书人获得原价的积分
        b2cOpearteOwnerGet: 0.25,//b2C 代为运营书   书主获得原价的积分
        b2cOpearteStationGet: 0.75,//b2C 代为运营书 平台获得原价的积分
        b2cOperatePenalty: 1,      //b2C 代为运营书 超时罚金 原价积分/天
        b2cOperatePenaltyOwner: 0,//b2C 代为运营书 超时罚金 书主获得原价积分的一半/天
        b2cOperatePenaltyStation: 1,//b2C 代为运营书 超时罚金 平台获得原价积分的一半/天
        b2cOperateGuideOwner: 0,    //b2C 代为运营书 引导支付 书主获得所有积分
        b2cOperateGuideStation: 1,  //b2C 代为运营书 引导支付 平台获得所有积分

        b2cDonate: 3,       //b2C 捐赠书获得原价的3倍积分
        b2cDonateOwnerGet: 0.125,//b2C 捐赠书  书主获得原价的积分
        b2cDonateStationGet: 0.875,//b2C 捐赠书 平台获得原价的积分
        b2cDonatePenalty: 1,      //b2C 捐赠书 超时罚金 原价积分/天
        b2cDonatePenaltyOwner: 0,//b2C 捐赠书 超时罚金 书主获得原价积分的一半/天
        b2cDonatePenaltyStation: 1,//b2C 捐赠书 超时罚金 平台获得原价积分的一半/天
        b2cDonateGuideOwner: 0,    //b2C 捐赠书 引导支付 书主获得所有积分
        b2cDonateGuideStation: 1,  //b2C 捐赠书 引导支付 平台获得所有积分

    },
})