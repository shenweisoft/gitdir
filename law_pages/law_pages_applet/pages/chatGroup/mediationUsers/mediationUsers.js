// pages/chatGroup/chatDetail/chatDetail.js
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var util = require('../../../utils/util');

var app = getApp();
var socketMsgQueue = []; //存储消息列队
Page({

  /**
   * 页面的初始数据
   */
  data: {
    caseId: '',
    userList: [], //已添加人员
    allUserList: [], //全部人员
    newUserList: [], //可新增的人员
    isCheckedAll: true, //标识人员是否全部被选择
    hidden: true
  },

  //获取两数组差集
  getArrDifference: function(all, arr, isFlag) {
    var flag, newUserList = [], that = this
    for (var i = 0; i < all.length; i++) {
      flag = false
      for (var x = 0; x < arr.length; x++) {
        if (all[i].id == arr[x].id) {
          flag = true
          if (isFlag) all[i].isChecked = true
        }
      }
      if (!flag && !isFlag) {
        newUserList.push(all[i])
      }
      if (isFlag) {
        newUserList = all
        that.setData({ isCheckedAll: false })
        newUserList.forEach(v=>{
          if(!v.isChecked) that.setData({isCheckedAll: true})
        })
      }
    }
    return newUserList;
  },

  //请求用户列表
  queryUserList: function(){
    let caseId = this.data.caseId, url = '', that = this, newUserList = [], userList = this.data.userList
    if (caseId) { //添加用户
      url = '/adjust/queryUserByCaseId'
      app.NetRequest(url, { caseId: caseId}, res=>{
        console.log(res)
        if(res.code == 0) {
          //过滤出未添加的人员(获取两数组差集)
          newUserList = that.getArrDifference(res.result, userList)
          console.log(newUserList)
          that.setData({
            newUserList: newUserList,
            allUserList: res.result
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '获取信息失败，请重试！',
            showCancel: false
          })
        }
      })
    } else { //删除用户
      newUserList = userList
      //在列表中屏蔽自己
      for (var i = 0; i < newUserList.length; i++) {
        if (newUserList[i].id == app.globalData.userInfo.id) {
          newUserList.splice(i, 1)
        }
      }
    }
    that.setData({
      newUserList: newUserList
    })
  },

  //选择人员
  handleChecked: function(e) {
    let checkedIndexArr = e.detail.value, checkedArr = []
    for (var i = 0; i < checkedIndexArr.length; i++) {
      checkedArr.push(this.data.newUserList[checkedIndexArr[i]])
    }
    this.setData({
      checkedIndexArr: checkedIndexArr,
      checkedArr: checkedArr
    })
  },

  //点击取消
  cancel: function() {
    wx.navigateBack({
      data: 1
    })
  },

  //点击确定
  affirm: function() {
    let caseId = this.data.caseId, that = this, checkedArr = this.data.checkedArr, url
    if (checkedArr && checkedArr.length > 0) {
      this.setData({ hidden: false })
      url = caseId ? '/adjust/insertSysUserRoom' : '/adjust/deleteSysUserRoom'
      checkedArr.forEach(v => {
        let data = { roomId: that.data.roomId, userId: v.id, userType: v.userType }
        app.NetRequest(url, data, res => {
          if (res.code == '0') {
            wx.showToast({
              title: caseId ? '添加成功' : '删除成功',
              icon: 'succes',
              duration: 1000,
              mask: true
            })
            //为操作过的人员添加isChecked标识
            that.data.newUserList = that.getArrDifference(that.data.newUserList, that.data.checkedArr, 'flag')
            that.setData({
              newUserList: that.data.newUserList
            })
            //更新上个页面数据
            var pages = getCurrentPages()
            var prev = pages[pages.length - 2]
            prev.queryUserByRoomId()
            that.setData({ 
              checkedArr: [],
              hidden: true 
            })
            //发布删除/新增通知
            let name = v.name ? v.name : v.text
            let text = caseId ? name + '已被调解员邀进聊天室' : name + '已被调解员请离聊天室'
            let flag = caseId ? '0' : '1' //删除，修改标识

            var pages = getCurrentPages();
            var prePage = pages[pages.length - 2];
            prePage.onShow();
            that.sendSocketMessage(new that.Message('', 'notice', that.data.roomId, text, v.id, flag))
          } else {
            wx.showModal({
              title: '提示',
              content: caseId ? '添加失败，请重试！' : '删除失败，请重试！',
              showCancel: false
            })
          }
        })
      })
    }
  },

  /**
   * 消息
   */
  Message: function (uid, type, roomid, text, toUserId, flag) {
    this.uid = uid;//用户id
    this.roomid = roomid;//房间id
    this.type = type;//消息类型 text, voice, picture, file
    this.name = '';//姓名
    this.personType = '';//人员类型 被申请人 法官 调解员 住建局 代理人
    this.createDate = util.formatTime2(new Date());//消息时间
    this.text = text;//消息内容
    this.toUserId = toUserId; //发给的用户id
    this.flag = flag; //添加0 删除1
  },

  /**
   * 发送webSocket数据
   */
  sendSocketMessage: function(msg) {
    let that = this, socketOpen = wx.getStorageSync("socketOpen")//查看当前webSocket链接状态
    msg.userType = that.data.userInfo.userType
    msg.username = that.data.userInfo.text

    //判断是否链接
    if (socketOpen) {
      wx.sendSocketMessage({
        data: JSON.stringify(msg)
      })
    } else {
      //此处再次打开websocket!
      console.log("发送信息的时候websocket已经关闭，需要再次打开")
      socketMsgQueue.push(msg);//将文字存储到消息队列

      //初始化文字聊天环境
      var socketUrl = wx.getStorageSync("socketUrl") || that.globalData.baiduSocketUrl
      wx.connectSocket({
        url: socketUrl + "/" + that.data.userInfo.id,
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
            socketMsgQueue.length = 0
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
    let title = '', that = this
    this.setData({
      roomId: options.roomId,
      caseId: options.caseId,
      userList: JSON.parse(options.userList),
      userInfo: app.globalData.userInfo
    })
    //请求用户列表
    this.queryUserList()
    //判断是添加还是删除
    if(options.caseId) {
      title = '添加群成员'
    } else {
      title = '删除群成员'
    }
    wx.setNavigationBarTitle({
      title: title
    });

    //监听服务器消息
    wx.onSocketMessage(function(res) {
      console.log(res)
      
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
  // 放大图片
  bigImage: function (e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      bigImgsrc: e.currentTarget.dataset.val,
      bigImgHeight: e.currentTarget.dataset.height
    })
  },
  PicHide: function (e) {
    this.setData({
      bigImgsrc: ""
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})