// pages/comment/comment.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
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
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

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
        console.log("得" + key1 + "分")
        this.setData({
            key1: key1
        })

    },
    //点击左边,整颗星
    selectRight1: function (e) {
        var key1 = e.currentTarget.dataset.key
        console.log("得" + key1 + "分")
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
        console.log("得" + key2 + "分")
        this.setData({
            key2: key2
        })

    },
    //点击左边,整颗星
    selectRight2: function (e) {
        var key2 = e.currentTarget.dataset.key
        console.log("得" + key2 + "分")
        this.setData({
            key2: key2
        })
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
        console.log("得" + key3 + "分")
        this.setData({
            key3: key3
        })

    },
    //点击左边,整颗星
    selectRight3: function (e) {
        var key3 = e.currentTarget.dataset.key
        console.log("得" + key3 + "分")
        this.setData({
            key3: key3
        })
    },
})