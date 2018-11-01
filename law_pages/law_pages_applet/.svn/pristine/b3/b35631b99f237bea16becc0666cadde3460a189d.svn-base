// pages/me/authentication/authentication.js
const utils = require('../../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sysUser:{
      idCard: "",
    },
    applicant: {
      idNo: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  },

  //上传图片
  uploadImg: function (event) {
    var that = this;
    wx.chooseImage({
      count: 1, // 设置最多可以选择的图片张数，默认9,如果我们设置了多张,那么接收时//就不在是单个变量了,
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        console.log(res)
        let filePath = res.tempFilePaths[0];
        app.NetUploadLogin(filePath, { type: 'applicant' }, res => {
          res = JSON.parse(res);
          console.log(res);
          that.setData({
            idCardImg: res.result
          })
          // 解析身份证正面照  
          let url = '/common/cardDisc', data = { "path": res.result, "type": "applicant" }
          app.NetRequestLogin(url, data, res => {
            console.log(res)
            if (res.code == 0) {
              that.setData({
                ['sysUser.idCard']: res.result.code,
                ['applicant.idNo']: res.result.code
              })
            } else {
              //that.showToast('error', res.message);
              wx.showToast({
                title: '身份证不清晰',
                icon: 'success',
                duration: 2000
              })
            }
          })

        })
      },
      fail: function (res) {
        //that.showToast('error', res.message)
      }
    })
  },

  /**
  * 数据绑定事件
  */
  userBindData: function (e) {
    var attribute = e.currentTarget.dataset.attribute;
    if (this.data.sysUser.hasOwnProperty(attribute) && (attribute in this.data.sysUser)) {
      var sysUser = this.data.sysUser;
      sysUser[attribute] = e.detail.value;
      console.log(e.detail.value);
      this.setData({
        sysUser: sysUser,
        ['applicant.idNo']: e.detail.value
      })
    }
  },

  /**
  * 未注册
  */
  doLoginTip: function () {
    var that = this;
    wx.showModal({
      title: '您的手机号还未绑定！',
      content: '绑定手机号方便您快速登录系统',
      showCancel: false,
      confirmText: '立即绑定',
      confirmColor: '#0d9deb',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../register/register?idCard='+that.data.sysUser.idCard,
          })
        }
      }
    })
  },

  /**
  * 下一步
  */
  nextStep: function () {
    var that = this;
    var idCard = that.data.applicant.idNo;
    var reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (!idCard) {
      wx.showToast({
        title: '身份证不能为空',
        icon: 'success',
        duration: 2000
      })
      return false
    }

  
    if (!utils.checkIdentity(that.data.applicant)) {
      wx.showToast({
        title: '身份证输入有误',
        icon: 'success',
        duration: 2000
      })
      return false
    }


    var url = '/login/checkAppLoginAccount';
    var data = {
      loginAccount: idCard
    }
    
    app.NetRequestLogin(url, data, res => {
      console.log(res);
      if (res.code == 2009){
        wx.navigateTo({
          url: '../winCode/winCode?winCodeType=bindPhoneNo&result=' + res.result
        })
      }
      if (res.code == 2008){
        wx.navigateTo({
          url: '../register/register?userType=2&idCard=' + idCard
        })
      }
    })
  }
})