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
        index:0,
        cateisShow: false,
        bookId:null,
        can_share_ids:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(params) {
        var bookId = params.bookId;
        var that = this;
        that.setData({
            bookId: bookId
        })
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=getBookInfo&bookId=' + bookId,
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                that.setData({
                    bookInfo:res.data[0],
                    loading:false
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
    },

    onShareAppMessage() {
        return {
            title: '自定义分享标题',
            desc: '自定义分享描述',
            path: '/pages/item?id=' + this.data.id
        }
    },

    bindPickerChange:function(e){
        this.setData({
            index: e.detail.value
        })
    },

    borrowBook:function(){
        //借书
        var that = this;
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=getBookOwners&bookId=' + that.data.bookId,
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                if (res.data.result == "noPeople"){
                    wx.showToast({
                        title: '暂无书主！',
                        icon: 'false',
                        duration: 2000
                    })
                }else{
                    that.setData({
                        owner: res.data.owners,
                        ownersID: res.data.ownersID,
                        keepTimes: res.data.keepTimes,
                        can_share_ids: res.data.can_share_ids
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

    affirmBorrowBook:function(){
        var that = this;
        var index = that.data.index;
        var can_share_ids = that.data.can_share_ids;
        
        //判断不能借自己书、是否借出
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=affirmBorrowBook&canShareId=' + can_share_ids[index]+'&user_id=' + app.globalData.userId,
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                console.log(res.data[0].result)
                if(res.data[0].result == "sharing"){
                    wx.showToast({
                        title: '图书已借出，请于2017-8-31日后再试',
                        icon: 'false',
                        duration: 2000
                    })
                } else if (res.data[0].result == "fail"){
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
    }
})
