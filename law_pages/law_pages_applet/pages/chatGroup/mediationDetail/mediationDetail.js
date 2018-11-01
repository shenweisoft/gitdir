// pages/litigants/mediationDetail/mediationDetail.js
const app = getApp();
const plugin = requirePlugin("WechatSI")
const util = require('../../../utils/util.js')
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    voiceShow: true,
    time: 0,
    voiceCancel: false,
    interval: ''
  },

  /**
   * 查询详细信息
   */
  queryDetail: function(){
    var that = this
    var planId = that.data.planId

    var url = '/adjust/getMediationPlanById'
    var data = {
      id: planId
    }
    app.NetRequest(url, data, function(res){
      if(res.code == app.globalData.Constant.SUCCESS){
        var mediationPlan = res.result
        mediationPlan = filterQuery(mediationPlan)
        that.setData({
          mediationPlan: mediationPlan
        })
      }
    })

    //过滤查询信息
    function filterQuery(mediationPlan){
      mediationPlan.feeArray = JSON.parse(mediationPlan.feeArray)
      return mediationPlan
    }
  },

  /**
   * 评论对象
   */
  Evaluation: function (planId, content, headIcon){
    this.planId= planId
    this.content = content
    this.headIcon = headIcon
  },

  /**
   * 输入数据
   */
  setContent: function(e){
    var that = this

    that.setData({
      content: e.detail.value
    })
  },

  /**
   * 提交留言
   */
  commit: function(){
    var that = this
    var content = that.data.content

    if (!content){
      wx.showToast({
        title: '不能发送空信息',
      })
      return;
    }

    var url = '/adjust/submitMediationEval';

    var headIcon = wx.getStorageSync('openUser').avatarUrl || '/images/eval_head.png';
    var data = new that.Evaluation(that.data.planId, content, headIcon)
    app.NetRequest(url, data, function(res){
      if (res.code == app.globalData.Constant.SUCCESS){
        var mediationPlan = that.data.mediationPlan
        mediationPlan.evalList.push(res.result)
        that.setData({
          content: "",
          mediationPlan: mediationPlan
        })

        that.shareMediation();
      }
    })
  },

  /**
   * 初始化语音识别回调
   * 绑定语音播放开始事件
   */
  initRecord: function () {
    let that = this;
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      console.log(res);
    }

    // 识别结束事件
    manager.onStop = (res) => {
      console.log(res)
      //储存语音文字
      that.setData({
        content: res.result,
        hidden: true
      })
      // that.commit()
    }

    // 识别错误事件
    manager.onError = (res) => {
      wx.showToast({
        title: '当前网络不可用',
      })
      that.setData({
        hidden: true,
      })
    }
  },

  // 权限询问
  getRecordAuth: function () {
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              console.log("succ auth")
            }, fail() {
              console.log("fail auth")
            }
          })
        } else {
          console.log("record has been authed")
        }
      }, fail(res) {
        console.log("fail")
      }
    })
  },

  //开始录音
  streamRecord: function (e) {
    let that = this
    var touchDot = e.touches[0].pageY; // 获取触摸时的原点
    // 权限询问
    this.getRecordAuth();
    manager.start()
    this.setData({
      recording: false,
      voiceShow: false,
      touchDot: touchDot,
      voiceCancel: false
    })
    // 使用js计时器记录时间
    var time = that.data.time
    var interval = setInterval(function () {
      time++;
      that.setData({
        time: time
      })
      if (time > 600) {//一分钟
        manager.stop();
        wx.showToast({
          title: '最长时间60s',
        })
        clearInterval(interval)
        that.setData({
          time: time,
          voiceShow: true
        })
      }
    }, 100);
    that.setData({
      interval: interval
    })
  },

  //结束录音
  streamRecordEnd: function (e) {
    if (!this.data.voiceCancel) {
      var interval = this.data.interval
      clearInterval(interval); // 清除setInterval
      manager.stop()
      this.setData({
        hidden: false,
        voiceShow: true,
        time: 0
      })
    }
  },

  //向上滑动
  streamRecordMove: function (e) {
    var that = this;
    var time = that.data.time;
    var touchMove = e.touches[0].pageY;//移动的原点
    var touchDot = that.data.touchDot;//移动的中点

    // 向上滑动    
    if (touchMove - touchDot <= -10) {
      wx.showToast({
        title: '取消发送',
      })
      var interval = that.data.interval
      clearInterval(interval); // 清除setInterval
      that.setData({
        voiceShow: true,
        time: 0,
        voiceCancel: true
      })
    }
  },

  /**
   * 分享调解方案
   */
  shareMediation: function () {
    var that = this
    var roomId = that.data.roomId
    var userInfo = wx.getStorageSync("userInfo")

    var message = new that.Message(userInfo.id, 'link', roomId);
    message.text = userInfo.text + "\r\n评论了调解方案";
    message.username = userInfo.text
    message.planId = that.data.planId

    that.sendSocketMessage(message);
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var planId = options.planId
    var roomId = options.roomId
    //语音识别
    this.initRecord();

    that.setData({
      planId: planId,
      roomId: roomId
    })

    that.queryDetail();
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