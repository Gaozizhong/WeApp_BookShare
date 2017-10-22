var utils = require('../../utils/util.js');
//share.js 上传图书分享
//获取应用实例
var app = getApp()
Page({
    data: {
        isbnCode:"",
        loading:true,
        bookInfo:{},
        cateisShow:false,
        uploadDays:10,//默认上传天数
        location:null,//地理名称
        longitude:null,//经度,
        latitude:null,//纬度
    },
    
    onReady: function () {

    },

    //事件处理函数
    onLoad: function (options) {
        var that = this;
        that.setData({
            isbnCode: options.isbn
        })
        wx.request({
            url: 'https://api.douban.com/v2/book/isbn/' + this.data.isbnCode,
            header: {
                'content-type': 'json'
            },
            success: function (res) {
                if(res.data.msg == "book_not_found"){
                    wx.showModal({
                        title: '提醒',
                        content: '没有此图书信息，请至手动添加！',
                        cancelText: "取消",
                        cancelColor: "",
                        success: function (res) {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: '../operateShare/operateShare',
                                })
                            } else if (res.cancel) {
                                
                            }
                        }
                    })
                }else{
                    that.setData({
                        bookInfo: res.data,
                        loading: false
                    })
                }
            },
            fail: function () {
                that.setData({
                    loading: false
                })
                wx.showToast({
                    title: '信息加载失败，请重试',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })
    },

    togglePtype: function () {
        //显示分类
        this.setData({
            cateisShow: !this.data.cateisShow
        })
    },

    //修改之后的上传
    openOperateShare:function(){
        var that = this
        wx.navigateTo({
            url: '../operateShare/operateShare?isbn=' + that.data.isbnCode,
        })
    },

    //修改之前的上传 直接上传 不跳转到operateshare
    uploadBook:function(){
        //上传图书信息
        var that = this;
        var bookData = that.data.bookInfo;
        if (that.data.bookId){
            that.togglePtype();
        }else{
            wx.request({
                url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=uploadBookInfo&book_name=' + bookData.title + "&writer=" + bookData.author[0] + "&translator=" + bookData.translator[0] + "&introduction=" + bookData.summary + "&book_image=" + bookData.image + "&book_sort=" + bookData.tags[0].count + "&ISBN10=" + bookData.isbn10 + "&book_press=" + bookData.publisher + "&publish_date=" + bookData.pubdate + "&web_url=" + bookData.url + "&rating=" + bookData.rating.average + "&writer_intro=" + bookData.author_intro + "&image_large=" + bookData.images.large + "&image_medium=" + bookData.images.medium + "&image_small=" + bookData.images.small + "&ISBN13=" + bookData.isbn13 + "&pages=" + bookData.pages + "&price=" + bookData.price + "&rating_max=" + bookData.rating.max + "&rating_min=" + bookData.rating.min + "&raters_num=" + bookData.rating.numRaters + "&subtitle=" + bookData.subtitle,
                method: "GET",
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    that.setData({
                        bookId: res.data.id,
                    })
                    that.togglePtype();
                },
                fail: function () {
                    wx.showToast({
                        title: '分享失败，请稍后重试！',
                        image: '../../images/fail.png',
                        duration: 2000
                    })
                }
            })   
        }
             
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

    addBookList: function () {
        //添加书单
        // var that = this;
        // var bookData = that.data.bookInfo;
        
        // wx.request({
        //     url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=uploadBookInfo&book_name=' + bookData.title + "&writer=" + bookData.author[0] + "&translator=" + bookData.translator[0] + "&introduction=" + bookData.summary + "&book_image=" + bookData.image + "&book_sort=" + bookData.tags[0].count + "&ISBN10=" + bookData.isbn10 + "&book_press=" + bookData.publisher + "&publish_date=" + bookData.pubdate + "&web_url=" + bookData.url + "&rating=" + bookData.rating.average + "&writer_intro=" + bookData.author_intro + "&image_large=" + bookData.images.large + "&image_medium=" + bookData.images.medium + "&image_small=" + bookData.images.small + "&ISBN13=" + bookData.isbn13 + "&pages=" + bookData.pages + "&price=" + bookData.price + "&rating_max=" + bookData.rating.max + "&rating_min=" + bookData.rating.min + "&raters_num=" + bookData.rating.numRaters + "&subtitle=" + bookData.subtitle,
        //     method: "GET",
        //     header: {
        //         'content-type': 'application/json'
        //     },
        //     success: function (res) {
        //         console.log(JSON.stringify(res))
        //     },
        //     fail: function () {
        //         wx.showToast({
        //             title: '添加失败，请稍后重试！',
        //             icon: 'false',
        //             duration: 2000
        //         })
        //     }
        // })
    },

    setDays:function(e){
        var that = this;
        that.setData({
            uploadDays: e.detail.value
        })
    },

    shareBook:function(){
        var that = this;
        if (!that.data.location){
            wx.showToast({
                title: '您还没有选择地址！',
                image: '../../images/warning.png',
                duration: 2000
            })
            return ;
        }
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=shareBook&ownerId=' + app.globalData.userId + "&bookId=" + that.data.bookId + "&keep_time=" + that.data.uploadDays + "&location=" + that.data.location + "&longitude=" + that.data.longitude + "&latitude=" + that.data.latitude,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "have shared") {
                    wx.showToast({
                        title: '已经分享过，无需再分享！',
                        icon: 'success',
                        duration: 2000
                    })
                } else {
                    wx.showToast({
                        title: '分享成功！',
                        icon: 'success',
                        duration: 2000
                    })
                }
                that.togglePtype();
            },
            fail: function () {
                wx.showToast({
                    title: '分享失败，请稍后重试！',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })   
    }

})
