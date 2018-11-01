// pages/chatGroup/addGroup/addGroup.js
var rtcroom = require('../../../utils/rtcroom.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    room: {},
    personArray:[],
    selectUserArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var room = that.data.room
    var caseId = options.id
    room.caseId = caseId
    
    that.setData({
      room: room,
      userInfo: wx.getStorageSync("userInfo")
    })

    that.queryData();
  },

  /**
   * 查询数据
   */
  queryData: function(){
    var that = this;
    var url = '/adjust/queryUserByCaseId';
    var data = {
      caseId: that.data.room.caseId
    };

    app.NetRequest(url, data, function(res){
      if(res.code == app.globalData.Constant.SUCCESS){
        that.setData({
          personArray: res.result
        })
      }
    })
  },
  
  /**
   * 新建房间
   */
  createNewRoom: function(e){
    var that = this;

    // 防止两次点击操作间隔太快
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    if (!that.data.room.name) {
      wx.showToast({
        title: '调解室名称为空',
      })
      return;
    }
    if (/[<>*{}()^%$#@!~&= ]/.test(that.data.room.name)) {
      wx.showModal({
        title: '提示',
        content: '名称不能为空或包含特殊字符',
        showCancel: false
      });
      return;
    };

    var selectPersonArray = that.data.personArray.filter((v) =>{
      return v.checked;
    })
    if (!selectPersonArray || selectPersonArray.length == 0){
      wx.showModal({
        title: '提示',
        content: '请选择成员',
        showCancel: false
      });
      return;
    } else if (selectPersonArray.length < 1){
      wx.showModal({
        title: '提示',
        content: '成员最少2人',
        showCancel: false
      });
      return;
    }

    var url = '/adjust/insertSysChatRoom';
    var data = that.data.room;
    var userInfo = wx.getStorageSync("userInfo")

    app.NetRequest(url, data, function (res) {
      if (res.code == app.globalData.Constant.SUCCESS) {
        wx.setStorageSync("webRoomId", res.result.id)
        //群员
        var dataArray = [{
          roomId: res.result.id,
          userId: userInfo.id,
          userType: userInfo.userType=='2'?"调解员":'申请人'
        }]

        //案件当事人
        var personArray = that.data.personArray;
        personArray.forEach((v) =>{
          if (v.checked){
            dataArray.push({
              roomId: res.result.id,
              userId: v.id,
              userType: v.userType
            })
          } 
        });

        url = '/adjust/insertSysUserRoom';
        dataArray.forEach((v) =>{
          app.NetRequest(url, v, function (res1) {
            if (res1.code == app.globalData.Constant.SUCCESS) {
              console.log("人员插入成功")
            } else {
              wx.showToast({
                title: res1.message || '人员插入出错',
              })
            }
          })
        })

        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.initData();
        wx.navigateBack({
          delta: 1
        })
        
      }else{
        wx.showToast({
          title: res.message || '创建调解室失败',
        })
      }
    })
  },

  /**
   * 数据绑定时间
   */
  bindInput: function(e){
    var that = this;
    var attribute = e.currentTarget.dataset.attribute;
    var value = e.detail.value
    var room = that.data.room
    var personArray = that.data.personArray;
    var selectUserArray = that.data.selectUserArray

    if (attribute == 'check'){
      var id = e.currentTarget.dataset.id;
      var value = e.detail.value;
      personArray.forEach((v) => {
        if (v.id == id) {
          v.checked = !v.checked
        }
      })
    }else{
      room[attribute] = value
    }
    

    that.setData({
      room: room,
      personArray: personArray
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