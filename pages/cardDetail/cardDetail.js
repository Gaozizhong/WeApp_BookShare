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

    editCardDetail: function () {
        var that = this;
        wx.navigateTo({
            url: '../editCardDetail/editCardDetail?book_id=' + that.data.book_id,
        })
    },
})