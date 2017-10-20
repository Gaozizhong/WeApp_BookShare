import { $wuxBackdrop } from '../../components/wux'
var app = getApp()
Page({
    data: {
        locks: 0,
        userInfo: null,
        userData:new Array(),
        selfNum:null
    },
    onLoad() {
        var that = this;
        this.$wuxBackdrop = $wuxBackdrop.init()
        // this.retain()
        this.setData({
            userInfo: app.globalData.userInfo,
        })
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=User&a=getTopInvite&id=' + app.globalData.userId,
            method: "GET",
            dataType: "json",
            success: function (res) {
                if (res) {
                    that.setData({
                        userData: res.data[0],
                        selfNum: res.data[1][0]["selfNum"]
                    })
                    console.log(that.data.selfNum)

                } else {
                    wx.showToast({
                        title: '获取数据失败，请重试！',
                        icon: 'success',
                        duration: 2000
                    })
                }
            }
        })

    },
    onShareAppMessage() {
        return {
            title: "邀请好友，共同获得积分",
            desc: "邀请好友，共同获得积分,共同阅读！",
            path: '/pages/invite/invite?id=' + app.globalData.userId
        }
    },
    retain() {
        this.$wuxBackdrop.retain()
        this.setData({
            locks: this.$wuxBackdrop.backdropHolds
        })
    },
    release() {
        this.$wuxBackdrop.release()
        this.setData({
            locks: this.$wuxBackdrop.backdropHolds
        })
    },
    getInviteCode:function(){
        var that = this;
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=User&a=createInvite&id=' + app.globalData.userId,
            method:"GET",
            dataType:"text",
            success:function(res){
                if (res.data!="fail"){
                    that.setData({
                        invite: res.data
                    })
                }else{
                    wx.showToast({
                        title: '生成失败，请重试！',
                        icon: 'success',
                        duration: 2000
                    })
                }
            }
        })
    }
})