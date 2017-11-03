// pages/bookInfo/bookInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      stars: [0, 1, 2, 3, 4],
      normalSrc: '../../images/normal.png',
      selectedSrc: '../../images/selected.png',
      halfSrc: '../../images/half.png',
      key1: 5,//评分
  
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

  borrowBook: function (e) {
      //借书
      var that = this;
      var canShareId = that.data.canShareId;
      var book_type = that.data.book_type;
      var checkStatus = that.data.bookInfo.protect;//信息保护

      //C2C借书
      if (checkStatus == 1) {
          //开启信息保护
          that.togglePtype();
      } else {
          //判断不能借自己书、是否借出
          wx.request({
              url: ('https://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=affirmBorrowBook&canShareId=' + canShareId + '&user_id=' + app.globalData.userId + "&protect=0").replace(/\s+/g, ""),
              method: "GET",
              header: {
                  'content-type': 'application/json',
              },
              success: function (res) {
                  if (res.data[0].result == "sharing") {
                      wx.showToast({
                          title: '图书已被借出！',
                          icon: 'false',
                          image: '../../images/warning.png',
                          duration: 2000
                      })
                  } else if (res.data[0].result == "fail") {
                      wx.showToast({
                          title: '借书失败，请稍后重试！',
                          icon: 'false',
                          image: '../../images/fail.png',
                          duration: 2000
                      })
                  } else if (res.data[0].result == "success") {
                      if (book_type == 0) {
                          wx.showModal({
                              title: '通知',
                              content: '书主关闭了借书申请，您可以直接联系他！',
                              success: function (res) {
                                  if (res.confirm) {
                                      wx.makePhoneCall({
                                          phoneNumber: that.data.bookInfo.phoneNumber //仅为示例，并非真实的电话号码
                                      })
                                  } else if (res.cancel) {
                                      wx.showModal({
                                          title: '通知',
                                          content: '您可以前往借入界面联系书主',
                                          showCancel: false,
                                          success: function (res) {
                                              if (res.confirm) {

                                              } else if (res.cancel) {

                                              }
                                          }
                                      })
                                  }
                              }
                          })
                      } else {
                          //自营点借书成功提示
                          wx.showModal({
                              title: '通知',
                              content: '借入成功，你需要前往此自营点借书！',
                              success: function (res) {
                                  if (res.confirm) {

                                  } else if (res.cancel) {

                                  }
                              }
                          })
                      }

                  } else if (res.data[0].result == "mine") {
                      wx.showToast({
                          title: '您不能借自己的书！',
                          image: '../../images/warning.png',
                          duration: 2000
                      })
                  }
              },
              fail: function () {
                  wx.showToast({
                      title: '借书失败，请稍后重试！',
                      image: '../../images/fail.png',
                      duration: 2000
                  })
              }
          })
      }
  },



  affirmBorrowBook: function (e) {
      var that = this;
      var canShareId = that.data.canShareId;
      var openIds = that.data.openIds;
      var eventData = e;

      //判断不能借自己书、是否借出
      wx.request({
          url: ('https://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=affirmBorrowBook&canShareId=' + canShareId + '&user_id=' + app.globalData.userId).replace(/\s+/g, ""),
          method: "GET",
          header: {
              'content-type': 'application/json',
          },
          success: function (res) {
              if (res.data[0].result == "sharing") {

                  wx.showToast({
                      title: '图书已被借出！',
                      icon: 'false',
                      duration: 2000
                  })
              } else if (res.data[0].result == "fail") {
                  wx.showToast({
                      title: '借书失败，请稍后重试！',
                      icon: 'false',
                      duration: 2000
                  })
              } else if (res.data[0].result == "success") {
                  wx.showToast({
                      title: '申请成功，等书主确认！',
                      icon: 'false',
                      duration: 2000
                  })

              } else if (res.data[0].result == "mine") {
                  wx.showToast({
                      title: '您不能借自己的书！',
                      icon: 'false',
                      duration: 2000
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
  },
  //打开读书卡片页面
  writeCard: function () {
      var that = this
      //添加至public_booklist 我看过的
      wx.request({
          url: ('https://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=addSeenBook&user_id=' + app.globalData.userId + "&book_id=" + that.data.bookInfo.book_id + "&type=1").replace(/\s+/g, ""),
          method: "GET",
          header: {
              'content-type': 'application/json',
          },
          success: function (res) {
              if (res.data == "success") {
                  that.setData({
                      haveRead: 1
                  })
                  wx.navigateTo({
                      url: '../cardDetail/cardDetail?book_id=' + that.data.bookInfo.book_id,
                  })
                  wx.showToast({
                      title: '添加成功！',
                      icon: 'false',
                      duration: 2000
                  })
              } else if (res.data == "haveAdded") {
                  wx.showToast({
                      title: '您也添加过！',
                      icon: 'false',
                      duration: 2000
                  })
              }
          },
          fail: function () {
              wx.showToast({
                  title: '添加失败，请稍后重试！',
                  icon: 'false',
                  duration: 2000
              })
          }
      })
  },

  //取消我看过的
  cancelSeen: function () {
      var that = this
      wx.showModal({
          title: '通知',
          content: '您确定要取消看过吗？',
          success: function (res) {
              if (res.confirm) {
                  wx.request({
                      url: ('https://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=cancelSeenBook&user_id=' + app.globalData.userId + "&book_id=" + that.data.bookInfo.book_id + "&type=1").replace(/\s+/g, ""),
                      method: "GET",
                      header: {
                          'content-type': 'application/json',
                      },
                      success: function (res) {
                          if (res.data == "success") {
                              wx.showToast({
                                  title: '取消成功！',
                                  icon: 'false',
                                  duration: 2000
                              })
                              that.setData({
                                  haveRead: 0
                              })
                          } else {
                              wx.showToast({
                                  title: '取消失败',
                                  icon: 'false',
                                  duration: 2000
                              })
                          }
                      },
                      fail: function () {
                          wx.showToast({
                              title: '取消失败，请稍后重试！',
                              icon: 'false',
                              duration: 2000
                          })
                      }
                  })
              }
          }
      })

  },

  //添加志public_booklist 我喜欢的
  addLove: function () {
      var that = this
      //添加至public_booklist 我看过的
      wx.request({
          url: ('https://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=addSeenBook&user_id=' + app.globalData.userId + "&book_id=" + that.data.bookInfo.book_id + "&type=2").replace(/\s+/g, ""),
          method: "GET",
          header: {
              'content-type': 'application/json',
          },
          success: function (res) {
              if (res.data == "success") {
                  wx.showToast({
                      title: '成功添加至喜欢！',
                      icon: 'false',
                      duration: 2000
                  })
                  that.setData({
                      haveLoved: 1
                  })
              } else if (res.data == "haveAdded") {
                  wx.showToast({
                      title: '您已添加过！',
                      icon: 'false',
                      duration: 2000
                  })
              }
          },
          fail: function () {
              wx.showToast({
                  title: '添加失败，请稍后重试！',
                  icon: 'false',
                  duration: 2000
              })
          }
      })
  },

  //取消喜欢
  cancelLove: function () {
      var that = this
      wx.showModal({
          title: '通知',
          content: '您确定要取消喜欢吗？（取消可能会错过信息哦）',
          success: function (res) {
              if (res.confirm) {
                  wx.request({
                      url: ('https://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=cancelSeenBook&user_id=' + app.globalData.userId + "&book_id=" + that.data.bookInfo.book_id + "&type=2").replace(/\s+/g, ""),
                      method: "GET",
                      header: {
                          'content-type': 'application/json',
                      },
                      success: function (res) {
                          if (res.data == "success") {
                              wx.showToast({
                                  title: '取消成功！',
                                  icon: 'false',
                                  duration: 2000
                              })
                              that.setData({
                                  haveLoved: 0
                              })
                          } else {
                              wx.showToast({
                                  title: '取消失败',
                                  icon: 'false',
                                  duration: 2000
                              })
                          }
                      },
                      fail: function () {
                          wx.showToast({
                              title: '取消失败，请稍后重试！',
                              icon: 'false',
                              duration: 2000
                          })
                      }
                  })
              }
          }
      })
  },
})