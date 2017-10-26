
const app = getApp()
var utils = require('../../utils/util.js');
// pages/detail1/detail1.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrls: [
            'https://img3.doubanio.com/lpic/s26657870.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg'
        ],
        images: [
            'https://img3.doubanio.com/lpic/s26657870.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg'
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 500,
        circular: true,

        //原始
        loading: true,
        keepTimes: null,
        cateisShow: false,
        canShareId: null,
        openIds: null,
        params: null,
        commentInfo: null,
        borrowNeed: app.globalData.borrow,
        morePic:null        
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(params) {
        var canShareId = params.canShareId;
        var book_type = params.book_type;
        var bookId = params.bookId;
        var that = this;
        that.setData({
            canShareId: canShareId,
            params: params,
            book_type: book_type,
            bookId: bookId
        })
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getBookInfoByCanShareId&canShareId=' + canShareId + "&book_type=" + book_type + "&userId=" + app.globalData.userId + "&bookId=" + that.data.bookId,
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                that.setData({
                    bookInfo: res.data[0],
                    commentInfo: res.data[0].comment,
                    loading: false,
                    morePic: res.data[0]["morePic"]
                })
                console.log(that.data)
                wx.setNavigationBarTitle({ title: res.data[0].book_name })
            },
            fail: function () {
                wx.showToast({
                    title: '获取数据失败，请稍后重试！',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })


    },
    onShow: function () {
        utils.checkSettingStatu();
    },

    previewImage: function (e) {
        var that = this;
        wx.previewImage({
            //数据源
            urls: [that.data.imgUrls]
        })
    },

    togglePtype: function () {
        //显示分类
        this.setData({
            cateisShow: !this.data.cateisShow
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        // TODO: onPullDownRefresh
        var params = this.data.params;
        this.onLoad(params);
        wx.stopPullDownRefresh()
    },

    onShareAppMessage() {
        return {
            title: this.data.bookInfo.book_name,
            desc: this.data.introduction,
            path: '/pages/detail/detail?canShareId=' + this.data.canShareId
        }
    },

    borrowBook: function (e) {
        if (app.globalData.certificationOk != 2) {
            wx.showToast({
                title: '您还没有进行信息认证！',
            })
            return;
        }
        //借书
        var that = this;
        var canShareId = that.data.canShareId;
        var book_type = that.data.book_type;
        var checkStatus = that.data.bookInfo.protect;//信息保护

        //C2C借书
        if (checkStatus == 1) {
            //开启信息保护
            that.togglePtype();
        } else {
            //判断不能借自己书、是否借出
            wx.request({
                url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=affirmBorrowBook&canShareId=' + canShareId + '&user_id=' + app.globalData.userId + "&protect=0" + "&price=" + that.data.bookInfo.price + "&bookType=" + book_type,
                method: "GET",
                header: {
                    'content-type': 'application/json',
                },
                success: function (res) {
                    if (res.data[0].result == "noEnough") {
                        wx.showToast({
                            title: '您的积分不够,请通过其他方式获取积分！',
                            image: '../../images/warning.png',
                            duration: 2000
                        })
                        return;
                    }
                    else if (res.data[0].result == "sharing") {
                        wx.showToast({
                            title: '图书已被借出！',
                            image: '../../images/warning.png',
                            duration: 2000
                        })
                    } else if (res.data[0].result == "fail") {
                        wx.showToast({
                            title: '借书失败，请稍后重试！',
                            image: '../../images/fail.png',
                            duration: 2000
                        })
                    } else if (res.data[0].result == "success") {
                        if (book_type == 0) {
                            wx.showModal({
                                title: '通知',
                                content: '扣除您' + that.data.bookInfo.price + '积分，您可以直接联系书主借书！',
                                success: function (res) {
                                    if (res.confirm) {
                                        wx.makePhoneCall({
                                            phoneNumber: that.data.bookInfo.phoneNumber //仅为示例，并非真实的电话号码
                                        })
                                    } else if (res.cancel) {
                                        wx.showModal({
                                            title: '通知',
                                            content: '您可以前往借入界面联系书主',
                                            showCancel: false,
                                            success: function (res) {
                                                if (res.confirm) {

                                                } else if (res.cancel) {

                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        } else {
                            //自营点借书成功提示
                            wx.showModal({
                                title: '通知',
                                content: '借入成功，扣除' + that.data.bookInfo.price + '积分，你需要前往此自营点借书！',
                                success: function (res) {
                                    if (res.confirm) {

                                    } else if (res.cancel) {

                                    }
                                }
                            })
                        }

                    } else if (res.data[0].result == "mine") {
                        wx.showToast({
                            title: '您不能借自己的书！',
                            image: '../../images/waning.png',
                            duration: 2000
                        })
                    }
                },
                fail: function () {
                    wx.showToast({
                        title: '借书失败，请稍后重试！',
                        image: '../../images/fail.png',
                        duration: 2000
                    })
                }
            })
        }
    },



    affirmBorrowBook: function (e) {
        if (app.globalData.certificationOk != 2) {
            wx.showToast({
                title: '您还没有进行信息认证！',
                image: '../../images/warning.png',
            })
            return;
        }
        var that = this;
        var canShareId = that.data.canShareId;
        var openIds = that.data.openIds;
        var eventData = e;

        //判断不能借自己书、是否借出
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=affirmBorrowBook&canShareId=' + canShareId + '&user_id=' + app.globalData.userId + "&price=" + that.data.bookInfo.price + "&bookType=" + that.data.book_type,
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                if (res.data[0].result == "sharing") {

                    wx.showToast({
                        title: '图书已被借出！',
                        image: '../../images/warning.png',
                        duration: 2000
                    })
                } else if (res.data[0].result == "fail") {
                    wx.showToast({
                        title: '借书失败，请稍后重试！',
                        image: '../../images/fail.png',
                        duration: 2000
                    })
                } else if (res.data[0].result == "success") {
                    wx.showToast({
                        title: '申请成功，等书主确认！',
                        icon: 'success',
                        duration: 2000
                    })

                } else if (res.data[0].result == "mine") {
                    wx.showToast({
                        title: '您不能借自己的书！',
                        image: '../../images/warning.png',
                        duration: 2000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '借书失败，请稍后重试！',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })
    },

    //打开读书卡片页面
    writeCard: function () {
        var that = this
        //添加至public_booklist 我看过的
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=addSeenBook&user_id=' + app.globalData.userId + "&book_id=" + that.data.bookInfo.book_id + "&type=1",
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                if (res.data == "success") {
                    that.setData({
                        haveRead: 1
                    })
                    wx.navigateTo({
                        url: '../cardDetail/cardDetail?book_id=' + that.data.bookInfo.book_id,
                    })
                    wx.showToast({
                        title: '添加成功！',
                        icon: 'success',
                        duration: 2000
                    })
                } else if (res.data == "haveAdded") {
                    wx.showToast({
                        title: '您已添加过！',
                        image: '../../images/warning.png',
                        duration: 2000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '添加失败，请稍后重试！',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })
    },

    //取消我看过的
    cancelSeen: function () {
        var that = this
        wx.showModal({
            title: '通知',
            content: '您确定要取消看过吗？',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=cancelSeenBook&user_id=' + app.globalData.userId + "&book_id=" + that.data.bookInfo.book_id + "&type=1",
                        method: "GET",
                        header: {
                            'content-type': 'application/json',
                        },
                        success: function (res) {
                            if (res.data == "success") {
                                console.log(that.data)
                                wx.showToast({
                                    title: '取消成功！',
                                    icon: 'success',
                                    duration: 2000
                                })
                                that.setData({
                                    haveRead: 0
                                })
                            } else {
                                wx.showToast({
                                    title: '取消失败',
                                    image: '../../images/fail.png',
                                    duration: 2000
                                })
                            }
                        },
                        fail: function () {
                            wx.showToast({
                                title: '取消失败，请稍后重试！',
                                image: '../../images/fail.png',
                                duration: 2000
                            })
                        }
                    })
                }
            }
        })

    },

    //添加志public_booklist 我喜欢的
    addLove: function () {
        var that = this
        //添加至public_booklist 我看过的
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=addSeenBook&user_id=' + app.globalData.userId + "&book_id=" + that.data.bookInfo.book_id + "&type=2",
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                if (res.data == "success") {
                    wx.showToast({
                        title: '成功添加至喜欢！',
                        icon: 'success',
                        duration: 2000
                    })
                    that.setData({
                        haveLoved: 1
                    })
                } else if (res.data == "haveAdded") {
                    wx.showToast({
                        title: '您已添加过！',
                        image: '../../images/warning.png',
                        duration: 2000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '添加失败，请稍后重试！',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })
    },

    //取消喜欢
    cancelLove: function () {
        var that = this
        wx.showModal({
            title: '通知',
            content: '您确定要取消喜欢吗？（取消可能会错过信息哦）',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=cancelSeenBook&user_id=' + app.globalData.userId + "&book_id=" + that.data.bookInfo.book_id + "&type=2",
                        method: "GET",
                        header: {
                            'content-type': 'application/json',
                        },
                        success: function (res) {
                            if (res.data == "success") {
                                wx.showToast({
                                    title: '取消成功！',
                                    icon: 'success',
                                    duration: 2000
                                })
                                that.setData({
                                    haveLoved: 0
                                })
                            } else {
                                wx.showToast({
                                    title: '取消失败',
                                    image: '../../images/fail.png',
                                    duration: 2000
                                })
                            }
                        },
                        fail: function () {
                            wx.showToast({
                                title: '取消失败，请稍后重试！',
                                image: '../../images/fail.png',
                                duration: 2000
                            })
                        }
                    })
                }
            }
        })
    },
    imageLoad: function (e) {
        var $width = e.detail.width,    //获取图片真实宽度
            $height = e.detail.height,
            ratio = $width / $height;    //图片的真实宽高比例
        var viewHeight = 500,           //设置图片显示宽度，左右留有16rpx边距
            viewWidth = 500 * ratio;    //计算的高度值
        var marginLeftWidth = (750*0.97 - viewWidth)/2;
        var image = this.data.images;
        //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
        image[e.target.dataset.index] = {
            width: viewWidth,
            height: viewHeight,
            marginLeftWidth: marginLeftWidth
        }
        this.setData({
            images: image
        })
    },
    

})