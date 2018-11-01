// pages/mediate/mediationPlan/mediationPlan.js
const app = getApp()
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    socketMsgQueue: []
  },

  /**
   * 新建方案
   */
  addMediation: function(){
    var that = this
    wx.navigateTo({
      url: '../newMediationPlan/newMediationPlan?caseId=' + that.data.caseId + "&roomId=" + that.data.roomId,
    })
  },
  
  /**
   * 回复
   */
  reply: function(e){
    var that = this
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../mediationDetail/mediationDetail?reply=1&planId='+id,
    })
  },

  /**
   * 编辑
   */
  edit: function(e){
    var that = this
    var mediationPlan = e.currentTarget.dataset.value
    wx.navigateTo({
      url: '../newMediationPlan/newMediationPlan?mediationPlan=' + JSON.stringify(mediationPlan) + "&caseId=" + that.data.caseId + "&roomId=" + that.data.roomId +"&edit=1"
    })
  },

  /**
   * 详情
   */
  detail: function(e){
    var that = this
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../mediationDetail/mediationDetail?planId=' + id + "&roomId=" + that.data.roomId,
    })
  },

  /**
   * 分享调解方案
   */
  shareMediation: function(e){
    var that = this
    var roomId = that.data.roomId
    var userInfo = wx.getStorageSync("userInfo")

    var message = new that.Message(userInfo.id, 'link', roomId);
    message.text = "我发布了新的调解方案";
    message.username = userInfo.text
    message.planId = e.currentTarget.dataset.id

    that.sendSocketMessage(message);

    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 发送webSocket数据
   */
  sendSocketMessage: function (msg) {
    var that = this
    var socketOpen = wx.getStorageSync("socketOpen")
    var socketMsgQueue = that.data.socketMsgQueue
    msg.userType = wx.getStorageSync("userInfo").userType

    if (socketOpen) {
      wx.sendSocketMessage({
        data: JSON.stringify(msg)
      })
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var caseId = options.caseId
    var roomId = options.roomid
    that.setData({
      caseId: caseId,
      roomId: roomId,
      userInfo: wx.getStorageSync("userInfo")
    })

    that.queryMediationPlan()
  },

  queryMediationPlan: function(){
    var that = this
    var url = '/adjust/getMediationPlanList';
    var data = {
      caseId: that.data.caseId,
      roomId: that.data.roomId
    }
    app.NetRequest(url, data, function (res) {
      if (res.code == app.globalData.Constant.SUCCESS) {
        var mediationArray = filterQuery(res.result)
        that.setData({
          mediationArray: mediationArray
        })
      }
    })

    //过滤查询结果
    function filterQuery(mediationArray) {
      if (mediationArray && mediationArray.length != 0) {
        mediationArray.forEach((v) => {
          v.feeArray = JSON.parse(v.feeArray)
        })
      }

      return mediationArray
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