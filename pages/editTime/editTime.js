//bookMan.js 图书管理
//获取应用实例
var app = getApp()
Page({
    data: {
        canShareId:null,
        loading:true,
        bookInfo:null,
        keepTime:null
    },
    //事件处理函数
    onLoad: function (options) {
        var that = this;
        var canShareId = options.canShareId;
        that.setData({
            canShareId: canShareId
        })
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=getEditInfo&canShareId=' + canShareId,
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res.data)
                if(res.data[0]["result"] == "success"){
                    that.setData({
                        bookInfo: res.data[0],
                        loading: false
                    })
                }else{
                    wx.showToast({
                        title: '获取数据失败，请重试！',
                        icon: 'false',
                        duration: 2000
                    })
                }
                
            }
        })


    },
    onReady: function () {

    },
    
    //设置时间
    setDays: function (e) {
        var that = this;
        that.setData({
            keepTime: e.detail.value
        })
    },

    //保存修改
    saveKeepTime:function(e){
        console.log(e)
        var canShareId = e.currentTarget.dataset.canshareid;
        var that = this;
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=editKeepTime&canShareId=' + canShareId + "&keepTime=" + that.data.keepTime,
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "success") {
                    wx.showToast({
                        title: '修改成功！',
                        icon: 'false',
                        duration: 2000
                    })
                } else {
                    wx.showToast({
                        title: '修改失败，请重试！',
                        icon: 'false',
                        duration: 2000
                    })
                }

            }
        })
    }

    

})
