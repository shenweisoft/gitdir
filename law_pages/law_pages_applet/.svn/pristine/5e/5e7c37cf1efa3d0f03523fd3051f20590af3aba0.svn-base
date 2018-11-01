// pages/chatGroup/roomList/roomList.js
var rtcroom = require('../../../utils/rtcroom.js');
var getlogininfo = require('../../../getlogininfo.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomArray: [],
    socketOpen: false, //websoket连接是否打开
    socketMsgQueue: [], //消息队列
    messageArray: [],
    isGetLoginInfo: false,  // 是否已经获取登录信息
    firstshow: true,// 第一次显示页面
    tapTime: '',
    userType: "",
    delBtnWidth: 81 //删除按钮宽度单位（rpx） 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var formId = options.caseId
    that.setData({
      formId: formId,
      mediatorId: options.mediatorId,
      createBy: options.createBy,
      userType: app.globalData.userInfo.userType
    })

    //房间列表数据
    that.initData(function(){
      that.onSocketMessage();
    });
  },

  /**
   * 房间列表数据
   */
  initData: function(callback){
    var that = this;
    var url = '/adjust/queryRoomByUser';
    var data = {
      caseId: that.data.formId
    }

    app.NetRequest(url, data, function(res){
      if (res.code == app.globalData.Constant.SUCCESS){
        // if (!res.result || res.result.length == 0){

        //   that.initRoomInfo(function(){
        //     that.queryUserInfoOfCase(function (userArray){
        //       console.log(userArray)
        //       that.initRoomUserInfo(userArray)
        //     });
        //   })
        // }
        that.setData({
          roomArray: res.result
        })

        if (typeof callback == 'function'){
          callback();
        }
      }
    })
  },

  /**
   * 获取案件干系人
   */
  queryUserInfoOfCase: function(callback){
    var that = this
    var url = '/adjust/queryUserByCaseId';
    var caseId = that.data.formId
    app.NetRequest(url, { caseId: caseId}, function (res) {
      if (res.code == app.globalData.Constant.SUCCESS) {
        var userArray = []
        if (res.result && res.result.length > 0){
          res.result.forEach((v) =>{
            userArray.push({
              roomId: that.data.room.id,
              userId: v.id
            })
          })
        }
        
        //增加调解员
        userArray.push({
          roomId: that.data.room.id,
          userId: that.data.mediatorId
        })
        
        callback(userArray)
      }
    })
  },

  /**
   * 初始化房间
   */
  initRoomInfo: function(callback){
    var that = this
    var url = '/adjust/insertSysChatRoom';
    var data = {
      caseId: that.data.formId,
      name: '默认群',
    }

    app.NetRequest(url, data, function (res) {
      if (res.code == app.globalData.Constant.SUCCESS) {
        var roomArray = []
        roomArray.push(res.result)
        that.setData({
          roomArray: roomArray,
          room: res.result
        })
        callback()
      }
    })
  },

  /**
   * 初始化房间内人员
   */
  initRoomUserInfo: function (userArray) {
    var that = this
    var url = '/adjust/insertSysUserRoom';
    userArray.forEach((v) => {
      app.NetRequest(url, v, function (res) {
        if (res.code == app.globalData.Constant.SUCCESS) {
          console.log("人员插入成功")
        } else {
          wx.showToast({
            title: res1.message || '人员初始化出错',
          })
        }
      })
    })
  },

  /**
   * 监听服务器消息
   */
  onSocketMessage: function(res){
    var that = this;
    var roomArray = that.data.roomArray;
    wx.onSocketMessage(function (res) {
      var message = JSON.parse(res.data)
      if (message.roomid) {
        roomArray.forEach((v) => {
          if (v.id == message.roomid) {
            v.newMessage = true
          }
        })

        that.setData({
          roomArray: roomArray
        })
      }
    }) 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
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

  /**
   * 查看聊天详情
   */
  viewChatInfo: function(e){
    var that = this;
    //确认webSocket是否已经连接
    var socketOpen = wx.getStorageSync("socketOpen")
    if (!socketOpen) {
      app.connectSocket();
    }
    var roomid = e.currentTarget.dataset.roomid;
    var videoRoomId = e.currentTarget.dataset.videoRoomId;
    var roomName = e.currentTarget.dataset.name
    var formId = that.data.formId
    wx.setStorageSync("webRoomId", roomid)
    wx.navigateTo({
      url: '../chatDetail/chatDetail?formId=' + formId + '&roomid=' + roomid + "&videoRoomId=" + videoRoomId + "&createBy=" + this.data.createBy + "&roomName=" + roomName,
    })
  },
  /**
   * 创建新房间
   */
  newRoom: function(){
    var that = this
    wx.navigateTo({
      url: '../addGroup/addGroup?id=' + that.data.formId,
    })
  },

  /**
   * 删除房间
   */
  delRoom: function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除么',
      success: function (data) {
        if (data.confirm) {
          var userInfo = wx.getStorageSync("userInfo")
          var index = e.currentTarget.dataset.index;
          var room = e.currentTarget.dataset.room;

          if (userInfo.id != room.createBy){
            wx.showToast({
              title: '无删除权限！',
            })
            return
          }

          var url = '/adjust/deleteSysChatRoom'
          var data = {
            id: room.id
          }
          app.NetRequest(url, data, function (res) {
            if (res.code == app.globalData.Constant.SUCCESS) {
              var roomArray = that.data.roomArray
              roomArray.splice(index, 1);
              that.setData({
                roomArray: roomArray
              })
            }
          })
        } else if (data.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 删除滑动效果
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置 
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    
    var that = this
    this.initdata(that)
    if (e.touches.length == 1) {
      //手指移动时水平方向位置 
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值 
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变 
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离 
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度 
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项 
      var index = e.currentTarget.dataset.index;
      var roomArray = this.data.roomArray;
      roomArray[index].txtStyle = txtStyle;
      //更新列表的状态 
      this.setData({
        roomArray: roomArray
      });
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置 
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离 
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮 
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项 
      var index = e.currentTarget.dataset.index;
      var roomArray = this.data.roomArray;
      roomArray[index].txtStyle = txtStyle;
      //更新列表的状态 
      this.setData({
        roomArray: roomArray
      });
    }
  },
  //获取元素自适应后的实际宽度 
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应 
      // console.log(scale); 
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error 
    }
  },
 
  initdata: function (that) {
    var roomArray = that.data.roomArray
    for (var i = 0; i < roomArray.length; i++) {
      roomArray[i].txtStyle = ""
    }
    that.setData({ roomArray: roomArray })
  } 



})