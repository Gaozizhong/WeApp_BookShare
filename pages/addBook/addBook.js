// pages/addBook/addBook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      items: [
          { name: 'USA', value: '美国' },
        //   { name: 'CHN', value: '中国', checked: 'true' },
          { name: 'CHN', value: '中国' },
          { name: 'BRA', value: '巴西' },
      ]
  
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

  screenISBN: function () {
      wx.getSetting({
          success(res) {
              if (res.authSetting['scope.userInfo']) {
                  //已授权 扫描ISBN
                  wx.scanCode({
                      success: (res) => {
                          if (res.errMsg == "scanCode:ok") {
                              //扫描成功
                              if (res.scanType == "EAN_13") {
                                  //条形码
                                  var isbnCode = res.result;
                                  wx.navigateTo({
                                      url: '../share/share?isbn=' + isbnCode,
                                  })
                              } else {
                                  wx.showToast({
                                      title: '条形码有误！',
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
})