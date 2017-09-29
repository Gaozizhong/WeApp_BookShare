//uploadPilot.js 自营点上传图书
//获取应用实例
var app = getApp()
Page({
    data: {
        bookInfo:null,
        hidden:1
    },
    //事件处理函数
    onLoad: function (options) {
        var that = this;
        that.setData({
            donateType: options.donateType
        })
    },
    onReady: function () {

    },


    // 扫描书后的isbn
    screenBook: function (e) {
        var that = this
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
                                            } else {
                                                that.setData({
                                                    bookInfo: res.data,
                                                    hidden: false
                                                })
                                                var bookData = that.data.bookInfo;
                                                wx.request({
                                                    url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=uploadBookInfo&book_name=' + bookData.title + "&writer=" + bookData.author[0] + "&translator=" + bookData.translator[0] + "&introduction=" + bookData.summary + "&book_image=" + bookData.image + "&book_sort=" + bookData.tags[0].count + "&ISBN10=" + bookData.isbn10 + "&book_press=" + bookData.publisher + "&publish_date=" + bookData.pubdate + "&web_url=" + bookData.url + "&rating=" + bookData.rating.average + "&writer_intro=" + bookData.author_intro + "&image_large=" + bookData.images.large + "&image_medium=" + bookData.images.medium + "&image_small=" + bookData.images.small + "&ISBN13=" + bookData.isbn13 + "&pages=" + bookData.pages + "&price=" + parseInt(bookData.price) + "&rating_max=" + bookData.rating.max + "&rating_min=" + bookData.rating.min + "&raters_num=" + bookData.rating.numRaters + "&subtitle=" + bookData.subtitle,
                                                    method: "GET",
                                                    header: {
                                                        'content-type': 'application/json'
                                                    },
                                                    success: function (res) {
                                                        that.setData({
                                                            bookId: res.data.id,
                                                        })
                                                        wx.request({
                                                            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=sharePilotBook&ownerId=' + app.globalData.userId + "&bookId=" + that.data.bookId + "&keep_time=" + app.globalData.pilotKeepTime,
                                                            method: "GET",
                                                            header: {
                                                                'content-type': 'application/json'
                                                            },
                                                            success: function (res) {
                                                                if (res.data[0]["result"] == "have shared") {
                                                                    wx.showToast({
                                                                        title: '已经分享过，无需再分享！',
                                                                        icon: 'success',
                                                                        duration: 2000
                                                                    })
                                                                } else if (res.data[0]["result"] == "success") {
                                                                    // wx.showToast({
                                                                    //     title: '分享成功！',
                                                                    //     icon: 'success',
                                                                    //     duration: 2000
                                                                    // })
                                                                    that.setData({
                                                                        can_share_id: res.data[0]["can_share_id"],
                                                                        hidden:2
                                                                    })
                                                                }else{
                                                                    wx.showToast({
                                                                        title: '分享失败，请稍后重试！',
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

    },

    //扫描与书主绑定的二维码
    screenQRcode: function (e) {
        var that = this
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    //已授权 扫描ISBN
                    wx.scanCode({
                        success: (res) => {
                            if (res.errMsg == "scanCode:ok") {
                                //扫描成功
                                var qrcodeId = res.result.substring(72);
                                wx.request({
                                    url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=insertPilot&user_id=' + app.globalData.userId + "&qrcode_id=" + qrcodeId + "&can_share_id=" + that.data.can_share_id + "&donateType=" + that.data.donateType,
                                    method: "GET",
                                    header: {
                                        'content-type': 'application/json'
                                    },
                                    success: function (res) {
                                        if (res.data == "had screen") {
                                            wx.showToast({
                                                title: '该二维码已被使用，请更换二维码',
                                                icon: 'success',
                                                duration: 2000
                                            })
                                        } else if (res.data == "success") {
                                            // wx.showToast({
                                            //     title: '上传自营点成功！',
                                            //     icon: 'success',
                                            //     duration: 2000
                                            // })
                                            that.setData({
                                                hidden:3
                                            })
                                        }else{
                                            wx.showToast({
                                                title: '上传失败，请稍后重试！',
                                                icon: 'false',
                                                duration: 2000
                                            })
                                        }
                                    },
                                    fail: function () {
                                        wx.showToast({
                                            title: '上传失败，请稍后重试！',
                                            icon: 'false',
                                            duration: 2000
                                        })
                                    }
                                })
                                
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

    },

    //扫描柜子二维码
    bookcase: function (e) {
        var that = this
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    //已授权 扫描ISBN
                    wx.scanCode({
                        success: (res) => {
                            if (res.errMsg == "scanCode:ok") {
                                //扫描成功
                                var array = res.result.split("@bookcase");
                                wx.request({
                                    url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=updateOwner&pilot_id=' + array[0] + "&bookcase_qrcode=" + array[1] + "&can_share_id=" + that.data.can_share_id + "&price=" + parseInt(that.data.bookInfo.price) + "&user_id=" + app.globalData.userId,
                                    method: "GET",
                                    header: {
                                        'content-type': 'application/json'
                                    },
                                    success: function (res) {
                                        if (res.data == "had screen") {
                                            wx.showToast({
                                                title: '该二维码已被使用，请更换二维码',
                                                icon: 'success',
                                                duration: 2000
                                            })
                                        } else if (res.data == "success") {
                                            wx.showToast({
                                                title: '上传自营点成功！',
                                                icon: 'success',
                                                duration: 2000
                                            })
                                        } else {
                                            wx.showToast({
                                                title: '上传失败，请稍后重试！',
                                                icon: 'false',
                                                duration: 2000
                                            })
                                        }
                                    },
                                    fail: function () {
                                        wx.showToast({
                                            title: '上传失败，请稍后重试！',
                                            icon: 'false',
                                            duration: 2000
                                        })
                                    }
                                })

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

    },



})
