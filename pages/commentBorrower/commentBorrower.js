var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: false,
        disabled: false,
        flag1: 5,
        flag2: 5,
        flag3: 5,

        stars: [0, 1, 2, 3, 4],
        normalSrc: '../../images/normal.png',
        selectedSrc: '../../images/selected.png',
        halfSrc: '../../images/half.png',
        key1: 5,//评分
        key2: 5,//评分
        key3: 5,//评分
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var sharingId = options.sharingId;
        var bookId = options.bookId;
        var that = this;
        that.setData({
            sharingId: sharingId,
            bookId: bookId,
        })
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getBookInfo&bookId=' + bookId,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
                    bookInfo: res.data[0],
                    loading: true
                })
            },
            fail: function () {
                wx.showToast({
                    title: '获取数据失败，请重试',
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
     * 书主态度
     */
    selectLeft1: function (e) {
        var key1 = e.currentTarget.dataset.key
        if (this.data.key1 == 0.5 && e.currentTarget.dataset.key == 0.5) {
            //只有一颗星的时候,再次点击,变为0颗
            key1 = 0;
        }
        this.setData({
            key1: key1
        })

    },
    //点击左边,整颗星
    selectRight1: function (e) {
        var key1 = e.currentTarget.dataset.key
        this.setData({
            key1: key1
        })
    },
    /**
     * 图书质量
     */
    selectLeft2: function (e) {
        var key2 = e.currentTarget.dataset.key
        if (this.data.key2 == 0.5 && e.currentTarget.dataset.key == 0.5) {
            //只有一颗星的时候,再次点击,变为0颗
            key2 = 0;
        }
        this.setData({
            key2: key2
        })

    },
    //点击左边,整颗星
    selectRight2: function (e) {
        var key2 = e.currentTarget.dataset.key
        this.setData({
            key2: key2
        })
    },
    
    setCardContent: function (e) {
        var that = this;
        that.setData({
            card_content: e.detail.value
        })
    },

    //对借书人评价
    comment: function () {
        var that = this;
        that.setData({
            disabled: true
        })
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=borrowComment&sharingId=' + that.data.sharingId + "&borrower_attitude=" + that.data.key1 + "&book_protect=" + that.data.key2 + "&borrower_content="  + that.data.card_content,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "success") {
                    wx.showToast({
                        title: '评论成功',
                        icon: 'false',
                        duration: 2000
                    })
                    wx.navigateBack({
                        delta: 1
                    })
                } else if (res.data == "fail") {
                    wx.showToast({
                        title: '评论失败，请重试！',
                        icon: 'false',
                        duration: 2000
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
})