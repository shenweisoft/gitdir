// pages/login/login.js
var app = getApp()
const config = require('../../config.js');
Page({
  data: {
    sysUser: {
      userName: "",
      password: "",
      telephone: "",
      code: "",
      loginMode: ""
    },
    winCode: "获取验证码",
    isClick: false,
    shouxinUrl: config.shouxinHost,//首信云
    host: config.host,
    domain: config.host
  },
  onLoad: function(options) {
    var userType = options.userType
    console.log(options.isAppointment,"!!!!!!!!!!!!!!!");
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      loginTimes: 0,
      userType: userType,
      isAppointment: options.isAppointment? true: ''
    })
    this.setData({
      ['sysUser.loginMode']: userType
    })
  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },

  /**
   * 数据绑定事件
   */
  userBindData: function(e) {
    var attribute = e.currentTarget.dataset.attribute;
    if (this.data.sysUser.hasOwnProperty(attribute) && (attribute in this.data.sysUser)) {
      var sysUser = this.data.sysUser;
      sysUser[attribute] = e.detail.value;
      this.setData({
        sysUser: sysUser
      })
    }
  },

  /**
   * 扫码登录
   */
  scanLogin: function() {
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        var userInfo = res.userInfo;
        app.globalData.openUser = userInfo;
      }
    })

    /**
     * 扫码事件
     */
    wx.scanCode({
      success: (res) => {
        var loginAccount = res.result;
        // console.log(that.data.userType, "!!!!!!");

        let url = app.globalData.dataUrl + '/login/appLogin'
        var data = {
          openid: app.globalData.openId,
          loginAccount: loginAccount

        };

        if (!app.globalData.openId) {
          app.getUserInfo(function() {
            data.openid = app.globalData.openId;
            that.loginRequest(url, data);
          })
        } else {
          that.loginRequest(url, data)
        }
      }
    })
  },

  /**
   * 验证登录
   */
  validateLogin: function() {
    var that = this;
    var userName = that.data.sysUser.userName;
    console.log(that.data.sysUser);
    var loginMode = that.data.sysUser.loginMode
    if (loginMode == 1) {
      if (!userName) {
        wx.showToast({
          title: '用户名不能为空',
          icon: 'success',
          duration: 2000
        })
        return false
      }
      var password = that.data.sysUser.password;
      if (!password) {
        wx.showToast({
          title: '密码不能为空',
          icon: 'success',
          duration: 2000
        })
        return false
      }
    }
    return true
  },

  /**
   * 账号登录事件
   */
  doLogin: function() {
    var that = this;
    var loginMode = that.data.sysUser.loginMode
    console.log(loginMode)
    if (loginMode == 1) {
      //清空数据服务
      wx.setStorageSync("dataUrl", "");
      var data = {
        openid: app.globalData.openId,
        loginAccount: that.data.sysUser.userName,
        password: that.data.sysUser.password,
        loginMode: loginMode
      };
    } else {
      var code = that.data.sysUser.code;
      if (!code) {
        wx.showToast({
          title: '验证码不能为空',
          icon: 'success',
          duration: 2000
        })
        return false
      }
      var data = {
        openid: app.globalData.openId,
        phone: that.data.sysUser.telephone,
        validateCode: code,
        loginMode: loginMode
      };
    }
    var that = this,
      url = app.globalData.dataUrl + '/login/appLogin'
    

    /*验证登录方法*/
    if (that.validateLogin()) {
      wx.showLoading({
        title: '正在登录中...',
        mask: true
      })
      if (that.data.isAppointment) {
        app.dologin(that.data.sysUser, that.data.isAppointment);
      } else {
        app.dologin(that.data.sysUser);
      }
    }
  },
  //先验证手机号在那个服务器
  winCodePrev: function (){
    var that = this;
    var url = that.data.domain + '/login/checkUserMobile'
    wx.request({
      url: url,
      method: "POST",
      data: {
        mobile: that.data.sysUser.telephone
      },
      success: res => {
        console.log(res);
        let data = res.data
        if (data.code != 2011) {
            if (url.indexOf(that.data.host) != -1) {
              that.setData({
                domain: that.data.shouxinUrl //首信云
              })
              that.winCodePrev();
            } else if (url.indexOf(that.data.shouxinUrl) != -1) {
              wx.showModal({
                title: '提示',
                content: '账号尚未注册',
                confirmText: "去注册",
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../me/register/register'
                    })
                  }
                }
              })
            }
        }else{
          wx.setStorageSync("dataUrl", that.data.domain);
          that.winCode();
        }
      }
    })
  },
  /*获取验证码*/
  winCode: function() {
    var that = this;
    var isClassStatus = that.data.isClick;
    if (isClassStatus == false) {
      var reg = /^((1[3-9][0-9])+\d{8})$/;
      var telephone = that.data.sysUser.telephone;
      console.log(telephone);
      if (!(reg.test(telephone))) {
        wx.showToast({
          title: '手机号格式错误',
          icon: 'success',
          duration: 2000
        })
        return false
      } else {
        that.setData({
          isClick: true,
        })
        var i = 60;
        var timer = setInterval(function() {
          i--
          that.setData({
            winCode: i + "秒后获取"
          })
          if (i <= 0) {
            clearInterval(timer);
            that.setData({
              winCode: "获取验证码",
              isClick: false
            })
          }
        }, 1000)
        var url = "/login/sendWeChatMessage";
        app.NetRequestLogin(url, {
          phone: telephone
        }, res => {
          console.log(res);
          console.log(telephone)
          if (res.code != 0) {
            wx.showToast({
              title: '获取失败',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    }
  },

  /*注册*/
  doReg: function() {
    wx.navigateTo({
      url: '../me/register/register?WinCodeType=register'
    })
  }
})