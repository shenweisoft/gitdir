// pages/litigants/step3/step3.js
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
    stepArray: [],
    lawCase: {},
    showToast: false,
    toastType: '',
    content: '',
    hidden: true,
    voiceShow: true,
    time: 0,
    voiceCancel: false,
    interval: ''
  },

  //显示弹框
  showToast: function (type, content) {
    let that = this;
    if (that.data.showToast) {
      return;
    }
    that.setData({
      showToast: true,
      toastType: type,
      content: content
    })
    setTimeout(function () {
      that.setData({
        showToast: false,
        toastType: type,
        content: ''
      })
    }, 2000)
  },

  setFactReason: function(event) {
    console.log(event)
    this.setData({
      ['lawCase.factReason']: event.detail.value
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
      that.data.lawCase.factReason = that.data.lawCase.factReason ? that.data.lawCase.factReason + res.result : res.result;
      that.setData({
        ['lawCase.factReason']: that.data.lawCase.factReason
      })
      that.setData({
        hidden: true
      })
    }

    // 识别错误事件
    manager.onError = (res) => {
      that.showToast('error', '当前网络状况不佳！')
      that.setData({
        hidden: true,
      })
    }
  },

  // 权限询问
  getRecordAuth: function () {
    wx.getSetting({
      success(res) {
        console.log("succ")
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
        console.log(res)
      }
    })
  },

  //开始录音
  streamRecord: function(e) {
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
  streamRecordMove: function(e) {
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

  //将当前对象保存到上一步中
  saveToPrev: function() {
    let pages = getCurrentPages()
    let prev = pages[pages.length - 2]
    prev.setData({
      lawCase: this.data.lawCase
    })
    wx.navigateBack({
      delta: 1
    })
  },

  //保存
  save: function (event, isNext) {
    //验证数据
    if (isNext != 'save' && !this.data.lawCase.factReason) {
      this.showToast('error', '请输入事实理由！')
      return false;
    }
    //提交数据
    let url = app.globalData.userInfo.userType == '2' ? '/adjust/insertAdjustDetail' : '/adjust/insertAppPersonAdjustDetail', that = this;
    app.NetRequest(url, that.data.lawCase, res => {
      console.log(res)
      if (res.code == '0') {
        if (!isNext) {
          that.showToast('success', '保存成功');
        } else if (isNext == 'save') {
          //将当前对象保存到上一步中
          that.saveToPrev()
        } else {
          //判断用户身份
          wx.navigateTo({
            url: '../step4/step4?lawCase=' + JSON.stringify(that.data.lawCase)
          })
        }
      }
    })
  },

  //下一步
  next: function () {
    this.save('', 'next');
  },

  //上一步
  prev: function () {
    this.save('', 'save');
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let lawCase = JSON.parse(options.lawCase);
    this.setData({
      lawCase: lawCase
    })

    //判断用户身份
    var stepArray, step;
    if (app.globalData.userInfo.userType == '2') {
      stepArray = [{ id: 1, name: '申请人' }, { id: 2, name: '被申请人' }, { id: 3, name: '证据信息' }];
      step = 3;
    } else {
      stepArray = [{ id: 1, name: '申请人' }, { id: 2, name: '被申请人' }, { id: 3, name: '事实理由' }, { id: 4, name: '证据信息' }, { id: 5, name: '赔偿信息' }];
      step = 3;
    }
    this.setData({
      stepArray: stepArray,
      step: step
    })

    //语音识别
    this.initRecord();
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