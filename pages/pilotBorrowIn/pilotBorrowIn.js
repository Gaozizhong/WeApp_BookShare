var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        step: 1,
        hidden:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            canShareId: options.canShareId,
            sharingId: options.sharingId
        })
        wx.setNavigationBarTitle({
            title: '自营点借书流程',
        })
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '?m=home&c=Api&a=getBookStatusBySharingId&sharingId=' + options.sharingId,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
                    sharingInfo: res.data[0]
                })
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
        this.onLoad(this.data);
    },

    //扫描图书后的二维码
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
                                if (res.scanType == "QR_CODE") {
                                    var qrcode = res.result.substring(72);
                                    wx.request({
                                        url: 'http://' + app.globalData.apiUrl + '?m=home&c=Api&a=getSharingByQRcode&qrcode=' + qrcode,
                                        method: "GET",
                                        header: {
                                            'content-type': 'application/json'
                                        },
                                        success: function (res) {
                                            if (res.data[0].can_share_id == that.data.canShareId) {
                                                that.setData({
                                                    step: e.target.dataset.index
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

                                } else {
                                    wx.showToast({
                                        title: '二维码类型错误',
                                        icon: 'false',
                                        duration: 2000
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

    //扫描书架 借出书
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
                                if (res.scanType == "QR_CODE") {
                                    var qrcode = res.result.substring(10);
                                    wx.request({
                                        url: 'http://' + app.globalData.apiUrl + '?m=home&c=Api&a=screenBookCaseFinish&bookCaseQRcode=' + qrcode + "&canShareId=" + that.data.canShareId + "&sharingId=" + that.data.sharingId,
                                        method: "GET",
                                        header: {
                                            'content-type': 'application/json'
                                        },
                                        success: function (res) {
                                            if (res.data == "loaned") {
                                                wx.showToast({
                                                    title: '您已成功借出，无需重复！',
                                                    icon: 'false',
                                                    duration: 2000
                                                })
                                            } else if (res.data == "success") {
                                                wx.showToast({
                                                    title: '借书成功！',
                                                    icon: 'false',
                                                    duration: 2000
                                                })
                                                that.setData({
                                                    step: e.target.dataset.index
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

                                } else {
                                    wx.showToast({
                                        title: '二维码类型错误',
                                        icon: 'false',
                                        duration: 2000
                                    })
                                }

                            } else {
                                wx.showToast({
                                    title: '借书失败，请稍后重试！',
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

    //阅读完成
    finishRead: function (e) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '您确认已读完？',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: 'http://' + app.globalData.apiUrl + '?m=home&c=Api&a=finishRead&sharingId=' + that.data.sharingId,
                        method: "GET",
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function (res) {
                            if (res.data == "finished") {
                                wx.showToast({
                                    title: '您已确认读书完成，无需重复！',
                                    icon: 'false',
                                    duration: 2000
                                })
                            } else if (res.data == "success") {
                                wx.showToast({
                                    title: '确认成功！',
                                    icon: 'false',
                                    duration: 2000
                                })
                                that.setData({
                                    step: e.target.dataset.index
                                })
                            }
                        },
                        fail: function () {
                            wx.showToast({
                                title: '确认失败，请稍后重试！',
                                icon: 'false',
                                duration: 2000
                            })
                        }
                    })
                }
            }
        })

    },

    //扫柜子码还书
    bookcaseToReturn: function (e) {
        var that = this
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    //已授权 扫描ISBN
                    wx.scanCode({
                        success: (res) => {
                            if (res.errMsg == "scanCode:ok") {
                                //扫描成功
                                if (res.scanType == "QR_CODE") {
                                    var qrcode = res.result.substring(10);
                                    wx.request({
                                        url: 'http://' + app.globalData.apiUrl + '?m=home&c=Api&a=returnBackPilot&locationQRcode=' + qrcode + "&canShareId=" + that.data.canShareId + "&sharingId=" + that.data.sharingId,
                                        method: "GET",
                                        header: {
                                            'content-type': 'application/json'
                                        },
                                        success: function (res) {
                                            if (res.data == "returned") {
                                                wx.showToast({
                                                    title: '您已成功还书，无需重复！',
                                                    icon: 'false',
                                                    duration: 2000
                                                })
                                            } else if (res.data == "success") {
                                                wx.showToast({
                                                    title: '还书成功！',
                                                    icon: 'false',
                                                    duration: 2000
                                                })
                                                that.setData({
                                                    step: e.target.dataset.index
                                                })
                                            }
                                        },
                                        fail: function () {
                                            wx.showToast({
                                                title: '还书失败，请稍后重试！',
                                                icon: 'false',
                                                duration: 2000
                                            })
                                        }
                                    })

                                } else {
                                    wx.showToast({
                                        title: '二维码类型错误',
                                        icon: 'false',
                                        duration: 2000
                                    })
                                }

                            } else {
                                wx.showToast({
                                    title: '还书失败，请稍后重试！',
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