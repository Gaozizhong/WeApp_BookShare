// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
    /**
     * 页面的初始数据
     */
    data: {
        loading: true,
        owner: new Array("暂无书主！"),
        ownersID: null,
        keepTimes: null,
        index: 0,
        cateisShow: false,
        bookId: null,
        can_share_ids: null,
        openIds:null,
        params:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(params) {
        var bookId = params.bookId;
        var that = this;
        that.setData({
            bookId: bookId,
            params: params
        })
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=getBookInfo&bookId=' + bookId,
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                that.setData({
                    bookInfo: res.data[0],
                    loading: false
                })
                wx.setNavigationBarTitle({ title: res.data[0].book_name })
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

    togglePtype: function () {
        //显示分类
        this.setData({
            cateisShow: !this.data.cateisShow
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        // TODO: onPullDownRefresh
        var params = this.data.params;
        this.onLoad(params);
        wx.stopPullDownRefresh()
    },

    onShareAppMessage() {
        return {
            title: this.data.bookInfo.book_name,
            desc: this.data.introduction,
            path: '/pages/detail/detail?bookId=' + this.data.bookId
        }
    },

    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value
        })
    },

    borrowBook: function () {
        //借书
        var that = this;
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=getBookOwners&bookId=' + that.data.bookId,
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                if (res.data.result == "noPeople") {
                    wx.showToast({
                        title: '暂无书主！',
                        icon: 'false',
                        duration: 2000
                    })
                } else {
                    that.setData({
                        owner: res.data.owners,
                        ownersID: res.data.ownersID,
                        keepTimes: res.data.keepTimes,
                        can_share_ids: res.data.can_share_ids,
                        openIds: res.data.openId
                    })

                }


            },
            fail: function () {
                wx.showToast({
                    title: '获取书主失败，请稍后重试！',
                    icon: 'false',
                    duration: 2000
                })
            }
        })
        that.togglePtype();
    },

    affirmBorrowBook: function (e) {
        var that = this;
        var index = that.data.index;
        var can_share_ids = that.data.can_share_ids;
        var openIds = that.data.openIds;
        var eventData = e;
        console.log(eventData)
        //判断不能借自己书、是否借出
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=affirmBorrowBook&canShareId=' + can_share_ids[index] + '&user_id=' + app.globalData.userId,
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                console.log(res.data[0].result)
                if (res.data[0].result == "sharing") {
                    wx.showToast({
                        title: '图书已借出，请于2017-8-31日后再试',
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
                    
                    var formId = eventData.detail.formId;
                    var url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + app.globalData.access_token;
                    var d = {
                        touser: openIds[index],
                        template_id: 'DLInbgS69GSiBD73whDhNBTUnVvwYukCR88V7DD3ngo',//模板消息id，  
                        page: '/pages/borrowApplication/borrowApplication',
                        form_id: formId,
                        value: {
                            "keyword1": {
                                "value": "339208499",
                                "color": "#173177"
                            },
                            "keyword2": {
                                "value": "2015年01月05日 12:30",
                                "color": "#173177"
                            },
                            "keyword3": {
                                "value": "粤海喜来登酒店",
                                "color": "#173177"
                            },
                            "keyword4": {
                                "value": "广州市天河区天河路208号",
                                "color": "#173177"
                            },
                            "keyword5": {
                                "value": "广州市天河区天河路208号",
                                "color": "#173177"
                            }
                             
                        },
                        color: '#ccc',
                        emphasis_keyword: 'keyword1.DATA'
                    }
                    wx.request({
                        url: url,
                        data: d,
                        method: 'POST',
                        success: function (res) {
                            console.log("push msg");
                            console.log(res);
                        },
                        fail: function (err) {
                            // fail  
                            console.log("push err")
                            console.log(err);
                        }
                    });
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
})
