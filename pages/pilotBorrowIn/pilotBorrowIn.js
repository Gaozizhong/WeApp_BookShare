var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hidden: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '自营点借书流程',
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    //扫描图书后的二维码
    screenQRcode:function(e){
        var that = this
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    //已授权 扫描ISBN
                    wx.scanCode({
                        success: (res) => {
                            console.log(res)
                            if (res.errMsg == "scanCode:ok") {
                                //扫描成功
                                if (res.scanType == "QR_CODE"){
                                    var qrcodeId = res.result.substring(72);
                                    console.log(qrcodeId)
                                    
                                }else{
                                    wx.showToast({
                                        title: '二维码类型错误',
                                        icon: 'false',
                                        duration: 2000
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
    }

    
})