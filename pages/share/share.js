//share.js 上传图书分享
//获取应用实例
var app = getApp()
Page({
    data: {
        isbnCode:"",
        loading:true,
        bookInfo:{},
        cateisShow:false,
        uploadDays:10
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
                that.setData({
                    bookInfo: res.data,
                    loading: false
                })
            },
            fail: function () {
                that.setData({
                    loading: false
                })
                wx.showToast({
                    title: '信息加载失败，请重试',
                    icon: 'false',
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

    uploadBook:function(){
        //上传图书信息
        var that = this;
        var bookData = that.data.bookInfo;
        if (that.data.bookId){
            that.togglePtype();
        }else{
            wx.request({
                url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=uploadBookInfo&book_name=' + bookData.title + "&writer=" + bookData.author[0] + "&translator=" + bookData.translator[0] + "&introduction=" + bookData.summary + "&book_image=" + bookData.image + "&book_sort=" + bookData.tags[0].count + "&ISBN10=" + bookData.isbn10 + "&book_press=" + bookData.publisher + "&publish_date=" + bookData.pubdate + "&web_url=" + bookData.url + "&rating=" + bookData.rating.average + "&writer_intro=" + bookData.author_intro + "&image_large=" + bookData.images.large + "&image_medium=" + bookData.images.medium + "&image_small=" + bookData.images.small + "&ISBN13=" + bookData.isbn13 + "&pages=" + bookData.pages + "&price=" + bookData.price + "&rating_max=" + bookData.rating.max + "&rating_min=" + bookData.rating.min + "&raters_num=" + bookData.rating.numRaters + "&subtitle=" + bookData.subtitle,
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
                        icon: 'false',
                        duration: 2000
                    })
                }
            })   
        }
             
    },

    addBookList: function () {
        //添加书单
        var that = this;
        var bookData = that.data.bookInfo;
        
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=uploadBookInfo&book_name=' + bookData.title + "&writer=" + bookData.author[0] + "&translator=" + bookData.translator[0] + "&introduction=" + bookData.summary + "&book_image=" + bookData.image + "&book_sort=" + bookData.tags[0].count + "&ISBN10=" + bookData.isbn10 + "&book_press=" + bookData.publisher + "&publish_date=" + bookData.pubdate + "&web_url=" + bookData.url + "&rating=" + bookData.rating.average + "&writer_intro=" + bookData.author_intro + "&image_large=" + bookData.images.large + "&image_medium=" + bookData.images.medium + "&image_small=" + bookData.images.small + "&ISBN13=" + bookData.isbn13 + "&pages=" + bookData.pages + "&price=" + bookData.price + "&rating_max=" + bookData.rating.max + "&rating_min=" + bookData.rating.min + "&raters_num=" + bookData.rating.numRaters + "&subtitle=" + bookData.subtitle,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(JSON.stringify(res))
            },
            fail: function () {
                wx.showToast({
                    title: '添加失败，请稍后重试！',
                    icon: 'false',
                    duration: 2000
                })
            }
        })
    },

    setDays:function(e){
        var that = this;
        that.setData({
            uploadDays: e.detail.value
        })
    },

    shareBook:function(){
        var that = this;

        wx.getStorage({
            key: 'userInfo',
            success: function(res) {
                console.log(res)
            },
        })
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=shareBook&ownerId=' + app.globalData.userId + "&bookId=" + that.data.bookId + "&keep_time=" + that.data.uploadDays,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                wx.showToast({
                    title: '分享成功！',
                    icon: 'success',
                    duration: 2000
                })
                that.togglePtype();
            },
            fail: function () {
                wx.showToast({
                    title: '分享失败，请稍后重试！',
                    icon: 'false',
                    duration: 2000
                })
            }
        })   
    }

})
