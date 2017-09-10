var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      items:null,
      refuse_reason:null,//取消原因ID
      refuse_content:null,//其他取消原因
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this; 
        that.setData({
            sharingId: options.sharingId,
            canShareId: options.canShareId
        })
        wx.request({
          url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=getBorrowCancelReason',
          method: "GET",
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            that.setData({
              items: res.data
            })
          },
          fail: function () {
            wx.showToast({
              title: '取消失败，请稍后重试',
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

    //取消借书
    cancelBorrow: function () {
        var that = this;
        wx.request({
          url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=cancelBorrow&sharingId=' + that.data.sharingId + "&canShareId=" + that.data.canShareId + "&refuse_reason=" + that.data.refuse_reason+"&refuse_content="+that.data.refuse_content,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "canceled") {
                    wx.showToast({
                        title: '已取消借书，无需重复！',
                        icon: 'false',
                        duration: 2000
                    })
                } else if (res.data == "success") {
                    wx.showToast({
                        title: '取消成功',
                        icon: 'true',
                        duration: 2000
                    })
                } else if (res.data == "fail") {
                    wx.showToast({
                        title: '取消失败，请稍后重试',
                        icon: 'true',
                        duration: 2000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '取消失败，请稍后重试',
                    icon: 'false',
                    duration: 2000
                })
            }
        })
    },
    checkboxChange: function (e) {
      var that = this;
      //console.log('checkbox发生change事件，携带value值为：', e.detail.value)
      var array = e.detail.value,str = '';
      for(var i = 0;i<array.length;i++){
        str += array[i]+',';
      }
      that.setData({
        refuse_reason:str
      })
    },

    //填写其他原因
    setRefuseContent:function(e){
      var that = this;
      that.setData({
        refuse_content: e.detail.value
      })
    }
})