//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        borrowIn: null
    },

    onLoad: function () {
        var that = this;
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=getBorrowIn&userId=' + app.globalData.userId,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "noBorrowIn") {
                    wx.showToast({
                        title: '您还没有借过书！',
                        icon: 'false',
                        duration: 2000
                    })
                } else {
                    that.setData({
                        borrowIn: res.data
                    })
                }
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

    agreeApply: function (e) {
        var formId = e.detail.formId;
        var sharingId = e.currentTarget.dataset.sharingid;
        var openId = e.currentTarget.dataset.openid;
        var agreeCode = e.currentTarget.dataset.agree;
        var title1; var title2;
        if (agreeCode == 1) {
            title1 = "借出成功";
            title2 = "同意失败，请稍后重试";
        } else {
            title1 = "拒绝成功";
            title2 = "拒绝失败，请稍后重试";
        }
        console.log(e);
        // var url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + app.globalData.access_token;
        // var d = {
        //     touser: sharingId,
        //     template_id: 'DLInbgS69GSiBD73whDhNBTUnVvwYukCR88V7DD3ngo',//模板消息id，  
        //     page: '/pages/borrowApplication/borrowApplication',
        //     form_id: formId,
        //     value: {
        //         "keyword1": {
        //             "value": "339208499",
        //             "color": "#173177"
        //         },
        //         "keyword2": {
        //             "value": "2015年01月05日 12:30",
        //             "color": "#173177"
        //         },
        //         "keyword3": {
        //             "value": "粤海喜来登酒店",
        //             "color": "#173177"
        //         },
        //         "keyword4": {
        //             "value": "广州市天河区天河路208号",
        //             "color": "#173177"
        //         },
        //         "keyword5": {
        //             "value": "广州市天河区天河路208号",
        //             "color": "#173177"
        //         }

        //     },
        //     color: '#ccc',
        //     emphasis_keyword: 'keyword1.DATA'
        // }
        // wx.request({
        //     url: url,
        //     data: d,
        //     method: 'POST',
        //     success: function (res) {
        //         console.log("push msg");
        //         console.log(res);
        //     },
        //     fail: function (err) {
        //         // fail  
        //         console.log("push err")
        //         console.log(err);
        //     }
        // });

        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=agreeApplication&sharingId=' + sharingId + "&ifAgree=" + agreeCode,
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res.data)
                if (res.data == "agreed") {
                    wx.showToast({
                        title: '已同意借出，无需重复！',
                        icon: 'false',
                        duration: 2000
                    })
                } else if (res.data == "refused") {
                    wx.showToast({
                        title: '已拒绝借出，无需重复操作！',
                        icon: 'true',
                        duration: 2000
                    })
                } else if (res.data == "success") {
                    wx.showToast({
                        title: title1,
                        icon: 'true',
                        duration: 2000
                    })
                } else if (res.data == "fail") {
                    wx.showToast({
                        title: title2,
                        icon: 'true',
                        duration: 2000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: title2,
                    icon: 'false',
                    duration: 2000
                })
            }
        })

    }

})
