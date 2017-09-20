// 获取全局应用程序实例对象
const app = getApp()
var utils = require('../../utils/util.js');
// 创建页面实例对象
Page({
    /**
     * 页面的初始数据
     */
    data: {
        loading: true,
        keepTimes: null,
        cateisShow: false,
        canShareId: null,
        openIds: null,
        params: null,
        commentInfo:null,

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
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=getBookInfoByCanShareId&canShareId=' + canShareId + "&book_type=" + book_type + "&userId=" + app.globalData.userId + "&bookId=" + that.data.bookId,
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                that.setData({
                    bookInfo: res.data[0],
                    commentInfo: res.data[0].comment,
                    loading: false
                })
                wx.setNavigationBarTitle({ title: res.data[0].book_name })
            },
            fail: function () {
                wx.showToast({
                    title: '获取数据失败，请稍后重试！',
                    icon: 'false',
                    duration: 2000
                })
            }
        })


    },
    onShow: function () {
        utils.checkSettingStatu();
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
                url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=affirmBorrowBook&canShareId=' + canShareId + '&user_id=' + app.globalData.userId + "&protect=0",
                method: "GET",
                header: {
                    'content-type': 'application/json',
                },
                success: function (res) {
                    if (res.data[0].result == "sharing") {
                        wx.showToast({
                            title: '图书已被借出！',
                            icon: 'false',
                            duration: 2000
                        })
                    } else if (res.data[0].result == "fail") {
                        wx.showToast({
                            title: '借书失败，请稍后重试！',
                            icon: 'false',
                            duration: 2000
                        })
                    } else if (res.data[0].result == "success") {
                        if (book_type == 0) {
                            wx.showModal({
                                title: '通知',
                                content: '书主关闭了借书申请，您可以直接联系他！',
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
                                content: '借入成功，你需要前往此自营点借书！',
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
                            icon: 'false',
                            duration: 2000
                        })
                    }
                },
                fail: function () {
                    wx.showToast({
                        title: '借书失败，请稍后重试！',
                        icon: 'false',
                        duration: 2000
                    })
                }
            })
        }
    },



    affirmBorrowBook: function (e) {
        var that = this;
        var canShareId = that.data.canShareId;
        var openIds = that.data.openIds;
        var eventData = e;

        //判断不能借自己书、是否借出
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=affirmBorrowBook&canShareId=' + canShareId + '&user_id=' + app.globalData.userId,
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                if (res.data[0].result == "sharing") {

                    wx.showToast({
                        title: '图书已被借出！',
                        icon: 'false',
                        duration: 2000
                    })
                } else if (res.data[0].result == "fail") {
                    wx.showToast({
                        title: '借书失败，请稍后重试！',
                        icon: 'false',
                        duration: 2000
                    })
                } else if (res.data[0].result == "success") {
                    wx.showToast({
                        title: '申请成功，等书主确认！',
                        icon: 'false',
                        duration: 2000
                    })

                } else if (res.data[0].result == "mine") {
                    wx.showToast({
                        title: '您不能借自己的书！',
                        icon: 'false',
                        duration: 2000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '借书失败，请稍后重试！',
                    icon: 'false',
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
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=addSeenBook&user_id=' + app.globalData.userId + "&book_id=" + that.data.bookInfo.book_id + "&type=1",
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                if (res.data == "success") {
                    that.setData({
                        haveRead:1
                    })
                    wx.navigateTo({
                        url: '../cardDetail/cardDetail?book_id=' + that.data.bookInfo.book_id,
                    })
                    wx.showToast({
                        title: '添加成功！',
                        icon: 'false',
                        duration: 2000
                    })
                } else if (res.data == "haveAdded") {
                    wx.showToast({
                        title: '您也添加过！',
                        icon: 'false',
                        duration: 2000
                    })
                }
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

    //取消我看过的
    cancelSeen: function () {
        var that = this
        wx.showModal({
            title: '通知',
            content: '您确定要取消看过吗？',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=cancelSeenBook&user_id=' + app.globalData.userId + "&book_id=" + that.data.bookInfo.book_id + "&type=1",
                        method: "GET",
                        header: {
                            'content-type': 'application/json',
                        },
                        success: function (res) {
                            if (res.data == "success") {
                                wx.showToast({
                                    title: '取消成功！',
                                    icon: 'false',
                                    duration: 2000
                                })
                                that.setData({
                                    haveRead: 0
                                })
                            } else {
                                wx.showToast({
                                    title: '取消失败',
                                    icon: 'false',
                                    duration: 2000
                                })
                            }
                        },
                        fail: function () {
                            wx.showToast({
                                title: '取消失败，请稍后重试！',
                                icon: 'false',
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
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=addSeenBook&user_id=' + app.globalData.userId + "&book_id=" + that.data.bookInfo.book_id + "&type=2",
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                if (res.data == "success") {
                    wx.showToast({
                        title: '成功添加至喜欢！',
                        icon: 'false',
                        duration: 2000
                    })
                    that.setData({
                        haveLoved: 1
                    })
                } else if (res.data == "haveAdded") {
                    wx.showToast({
                        title: '您已添加过！',
                        icon: 'false',
                        duration: 2000
                    })
                }
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

    //取消喜欢
    cancelLove: function () {
        var that = this
        wx.showModal({
            title: '通知',
            content: '您确定要取消喜欢吗？（取消可能会错过信息哦）',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=cancelSeenBook&user_id=' + app.globalData.userId + "&book_id=" + that.data.bookInfo.book_id + "&type=2",
                        method: "GET",
                        header: {
                            'content-type': 'application/json',
                        },
                        success: function (res) {
                            if (res.data == "success") {
                                wx.showToast({
                                    title: '取消成功！',
                                    icon: 'false',
                                    duration: 2000
                                })
                                that.setData({
                                    haveLoved: 0
                                })
                            } else {
                                wx.showToast({
                                    title: '取消失败',
                                    icon: 'false',
                                    duration: 2000
                                })
                            }
                        },
                        fail: function () {
                            wx.showToast({
                                title: '取消失败，请稍后重试！',
                                icon: 'false',
                                duration: 2000
                            })
                        }
                    })
                }
            }
        })
    },
})
