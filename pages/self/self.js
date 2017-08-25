//self.js 个人中心首页
//获取应用实例
var app = getApp()
Page({
    data: {
        userInfo: {},
        authInfo : getApp().globalData.authInfo,
        appId: getApp().globalData.appId,
        appSecret: getApp().globalData.appSecret,
    },
    
    onLoad: function () {
        var that = this
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo,
            })
            app.globalData.userInfo = userInfo;
        })
    },
    
    onReady:function(){
        var that = this;
        if(!that.data.authInfo){
            wx.showModal({
                title: '认证提醒',
                content: '您还没有认证',
                cancelText:"下次再说",
                cancelColor:"",
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../toAuth/toAuth',
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    },

    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    login:function(){
        //认证信息及个人信息切换
        if (this.data.authInfo == true){
            //个人信息页面
            wx.navigateTo({
                url: '../selfInfo/selfInfo',
            })
        }else{
            //去认证页面
            wx.navigateTo({
                url: '../toAuth/toAuth',
            })
        }
        
    },

    openBookList:function(event){
        //打开个人中心图书列表
        var index = event.currentTarget.dataset.index;
        wx.navigateTo({
            url: '../bookList/bookList?index=' + index,
        })
    },

    openOpinion:function(){
        //打开意见反馈
        wx.navigateTo({
            url: '../opinion/opinion',
        })
    },

    aboutUs:function(){
        //打开关于我们
        wx.navigateTo({
            url: '../aboutUs/aboutUs',
        })
    }
})
