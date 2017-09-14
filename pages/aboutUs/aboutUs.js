//about.js 关于我们
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

    openLocation:function(){
        wx.openLocation({
            latitude: app.globalData.latitude,
            longitude: app.globalData.longitude,
            scale: 15,
            name:"河北工业大学北辰校区"
        })
    }
})
