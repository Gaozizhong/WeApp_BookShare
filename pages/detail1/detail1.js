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