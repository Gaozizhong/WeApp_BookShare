var utils = require('../../utils/util.js');
import { $wuxNotification } from '../../components/wux'

//self.js 个人中心首页
//获取应用实例
var app = getApp()
Page({
    data: {
        userInfo: null,
        certificationOk: null,
    },

    onPullDownRefresh :function(){
        utils.getUserData();
        wx.stopPullDownRefresh()
    },
    
    onLoad: function (options) {
        var that = this;
        utils.getUserData(that);  
        that.setData({
            userInfo: app.globalData.userInfo,
            certificationOk: app.globalData.certificationOk,
        })
        
    },
    
    onReady:function(){
        var that = this;
        if (that.data.userInfo){
            if (that.data.certificationOk == 0){
                wx.showModal({
                    title: '认证提醒',
                    content: '您还没有认证',
                    cancelText: "下次再说",
                    cancelColor: "",
                    success: function (res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '../toAuth/toAuth',
                            })
                        }
                    }
                })
            }
            
        }
    },
    onShow: function () {
        var that = this;
        utils.checkSettingStatu(that);
        that.onLoad();
    },

    showNotification: function (image, title, text) {
        this.closeNotification = $wuxNotification.show({
            image: image ? image : 'http://light7.org/assets/img/i-wechat.png',
            title: title ? title : '通知',
            text: text ? text : '通知消息',
            data: {
                message: '逗你玩的!!!'
            },
            time: 3000,
            onClick(data) {
                wx.navigateTo({
                    url: '../toAuth/toAuth',
                })
            },
            onClose(data) {
                console.log(data)
            },
        })
    },

    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    login:function(){
        //认证信息及个人信息切换
        var that = this;
        if (that.data.certificationOk == 2){
            //个人信息页面
            wx.navigateTo({
                url: '../selfInfo/selfInfo',
            })
        }else{
            //去认证页面
            wx.navigateTo({
                url: '../toAuth/toAuth',
            })
        }
        
    },

    openAccount: function (event) {
        //打开我的账户
        wx.navigateTo({
            url: '../myAccount/myAccount',
        })
    },

    openBookList:function(event){
        //打开个人中心图书列表
        var index = event.currentTarget.dataset.index;
        wx.navigateTo({
            url: '../bookList/bookList?index=' + index,
        })
    },

    //自营点上传图书
    uploadPilot: function () {
        if (app.globalData.certificationOk != 2) {
            wx.showToast({
                title: '您还没有进行信息认证！',
                image: '../../images/warning.png',
            })
            return;
        }
        wx.navigateTo({
            url: '../joinShare/joinShare',
        })
    },

    billBoard:function(){
        if (app.globalData.certificationOk != 2) {
            wx.showToast({
                title: '您还没有进行信息认证！',
                image: '../../images/warning.png',
            })
            return;
        }
        //打开邀请页面
        wx.navigateTo({
            url: '../billBoard/billBoard',
        })
    },


    openOpinion:function(){
        //打开意见反馈
        wx.navigateTo({
            url: '../opinion/opinion',
        })
    },

    aboutUs:function(){
        //打开关于我们
        wx.navigateTo({
            url: '../aboutUs/aboutUs',
        })
    },

    openSetting:function(){
        wx.navigateTo({
            url: '../setting/setting',
        })
    },

    openCards:function(){
        wx.navigateTo({
            url: '../card/card',
        })
    },

    /*****仿淘宝布局******/
    //待归还
    returnBack: function () {
        if (app.globalData.certificationOk != 2) {
            wx.showToast({
                title: '您还没有进行信息认证！',
                image: '../../images/warning.png',
            })
            return;
        }
        wx.navigateTo({
            url: '../returnBack/returnBack'
        })
    },
    //收书
    getBook: function () {
        if (app.globalData.certificationOk != 2) {
            wx.showToast({
                title: '您还没有进行信息认证！',
                image: '../../images/warning.png',
            })
            return;
        }
        wx.navigateTo({
            url: '../getBook/getBook'
        })
    },
})
