//bookList.js 个人中心共用图书列表
//获取应用实例
var app = getApp()
Page({
    data: {
        
    },

    onLoad: function () {
        var that = this;
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getBookListCount&userId=' + app.globalData.userId,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
                    readNum: res.data.readNum,
                    loveNum: res.data.loveNum,
                    shareNum: res.data.shareNum,
                    booklistObj: res.data.private
                })
            },
            fail: function () {
                wx.showToast({
                    title: '获取数据失败，请稍后重试！',
                    icon: 'false',
                    duration: 2000
                })
            }
        })
    },

    onShow: function () {
        this.onLoad();
    },

    //进入各书单列表页
    openBookListInfo:function(e){
        var bookListType = e.currentTarget.dataset.type;
        wx.navigateTo({
            url: '../bookListInfo/bookListInfo?bookListType=' + bookListType,
        })
    },
    //新建书单
    newList:function() {
        wx.navigateTo({
            url: '../newBookList/newBookList',
        })
    }

})
