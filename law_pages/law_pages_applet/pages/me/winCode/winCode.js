// pages/me/winCode/winCode.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winCode: "获取验证码",
    sysUser: {
      telephone: "",
      name: "",
      userName: "",
      code: "",
      certificateType: "0",
      idCard: "",
      password: ""
    },
    isClick: false,
    btnText: '确定',
    nowPhone: false,
    winCodeType: "",
    i: 60,
    timer: null,
    result: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var winCodeType = options.winCodeType
    this.setData({
      winCodeType: winCodeType
    })
    if (winCodeType == "reg"){
      wx.setNavigationBarTitle({
        title: '绑定手机号',
      })
      this.setData({
        ['sysUser.idCard']: options.idCard,
        ['sysUser.password']: options.password,
        ['sysUser.name']: options.name,
        nowPhone: true
      })
    } 
    if (winCodeType == 'bindPhoneNo'){
      wx.setNavigationBarTitle({
        title: '绑定手机号'
      })
      if (options.result){
        this.setData({
          nowPhone: true,
          result: options.result,
          btnText: '确认绑定'
        })
      }
    }

    if (winCodeType == 'changePhoneNo'){
      wx.setNavigationBarTitle({
        title: '修改手机号',
      })
     
      var userInfo = wx.getStorageSync('userInfo');
      this.setData({
        ['sysUser.telephone']: userInfo.mobile,
        btnText: "下一步"
      })
    }

    if (winCodeType == 'NewPhoneNo') {
      wx.setNavigationBarTitle({
        title: '绑定手机号',
      })
     
      this.setData({
        winCodeType: 'NewPhoneNo',
        nowPhone: true
      })
    }
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 数据绑定事件
   */
  userBindData: function (e) {
    //console.log(e);
    var attribute = e.currentTarget.dataset.attribute;
    if (this.data.sysUser.hasOwnProperty(attribute) && (attribute in this.data.sysUser)) {
      var sysUser = this.data.sysUser;
      sysUser[attribute] = e.detail.value;
      this.setData({
        sysUser: sysUser
      })
    }
  },

  /*获取验证码*/
  winCode: function () {
    var that = this;
    var isClassStatus = that.data.isClick;
    if (isClassStatus == false) {
      clearInterval(that.data.timer);
      var reg = /^((1[3-9][0-9])+\d{8})$/;
      var telephone = that.data.sysUser.telephone;
      console.log(telephone);
      if (!(reg.test(telephone))) {
        that.errorTip('请输入正确手机号');
      } else {
        that.setData({
          isClick: true,
        })
        var i = that.data.i;
        var timer = that.data.timer
        timer = setInterval(function () {
          that.setData({
            timer: timer
          })
          //console.log(that.data);
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
        app.NetRequestLogin(url, { phone: telephone }, res => {
          console.log(res)
          if (res.code != 0) {
            that.errorTip('获取失败');
          }
        })
      }
    }
  },

  //所有的提示
  errorTip: function (msg) {
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 2000
    })
    return false
  },

  /**
   * 确定
   */
  doLogin: function () {
    var winCodeType = this.data.winCodeType
    var that = this;
    //注册
    if (winCodeType == 'reg'){
      var data = {
        loginAccount: that.data.sysUser.idCard,
        password: that.data.sysUser.password,
        mobile: that.data.sysUser.telephone,
        verificationCode: that.data.sysUser.code,
        certificateType: that.data.sysUser.certificateType,
        name: that.data.sysUser.name
      }
      console.log(data)
      var url = "/login/wxRegister";
      var loginUrl = "/login/wxRegister";
      app.NetRequestLogin(url, data, res => {
        console.log(res);
        if (res.code == 0) {
          that.errorTip('注册成功');
          let That = that.data.sysUser;
          setTimeout(function () {
            app.dologin(That);
          }, 2001)
        } else if (res.code == 2009) {
          that.errorTip('账号已存在');
          setTimeout(function () {
            wx.navigateTo({
              url: '../../selectCharacter/selectCharacter'
            })
          }, 2001)
        } else {
          that.errorTip(res.message);
        }
      })
    }
    //修改手机号码
    if (winCodeType == 'changePhoneNo') {
      var that = this;
      var url = '/login/checkMobileCode';
      var data = {
        mobile: that.data.sysUser.telephone,
        mobileCode: that.data.sysUser.code
      }
      app.NetRequest(url, data, res => {
        if (res.code == 0) {
          clearInterval(that.data.timer);
          wx.setNavigationBarTitle({
            title: '新手机号',
          })
          that.setData({
            nowPhone: true,
            btnText: "确定",
            i: 60,
            winCode: "获取验证码",
            isClick: false,
            winCodeType: "NewPhoneNo"
          })
        }else{
          that.errorTip(res.message);
        }
      })
    }
    //新的手机号码
    if (winCodeType == 'NewPhoneNo'){
      var oldPhoneNo = wx.getStorageSync('userInfo').mobile;
      console.log(oldPhoneNo, "&&&&&&&&&&");
      if (that.data.sysUser.telephone == oldPhoneNo){
        that.errorTip('手机号码一致');
      }
      var that = this;
      var url = '/login/checkAndModifyAppMobile';
      var id = wx.getStorageSync('userInfo').id;
     
      var data = {
        mobile: that.data.sysUser.telephone,
        mobileCode: that.data.sysUser.code,
        id: id
      }
      app.NetRequest(url, data, res => {
        console.log(res);
        if (res.code == 0) {
          that.errorTip('成功');
          setTimeout(function(){
            wx.switchTab({
              url: '../me'
            })
          },2001)
          var userInfo = wx.getStorageSync('userInfo');
          userInfo.mobile = that.data.sysUser.telephone;
          wx.setStorageSync('userInfo', userInfo);
        }else{
          that.errorTip(res.message);
        }
      })
    }
    //绑定手机号
    if (winCodeType == 'bindPhoneNo') {
      var code = that.data.sysUser.code;
      if (!code) {
        that.errorTip('验证码不能为空');
      }
      var mobile = that.data.sysUser.telephone;
      var url = '/login/checkAndModifyAppMobile';
      if (!mobile) {
        that.errorTip('请输入手机号');
      }
      var data = {
        mobile: mobile,
        mobileCode: that.data.sysUser.code,
        id: that.data.result
      }
      console.log(data);
      app.NetRequestLogin(url, data, res => {
        if (res.code ==  2007) {
          that.errorTip(res.message);
        }
        if (res.code == -1){
          that.errorTip('验证码错误');
        }
        if (res.code == 2011) {
          that.errorTip('手机号已存在');
          setTimeout(function(){
            wx.navigateTo({
              url: '../../login/login?userType=2'
            })
          },2001)
        }
        console.log(res);
        if (res.code == 0){
          that.errorTip('绑定成功');
          let That = that.data.sysUser
          setTimeout(function () {
            app.dologin(That);
          }, 2001)
        }
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})