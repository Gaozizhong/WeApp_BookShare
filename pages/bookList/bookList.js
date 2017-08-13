//bookList.js 个人中心共用图书列表
//获取应用实例
var app = getApp()
Page({
    data: {
        userInfo: {}
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
        
    },
    
})
