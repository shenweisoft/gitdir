// pages/caseList/caseList.js


const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    pageVO: {
      pageSize: 10,
      pageNo: 1,
      pageTotal: 0
    },
    listType: 'adjust',
    isDocument: '',
    resLength: "",
    addressArr: [],
    showLoading: false,
    resEmpty: false,
    userType: '',
    isLoginShow: false,
    isLoading: false
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

  //切换列表
  handleListType: function(event) {
    let listType = event.currentTarget.dataset.type
    this.setData({
      listType: listType,
      ['pageVO.pageNo']: 1,
      list: []
    })
    this.getCaseList('', 'listType')
  },

  getCaseList: function (isDropDown, isListType, nameOrSerialNum) {
    let that = this;
    var pageNum = that.data.pageVO.pageNo;
    if (pageNum <= 1){
      that.setData({
        list: [],
        userType: app.globalData.userInfo.userType
      })
    }
    let listType = this.data.listType;
    let url = listType == 'adjust' ? (app.globalData.userInfo.userType == 2 ? "/adjust/queryJyAdjustInfoList" : "/adjust/queryAppAdjustByIdNo") : "/adjust/queryLawInfoListByPhone";
    let pageNo = that.data.pageVO.pageNo;
    let data = listType == 'adjust' ? (app.globalData.userInfo.userType == 2 ? { pageNo: pageNo, orgId: app.globalData.userInfo.userDepartList[0].orgId, adjustPersonId: app.globalData.userInfo.id, searchOverallSituation: nameOrSerialNum } : { pageNo: pageNo, searchOverallSituation: nameOrSerialNum }) : { pageNo: pageNo, searchOverallSituation: nameOrSerialNum };
    that.setData({
      isLoading: true
    })
    wx.showLoading({
      title: "加载中"
    })
    app.NetRequest(url, data, res => {
      if(res.code == app.globalData.Constant.SUCCESS){
        wx.hideLoading()
        that.setData({
          isLoading: false
        })
        that.setData({
          resLength: res.result ? res.result.length : 0
        })
        console.log(res.result);
        console.log(that.data.resLength);
        //这里
        if (listType == 'adjust' && res.result) {
          for (var i = 0; i < res.result.length; i++) {
            if (res.result[i].mediationAddress) {
              var mediationAddress = res.result[i].mediationAddress ? JSON.parse(res.result[i].mediationAddress) : ""
              res.result[i].mediationAddress = mediationAddress.regionName + " " + mediationAddress.address
            }
          }
        }

        if (!res.result || (res.result.length == 0 && isDropDown)) {
          wx.showModal({
            title: '提示',
            content: '数据已全部显示',
            showCancel: false
          })
          return;
        }
        if (isListType) {
          that.data.list.length = 0
          that.setData({
            list: that.data.list
          })
        }
        that.setData({
          list: that.data.list.concat(res.result)
        })
      }
    })
  },

  getCaseTotal: function() {
    let that = this;
    let url = "/adjust/queryAdjustCountByIdNo";
    app.NetRequest(url, {}, res => {
      that.setData({
        ['pageVO.pageTotal']: res.result
      })
    })
  },

  winLocation: function (e) {
    var that = this;
    var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
    var config = require('../../../config.js');
    var demo = new QQMapWX({
      key: config.mapKey
    });
    // 调用接口
    
    var winAddressLocation = e.currentTarget.dataset.address
    console.log(winAddressLocation);
    demo.geocoder({
      address: winAddressLocation,
      success: function (res) {
        console.log(res);
        wx.openLocation({
          latitude: res.result.location.lat,
          longitude: res.result.location.lng,
          scale: 18,
          address: winAddressLocation
        })  
      },
      fail: function (res) {
        wx.showToast({
          title: '请检查网络',
          icon: 'success',
          duration: 2000
        })
        return false
      }
    });
    

  },
  //搜索案件
  searchCase: function (event) {
    //判断是否已登录（userInfo标识）
    if (!app.globalData.userInfo) {
      this.notLoggedInTip();
    }else{
      console.log(event.detail.value);
      this.getCaseList('', '', event.detail.value)
    }
  },
  //查看页面详情
  caseDetail: function(event) {
    let index = event.currentTarget.dataset.index;
    let lawCase = this.data.list[index];
    console.log(lawCase);
    //调解员
    if (app.globalData.userInfo.userType == '2') {
      if (lawCase.state == '1000' && !lawCase.isReturn){
        wx.navigateTo({
          url: '../step1/step1?serialNo=' + lawCase.serialNo + '&id=' + lawCase.id
        })
      }else{
        wx.setStorageSync('case', lawCase);
        wx.navigateTo({
          url: '../caseDetail/caseDetail?serialNo=' + lawCase.serialNo + '&id=' + lawCase.id
        })
      }
    } else {//当事人
      if (lawCase.state == '2000') {
        wx.navigateTo({
          url: '../step1/step1?serialNo=' + lawCase.serialNo + '&id=' + lawCase.id
        })
      } else {
        wx.navigateTo({
          url: '../caseDetail/caseDetail?serialNo=' + lawCase.serialNo + '&id=' + lawCase.id
        })
      }
    }
  },
  errorTip: function (content) {
    wx.showModal({
      title: '退回原因',
      content: content,
      showCancel: false,
      confirmText: '关闭',
      confirmColor: '#0e9deb',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //退回原因
  workReturn: function (event){
    let index = event.currentTarget.dataset.index;
    let list = this.data.list[index].workFlowlist;
    let content = "";
    if (list){
      content = list[0].remark
      this.errorTip(content)
    }else{
      this.errorTip("暂未查到相关原因")
    }
  },
  
  //证据补充
  addEvidence: function(event) {
    let index = event.currentTarget.dataset.index;
    let lawCase = this.data.list[index];
    if (lawCase.state == 1000){
      wx.navigateTo({
        url: '../addEvidence/addEvidence?serialNo=' + lawCase.serialNo + '&id=' + lawCase.id
      })
    }
    if (this.data.userType == '0' && lawCase.state == 2000){
      wx.navigateTo({
        url: '../addEvidence/addEvidence?serialNo=' + lawCase.serialNo + '&id=' + lawCase.id
      })
    }
  },

  //申请理赔
  claims: function(event) {
    var that = this, index = event.currentTarget.dataset.index
    if (that.data.list[index].claimState == '0') { //发起理赔
      wx.showModal({
        title: '',
        content: '申请一键理赔，将进入保险公司的理赔环节，确定要申请吗？',
        success: function (res) {
          if (res.confirm) {
            var serialNo = that.data.list[index].serialNo;
            var operateType = that.data.listType == 'adjust' ? 0 : 1; //0调解 1诉讼
            var data = { serialNo: serialNo, operateType: operateType };
            var url = '/interface/claimIdentificationReturn';
            app.NetRequest(url, data, function (res) {
              if (res.code == 0) {
                wx.showToast({
                  title: '进入理赔阶段',
                  icon: 'success',
                  duration: 2000
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.message,
                  showCancel: false
                })
              }
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    if (that.data.list[index].claimState == '2') { //查看理赔详情
      //跳转到理赔详情
      var serialNo = that.data.list[index].serialNo;
      var operateType = that.data.listType == 'adjust' ? 0 : 1; //0调解 1诉讼
      wx.navigateTo({
        url: '../detailsOfClaims/detailsOfClaims?serialNo=' + serialNo + '&operateType=' + operateType
      })
    }
  },

  notLoggedInTip: function (){
    this.setData({
      list: [],
      isLoginShow: true
    }) 
  },
  doLogin: function () {
    wx.navigateTo({
      url: '/pages/selectCharacter/selectCharacter?historyPage=1',
    })
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
    wx.hideTabBarRedDot({
      index: 1,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    //判断是否已登录（userInfo标识）
    if (app.globalData.userInfo) {
      that.getCaseList();
      that.getCaseTotal();
      wx.hideTabBarRedDot({
        index: 1
      })
    } else {
      that.notLoggedInTip();
    }
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({ showLoading: true });
   
    var that = this;
    var len = this.data.resLength;
    if (len >= 10){
      setTimeout(function(){
        that.setData({
          ['pageVO.pageNo']: that.data.pageVO.pageNo + 1,
          showLoading: false
        })
        that.getCaseList('dropDown');
      },1000)
    }else{
      that.setData({
        showLoading: false
      })
      that.setData({ 
        resEmpty: true
      })
      setTimeout(function () {
        that.setData({ resEmpty: false})
      }, 2000)
    }
  },

   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      wx.stopPullDownRefresh();
      this.setData({
        ['pageVO.pageNo']:1
      })
      this.getCaseList('dropDown');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 案情沟通
   */
  chatTogeter: function(e){
    var that = this
    
    //确认webSocket是否已经连接
    var socketOpen = wx.getStorageSync("socketOpen")
    if (!socketOpen) {
      app.connectSocket();
    }

    //按钮是否可以被点击
    if (e.currentTarget.dataset.isActive == 'false') {
      return;
    }
    
    var caseId = e.currentTarget.dataset.id
    var mediator = e.currentTarget.dataset.mediator
    if (!mediator){
      that.showToast('error', "该案件暂无调解员接入，无法沟通");
      return
    }
    var state = e.currentTarget.dataset.state
    if (state == '1000'){ //当事人
      let index = e.currentTarget.dataset.index
      let createBy = this.data.list[index].createBy
      wx.navigateTo({
        url: '../../chatGroup/roomList/roomList?caseId=' + caseId + "&mediatorId=" + mediator + "&createBy=" + createBy,
      })
    }
  },

  /**
   * 视频调解
   */
  liveChat: function(e){
    console.log(e.currentTarget.dataset)
    if (e.currentTarget.dataset.isActive == 'false') {
      return
    }
    var that = this
    var caseId = e.currentTarget.dataset.id
    var userName = wx.getStorageSync("userInfo").text;//微信昵称
    wx.setStorageSync('caseId', caseId);
    var state = e.currentTarget.dataset.state
    if (state == '1000'){
      that.getChatRoom(caseId, function (adjust) {
        wx.setStorageSync("webRoomId", "")
        if (adjust.videoId) {
          that.goRoom(adjust.videoId, '默认房间', userName);//进入房间
        } else {
          that.createRoom('默认房间', userName);//创建房间
        }
      });
    }
  },

  /**
   * 查询视频房间信息
   */
  getChatRoom: function (caseId, callback) {
    var that = this;
    var url = '/adjust/queryChatRoomByCaseId';
    var data = {
      id: caseId
    }

    app.NetRequest(url, data, function (res) {
      if (res.code == app.globalData.Constant.SUCCESS) {
        callback(res.result)
      }
    })
  },

  /**
   * 创建聊天室
   */
  createRoom: function (roomName, userName) {
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
   * 查看文书
   */
  viewDocument: function(e){
    if (e.currentTarget.dataset.isdocument == 'false') {
      this.showToast('error', '暂无文书')
      return;
    }
    var that = this
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../../mediate/documentList/documentList?serialNo=' + this.data.list[index].serialNo
    })
  },

  /**
   * 新建调解
   */
  newCase: function(){
    wx.redirectTo({
      url: '../step1/step1',
    })
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
  }
})