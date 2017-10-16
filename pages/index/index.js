var utils = require('../../utils/util.js');
//index.js
//获取应用实例
var screenNum = 3;
var app = getApp()
Page({
    data: {
        cateisShow: false,
        activeNum: 1,
        loading: true,
        bookObj: null,
    },

    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    onPullDownRefresh: function () {
        //监听页面刷新
        this.onLoad()
        wx.stopPullDownRefresh()
    },

    onLoad: function () {
        var that = this;
        utils.getUserData();
        that.getBookList();
    },

    //设置搜索内容
    setSearchValue: function (e) {
        var that = this;
        that.setData({
            searchValue: e.detail.value
        })
    },

    //获取图书列表
    getBookList:function(){
        var that = this 
        var url = 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=bookList&screen=' + that.data.activeNum;
        if (that.data.searchValue){
            url += "&value=";
            url += that.data.searchValue;
        }
        //图书列表数据获取
        wx.request({
            url: url,
            method: "GET",
            success: function (res) {
                that.setData({
                    bookObj: res.data,
                    loading: false
                })
            },
            fail: function () {
                wx.showToast({
                    title: '获取数据失败，请稍后重试！',
                    icon: 'false',
                    duration: 2000
                })
            }
        })
    },

    onShow: function (){
        this.onLoad();
    },

    changeTab: function (event) {
        //切换筛选tab
        var num = event.target.dataset.id;
        this.setData({
            activeNum: num
        })
        this.getBookList()
    },

    screenISBN: function () {
        if (app.globalData.certificationOk != 2){
            wx.showToast({
                title: '您还没有进行信息认证！',
            })
            return ;
        }
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

    detail: function (event) {
        var bookId = event.currentTarget.dataset.bookid;
        var canShareId = event.currentTarget.dataset.canshareid;
        var book_type = event.currentTarget.dataset.type;//type 为1时自营点 为0时C2C
        //打开详情页
        wx.navigateTo({
            url: '../detail/detail?bookId=' + bookId + "&canShareId=" + canShareId + "&book_type=" + book_type,
        })
    },

    togglePtype: function () {
        //显示分类
        this.setData({
            cateisShow: !this.data.cateisShow
        })
    },

    checkDetail:function(){
        
    }
})
