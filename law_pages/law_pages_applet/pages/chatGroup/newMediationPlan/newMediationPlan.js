// pages/mediate/newMediationPlan/newMediationPlan.js
const app = getApp()
const dictionary = require('../../../utils/dictionary.js')
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mediationPlan:{
      name: '调解方案',
      state: '0',
      claimAmount: '',
      feeArray: dictionary.feeTypeList
    }
  },

  /**
   * 费用信息改变事件
   */
  inputChanged: function(e){
    var that = this
    var index= e.currentTarget.dataset.index
    var attribute = e.currentTarget.dataset.attribute

    var mediationPlan = that.data.mediationPlan
    mediationPlan.feeArray[index][attribute] = e.detail.value
    that.setData({
      mediationPlan: mediationPlan
    })
  },

  /**
   * 保存调解方案
   */
  saveMediationPlan: function(callback){
    var that = this
    var url = '/adjust/saveMediationPlan'
    var data = that.data.mediationPlan
    filterParam(data)
    var dataJson = JSON.parse(data.feeArray)
    var len = dataJson.length;
    let arr = [];
    for (var i = 0; i < len; i++){
      if (dataJson[i].claimAmount !== undefined) {
        arr.push(dataJson[i].claimAmount);
      }
    }
    if (arr.length < 1){
      wx.showToast({
        title: '至少有一项费用',
      })
      if (typeof (that.data.mediationPlan.feeArray) == 'string') {
        that.data.mediationPlan.feeArray = JSON.parse(that.data.mediationPlan.feeArray)
      }
      that.setData({
        ['mediationPlan.feeArray']: that.data.mediationPlan.feeArray
      })
      return;
    }
    
    app.NetRequest(url , data, function(res){
      if(res.code == app.globalData.Constant.SUCCESS){
        var pages = getCurrentPages();
        var prevPage = pages[pages.length -2];
        prevPage.queryMediationPlan();

        if (typeof callback == "function"){
          callback(res.result);
        }

        wx.navigateBack({
          delta: 1
        })
      }
    })

    //参数过滤
    function filterParam(mediationPlan){
      if (typeof(mediationPlan.feeArray) == 'string'){
        mediationPlan.feeArray = JSON.parse(mediationPlan.feeArray)
      }

      mediationPlan.claimAmount = 0
      mediationPlan.feeArray.forEach((v) =>{
        mediationPlan.claimAmount += parseFloat(v.claimAmount || 0)
      })
      mediationPlan.claimAmount = parseFloat(mediationPlan.claimAmount).toFixed(2)
      mediationPlan.feeArray = JSON.stringify(mediationPlan.feeArray)
    }
  },

  /**
   * 消息实体类
   */
  Message: function (uid, type, roomid) {
    this.uid = uid;//用户id
    this.roomid = roomid;//房间id
    this.type = type;//消息类型 text, voice, picture, file
    this.name = '';//姓名
    this.personType = '';//人员类型 被申请人 法官 调解员 住建局 代理人
    this.createDate = util.formatTime(new Date());//消息时间
    this.text = '';//消息内容
  },

  /**
   * 发送webSocket数据
   */
  sendSocketMessage: function (msg, callback) {
    var that = this;
    var socketOpen = wx.getStorageSync("socketOpen");
    var socketMsgQueue = []
    msg.userType = msg.userType = wx.getStorageSync("userInfo").userType

    if (socketOpen) {
      wx.sendSocketMessage({
        data: JSON.stringify(msg)
      })
      callback()
    } else {
      socketMsgQueue.push(msg);
      that.setData({
        socketMsgQueue: socketMsgQueue
      })

      //初始化文字聊天环境
      var userInfo = wx.getStorageSync("userInfo");
      var socketUrl = wx.getStorageSync("socketUrl") || that.globalData.baiduSocketUrl
      wx.connectSocket({
        url: socketUrl + "/" + userInfo.id,
        header: {
          'content-type': 'application/json',
          'method': 'CONNECT'
        },
        success: function (res) {
          console.log("连接已经打开")
          wx.setStorageSync("socketOpen", true);
          if (socketMsgQueue && socketMsgQueue.length > 0) {
            for (var i = 0; i < socketMsgQueue.length; i++) {
              wx.sendSocketMessage({
                data: JSON.stringify(socketMsgQueue[i])
              })
            }
          }
        },
        fail: function (res) {
          console.log("连接打开失败")
        }
      })
    }
  },

  shareMediationPlan: function(data){
    var that = this

    that.saveMediationPlan(function (data){
      var roomId = data.roomId
      var userInfo = wx.getStorageSync("userInfo")

      var message = new that.Message(userInfo.id, 'link', roomId);
      message.text = "我发布了新的调解方案";
      message.username = userInfo.text
      message.planId = data.id

      that.sendSocketMessage(message, function(){
        wx.navigateBack({
          delta: 1
        })
      });
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var mediationPlan = that.data.mediationPlan
    if (options.mediationPlan){
      mediationPlan = JSON.parse(options.mediationPlan)
    }

    var caseId = options.caseId
    var roomId = options.roomId
    mediationPlan.caseId = caseId
    mediationPlan.roomId = roomId
    that.setData({
      caseId: caseId,
      roomId: roomId,
      mediationPlan: mediationPlan,
      edit: options.edit
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
  
  }
})