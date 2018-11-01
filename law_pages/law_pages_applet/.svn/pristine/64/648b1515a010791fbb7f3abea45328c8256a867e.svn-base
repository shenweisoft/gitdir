// pages/chatGroup/chatDetail/chatDetail.js
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()

var app = getApp();
var rtcroom = require('../../../utils/rtcroom.js');
var getlogininfo = require('../../../getlogininfo.js');
var util = require('../../../utils/util');

var socketMsgQueue = []; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageAddress: app.globalData.dataUrl + '/common/image/get/',
    voiceAddress: wx.getStorageSync('dataUrl').split("/lawProject")[0] + '/wxVoice/',
    userInfo: '',
    speakMode: false,//true：语音模式  false文字模式
    menuShow: false,
    voiceShow: true,
    interval: "",
    time: 0,
    socketOpen: false, //websoket连接是否打开
    socketMsgQueue: [], //消息队列
    messageArray:[],
    JuduserType: "",
    allImgUrl: [],
    bigImgsrc:'',
    bigImgHeight:'',
    showUsersList: undefined,
    usersList: []
  },
  //显示隐藏人员列表
  toggleUserList: function() {
    let that = this
    this.setData({
      showUsersList: !that.data.showUsersList,
      menuShow: false
    })
  },
  
  /**
   * 查询聊天信息
   */
  queryChatInfo: function(){
    var that = this;
    var roomid = that.data.roomid;
    var url = '/adjust/queryChatByRoomId';
    var data = {
      roomid: that.data.roomid
    }
    app.NetRequest(url, data, function(res){
      if(res.code == app.globalData.Constant.SUCCESS){
        var messageArray = res.result;
        var allImgArr = [];
        for (var i = 0; i < messageArray.length; i++){
          that.judUserType(messageArray[i])
          messageArray[i].length = messageArray[i].styleWidth
          if (messageArray[i].type == "picture") {
            allImgArr.push(messageArray[i].text);
          }
        }
        that.setData({
          messageArray: messageArray,
          allImgUrl: allImgArr
        })
      }
   })
  },

  /**
   * 更新聊天信息标志
   */
  updateChatInfo: function () {
    var that = this;
    var roomid = that.data.roomid;
    var index = that.data.index;
    var messageArray = that.data.messageArray;
    var url = '/adjust/updateSysChatInfo';
    var data = {
      chatInfoId: messageArray[index].id,
      roomid: that.data.roomid
    }
    app.NetRequest(url, data, function (res) {
      if (res.code == app.globalData.Constant.SUCCESS) {
        var messageArray = res.result;
        console.log(messageArray)
        //that.setData({
        //  messageArray: messageArray
       // })
      }
    })
  },
  /**
   * 消息
   */
  Message: function(uid, type, roomid){
    this.uid = uid;//用户id
    this.roomid = roomid;//房间id
    this.type = type;//消息类型 text, voice, picture, file
    this.name= '';//姓名
    this.personType= '';//人员类型 被申请人 法官 调解员 住建局 代理人
    this.createDate= util.formatTime(new Date());//消息时间
    this.text= '';//消息内容
  },
  /**
   * 显示/隐藏聊天按钮
   */
  toggleBtn: function(){
    var that = this;
    var speakMode = that.data.speakMode;
    that.setData({
      speakMode: !speakMode,
      menuShow: false
    })
  },
  /** 
   * 显示/隐藏菜单
   */
  toggleMenu: function(){
    var that = this
    var menuShow = that.data.menuShow;
    var showUsersList = that.data.showUsersList;
    if (showUsersList != undefined){
      that.setData({
        showUsersList: false
      })
    }
    
    if (this.data.messageArray.length < 5) {
      this.setData({
        menuShow: !menuShow
      })
    } else {
      this.setData({
        menuShow: !menuShow
      })
      // 使页面滚动到底部
      this.scrolltoBottom();
    }
  },

  /**
   * 手指接触屏幕事件
   */
  touchStart: function(e){
    var that = this;
    clearInterval(that.data.interval); // 清除setInterval
    var touchDot = e.touches[0].pageY; // 获取触摸时的原点
    const options = {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'aac',
      frameSize: 50
    }
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    recorderManager.onError((res) => {
      console.log(res);
    })
    
    // 使用js计时器记录时间
    var time = that.data.time
    var interval = setInterval(function () {
      time++;
      that.setData({
        time: time
      })

      console.log(time);
      console.log(innerAudioContext.volume)

      if (time > 600){//一分钟
        recorderManager.stop();
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
      voiceShow: false,//显示声音图标
      voiceCancel: false,
      touchDot: touchDot,
      interval: interval,
      recorderManager: recorderManager
    })
  },

  /**
   * 手指移动事件
   */
  touchMove: function(e){
    var that = this;
    var time = that.data.time;
    var touchMove = e.touches[0].pageY;//移动的原点
    var touchDot = that.data.touchDot;//移动的中点

    // 向上滑动    
    if (touchMove - touchDot <= -30) {
      wx.showToast({
        title: '取消发送',
      })

      that.setData({
        voiceShow: true,
        voiceCancel: true
      })
    }
  },

  /**
   * 手指离开屏幕事件
   */
  touchEnd: function(e){
    var that = this
    var interval = that.data.interval
    clearInterval(interval); // 清除setInterval
    var voiceLength = parseInt(that.data.time / 10);

    recorderManager.stop();
    recorderManager.onStop((res) => {
      that.tempFilePath = res.tempFilePath;

      if (!that.data.voiceCancel){//未被取消且 语音时间大于1秒
        if (voiceLength > 0){
          //上传声音文件
          app.NetUploadVoice(res.tempFilePath, { type: 'voiceChat', wordType: "", serialNo: '', name: ''}, function (res) {
            res = JSON.parse(res);
            if (res.code = app.globalData.Constant.SUCCESS) {
              var message = new that.Message('', 'voice');
              message.text = that.data.voiceAddress + res.result;
              message.length = voiceLength
              message.roomid = that.data.roomid
              message.formId = that.data.formId
              message.styleWidth = voiceLength
              that.sendSocketMessage(message);
            }
          })
        }else{
          wx.showToast({
            title: '说话时间太短',
          })
        }
      }
    })

    that.setData({
      voiceShow: true,//隐藏声音图标
      time: 0
    })
  },

  /**
   * 图片滑动开始
   */
  picTouchStart: function(e){
    var that = this;
    var touchDot = e.touches[0].pageY; // 获取触摸时的原点
    const options = {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'aac',
      frameSize: 50
    }

    that.setData({
      touchDot: touchDot,
      bigImgShow: true
    })
  },

  /**
   * 图片滑动
   */
  picTouchMove: function(e){
    var that = this;
    var touchMove = e.touches[0].pageY;//移动的原点
    var touchDot = that.data.touchDot;//移动的中点

    // 向上滑动    
    if (Math.abs(touchMove - touchDot) >= 20) {
      that.setData({
        bigImgShow: false
      })
    }
  },

  /**
   * 图片滑动结束
   */
  picTouchEnd: function(e){
    var that = this
    if (that.data.bigImgShow){
      that.setData({
        bigImgsrc: e.currentTarget.dataset.val,
        bigImgHeight: e.currentTarget.dataset.height
      })
      wx.previewImage({
        current: e.currentTarget.dataset.val, // 当前显示图片的http链接
        urls: that.data.allImgUrl // 需要预览的图片http链接列表
      })
    }
  },

  /**
   * 播放声音
   */
  play: function (e) {
    var that = this;
    var src = e.currentTarget.dataset.src;
    src = src.replace(/\\/g, '/');
    innerAudioContext.autoplay = true
    innerAudioContext.src = src,
    //播放事件
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
    })

    var index = e.currentTarget.dataset.index;
    var messageArray = that.data.messageArray;
    var messageArrayLength = that.data.messageArray.length
    //messageArray[index].isPlay = true;

    that.setData({
      messageArray: messageArray,
      index:index
    })
    //更新聊天记录标志
    if (messageArray[index].isPlay != true){
      // that.updateChatInfo();
    }
    messageArray[index].isPlay = true;

    that.setData({
      messageArray: messageArray
    })
  },

  /**
   * 文字消息
   */
  speakWord: function(e){
    var that = this;

    var message = new that.Message(that.data.userInfo.id, 'text', that.data.roomid);
    
    message.text = e.detail.value;
    message.roomid = that.data.roomid;
    message.formId = that.data.formId
    console.log(message);
    
    that.setData({
      speakWork: ""
    })

    //发送文本消息
    that.sendSocketMessage(message);
  },
  // 使页面滚动到底部
  scrolltoBottom: function(){
    wx.createSelectorQuery().select('#chatDetailBg').boundingClientRect(function (rect) {
      if (rect && rect.height)
        wx.pageScrollTo({
          scrollTop: rect.height
        })
    }).exec()
  },
  
  /**
   * 发送图片
   */
  sendImage: function(e){
    var that = this;
    var messageArray = that.data.messageArray;

    wx.chooseImage({
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        //获取图片宽高
        wx.getImageInfo({
          src: tempFilePaths[0],
          success: function (res) {
            var styleWidth = res.width / res.height;
            tempFilePaths.forEach(function (v) {
              app.NetUpload(v, { type: 'propertyChat' }, function (res) {
                res = JSON.parse(res);

                var message = new that.Message(that.data.userInfo.id, 'picture', that.data.roomid);
                message.text = that.data.imageAddress + res.result;
                message.roomid = that.data.roomid;
                message.formId = that.data.formId
                message.styleWidth = styleWidth;
                
                //发送图片信息
                that.sendSocketMessage(message);
              })
            })
          }
        })
      },
    })
  },
  
  /**
   * 视频聊天
   */
  liveChat: function(){
    // 防止两次点击操作间隔太快
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    
    var that = this;
    var userName = wx.getStorageSync("userInfo").text;//微信昵称
    if (userName){
      that.getChatRoom(function(room){
        if (room.videoRoomId) {
          console.log(userName + "进入了房间" + room.videoRoomId)
          that.goRoom(room.videoRoomId, room.name, userName);//进入房间
        } else {
          that.createRoom(room.name, userName);//创建房间
          console.log(userName + "创建了房间" + room.videoRoomId)
        }
      });
    }else{
      app.getSystemData();
      wx.showToast({
        title: '正在初始化，请稍后',
        icon: 'success',
        duration: 1000
      })
    }
  },
  
  /**
   * 调解方案
   */
  mediationPlan: function(){
    var that = this;
    var formId = that.data.formId
    wx.navigateTo({
      url: '../mediationPlan/mediationPlan?caseId=' + formId + "&roomid=" + that.data.roomid,
    })
  },

  /**
   * 创建聊天室
   */
  createRoom: function(roomName, userName){
    var that = this
    // 防止两次点击操作间隔太快
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }

    var url = '../../multiroom/room/room?type=create&roomName=' + roomName + '&userName=' + userName + "&type=create";
    wx.navigateTo({
      url: url
    });
    wx.showToast({
      title: '创建并进入房间',
      icon: 'success',
      duration: 1000
    })

    this.setData({ 'tapTime': nowTime });
  },

  /**
   * 进入聊天室
   */
  goRoom: function (roomid, roomname, userName) {
    // 防止两次点击操作间隔太快
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }

    if (!wx.createLivePlayerContext) {
      setTimeout(function () {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后再试。',
          showCancel: false
        });
      }, 0);
    } else {
      // 版本正确，允许进入
      var url = '../../multiroom/room/room?roomID=' + roomid + '&roomName=' + roomname + '&userName=' + userName + "&type=enter";
      wx.navigateTo({ url: url });
      wx.showToast({
        title: '进入房间',
        icon: 'success',
        duration: 1000
      })
      this.setData({ 'tapTime': nowTime });
    }
    
  },

  /**
   * 发送webSocket数据
   */
  sendSocketMessage: function(msg){
    var that = this;
    var socketOpen = wx.getStorageSync("socketOpen");
    var socketMsgQueue = socketMsgQueue
    msg.userType = that.data.userInfo.userType
    msg.username = that.data.userInfo.text

    if (socketOpen) {
      wx.sendSocketMessage({
        data: JSON.stringify(msg)
      })
    } else {
      //此处再次打开websocket!
      console.log("发送信息的时候websocket已经关闭，需要再次打开")
      socketMsgQueue.push(msg);

      //初始化文字聊天环境
      var socketUrl = wx.getStorageSync("socketUrl") || that.globalData.baiduSocketUrl
      wx.connectSocket({
        url: socketUrl + "/" + that.data.userInfo.id,
        header: {
          'content-type': 'application/json',
          'method': 'CONNECT'
        },
        success: function(res){
          console.log("连接已经打开")
          wx.setStorageSync("socketOpen", true);
          if (socketMsgQueue && socketMsgQueue.length > 0){
            for (var i = 0; i < socketMsgQueue.length; i++) {
              wx.sendSocketMessage({
                data: JSON.stringify(socketMsgQueue[i])
              })
            }

            socketMsgQueue = [];
          }
        },
        fail: function(res){
          console.log("连接打开失败")
        }
      })
    }
  },

  /**
   * 查看案件详情
   */
  viewPlan: function(e){
    var that = this;
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../mediationDetail/mediationDetail?planId=' + id + "&roomId=" + that.data.roomid,
    })
  },

  hideKeyboard: function(){
    this.setData({
      menuShow: false
    })
    if (this.data.showUsersList) {
      this.setData({
        showUsersList: false
      })
    }
  },

  /**
   * 查询视频房间信息
   */
  getChatRoom: function(callback){
    var that= this;
    var url = '/adjust/queryChatRoomById';
    var data = {
      id: that.data.roomid
    }

    app.NetRequest(url, data, function(res){
      if(res.code == app.globalData.Constant.SUCCESS){
        callback(res.result)
      }
    })
  },
  
  judUserType: function (message) {
    var that = this;
    switch (message.userType) {
      case "0":
        that.setData({
          JuduserType: "公民"
        })
        break;
      case "1":
        that.setData({
          JuduserType: "法官"
        })
        break;
      case "2":
        that.setData({
          JuduserType: "调解员"
        })
        break;
      case "3":
        that.setData({
          JuduserType: "鉴定员"
        })
        break;
      case "4":
        that.setData({
          JuduserType: "保险公司"
        })
        break;
    }
    
  },

  //查询人员列表
  queryUserByRoomId: function() {
    let url = '/adjust/queryUserByRoomId', that = this
    app.NetRequest(url, { roomIdList: [that.data.roomid]}, res=>{
      if(res.code == 0) {
        //将调解员放到第一位
        for(var i = 0; i < res.result.length; i++) {
          if (res.result[i].userType == '调解员'){
            var first = res.result.splice(i, 1)
            res.result.unshift(first[0])
            break;
          }
        }
        that.setData({
          usersList: res.result
        })
      }
      console.log(this.data.usersList)
    })
  },

  //添加/删除群成员
  toMediationUsers: function (e) {
    let that = this, flag = e.currentTarget.dataset.flag, url = ''
    if (flag == '0') { //添加
      url = '../mediationUsers/mediationUsers?caseId=' + this.data.formId + '&userList=' + JSON.stringify(this.data.usersList) + '&roomId=' + this.data.roomid
    } else { //删除
      url = '../mediationUsers/mediationUsers?userList=' + JSON.stringify(this.data.usersList) + '&roomId=' + this.data.roomid
    }
    wx.navigateTo({
      url: url
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var roomid = options.roomid;
    var videoRoomId = options.videoRoomId
    var formId = options.formId;
    var roomName = options.roomName
    var userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo)
    
    that.setData({
      formId: formId,
      roomid: roomid,
      roomName: roomName,
      videoRoomId: videoRoomId,
      userType: that.data.JuduserType,
      userInfo: userInfo,
      createBy: options.createBy,
      voiceAddress: wx.getStorageSync('dataUrl').split("lawProject")[0] + '/wxVoice/',
    })

    wx.setNavigationBarTitle({
      title: roomName,
    })

    //查询聊天记录
    that.queryChatInfo();

    //查询聊天人员
    that.queryUserByRoomId();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    setTimeout(function(){
      wx.createSelectorQuery().select('#chatDetailBg').boundingClientRect(function (rect) {
        wx.pageScrollTo({
          scrollTop: rect.height
        })
      }).exec()
    },500)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //监听服务器消息
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
      var data = JSON.parse(res.data);

      console.log(data);
      that.judUserType(data);

      var messageArray = that.data.messageArray;
      if (data.roomid == that.data.roomid) {//房间对应
        messageArray.push(data);
      }

      //提示与toUserId相同的登录人被提出
      if (data.flag == '1' && data.toUserId == that.data.userInfo.id) {
        wx.showModal({
          title: '提示',
          content: '您已被调解员请离聊天室',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                data: 3
              })
            }
          }
        })
      }

      that.setData({
        messageArray: messageArray
      })
      // 使页面滚动到底部
      that.scrolltoBottom();
    })
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
  bigImage:function(e){
    console.log(e.currentTarget.dataset)
    this.setData({ 
      bigImgsrc: e.currentTarget.dataset.val,
      bigImgHeight: e.currentTarget.dataset.height
    })
  },
  PicHide:function(e){
    this.setData({
      bigImgsrc:""
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})