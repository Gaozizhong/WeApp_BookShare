//uploadPilot.js 自营点上传图书
//获取应用实例
var app = getApp()
var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]
Page({
    data: {
        bookInfo:null,
        hidden:1,
        step:1,
        cateisShow: false,
        array: ['无限制', '3-5岁', '6-9岁', '10-12岁'],
        arrayValue: ['0', '1', '2', '3'],
        ageIndex: 0,
        sortsIDArray:null,//获取图书分类
        sortsNameArray: null,//获取图书分类
        sortsIndex:0,
        
        //上传图片
        imageList: [],
        imageListIndex:0,
        sourceTypeIndex: 2,
        sourceType: ['拍照', '相册', '拍照或相册'],

        sizeTypeIndex: 2,
        sizeType: ['压缩', '原图', '压缩或原图'],

        countIndex: 8,
        count: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    //事件处理函数
    onLoad: function (options) {
        var that = this;
        that.setData({
            donateType: options.donateType
        })
        var url = ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getSorts').replace(/\s+/g, "")
        wx.request({
            url: url,
            method: "GET",
            dataType:"json",
            success: function (res) {
                if (res.data == "none") {
                    wx.showToast({
                        title: '暂无分类',
                        image: '../../images/warning.png',
                        duration: 2000
                    })
                }else {
                    that.setData({
                        sortsIDArray: res.data["ID"],
                        sortsNameArray: res.data["sort_name"]
                    })
                }
            }
        })
    },
    togglePtype: function () {
        //显示分类
        this.setData({
            cateisShow: !this.data.cateisShow
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
                                                bookData.translator = bookData.translator[0] ? bookData.translator[0] : '未知';
                                                bookData.tags = JSON.stringify(bookData.tags)
                                                var price = bookData.price;
                                                price = price.replace(/[^0-9|.]/ig, "")
                                                that.setData({
                                                    price: price
                                                })
                                                var data = ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=uploadBookInfo&book_name=' + bookData.title + "&writer=" + bookData.author + "&translator=" + bookData.translator + "&introduction=" + (bookData.summary) + "&book_image=" + bookData.image + "&book_sort=" + (bookData.tags).substring(0, 300) + "&ISBN10=" + bookData.isbn10 + "&book_press=" + bookData.publisher + "&publish_date=" + bookData.pubdate + "&web_url=" + bookData.url + "&rating=" + bookData.rating.average + "&writer_intro=123" + "&image_large=" + bookData.images.large + "&image_medium=" + bookData.images.medium + "&image_small=" + bookData.images.small + "&ISBN13=" + bookData.isbn13 + "&pages=" + bookData.pages + "&price=" + price+"&rating_max=" + bookData.rating.max + "&rating_min=" + bookData.rating.min + "&raters_num=" + bookData.rating.numRaters + "&subtitle=" + bookData.subtitle).replace(/\s+/g, "");

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
                                var url1 = ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=sharePilotBook&ownerId=' + app.globalData.userId + "&bookId=" + that.data.bookId + "&keep_time=" + app.globalData.pilotKeepTime).replace(/\s+/g, "")
                                wx.request({
                                    url: url1,
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
                                            var url2 = ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=insertPilot&user_id=' + app.globalData.userId + "&qrcode_id=" + qrcodeId + "&can_share_id=" + that.data.can_share_id + "&donateType=" + that.data.donateType).replace(/\s+/g, "")
                                            wx.request({
                                                url: url2,
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
                                var url3 = ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=updateOwner&pilot_id=' + array[0] + "&can_share_id=" + that.data.can_share_id + "&price=" + that.data.price + "&user_id=" + app.globalData.userId + "&bookcase_qrcode=" + res.result).replace(/\s+/g, "") ;
                                
                                wx.request({
                                    url: url3,
                                    method: "GET",
                                    header: {
                                        'content-type': 'application/json'
                                    },
                                    success: function (res) {
                                        if (res.data == "success") {
                                            wx.showModal({
                                                title: '提醒',
                                                content: '扫描书架成功!',
                                                showCancel:false,
                                                success:function(res){
                                                    if (res.confirm) {
                                                        that.togglePtype();
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

    //选择适龄
    bindAgeChange:function(e){
        this.setData({
            ageIndex: e.detail.value
        })
    },

    //选择分类
    bindSortsChange: function (e) {
        this.setData({
            sortsIndex: e.detail.value
        })
    },

    setContent:function(e){
        this.setData({
            cardContent: e.detail.value
        })
    },

    //上传图片
    sourceTypeChange: function (e) {
        this.setData({
            sourceTypeIndex: e.detail.value
        })
    },
    sizeTypeChange: function (e) {
        this.setData({
            sizeTypeIndex: e.detail.value
        })
    },
    countChange: function (e) {
        this.setData({
            countIndex: e.detail.value
        })
    },
    chooseImage: function () {
        var that = this
        wx.chooseImage({
            sourceType: sourceType[this.data.sourceTypeIndex],
            sizeType: sizeType[this.data.sizeTypeIndex],
            count: this.data.count[this.data.countIndex],
            success: function (res) {
                var imageList = that.data.imageList;
                var tempFilePaths = res.tempFilePaths;
                var c = imageList.concat(tempFilePaths);
                that.setData({
                    imageList: c
                })
            }
        })
    },
    previewImage: function (e) {
        var current = e.target.dataset.src
        wx.previewImage({
            current: current,
            urls: this.data.imageList
        })
    },

    completeInfo: function () {
        //提交信息
        var that = this;
        var thatData = that.data;
        var ageIndex = that.data.ageIndex; 
        var sortsIndex = that.data.sortsIndex;
        if (!thatData.cardContent){
            wx.showModal({
                title: '提醒',
                content: '您还没有填写书评，填写书评可能会给您带来更多的积分呦',
                confirmText:"填写",
                cancelText:"算了",
                success: function (res) {
                    if (res.confirm) {
                        return ;
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }

        wx.request({
            url: ('https://' + app.globalData.apiUrl + '/index.php?m=home&c=Api&a=changeAgeSorts&can_share_id=' + thatData.can_share_id + "&book_id=" + thatData.bookId+"&user_id=" + app.globalData.userId + "&age=" + thatData.arrayValue[ageIndex] + "&sort=" + thatData.sortsIDArray[sortsIndex] + "&card_content=" + thatData.cardContent+"&book_content=5").replace(/\s+/g, ""),
            method: "GET",
            dataType:"text",
            success: function (res) {
                if (res.data == "success") {
                    wx.showModal({
                        title: '提醒',
                        content: '更新图书信息成功!',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                wx.navigateBack({
                                delta: 1
                            })
                            }
                        }
                    })
                } else {
                    wx.showToast({
                        title: '更新图书信息失败！',
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
        // console.log(that.data.imageList);
        // app.uploadimg({
        //     url: 'https://' + app.globalData.apiUrl + '/index.php?m=home&c=Api&a=uploadBookDetailPic',//这里是你图片上传的接口
        //     path: that.data.imageList,//这里是选取的图片的地址数组,
        //     formData: {
        //         'can_share_id': 12//that.data.can_share_id
        //     },
        // });
        //上传多张照片
        // for (var i in that.data.imageList){
        //     console.log(that.data.imageList[i]);
        //     //上传详细图片
        //     wx.uploadFile({
        //         url: 'https://' + app.globalData.apiUrl + '/index.php?m=home&c=Api&a=uploadBookDetailPic',
        //         formData: {
        //             'can_share_id': that.data.can_share_id
        //         },
        //         header: {
        //             'content-type': "multipart/form-data"
        //         }, // 设置请求的 header
        //         filePath: that.data.imageList[i],
        //         name: 'bookPic',
        //         success: function (res) {
        //             console.log(res.data);
        //             var data = res.data
        //             if (data == "success") {
                        
        //             } else if (data == "fail") {
        //                 wx.showToast({
        //                     title: '上传失败！',
        //                     image: '../../images/fail.png',
        //                     duration: 2000
        //                 })
        //             }
        //         }
        //     })
        // }
        
    }
})
