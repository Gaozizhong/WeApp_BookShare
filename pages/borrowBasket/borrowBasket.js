import { $wuxPrompt } from '../../components/wux'
const sliderWidth = 96
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: ['C2C', '自营点'],
        activeIndex: '0',
        sliderOffset: 0,
        sliderLeft: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({ title: "借书篮" })
        var that = this;
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getBorrowIn&userId=' + app.globalData.userId,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "noBorrowIn") {
                    $wuxPrompt.init('msg1', {
                        title: '空空如也',
                        text: '暂时没有相关数据',
                    }).show()
                } else {
                    if (res.data[0] == '' && res.data[1] == '') {
                        $wuxPrompt.init('msg1', {
                            title: '空空如也',
                            text: '暂时没有相关数据',
                        }).show()
                    }
                    that.setData({
                        borrowInC2C: res.data[0],
                        borrowInC2CRecord: res.data[1]
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '获取数据失败，请稍后重试！',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })

        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getPilotBorrowIn&userId=' + app.globalData.userId,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "noBorrowIn") {
                    $wuxPrompt.init('msg2', {
                        icon: '../../assets/images/iconfont-order.png',
                        title: '您还没有相关的订单',
                        text: '可以去看看有哪些想买',
                        buttons: [
                            {
                                text: '随便逛逛'
                            }
                        ],
                        buttonClicked(index, item) {
                            console.log(index, item)
                        },
                    }).show()
                } else {
                    if (res.data[0] == '' && res.data[1] == '') {
                        $wuxPrompt.init('msg2', {
                            icon: '../../assets/images/iconfont-order.png',
                            title: '您还没有相关的订单',
                            text: '可以去看看有哪些想买',
                            buttons: [
                                {
                                    text: '随便逛逛'
                                }
                            ],
                            buttonClicked(index, item) {
                                console.log(index, item)
                            },
                        }).show()
                    }
                    that.setData({
                        borrowInB2C: res.data[0],
                        borrowInB2CRecord: res.data[1]
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '获取数据失败，请稍后重试！',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })

        this.getSystemInfo();


    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.onLoad();
    },

    //获取系统详情
    getSystemInfo() {
        const that = this
        wx.getSystemInfo({
            success(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                })
            }
        })
    },

    //切换tab
    tabClick(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id,
        })
    },

    /*******************C2C JS START***************/
    //联系书主
    callOwner: function (e) {
        var sharingId = e.currentTarget.dataset.sharingid;
        var openId = e.currentTarget.dataset.openid;
        var phoneNum = e.currentTarget.dataset.phonenum;
        wx.makePhoneCall({
            phoneNumber: phoneNum //仅为示例，并非真实的电话号码
        })
    },

    //升级后的扫码功能
    creatBorrowQRcode: function (e) {
        var that = this;
        var sharingId = e.currentTarget.dataset.sharingid;
        wx.navigateTo({
            url: '../qrcode/qrcode?sharingId=' + sharingId
        })
    },

    //借书完成
    finishBorrow: function (e) {
        var sharingId = e.currentTarget.dataset.sharingid;
        var that = this;
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=finishBorrow&sharingId=' + sharingId,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "finished") {
                    wx.showToast({
                        title: '您已确认借书，无需重复操作',
                        image: '../../images/warning.png',
                        duration: 2000
                    })
                } else if (res.data == "success") {
                    wx.showToast({
                        title: '确认借书成功',
                        icon: 'success',
                        duration: 2000
                    })
                } else if (res.data == "fail") {
                    wx.showToast({
                        title: '确认借书失败',
                        image: '../../images/fail.png',
                        duration: 2000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '确认借书失败',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })
    },
    /*******************自营点 JS START*********************/
    cancelBorrow: function (e) {
        var sharingId = e.currentTarget.dataset.sharingid;
        var canShareId = e.currentTarget.dataset.canshareid;
        wx.navigateTo({
            url: '../cancelReason/cancelReason?sharingId=' + sharingId + "&canShareId=" + canShareId,
        })
    },

    pilotBorrowIn: function (e) {
        var sharingId = e.currentTarget.dataset.sharingid;
        var canShareId = e.currentTarget.dataset.canshareid;
        wx.navigateTo({
            url: '../pilotBorrowIn/pilotBorrowIn?sharingId=' + sharingId + "&canShareId=" + canShareId,
        })
    }
})