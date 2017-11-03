var app =getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this 
    wx.request({
        url: ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getCardList&userId=' + app.globalData.userId).replace(/\s+/g, ""),
        method: "GET",
        success: function (res) {
            if (res.data == "noCard"){
                wx.showToast({
                    title: '您还没有添加过！',
                    image: '../../images/warning.png',
                    duration: 2000
                })
            }else{
                that.setData({
                    bookObj: res.data,
                    loading: false
                })  
            }
            that.setData({
                loading: false,
            })
        },
        fail: function () {
            wx.showToast({
                title: '获取数据失败，请稍后重试！',
                image: '../../images/fail.png',
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
      this.onLoad();
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

  //打开卡片详情
  openCardDetail:function(e){
      var bookId = e.currentTarget.dataset.bookid;;
      wx.navigateTo({
          url: '../cardDetail/cardDetail?book_id=' + bookId,
      })
  },

})