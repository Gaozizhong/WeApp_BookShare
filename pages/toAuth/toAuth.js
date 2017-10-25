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
        studentCard:null,
        changePic:false //是否切换了图片
    },
    onLoad: function () {
        var that = this;
        wx.setNavigationBarTitle({ title: '个人认证' });

        //等待认证获取详情
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=User&a=getUserInfo&id=' + app.globalData.userId,
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                app.globalData.userInfo = res.data[0];
                that.setData({
                    userInfo: res.data[0],
                    pictureFiles: 'https://'+app.globalData.apiUrl+res.data[0]["authPic"],
                    userName: res.data[0]["userName"],
                    phoneNumber: res.data[0]["phoneNumber"],
                    userSchool: res.data[0]["userSchool"],
                    userClass: res.data[0]["userClass"],
                    studentCard: res.data[0]["studentCard"],
                    eMail: res.data[0]["eMail"]
                })
                

            }
        })
        
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getSchoolList',
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
                        pictureFiles: res.tempFilePaths[0],
                        hidden: true
                    })
                } else {
                    wx.showToast({
                        title: '选择照片失败，请重试',
                        image: '../../images/fail.png',
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
        
    },

    changePicture: function (e) {
        //长按切换照片
        var that = this;
        var index = e.target.dataset.index;
        wx.showActionSheet({
            itemList: ['更改图片', '删除'],
            success: function (res) {
                if (res.tapIndex == "0") {
                    wx.chooseImage({
                        count: 1,
                        success: function (res) {
                            if (res.errMsg == "chooseImage:ok") {
                                that.setData({
                                    pictureFiles: res.tempFilePaths[0],
                                    hidden: true,
                                    changePic:true,//切换了图片
                                })
                            } else {
                                wx.showToast({
                                    title: '选择照片失败，请重试',
                                    image: '../../images/fail.png',
                                    duration: 2000
                                })
                            }
                            // that.togglePtype()
                        }
                    })
                } else if (res.tapIndex == "1") {
                    that.setData({
                        pictureFiles: null,
                        hidden: false,
                        changePic: true,//切换了图片
                    })
                }
            },
            fail: function (res) {
                
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
    setEMail: function (e) {
        //联系方式
        var that = this;
        that.setData({
            eMail: e.detail.value
        })
    },

    setCardId: function (e) {
        //学号
        var that = this;
        that.setData({
            studentCard: e.detail.value
        })
    },
    /*****************************详细认证方法 **********************************/
    // toAuth: function () {
    //     //提交信息
    //     var that = this;
    //     var thatData = that.data;
    //     var schoolIndex = that.data.schoolIndex;
    //     var formData = {
    //         "ID": app.globalData.userId,
    //         'userName': that.data.userName,
    //         'phoneNumber': that.data.phoneNumber,
    //         'userSchool': that.data.school[schoolIndex],
    //         'userClass': that.data.userClass,
    //         "studentCard": that.data.studentCard,
    //         "eMail": that.data.eMail
    //     };
        
    //     if (!thatData.userName || !thatData.phoneNumber || !thatData.userClass || !thatData.studentCard || !thatData.eMail){
    //         wx.showToast({
    //             title: '你是不是忘记填了点什么！',
    //             image: '../../images/warning.png',
    //             duration: 2000
    //         })
    //         return ;
    //     }
    //     if (!thatData.pictureFiles){
    //         wx.showToast({
    //             title: '你是不是忘记选择照片了！',
    //             image: '../../images/warning.png',
    //             duration: 2000
    //         })
    //         return;
    //     }
    //     wx.uploadFile({
    //       url: 'https://' + app.globalData.apiUrl + '/index.php?m=home&c=User&a=selfAuth',
    //         header: {
    //             'content-type': "multipart/form-data"
    //         }, // 设置请求的 header
    //         filePath: that.data.pictureFiles,
    //         name: 'authPic',//app.globalData.userId+
    //         formData: {
    //             "ID": app.globalData.userId,
    //             'userName': that.data.userName,
    //             'phoneNumber': that.data.phoneNumber,
    //             'userSchool': that.data.school[schoolIndex],
    //             'userClass': that.data.userClass,
    //             "studentCard": that.data.studentCard,
    //             "eMail": that.data.eMail
    //         },
            
    //         success: function (res) {
    //             var data = res.data
    //             if (data == "success"){
    //                 wx.showToast({
    //                     title: '等待管理员审核！',
    //                     icon: 'success',
    //                     duration: 2000
    //                 })
    //                 wx.navigateBack({
    //                     delta: 1
    //                 })
    //             }else if(data == "fail"){
    //                 wx.showToast({
    //                     title: '申请失败,请稍后重试！',
    //                     image: '../../images/fail.png',
    //                     duration: 2000
    //                 })
    //             } else {
    //                 wx.showToast({
    //                     title: "提交信息失败,请重试！",
    //                     image: '../../images/fail.png',
    //                     duration: 2000
    //                 })
    //             }
    //         }
    //     })
    // }

    /**************************************简化后的认证方法 ***********************************/
    toAuth: function () {
        //提交信息
        var that = this;
        var thatData = that.data;
        
        if (!thatData.userName || !thatData.phoneNumber || !thatData.eMail) {
            wx.showToast({
                title: '你是不是忘记填了点什么！',
                image: '../../images/warning.png',
                duration: 2000
            })
            return;
        }

        wx.request({
            url: 'https://' + app.globalData.apiUrl + '/index.php?m=home&c=User&a=selfAuth&ID=' + app.globalData.userId + "&userName=" + that.data.userName + "&userSchool=河北工业大学&userClass=河北工业大学计算机学院&studentCard=000000&eMail=" + that.data.eMail + "&phoneNumber=" + that.data.phoneNumber,
            method: "get",
            dataType: "json",
            success: function (res) {
                var data = res.data
                console.log(res.data)
                if (data == "success") {
                    wx.showModal({
                        title: '通知',
                        content: '审核通过',
                        showCancel:false,
                        success: function (res) {
                            if (res.confirm) {
                                app.globalData.certificationOk=2;
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        }
                    })
                } else if (data == "fail") {
                    wx.showToast({
                        title: '申请失败,请稍后重试！',
                        image: '../../images/fail.png',
                        duration: 2000
                    })
                } else {
                    wx.showToast({
                        title: "提交信息失败,请重试！",
                        image: '../../images/fail.png',
                        duration: 2000
                    })
                }
            }
        })
        
    }
})
