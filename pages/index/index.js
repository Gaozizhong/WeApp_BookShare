//index.js
//获取应用实例
var screenNum = 3;
var app = getApp()
Page({
    data: {
        cateisShow: false,
        activeNum: 1,
        loading: true,
        bookObj:null,
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
        wx.login({
            success: function (res) {
                if (res.code) {
                    //请求access_token
                    wx.request({
                        url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=User&a=getSessionKey&code=' + res.code,
                        success: function (res) {
                            app.globalData.session_key = res.data.session_key
                            app.globalData.openId = res.data.openid
                            //获取个人信息
                            wx.getUserInfo({
                                success: function (res) {
                                    var res = JSON.parse(res.rawData);//eval('(' + res.rawData + ')');
                                    //存入storage
                                    wx.setStorage({
                                        key: 'userInfo',
                                        data: res,
                                    })
                                    //创建账号到数据库
                                    wx.request({
                                        url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=User&a=regiser&avatarUrl=' + res.avatarUrl + "&city=" + res.city + "&country=" + res.country + "&gender=" + res.gender + "&nickName=" + res.nickName + "&province=" + res.province + "&openId=" + app.globalData.openId,
                                        dataType: "JSON",
                                        success: function (res) {
                                            app.globalData.userId = res.data;
                                        }
                                    })
                                }
                            })
                        }
                    })
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        });
        //图书列表数据获取
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=bookList',
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                that.setData({
                    bookObj: res.data,
                    loading:false
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

    onReady: function () {

    },

    changeTab: function (event) {
        //切换筛选tab
        var num = event.target.dataset.id;
        this.setData({
            activeNum: num
        })
    },

    screenISBN: function () {
        //扫描ISBN
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
                }
            }
        })
    },

    detail: function (event) {
        var bookId = event.currentTarget.dataset.bookid;
        //打开详情页
        wx.navigateTo({
            url: '../detail/detail?bookId=' + bookId,
        })
    },
    
    togglePtype: function () {
        //显示分类
        this.setData({
            cateisShow: !this.data.cateisShow
        })
    },
})
