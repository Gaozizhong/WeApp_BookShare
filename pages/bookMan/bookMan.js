//bookMan.js 图书管理
//获取应用实例
var app = getApp()
Page({
    data: {
        downLineBooks:null,
        onLineBooks:null
    },
    //事件处理函数
    onLoad: function () {
        var that = this;
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=getBookManList&userId=' + app.globalData.userId,
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
                    downLineBooks: res.data[0]["data"],
                    onLineBooks: res.data[1]["data"]
                })
                
            }
        })
        
    },
    onShow: function () {
        this.onLoad();
    },

    editKeepTime:function(e){
        //编辑
        var canShareId = e.currentTarget.dataset.canshareid;
        var bookId = e.currentTarget.dataset.bookid;
        wx.navigateTo({
            url: '../editTime/editTime?canShareId=' + canShareId + "&bookId=" + bookId
        })
    },

    //下线图书
    downLine:function(e){
        var canShareId = e.currentTarget.dataset.canshareid;
        var that = this;
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=downLine&canShareId=' + canShareId,
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if(res.data == "downLined"){
                    wx.showToast({
                        title: '您已下线该图书，无需重复！',
                        icon: 'false',
                        duration: 2000
                    })
                } else if (res.data == "success"){
                    wx.showToast({
                        title: '下线成功！',
                        icon: 'false',
                        duration: 2000
                    })
                    that.onLoad();
                    
                } else if (res.data == "fail"){
                    wx.showToast({
                        title: '下线失败，请稍后重试！',
                        icon: 'false',
                        duration: 2000
                    })
                }
            }
        })

    },

    //上线图书
    onLine: function (e) {
        var canShareId = e.currentTarget.dataset.canshareid;
        var that = this;
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=onLine&canShareId=' + canShareId,
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "onLined") {
                    wx.showToast({
                        title: '您已上线该图书，无需重复！',
                        icon: 'false',
                        duration: 2000
                    })
                } else if (res.data == "success") {
                    wx.showToast({
                        title: '上线成功！',
                        icon: 'false',
                        duration: 2000
                    })
                    that.onLoad();
                } else if (res.data == "fail") {
                    wx.showToast({
                        title: '上线失败，请稍后重试！',
                        icon: 'false',
                        duration: 2000
                    })
                }
            }
        })

    }

    
})
