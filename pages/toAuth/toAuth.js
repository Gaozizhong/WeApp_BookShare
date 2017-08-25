//toAuth.js 认证页面
//获取应用实例
var app = getApp()
Page({
    data: {
        userInfo: {},
        loading: true,
        schoolIndex: 0,
        school: new Array("请选择", "河北工业大学"),
        schoolId: new Array("noSelect", "969"),
        cateisShow: false,//弹出框
        pictureFiles: null,
        hidden: false,
        //认证信息
        userName:null,
        phoneNumber:null,
        userSchool:null,
        userClass:null,
        studentCard:null
    },
    onLoad: function () {
        var that = this;

        wx.setNavigationBarTitle({ title: '个人认证' })
        wx.request({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=getSchoolList',
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
                    school: res.data.school,
                    schoolId: res.data.schoolId
                })
            }
        })
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

    togglePtype: function () {
        //显示分类
        this.setData({
            cateisShow: !this.data.cateisShow
        })
    },

    chooseImage: function () {
        var that = this;
        //选择校园卡或者教工卡
        wx.chooseImage({
            count: 1,
            success: function (res) {
                if (res.errMsg == "chooseImage:ok") {
                    that.setData({
                        pictureFiles: res.tempFilePaths,
                        hidden: true
                    })
                } else {
                    wx.showToast({
                        title: '选择照片失败，请重试',
                        icon: 'false',
                        duration: 2000
                    })
                }
                //that.togglePtype()
            }
        })
    },

    pictureView: function (e) {
        // var current = e.target.dataset.src
        // wx.previewImage({
        //     current: current,
        //     urls: ["1.png", "2.png"],
        //     fail: function () {
        //         console.log('fail')
        //     },
        //     complete: function () {
        //         console.info("点击图片了");
        //     },
        // })
        console.log("123")
    },

    changePicture: function (e) {
        //长按切换照片
        var that = this;
        var index = e.target.dataset.index;
        wx.showActionSheet({
            itemList: ['更改图片', '删除'],
            success: function (res) {
                console.log(res.tapIndex)
                if (res.tapIndex == "0") {
                    wx.chooseImage({
                        count: 1,
                        success: function (res) {
                            if (res.errMsg == "chooseImage:ok") {
                                that.setData({
                                    pictureFiles: res.tempFilePaths,
                                    hidden: true
                                })
                            } else {
                                wx.showToast({
                                    title: '选择照片失败，请重试',
                                    icon: 'false',
                                    duration: 2000
                                })
                            }
                            // that.togglePtype()
                        }
                    })
                } else if (res.tapIndex == "1") {
                    that.setData({
                        pictureFiles: null,
                        hidden: false
                    })
                }
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })

    },

    setName: function (e) {
        //真实姓名
        var that = this;
        that.setData({
            userName: e.detail.value
        })
    },

    setMajor: function (e) {
        //专业班级
        var that = this;
        that.setData({
            userClass: e.detail.value
        })
    },

    setPhone: function (e) {
        //联系方式
        var that = this;
        that.setData({
            phoneNumber: e.detail.value
        })
    },

    setCardId: function (e) {
        //学号
        var that = this;
        that.setData({
            studentCard: e.detail.value
        })
    },

    toAuth: function () {
        //提交信息
        var that = this;
        var thatData = that.data;
        var schoolIndex = that.data.schoolIndex;
        var formData = {
            "ID": app.globalData.userId,
            'userName': that.data.userName,
            'phoneNumber': that.data.phoneNumber,
            'userSchool': that.data.school[schoolIndex],
            'userClass': that.data.userClass,
            "studentCard": that.data.studentCard
        };
        console.log(formData)
        if (!thatData.userName || !thatData.phoneNumber || !thatData.userClass || !thatData.studentCard){
            wx.showToast({
                title: '你是不是忘记填了点什么！',
                icon: 'false',
                duration: 2000
            })
            return ;
        }
        if (!thatData.pictureFiles){
            wx.showToast({
                title: '你是不是忘记选择照片了！',
                icon: 'false',
                duration: 2000
            })
            return;
        }
        wx.uploadFile({
            url: 'http://' + app.globalData.apiUrl + '/bookshare?m=home&c=User&a=selfAuth',
            filePath: that.data.pictureFiles[0],
            name: 'authPic',//app.globalData.userId+
            formData: {
                "ID": app.globalData.userId,
                'userName': that.data.userName,
                'phoneNumber': that.data.phoneNumber,
                'userSchool': that.data.school[schoolIndex],
                'userClass': that.data.userClass,
                "studentCard": that.data.studentCard
            },
            header: {
                'content-type': 'multipart/form-data'
            }, // 设置请求的 header
            success: function (res) {
                var data = res.data
                console.log(res)
                //do something
            }
        })
    }

})
