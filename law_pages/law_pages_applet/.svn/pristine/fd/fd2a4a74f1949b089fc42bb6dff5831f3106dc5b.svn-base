//app.js
var loginStatus = true;
const config = require('./config.js');
var qcloud = require('./lib/index');
var getlogininfo = require('./getlogininfo.js');
var socketOpen = false; //websoket连接是否打开
var socketMsgQueue = []; //消息队列
var messageArray = [];   //暂存消息
App({
  onLaunch: function () {
   
    //判断网络信息
    this.isNetworkValiad();

    //清空数据服务
    wx.setStorageSync("dataUrl", "");

    //获取微信用户信息
    this.getUserInfo();

    //视频信息登录
    this.getSystemData();
    
    //监听socket打开事件
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      socketOpen = true
      for (var i = 0; i < socketMsgQueue.length; i++) {
        sendSocketMessage(socketMsgQueue[i])
      }
      socketMsgQueue = []

      //websocket打开事件
      wx.setStorageSync("socketOpen", socketOpen)

      //发送消息事件
      function sendSocketMessage(msg) {
        if (socketOpen) {
          wx.sendSocketMessage({
            data: msg
          })
        } else {
          socketMsgQueue.push(msg)
        }
      }
    })

    //websocket关闭
    wx.onSocketClose(function (res) {
      console.log('WebSocket连接断开')
      wx.setStorageSync("socketOpen", false)
    })

    //打开失败
    wx.onSocketError(function (res) {
      console.log('WebSocket连接失败')
      console.log(res);
    })
  },

  /**
   * 前台唤醒
   */
  onShow: function (options){
    wx.setStorageSync("where", JSON.stringify(options));
  },

  /**
   * 后台挂起
   */
  onHide: function(){

  },

  /**
   * 判断网络状态
   */
  isNetworkValiad:function(fun){
    var that = this;
    wx.getNetworkType({
      success: function (res) {
        var networkType = res.networkType; // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        if (networkType == 'none') {//无可用网络
          wx.showToast({
            title: '无可用网络!',
          })
        } else {
          //监听网络变化
          wx.onNetworkStatusChange(function (res) {
            if (!res.isConnected) {//无可用网络
              showFailure("无可用网络")
            } else {
              showSuccess("当前网络：" + res.networkType)
            }
          })

          //登录微信
          if (!that.globalData.openId) {
            that.dologin();
          }
        }
      }
    })
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function (callback){
    var that = this;
    if (!loginStatus) {//微信未登录
      //获取用户信息
      that.getSystemUser(callback);
    } else {
      wx.login({
        success: function (res) {
          if (res.code) {
            //获取用户信息
            that.getSystemUser(callback);
          }
        },
        fail: function () {
          console.info("登录失败");
        }
      });
    }
  },

  /**
   * 获取微信用户信息
   */
  getSystemUser: function (callback) {
    var that = this;
    wx.getUserInfo({
      withCredentials: false,
      success: function (data) {
        var userInfo = data.userInfo;
        that.globalData.openUser = userInfo;
        wx.setStorageSync("openUser", userInfo);

        if (typeof callback == "function") {
          callback(userInfo);
        }
      },
      fail: function () {
        loginStatus = false;
        wx.getUserInfo({
          withCredentials: false,
          success: function (data) {
            var userInfo = data.userInfo;
            that.globalData.openUser = userInfo;
            wx.setStorageSync("openUser", userInfo);

            if (typeof callback == "function") {
              callback(userInfo);
            }
          },
          fail: function () {
            console.info("授权失败返回数据");
          }
        });
      }
    });
  },

  /**
   * 登录司法项目
   */
  dologin(sysUser, isAppointment) {
    var that = this, openId = wx.getStorageSync("openid");
    let Server = wx.getStorageSync("dataUrl") || that.globalData.dataUrl;
    let url = Server + '/login/appLogin';
    var data = {
      openid: openId
    }
    if (!openId && !sysUser) {
      wx.login({
        success: function (loginCode) {
          if (loginCode.code) { //微信登录成功
            //获取用户的openid
            var url = Server + '/adjust/getWeChatOpenId';
            var data = {
              js_code: loginCode.code
            }
            wx.request({
              url: url,
              method: 'post',
              data: data,
              header: {},
              success: res => {
                if (res.data.code == that.globalData.Constant.SUCCESS) {
                  var result = JSON.parse(res.data.result);
                  that.globalData.openId = result.openid;
                  data.openid = result.openid;
                  wx.setStorageSync('openid', result.openid);//存储openid
                  console.log("openId: " + result.openid);
                  that.dologin();
                } else {
                  wx.showToast({
                    title: res.data.message,
                    icon: 'success',
                    duration: 2000
                  })
                }
              }
            })
          }
        }
      })
    } else {
      //账号密码登录
      if(sysUser) {
        if (sysUser.loginMode == "2"){
          data.telephone = sysUser.telephone;
          data.validateCode = sysUser.code;
          data.loginMode = "0";
        }else{
          data.loginAccount = sysUser.userName;
          data.password = sysUser.password;
          data.loginMode = "2";
        }
      }
      
      wx.request({
        url: url,
        method: 'post',
        data: data,
        header: {},
        success: res => {
          wx.hideLoading();
          if (res.data.code == that.globalData.Constant.SUCCESS) {
            that.globalData.userInfo = res.data.result.sysUser;
            var Cookie = res.header["Set-Cookie"];
            var JSESSIONID = Cookie.split(';')[0].split('=')[1];
            wx.setStorageSync('JSESSIONID', JSESSIONID);//把返回的session id 存入本地
            wx.setStorageSync('userInfo', res.data.result.sysUser);//把返回的session id 存入本地
            if (url.indexOf(that.globalData.dataUrl) != -1) {
              wx.setStorageSync('dataUrl', that.globalData.dataUrl);//百度云的数据
              wx.setStorageSync('socketUrl', that.globalData.baiduSocketUrl);//百度云的socket地址
            }
            
            //连接websocket
            that.connectSocket();

            if(sysUser) {
              if (isAppointment) {
                //由赔付试算而来，跳到新建案件页面
                wx.reLaunch({
                  url: '/pages/litigants/step1/step1?isAppointment='+true
                })
              } else {
                wx.reLaunch({
                  url: '/pages/index/index'
                })
              }
            }
            
          } else if (url.indexOf(that.globalData.dataUrl) != -1 && res.data.code == '2008') {//百度云上账号不存在
            wx.setStorageSync('dataUrl', that.globalData.shouxinUrl);//首信云的数据
            wx.setStorageSync('socketUrl', that.globalData.shouxinSocketUrl);//首信云的socket地址
            url = that.globalData.shouxinUrl + '/login/appLogin';
            sysUser ? that.dologin(sysUser) : that.dologin();
          } else if (res.data.code == 2008){
            console.log(res.data);
            console.log(data);
            if (data.loginMode == "0"){
              wx.showModal({
                title: '您的手机号还未绑定！',
                content: '绑定手机号方便您快速登录系统',
                showCancel: false,
                confirmText: '立即绑定',
                confirmColor: '#0d9deb',
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../me/authentication/authentication',
                    })
                  }
                }
              })
            } else if (data.loginMode == "2"){
              wx.showToast({
                title: "账号不存在",
                icon: 'success',
                duration: 2000
              })
              return false
            }
          } else {
            wx.setStorageSync('userInfo', null);//清空用户信息
            wx.showToast({
              title: res.data.message || "登录超时",
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: '服务器失联了!',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }
  },
  
  /**
   * 公用request请求方法
   */
  NetRequest : function(requetUrl, requetData,callback, method = "POST") {
    var that =this
    let Server = wx.getStorageSync("dataUrl") || that.globalData.dataUrl;
    if (!wx.getStorageSync("dataUrl")){
      wx.setStorageSync("dataUrl", that.globalData.dataUrl);
    }
    var session_id = wx.getStorageSync('JSESSIONID');//本地取存储的sessionID
    if (!session_id){
      showFailure('session失效，重新登录...');
      wx.reLaunch({
        url: 'pages/index/index'
      })
      session_id = wx.getStorageSync('JSESSIONID');
    }
    var header = { 'content-type': 'application/json', 'Cookie': 'JSESSIONID=' + session_id };
    requetUrl = Server + requetUrl;
    wx.request({
      url: requetUrl,
      method: method,
      data: requetData,
      header: header,
      success: res => {
        // console.log(res);
        let data = res.data
        data.header = res.header;
        if (typeof callback == "function" && res['statusCode'] === 200){
          callback(data)//回调方法
        }
      },
      fail: function(){
        showFailure("服务器异常");
      }
    })
  },


  /**
   * 公用登陆注册专用请求方法
   */
  NetRequestLogin: function (requetUrl, requetData, callback, method = "POST") {
    var that = this
    let Server = wx.getStorageSync("dataUrl") || that.globalData.dataUrl;
    if (!wx.getStorageSync("dataUrl")) {
      wx.setStorageSync("dataUrl", that.globalData.dataUrl);
    }
  
    requetUrl = Server + requetUrl;
    wx.request({
      url: requetUrl,
      method: method,
      data: requetData,
      success: res => {
        // console.log(res);
        let data = res.data
        data.header = res.header;
        if (typeof callback == "function" && res['statusCode'] === 200) {
          callback(data)//回调方法
        }
      },
      fail: function () {
        showFailure("服务器异常");
      }
    })
  },

  /**
   * 公用Upload请求方法
   */
  NetUpload:function(path,data,callback){
    var that = this
    var session_id = wx.getStorageSync('JSESSIONID');//本地取存储的sessionID
    let Server = wx.getStorageSync("dataUrl") || that.globalData.dataUrl;
   
    if (!session_id) {
      showFailure('session失效，重新登录...');
      that.dologin();
      session_id = wx.getStorageSync('JSESSIONID');
    }
    var header = { "Content-Type": "application/json", 'Cookie': 'JSESSIONID=' + session_id }

    wx.uploadFile({
      url: Server + '/common/uploadImage',
      filePath: path,
      name: 'file',
      header: header,
      formData: data,
      success: function(res) {
        let data = res.data
        if (typeof callback == "function" && res['statusCode'] === 200) {
          callback(data)//回调方法
        }
      },
      fail: function(res) {
        showFailure("服务器异常");
      },
      complete: function(res) {},
    })
  },

  NetUploadVoice: function (path, data, callback) {
    var that = this
    var session_id = wx.getStorageSync('JSESSIONID');//本地取存储的sessionID

    if (!session_id) {
      showFailure('session失效，重新登录...');
      that.dologin();
      session_id = wx.getStorageSync('JSESSIONID');
    }
    var header = { "Content-Type": "application/json", 'Cookie': 'JSESSIONID=' + session_id }

    wx.uploadFile({
      url: that.globalData.dataUrl + '/common/uploadVoice',
      filePath: path,
      name: 'file',
      header: header,
      formData: data,
      success: function (res) {
        let data = res.data
        if (typeof callback == "function" && res['statusCode'] === 200) {
          callback(data)//回调方法
        }
      },
      fail: function (res) {
        showFailure("服务器异常");
      },
      complete: function (res) { },
    })
  },

  /**
   * 公用Upload请求方法
   */
  NetUploadLogin: function (path, data, callback) {
    var that = this
    let Server = wx.getStorageSync("dataUrl") || that.globalData.dataUrl;
    wx.uploadFile({
      url: Server + '/common/uploadImage',
      filePath: path,
      name: 'file',
      formData: data,
      success: function (res) {
        let data = res.data
        if (typeof callback == "function" && res['statusCode'] === 200) {
          callback(data)//回调方法
        }
      },
      fail: function (res) {
        showFailure("服务器异常");
      },
      complete: function (res) { },
    })
  },

  /**
   * 获取系统信息
   */
  getSystemData: function () {
    wx.showLoading({
      title: '微信登录中',
    })
    // rtcroom初始化
    var self = this;
    getlogininfo.getLoginInfo({
      type: 'multi_room',
      success: function (ret) {
        wx.setStorageSync("userName", ret.userName)
        wx.hideLoading();

        // self.dologin();

        console.log('获取登录信息成功：')
        console.log(ret)
      },
      fail: function (ret) {
        wx.hideLoading();
        // self.data.isGetLoginInfo = false;
        wx.showModal({
          title: '获取登录信息失败',
          content: ret.errMsg,
          showCancel: false,
          complete: function () {
            wx.navigateBack({});
          }
        });
      }
    });
  },

  /**
   * 连接websocket
   */
  connectSocket: function () {
    var that = this
    var userInfo = wx.getStorageSync("userInfo");

    //初始化文字聊天环境
    var domain = wx.getStorageSync("socketUrl") || that.globalData.baiduSocketUrl
    wx.connectSocket({
      url: domain + "/" + userInfo.id,
      header: {
        'content-type': 'application/json',
        'method': 'CONNECT'
      },
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  
  /**
   * 全局变量
   */
  globalData: {
    userInfo: null,
    appid: 'wx209b3386edc258a2',
    dataUrl: config.host,
    shouxinUrl: config.shouxinHost,
    baiduSocketUrl: config.baiduSocketUrl,
    shouxinSocketUrl: config.shouxinSocketUrl,
    imageAddress: config.host+'/common/image/getThumbnail/',
    openId: '',
    Constant: {
      SUCCESS: '0',
      FAIL: '1'
    },
  }
})

export const showSuccess = function (tip) {
  wx.showToast({
    title: tip || '成功',
    icon: 'success',
    duration: 2000
  })
}

export const showFailure = function (tip) {
  wx.showModal({
    title: '提示',
    content: tip || '操作失败！',
    showCancel: false,
  })
}
