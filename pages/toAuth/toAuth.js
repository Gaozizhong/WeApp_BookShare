//toAuth.js 认证页面
//获取应用实例
var app = getApp()
Page({
    data: {
        userInfo: {},
        loading: true,
        schoolIndex: 0,
        majorIndex: 0,
        school: new Array("请选择", "河北工业大学", "天津工业大学", "河北经贸大学"),
        major: new Array("请选择", "工商管理", "网络工程", "软件工程")
    },
    onLoad: function () {
        
    },
    onReady: function () {
        this.setData({
            loading: false
        })
    },

    bindPickerSchoolChange: function (e) {
        //学校切换
        this.setData({
            schoolIndex: e.detail.value
        })
    },

    bindPickerMajorChange: function (e) {
        //专业切换
        this.setData({
            majorIndex: e.detail.value
        })
    },

    toAuth: function () {
        wx.navigateTo({
            url: '../toAuth/toAuth',
        })
    }
})
