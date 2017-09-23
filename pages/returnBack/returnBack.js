//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        returnBack: null
    },

    onLoad: function () {
        var that = this;
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getReturnBack&userId=' + app.globalData.userId,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res.data)
                if (res.data == "noReturn") {
                    wx.showToast({
                        title: '您还没有待还书！',
                        icon: 'false',
                        duration: 2000
                    })
                } else {
                    that.setData({
                        returnBack: res.data
                    })
                }
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
        this.onLoad();
    },

    //联系书主
    callOwner: function (e) {
        var sharingId = e.currentTarget.dataset.sharingid;
        var openId = e.currentTarget.dataset.openid;
        var phoneNum = e.currentTarget.dataset.phonenum;
        wx.makePhoneCall({
            phoneNumber: phoneNum //仅为示例，并非真实的电话号码
        })
    },

    //扫码 整体流程完成
    screenQRcode: function (e) {
        var bookId = e.target.dataset.bookid;
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    //已授权 扫描ISBN
                    wx.scanCode({
                        success: (res) => {
                            if (res.errMsg == "scanCode:ok") {
                                if (res.result) {
                                    var array = res.result.split("@");
                                    var sharingId = array[0];
                                    //根据sharingId获取书主 借书人信息 对书主 借书人信息进行验证
                                    wx.request({
                                        url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=checkOwner&sharingId=' + sharingId,
                                        method: "GET",
                                        header: {
                                            'content-type': 'application/json'
                                        },
                                        success: function (res) {
                                            if (array[1] == res.data["owner_id"]) {
                                                if (res.data["user_id"] == app.globalData.userId) {
                                                    wx.request({
                                                        url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=screenReturn&sharingId=' + sharingId + "&user_id=" + app.globalData.userId + " & book_id=" + bookId,
                                                        method: "GET",
                                                        header: {
                                                            'content-type': 'application/json'
                                                        },
                                                        success: function (res) {
                                                            if (res.data == "finished") {
                                                                wx.showToast({
                                                                    title: '已归还，无需重复！',
                                                                    icon: 'false',
                                                                    duration: 2000
                                                                })
                                                            } else if (res.data == "success") {
                                                                wx.showModal({
                                                                    title: '归还成功',
                                                                    content: '评论得积分，是否前往？',
                                                                    cancelText: "算了",
                                                                    confirmText:"立即前往",
                                                                    success: function (res) {
                                                                        if (res.confirm) {
                                                                            wx.navigateTo({
                                                                                url: '../comment/comment?sharingId=' + sharingId + "&bookId=" + bookId,
                                                                            })
                                                                        }
                                                                    }
                                                                })
                                                            } else if (res.data == "fail") {
                                                                wx.showToast({
                                                                    title: '归还失败，请稍后重试',
                                                                    icon: 'true',
                                                                    duration: 2000
                                                                })
                                                            }
                                                        },
                                                        fail: function () {
                                                            wx.showToast({
                                                                title: '归还失败，请稍后重试',
                                                                icon: 'false',
                                                                duration: 2000
                                                            })
                                                        }
                                                    })
                                                } else {
                                                    wx.showModal({
                                                        title: '通知',
                                                        content: '借书码错误，扫描失败！',
                                                        showCancel: false,
                                                    })
                                                }

                                            } else {
                                                wx.showModal({
                                                    title: '通知',
                                                    content: '您不是该书书主，扫描无效！',
                                                    showCancel: false,
                                                })
                                            }
                                        },
                                        fail: function () {
                                            wx.showToast({
                                                title: '获取数据失败，请稍后重试！',
                                                icon: 'false',
                                                duration: 2000
                                            })
                                        }
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

    //借书人确认已还书
    borrowAffirmReturn: function (e) {
        var sharingId = e.currentTarget.dataset.sharingid;
        var canShareId = e.currentTarget.dataset.canshareid;
        var that = this;
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=returnBack&sharingId=' + sharingId + "&canShareId=" + canShareId,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "returned") {
                    wx.showToast({
                        title: '已确认归还，无需重复操作',
                        icon: 'false',
                        duration: 2000
                    })
                } else if (res.data == "success") {
                    wx.showToast({
                        title: '确认成功',
                        icon: 'false',
                        duration: 2000
                    })
                } else if (res.data == "fail") {
                    wx.showToast({
                        title: '确认失败',
                        icon: 'false',
                        duration: 2000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '确认失败',
                    icon: 'false',
                    duration: 2000
                })
            }
        })
    },

})
