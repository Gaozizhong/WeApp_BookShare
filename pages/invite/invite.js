import { $wuxBackdrop } from '../../components/wux'
var app = getApp();
var utils = require('../../utils/util.js');

// pages/invite/invite.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      locks: 0,
      userInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      that.$wuxBackdrop = $wuxBackdrop.init()
      utils.checkSettingStatu(that);
      if(that.data.userInfo){
          that.release()
      }
  },
  retain:function() {
      this.$wuxBackdrop.retain()
      this.setData({
          locks: this.$wuxBackdrop.backdropHolds
      })
  },
  release: function() {
      this.$wuxBackdrop.release()
      this.setData({
          locks: this.$wuxBackdrop.backdropHolds
      })
  },

  
})