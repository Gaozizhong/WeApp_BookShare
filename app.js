//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null
  },
})

/*公众函数部分 */
// function addClass(obj, cls) {
//     var obj_class = obj.className,//获取 class 内容.
//         blank = (obj_class != '') ? ' ' : '';//判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
//     added = obj_class + blank + cls;//组合原来的 class 和需要添加的 class.
//     obj.className = added;//替换原来的 class.
// }

// function removeClass(obj, cls) {
//     var obj_class = ' ' + obj.className + ' ';//获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
//     obj_class = obj_class.replace(/(\s+)/gi, ' '),//将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
//         removed = obj_class.replace(' ' + cls + ' ', ' ');//在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
//     removed = removed.replace(/(^\s+)|(\s+$)/g, '');//去掉首尾空格. ex) 'bcd ' -> 'bcd'
//     obj.className = removed;//替换原来的 class.
// }

// function hasClass(obj, cls) {
//     var obj_class = obj.className,//获取 class 内容.
//         obj_class_lst = obj_class.split(/\s+/);//通过split空字符将cls转换成数组.
//     x = 0;
//     for (x in obj_class_lst) {
//         if (obj_class_lst[x] == cls) {//循环数组, 判断是否包含cls
//             return true;
//         }
//     }
//     return false;
// }
