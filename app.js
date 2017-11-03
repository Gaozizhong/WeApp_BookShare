//app.js
App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        //登录
        var that = this;
        wx.request({
            url: ('https://' + that.globalData.apiUrl + '?m=home&c=User&a=getAccessToken').replace(/\s+/g, ""),
            success: function (res) {
                that.globalData.access_token = res.data.access_token
            }
        })
        
        //定时器获取access_token
        var timename = setInterval(function(){
            wx.request({
                url: ('https://' + that.globalData.apiUrl + '?m=home&c=User&a=getAccessToken').replace(/\s+/g, ""),
                success: function (res) {
                    that.globalData.access_token = res.data.access_token
                }
            })
        }, that.globalData.timer);

        //获取手机的宽度和高度
        that.globalData.phoneInfo = wx.getSystemInfoSync()
        

    },

    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.getUserInfo({
                withCredentials: false,
                success: function (res) {
                    that.globalData.userInfo = res.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                }
            })
        }
    },

    //上传多张图片
    //多张图片上传
    uploadimg: function(data){
        var that= this,
        i=data.i ? data.i : 0,
        success=data.success ? data.success : 0,
        fail=data.fail ? data.fail : 0;
        wx.uploadFile({
            url: data.url,
            filePath: data.path[i],
            name: 'fileData',
            formData: data.formData,
            success: (resp) => {
                success++;
                console.log(resp)
                console.log(i);
                //这里可能有BUG，失败也会执行这里
            },
            fail: (res) => {
                fail++;
                console.log('fail:' + i + "fail:" + fail);
            },
            complete: () => {
                console.log(i);
                i++;
                if (i == data.path.length) {  //当图片传完时，停止调用     
                    console.log('执行完毕');
                    console.log('成功：' + success + " 失败：" + fail);
                } else {//若图片还没有传完，则继续调用函数
                    console.log(i);
                    data.i = i;
                    data.success = success;
                    data.fail = fail;
                    that.uploadimg(data);
                }

            }
        });
    },

    globalData: {
        userInfo: null,
        certificationOk: 0,//是否认证
        appId: 'wxe0a4d0328b2d85cb',
        appSecret: '25f225cee1b8da033ecbd23ac68beb1a',
        session_key: null,
        openId: null,
        apiUrl: "35978598.1949science.cn/",//"localhost:8081",//www.1949science.cn  139.199.171.106/bookshare
        userId:null,//用户userId
        timer: 30000,//定时器设置时间
        access_token:null,
        pilotKeepTime:7 ,//自营点时间
        latitude: 39.2349700000,//团队所在纬度
        longitude: 117.0582000000,//团队所在经度
        contractPhone:'13752766442',//联系我们的联系方式
        

    },
})