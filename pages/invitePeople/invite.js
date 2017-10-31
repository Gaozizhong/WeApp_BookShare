
var app = getApp();
var utils = require('../../utils/util.js');

// pages/invite/invite.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            "id": options.id,
            "invite": options.invite,
            "inviteName": options.inviteName
        })
        // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.userInfo']) {
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success() {
                            // 用户已经同意小程序授权，后续调用 wx.getUserInfo 接口不会弹窗询问
                            wx.getUserInfo({
                                success: function (res) {
                                    utils.getUserData(that);
                                    
                                }
                            })
                            
                        }
                    })
                }
                
            }
        })
        utils.getUserData(that);
        console.log(that.data)
    },
    onShow: function () {
        var that = this;
        that.onLoad(that.data);
    },

    submitInvite:function(){
        var that = this;
        if (that.data.id == that.data.userInfo.ID){
            wx.showModal({
                title: '警告',
                content: '不能邀请自己',
                showCancel: "false",
            })
            return ;
        }
        if (!that.data.invite || !that.data.userInfo.ID){
            wx.showModal({
                title: '警告',
                content: '你还有信息未输入',
                showCancel:"false",
            })
            return ;
        }
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=User&a=setInvite&id=' + that.data.userInfo.ID + "&invited=" + that.data.invite + "&inviteId=" + that.data.id,
            method: "GET",
            dataType: "json",
            success: function (res) {
                if (res) {
                    if (res.data == "success") {
                        wx.showModal({
                            title: '注册成功',
                            content: '注册成功，是否跳转至首页？',
                            success: function (res) {
                                if (res.confirm) {
                                    wx.navigateTo({
                                        url: '../index/index'
                                    })
                                }
                            }
                        })
                    }else if(res.data == "invited"){
                        wx.showToast({
                            title: '您已经被邀请过了',
                            image: '../../images/fail.png',
                            duration: 2000
                        })
                    }
                    
                } else {
                    wx.showToast({
                        title: '获取数据失败，请重试！',
                        image: '../../images/fail.png',
                        duration: 2000
                    })
                }
            }
        })
    }


})