//operateShare.js 关于我们
//获取应用实例
var app = getApp()
Page({
    data: {
        loading: false,
        bookInfo: null,
        disabled: false,
        uploadDays: 10,//默认上传天数
        location: null,//地理名称
        longitude: null,//经度,
        latitude: null,//纬度

        stars: [0, 1, 2, 3, 4],
        normalSrc: '../../images/normal.png',
        selectedSrc: '../../images/selected.png',
        halfSrc: '../../images/half.png',
        key1: 5,//评分

        array: ['无限制', '0-2岁', '3-7岁', '8-12岁'],
        arrayValue:['0','1','2','3'],
        index: 0,
    },
    //事件处理函数
    onLoad: function () {

    },
    onReady: function () {

    },

    //扫码
    screenISBN: function () {
        var that = this;
        that.setData({
            loading: true
        })
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    //已授权 扫描ISBN
                    wx.scanCode({
                        success: (res) => {
                            if (res.errMsg == "scanCode:ok") {
                                //扫描成功
                                if (res.scanType == "EAN_13") {
                                    //条形码
                                    var isbnCode = res.result;
                                    wx.request({
                                        url: 'https://api.douban.com/v2/book/isbn/' + isbnCode,
                                        header: {
                                            'content-type': 'json'
                                        },
                                        success: function (res) {
                                            if (res.data.msg == "book_not_found") {
                                                wx.showToast({
                                                    title: '没有此图书信息，请至手动添加！',
                                                    icon: 'false',
                                                    duration: 2000
                                                })
                                            } else {
                                                that.setData({
                                                    bookInfo: res.data,
                                                    disabled: true
                                                })
                                                var bookData = res.data;
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
                                                    },
                                                    fail: function () {
                                                        wx.showToast({
                                                            title: '上传失败，请稍后重试！',
                                                            icon: 'false',
                                                            duration: 2000
                                                        })
                                                    }
                                                })
                                            }
                                        },
                                        fail: function () {
                                            wx.showToast({
                                                title: '信息加载失败，请重试',
                                                icon: 'false',
                                                duration: 2000
                                            })
                                        }
                                    })

                                } else {
                                    wx.showToast({
                                        title: '条形码有误！',
                                    })
                                }
                            } else {
                                wx.showToast({
                                    title: '获取数据失败，请稍后重试！',
                                })
                            }
                        }
                    })
                } else {
                    utils.checkSettingStatu();
                }
            }
        })

        that.setData({
            loading: false
        })

    },

    //设置借出时间
    setDays: function (e) {
        var that = this;
        that.setData({
            uploadDays: e.detail.value
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

    shareBook: function () {
        var that = this;
        var index = that.data.index;
        var arrayValue = that.data.arrayValue;
        if (!that.data.location) {
            wx.showToast({
                title: '您还没有选择地址！',
                icon: 'success',
                duration: 2000
            })
            return;
        }
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=shareBook&ownerId=' + app.globalData.userId + "&bookId=" + that.data.bookId + "&keep_time=" + that.data.uploadDays + "&location=" + that.data.location + "&longitude=" + that.data.longitude + "&latitude=" + that.data.latitude + "&card_content=" + that.data.card_content + "&book_content=" + that.data.key1 + "&age=" + arrayValue[index],
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
                } else if (res.data == "success"){
                    wx.showToast({
                        title: '分享成功！',
                        icon: 'success',
                        duration: 2000
                    })
                }else{
                    wx.showToast({
                        title: '分享失败',
                        icon: 'success',
                        duration: 2000
                    })
                }

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

    //继续分享
    continueShare: function () {
        var that = this;
        that.setData({
            loading: false,
            bookInfo: null,
            disabled: false,
            uploadDays: 10,//默认上传天数
            location: null,//地理名称
            longitude: null,//经度,
            latitude: null,//纬度
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

    setContent:function(e){
        var that = this;
        that.setData({
            card_content: e.detail.value//书评内容
        })
    }
})
