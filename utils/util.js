function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function formatLocation(longitude, latitude) {
    if (typeof longitude === 'string' && typeof latitude === 'string') {
        longitude = parseFloat(longitude)
        latitude = parseFloat(latitude)
    }

    longitude = longitude.toFixed(2)
    latitude = latitude.toFixed(2)

    return {
        longitude: longitude.toString().split('.'),
        latitude: latitude.toString().split('.')
    }
}

module.exports = {
    formatTime: formatTime,
    
    // 是否为空对象
    isEmptyObject: function (e) {

        var t;

        for (t in e)

            return !1;

        return !0

    },

    // 检测授权状态
    checkSettingStatu: function (cb) {

        var that = this;
        var param = cb;
        // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒

        wx.getSetting({

            success: function success(res) {

                var authSetting = res.authSetting;

                if (that.isEmptyObject(authSetting)) {

                    console.log('首次授权');

                } else {

                    console.log('不是第一次授权', authSetting);

                    // 没有授权的提醒

                    if (authSetting['scope.userInfo'] === false) {

                        wx.showModal({

                            title: '用户未授权',

                            content: '如需正常使用功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',

                            showCancel: false,

                            success: function (res) {

                                if (res.confirm) {

                                    console.log('用户点击确定')

                                    wx.openSetting({

                                        success: function success(res) {
                                            that.getUserData(param)

                                        }

                                    });

                                }

                            }

                        })

                    }

                }

            }

        });

    },

    //获取个人信息
    getUserData: function (el){
        var param = el;
        wx.login({
            success: function (res) {
                if (res.code) {
                    //请求access_token
                    wx.request({
                        url: 'http://' + getApp().globalData.apiUrl + '?m=home&c=User&a=getSessionKey&code=' + res.code,
                        success: function (res) {
                            getApp().globalData.session_key = res.data.session_key
                            getApp().globalData.openId = res.data.openid
                            //获取个人信息
                            wx.getUserInfo({
                                success: function (res) {
                                    var res = JSON.parse(res.rawData);//eval('(' + res.rawData + ')');
                                    //创建账号到数据库
                                    wx.request({
                                        url: 'http://' + getApp().globalData.apiUrl + '?m=home&c=User&a=regiser&avatarUrl=' + res.avatarUrl + "&city=" + res.city + "&country=" + res.country + "&gender=" + res.gender + "&nickName=" + res.nickName + "&province=" + res.province + "&openId=" + getApp().globalData.openId,
                                        success: function (res) {
                                            getApp().globalData.userId = res.data[0]["ID"];
                                            getApp().globalData.userInfo = res.data[0];
                                            getApp().globalData.certificationOk = res.data[0]["certificationOk"];
                                            console.log(getApp().globalData)
                                            param.setData({
                                                userInfo: getApp().globalData.userInfo,
                                                certificationOk: getApp().globalData.certificationOk,
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                } else {
                    getApp().globalData.userId = null;
                }
            }
        });
    }
}


