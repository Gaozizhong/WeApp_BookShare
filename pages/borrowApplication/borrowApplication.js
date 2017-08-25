//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        
    },
    
    onLoad: function () {
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
    },

})
