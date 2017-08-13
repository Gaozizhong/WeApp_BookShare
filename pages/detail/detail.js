// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
    /**
     * 页面的初始数据
     */
    data: {
        title: '',
        loading: true,
        value: [1, 1, 1],
        owner: new Array("----请选择-----","Saab", "Volvo", "BMW"),
        index:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(params) {
        // this.setData({ title: "心理罪", movie: d, loading: false })
         wx.setNavigationBarTitle({ title: "心理罪" })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
         wx.setNavigationBarTitle({ title: "心理罪"})
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // TODO: onShow
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        // TODO: onHide
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        // TODO: onUnload
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
    }
})
