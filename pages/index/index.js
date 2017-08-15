//index.js
//获取应用实例
var screenNum = 3;
var app = getApp()
Page({
  data: {
    motto: '欢 迎 来 到 BookShare！',
    userInfo: {},
    cateisShow: false,
    activeNum:1
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onPullDownRefresh: function () {
      //监听页面刷新
      wx.stopPullDownRefresh()
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  onReady:function(){
      
  },
  changeTab: function (event){
      //切换筛选tab
      console.log(event);
      var num = event.target.dataset.id;
      this.setData({
          activeNum: num
      })
  },
  screenISBN: function(){
      //扫描ISBN
      wx.scanCode({
          success: (res) => {
              console.log(res)
              if(res.errMsg == "scanCode:ok"){
                  //扫描成功
                  if(res.scanType == "EAN_13"){
                        //条形码
                        var isbnCode = res.result;
                        console.log(isbnCode);
                        wx.navigateTo({
                            url: '../share/share?isbn=' + isbnCode,
                        })

                        // wx.request({
                        //     url: 'https://api.douban.com/v2/book/isbn/' + isbnCode,
                        //     header: {
                        //         'content-type': 'json'
                        //     },
                        //     success: function (res) {
                        //         console.log(res.data)
                        //     }
                        // })
                  }else{
                        wx.showToast({
                            title: '条形码有误！',
                        })
                  }
              }
          }
      })
  },
  detail: function(){
      //打开详情页
      wx.navigateTo({
          url: '../detail/detail',
      })
  },
  togglePtype: function () {
      //显示分类
      this.setData({
          cateisShow: !this.data.cateisShow
      })
  },
})
