// pages/selectCharacter/selectCharacter.js
var pages = getCurrentPages();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goLogin: ''
  },

  /**
   * 去登录
   */
  login: function(e){
    var that = this
    var type = e.currentTarget.dataset.type
    console.log(type,123456);
    console.log('../login/login?userType=' + type);
    //判断是否是通过预约调解过来的案件
    if (this.data.isAppointment) {
      wx.navigateTo({
        url: '../login/login?userType=' + type + '&isAppointment=' + true
      })
    } else {
      wx.navigateTo({
        url: '../login/login?userType=' + type
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isAppointment = ''
    var where = JSON.parse(wx.getStorageSync("where"))
    where && where.referrerInfo && where.referrerInfo.extraData? isAppointment = true : isAppointment = false;
    this.setData({
      isAppointment: isAppointment,
      historyPage: options.historyPage ? options.historyPage: false
    })
    console.log(this.data.isAppointment,"$%&^%^&*");
    // wx.setStorageSync("where", JSON.stringify(options));
    // console.log(JSON.parse(wx.getStorageSync("where")), "!!!!!!!!!!!!");
    // console.log(JSON.parse(wx.getStorageSync("where")).referrerinfo, "!!!!!!!!!!!!");
    // console.log(JSON.parse(wx.getStorageSync("where")).referrerinfo.extraData, "!!!!!!!!!!!!");
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
    var that = this
    var historyPage = that.data.historyPage
    if (historyPage){
      wx.navigateBack()
      // wx.reLaunch({
      //   url: '/pages/index/index',
      // })
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