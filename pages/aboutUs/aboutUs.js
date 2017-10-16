import { $wuxPrompt } from '../../components/wux'
const sliderWidth = 96

//about.js 关于我们
//获取应用实例
var app = getApp()
Page({
    data: {
        tabs: ['全部', '待收货', '待评价'],
        activeIndex: '0',
        sliderOffset: 0,
        sliderLeft: 0
    },
    //事件处理函数
    onLoad: function () {
        $wuxPrompt.init('msg1', {
            title: '空空如也',
            text: '暂时没有相关数据',
        }).show()

        $wuxPrompt.init('msg2', {
            icon: '../../assets/images/iconfont-order.png',
            title: '您还没有相关的订单',
            text: '可以去看看有哪些想买',
            buttons: [
                {
                    text: '随便逛逛'
                }
            ],
            buttonClicked(index, item) {
                console.log(index, item)
            },
        }).show()

        $wuxPrompt.init('msg3', {
            icon: '../../assets/images/iconfont-empty.png',
            title: '暂无待评价订单',
        }).show()

        this.getSystemInfo()
    },
    onReady: function () {

    },

    openLocation:function(){
        wx.openLocation({
            latitude: app.globalData.latitude,
            longitude: app.globalData.longitude,
            scale: 15,
            name:"河北工业大学北辰校区"
        })
    },
    getSystemInfo() {
        const that = this
        wx.getSystemInfo({
            success(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                })
            }
        })
    },
    tabClick(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id,
        })
    },
})
