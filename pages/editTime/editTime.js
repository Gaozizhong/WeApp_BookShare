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
        key1: 3,//评分

        array: ['无限制', '0-2岁', '3-7岁', '8-12岁'],
        arrayValue: ['0', '1', '2', '3'],
        index: 0,
    },
    //事件处理函数
    onLoad: function (options) {
        var that = this;
        var canShareId = options.canShareId;
        var bookId = options.bookId;
        that.setData({
            canShareId: canShareId,
            bookId: bookId
        })
        wx.request({
            url: ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getEditInfo&canShareId=' + canShareId).replace(/\s+/g, ""),
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if(res.data[0]["result"] == "success"){
                    that.setData({
                        bookInfo: res.data[0],
                        loading: false,
                        keepTime: res.data[0].keep_time,
                        location: res.data[0].location,
                        longitude: res.data[0].longitude,
                        latitude: res.data[0].latitude,
                        index:res.data[0].age,
                        key1:res.data[0].book_content,
                        card_content:res.data[0].card_content,
                        book_id: res.data[0].book_id
                    })
                }else{
                    wx.showToast({
                        title: '获取数据失败，请重试！',
                        image: '../../images/fail.png',
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
        var canShareId = e.currentTarget.dataset.canshareid;
        var that = this;
        var index = that.data.index;
        var arrayValue = that.data.arrayValue;
        wx.request({
            url: ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=editKeepTime&canShareId=' + canShareId + "&keepTime=" + that.data.keepTime + "&book_id=" + that.data.bookId + "&user_id=" + app.globalData.userId + "&book_content=" + that.data.key1 + "&card_content=" + that.data.card_content + "&location=" + that.data.location + "&latitude=" + that.data.latitude + "&longitude=" + that.data.longitude + "&age=" + arrayValue[index]).replace(/\s+/g, ""),
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "success") {
                    wx.showToast({
                        title: '修改成功！',
                        icon: 'success',
                        duration: 4000,
                        success:function(){
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    })
                    
                } else {
                    wx.showToast({
                        title: '修改失败，请重试！',
                        image: '../../images/fail.png',
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
        this.setData({
            key1: key1
        })

    },
    //点击左边,整颗星
    selectRight1: function (e) {
        var key1 = e.currentTarget.dataset.key
        this.setData({
            key1: key1
        })
    },
    //选择器
    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value
        })
    },

    //选择位置
    chooseLocation: function () {
        var that = this
        wx.chooseLocation({
            success: function (res) {
                that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                    location: res.name
                })
            }
        })
    },
    
    //设置书评内容
    setContent: function (e) {
        var that = this;
        that.setData({
            card_content: e.detail.value//书评内容
        })
    }
    

})
