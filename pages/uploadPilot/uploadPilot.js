//uploadPilot.js 自营点上传图书
//获取应用实例
var app = getApp()
Page({
    data: {
        bookInfo:null,
        hidden:1,
        step:1
    },
    //事件处理函数
    onLoad: function (options) {
        var that = this;
        that.setData({
            donateType: options.donateType
        })
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
                                                })
                                                var bookData = that.data.bookInfo;
                                                bookData.author = bookData.author[0] ? bookData.author[0] : '未知';
                                                bookData.translator = bookData.translator[0] ? bookData.author[0] : '未知';
                                                bookData.tags = JSON.stringify(bookData.tags)
                                                var price = bookData.price;
                                                price = price.replace(/[^0-9|.]/ig, "")
                                                that.setData({
                                                    price: price
                                                })
                                                var data = 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=uploadBookInfo&book_name=' + bookData.title + "&writer=" + bookData.author + "&translator=moren" + "&introduction=" + (bookData.summary).substring(0, 300) + "&book_image=" + bookData.image + "&book_sort=" + (bookData.tags).substring(0, 300) +"&ISBN10=" + bookData.isbn10 + "&book_press=" + bookData.publisher + "&publish_date=" + bookData.pubdate + "&web_url=" + bookData.url + "&rating=" + bookData.rating.average + "&writer_intro=123" +"&image_large=" + bookData.images.large + "&image_medium=" + bookData.images.medium + "&image_small=" + bookData.images.small + "&ISBN13=" + bookData.isbn13 + "&pages=" + bookData.pages + "&price=" + parseInt(price) + "&rating_max=" + bookData.rating.max + "&rating_min=" + bookData.rating.min + "&raters_num=" + bookData.rating.numRaters + "&subtitle=" + bookData.subtitle;

                                                wx.request({
                                                    url: data,
                                                    method: "GET",
                                                    success: function (res) {
                                                        that.setData({
                                                            bookId: res.data.id,
                                                            hidden: 2
                                                        })
                                                    },
                                                    fail: function () {
                                                        wx.showToast({
                                                            title: '上传图书信息失败！',
                                                            image: '../../images/fail.png',
                                                            duration: 2000
                                                        })
                                                    }
                                                })
                                                
                                            }
                                        },
                                    })
                                } else {
                                    wx.showToast({
                                        title: '条形码有误！',
                                        image: '../../images/fail.png',
                                    })
                                }
                            } else {
                                wx.showToast({
                                    title: '获取数据失败，请稍后重试！',
                                    image: '../../images/fail.png',
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
                                var qrcodeId = res.result.substring(69);
                                if (!qrcodeId){
                                    wx.showToast({
                                        title: '重新扫描二维码',
                                        image: '../../images/warning.png',
                                        duration: 2000
                                    })
                                    return ;
                                }
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
                                                image: '../../images/warning.png',
                                                duration: 2000
                                            })
                                        } else if (res.data[0]["result"] == "success") {
                                            that.setData({
                                                can_share_id: res.data[0]["can_share_id"],
                                            })
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
                                                            image: '../../images/warning.png',
                                                            duration: 2000
                                                        })
                                                    } else if (res.data == "success") {
                                                        that.setData({
                                                            hidden: 3
                                                        })
                                                    } else {
                                                        wx.showToast({
                                                            title: '上传失败，请稍后重试！',
                                                            image: '../../images/fail.png',
                                                            duration: 2000
                                                        })
                                                    }
                                                },
                                                fail: function () {
                                                    wx.showToast({
                                                        title: '上传失败，请稍后重试！',
                                                        image: '../../images/fail.png',
                                                        duration: 2000
                                                    })
                                                }
                                            })
                                        } else {
                                            wx.showToast({
                                                title: '分享失败，请稍后重试！',
                                                image: '../../images/fail.png',
                                                duration: 2000
                                            })
                                        }
                                    },
                                    fail: function () {
                                        wx.showToast({
                                            title: '分享失败，请稍后重试！',
                                            image: '../../images/fail.png',
                                            duration: 2000
                                        })
                                    }
                                })
                                
                                
                            } else {
                                wx.showToast({
                                    title: '获取数据失败，请稍后重试！',
                                    image: '../../images/fail.png',
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
                                if (array.length<2){
                                    wx.showToast({
                                        title: '扫描二维码出错！',
                                        image: '../../images/fail.png',
                                    })
                                    return ;
                                }
                                var url = 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=updateOwner&pilot_id=' + array[0] + "&can_share_id=" + that.data.can_share_id + "&price=" + that.data.price + "&user_id=" + app.globalData.userId + "&bookcase_qrcode=" + res.result ;
                                
                                wx.request({
                                    url: url,
                                    method: "GET",
                                    header: {
                                        'content-type': 'application/json'
                                    },
                                    success: function (res) {
                                        if (res.data == "success") {
                                            wx.showModal({
                                                title: '提醒',
                                                content: '上传自营点成功！',
                                                showCancel:false,
                                                success:function(res){
                                                    if (res.confirm) {
                                                        wx.navigateBack({
                                                            delta: 1
                                                        })
                                                    }
                                                }
                                            })
                                        } else {
                                            console.log(res.data)
                                            wx.showToast({
                                                title: '扫描书柜失败！',
                                                image: '../../images/fail.png',
                                                duration: 2000
                                            })
                                        }
                                    },
                                    fail: function () {
                                        wx.showToast({
                                            title: '扫描书柜失败！',
                                            image: '../../images/fail.png',
                                            duration: 2000
                                        })
                                    }
                                })

                            } else {
                                wx.showToast({
                                    title: '扫描书柜二维码出错！',
                                    image: '../../images/fail.png',
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
