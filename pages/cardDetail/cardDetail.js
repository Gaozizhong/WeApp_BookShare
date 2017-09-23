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
        can_see: 0,

        stars: [0, 1, 2, 3, 4],
        normalSrc: '../../images/normal.png',
        selectedSrc: '../../images/selected.png',
        halfSrc: '../../images/half.png',
        key3: 5,//评分
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
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getCardDetail&bookId=' + options.book_id + "&userId=" + app.globalData.userId,
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                that.setData({
                    loading: true,
                    bookInfo: res.data["book_info"],
                    cardContent: res.data["card_content"],
                    cardInfo: res.data["card_content"]["card_content"],
                    key3: res.data["card_content"]["book_content"]
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

    /**
     * 图书内容
     */
    selectLeft3: function (e) {
        var key3 = e.currentTarget.dataset.key
        if (this.data.key3 == 0.5 && e.currentTarget.dataset.key == 0.5) {
            //只有一颗星的时候,再次点击,变为0颗
            key3 = 0;
        }
        this.setData({
            key3: key3
        })

    },
    //点击左边,整颗星
    selectRight3: function (e) {
        var key3 = e.currentTarget.dataset.key
        this.setData({
            key3: key3
        })
    },

    //设置感想内容
    setContent: function (e) {
        var that = this;
        that.setData({
            cardInfo: e.detail.value
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
        if (!that.data.cardInfo) {
            wx.showToast({
                title: '您没有输入感想！',
                icon: 'false',
                duration: 2000
            })
            return;
        }
        if (that.data.cardContent=="none") {
            url = 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=makeCard&user_id=' + app.globalData.userId + "&book_id=" + that.data.book_id + "&card_content=" + that.data.cardInfo + "&can_see=" + that.data.can_see +"&book_content="+that.data.key3;
            successStr = "添加成功！";
            failStr = "添加失败，请重试！"
            
        } else {
            url = 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=editCard&user_id=' + app.globalData.userId + "&book_id=" + that.data.book_id + "&card_content=" + that.data.cardInfo + "&can_see=" + that.data.can_see + "&card_id=" + that.data.cardContent["ID"] + "&book_content=" + that.data.key3;
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
                    //                 url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=makeSecondCard&user_id=' + app.globalData.userId + "&book_id=" + that.data.book_id + "&card_content=" + that.data.card_content + "&can_see=" + that.data.can_see,
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
                    wx.navigateBack({
                        delta:1
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