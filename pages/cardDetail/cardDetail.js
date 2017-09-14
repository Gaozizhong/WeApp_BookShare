var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: false,
        cardContent: {
            "ID":null,
            card_content:null
        },
        can_see: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            book_id: options.book_id,
        })
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=getCardDetail&bookId=' + options.book_id + "&userId=" + app.globalData.userId,
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                console.log(res.data)
                that.setData({
                    loading: true,
                    bookInfo: res.data["book_info"],
                    cardContent: res.data["card_content"],
                })
                wx.setNavigationBarTitle({ title: res.data["book_info"].book_name })
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    //设置感想内容
    setContent: function (e) {
        var that = this;
        that.setData({
            card_content: e.detail.value
        })
    },

    //设置是否仅自己可见
    setCanSee: function (e) {
        var that = this;
        that.setData({
            can_see: e.detail.value[0] ? e.detail.value[0] : 0
        })
    },

    //上传生成书单
    makeCard: function () {
        var that = this;
        var url, successStr, failStr;
        if (!that.data.card_content) {
            wx.showToast({
                title: '您没有输入感想！',
                icon: 'false',
                duration: 2000
            })
            return;
        }
        if (that.data.cardContent=="none") {
            url = 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=makeCard&user_id=' + app.globalData.userId + "&book_id=" + that.data.book_id + "&card_content=" + that.data.card_content + "&can_see=" + that.data.can_see;
            successStr = "添加成功！";
            failStr = "添加失败，请重试！"
            
        } else {
            url = 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=editCard&user_id=' + app.globalData.userId + "&book_id=" + that.data.book_id + "&card_content=" + that.data.card_content + "&can_see=" + that.data.can_see + "&card_id=" + that.data.cardContent["ID"];
            successStr = "修改成功！";
            failStr = "修改失败，请重试！"
        }
        wx.request({
            url: url,
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                if (res.data == "haveAdded") {
                    // wx.showModal({
                    //     title: '通知',
                    //     content: '您已生成该书卡片，是否再次生成',
                    //     success: function (res) {
                    //         if (res.confirm) {
                    //             wx.request({
                    //                 url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=makeSecondCard&user_id=' + app.globalData.userId + "&book_id=" + that.data.book_id + "&card_content=" + that.data.card_content + "&can_see=" + that.data.can_see,
                    //                 method: "GET",
                    //                 header: {
                    //                     'content-type': 'application/json',
                    //                 },
                    //                 success: function (res) {
                    //                     if (res.data == "success") {
                    //                         wx.showToast({
                    //                             title: '添加成功！',
                    //                             icon: 'false',
                    //                             duration: 2000
                    //                         })
                    //                     } else {
                    //                         wx.showToast({
                    //                             title: '添加失败，请稍后重试！',
                    //                             icon: 'false',
                    //                             duration: 2000
                    //                         })
                    //                     }
                    //                 },
                    //                 fail: function () {
                    //                     wx.showToast({
                    //                         title: '添加失败，请稍后重试！',
                    //                         icon: 'false',
                    //                         duration: 2000
                    //                     })
                    //                 }
                    //             })
                    //         } else if (res.cancel) {

                    //         }
                    //     }
                    // })
                    wx.showToast({
                        title: '您已经生出卡片，无需重复！',
                        icon: 'false',
                        duration: 2000
                    })
                } else if (res.data == "success") {
                    wx.showToast({
                        title: successStr,
                        icon: 'false',
                        duration: 2000
                    })
                } else {
                    wx.showToast({
                        title: failStr,
                        icon: 'false',
                        duration: 2000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: failStr,
                    icon: 'false',
                    duration: 2000
                })
            }
        })


    }
})