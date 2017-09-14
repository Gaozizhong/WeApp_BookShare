//bookMan.js 图书管理
//获取应用实例
var app = getApp()
Page({
    data: {
        canShareId:null,
        loading:true,
        bookInfo:null,
        keepTime:null,

        stars: [0, 1, 2, 3, 4],
        normalSrc: '../../images/normal.png',
        selectedSrc: '../../images/selected.png',
        halfSrc: '../../images/half.png',
        key1: 5,//评分

        array: ['无限制', '0-2岁', '3-7岁', '8-12岁'],
        index: 0,
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
    },
    
    /**
    * 书评
     */
    selectLeft1: function (e) {
        var key1 = e.currentTarget.dataset.key
        if (this.data.key1 == 0.5 && e.currentTarget.dataset.key == 0.5) {
            //只有一颗星的时候,再次点击,变为0颗
            key1 = 0;
        }
        console.log("得" + key1 + "分")
        this.setData({
            key1: key1
        })

    },
    //点击左边,整颗星
    selectRight1: function (e) {
        var key1 = e.currentTarget.dataset.key
        console.log("得" + key1 + "分")
        this.setData({
            key1: key1
        })
    },
    //选择器
    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },

    

})
