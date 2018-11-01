// pages/litigants/caseDetail/caseDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lawCase: {},
    idTypeArr: ['公民', '法人', '其他组织'],
    certificatesTypeArr: ['身份证', '驾驶证', '外籍在华驾驶证', '军队驾驶证', '律师证', '暂未获取'],
    feeTotal: 0, //赔偿申请总额
    isFeeDetail: true,
    imageAddress: '',
    serialNo: '',
    list: [],
    userType: "",
    listType: 'adjust'
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

  //显示费用详情
  showFeeDetail: function() {
    let isFeeDetail = !(this.data.isFeeDetail);
    this.setData({
      isFeeDetail: isFeeDetail
    })
    console.log(this.data.lawCase)
  },

  //保存图片
  saveImg: function () {
    let that = this;
    //查询授权
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum'
          })
        }
      }
    })

    if (!this.data.shareTempFilePath) {
      wx.showModal({
        title: '提示',
        content: '图片绘制中，请稍后重试',
        showCancel: false
      })
    }
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareTempFilePath,
      success: (res) => {
        that.showToast('success', '保存成功！')
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  //获取临时路径
  getTempFilePath: function () {
    wx.canvasToTempFilePath({
      canvasId: 'share',
      success: (res) => {
        this.setData({
          shareTempFilePath: res.tempFilePath
        })
        console.log(this.data)
      }
    })
  },

  //获取证据src数组
  getImgUrls: function () {
    let urls = [], that = this;
    if (this.data.lawCase.evidenceArray && this.data.lawCase.evidenceArray.length>0) {
      this.data.lawCase.evidenceArray.forEach(function (v) {
        urls.push(that.data.imageAddress + v.picture)
      })
      this.setData({
        urls: urls
      })
    }
  },

  //点击查看大图
  bigImg: function (event) {
    let current = event.currentTarget.dataset.src;
    let urls = this.data.urls;
    wx.previewImage({
      current: current,
      urls: urls
    })
  },

 
  /**
   * 查看文书
   */
  viewDocument: function (e) {
    if (e.currentTarget.dataset.isdocument == 'false') {
      this.showToast('error', '暂无文书')
      return;
    }
    var that = this
    wx.navigateTo({
      url: '../../mediate/documentList/documentList?serialNo=' + this.data.lawCase.serialNo
    })
  },

  //证据补充
  addEvidence: function (event) {
    let index = event.currentTarget.dataset.index;
    let lawCase = this.data.lawCase;
    if (lawCase.state == 1000) {
      wx.navigateTo({
        url: '../addEvidence/addEvidence?serialNo=' + lawCase.serialNo
      })
    }
    if (this.data.userType == '0' && lawCase.state == 2000) {
      wx.navigateTo({
        url: '../addEvidence/addEvidence?serialNo=' + lawCase.serialNo
      })
    }
  },
  
  //申请理赔
  claims: function (event) {
    var that = this
    if (that.data.list.claimState == '0') { //发起理赔
      wx.showModal({
        title: '',
        content: '申请一键理赔，将进入保险公司的理赔环节，确定要申请吗？',
        success: function (res) {
          if (res.confirm) {
            var serialNo = that.data.list.serialNo;
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
    if (that.data.list.claimState == '2') { //查看理赔详情
      //跳转到理赔详情
      var serialNo = that.data.list.serialNo;
      var operateType = that.data.listType == 'adjust' ? 0 : 1; //0调解 1诉讼
      wx.navigateTo({
        url: '../detailsOfClaims/detailsOfClaims?serialNo=' + serialNo + '&operateType=' + operateType
      })
    }
  },
  /**
   * 案情沟通
   */
  chatTogeter: function (e) {
    if (e.currentTarget.dataset.isActive == 'false') {
      return;
    }
    var that = this

    var caseId = e.currentTarget.dataset.id
    var mediator = e.currentTarget.dataset.mediator
    if (!mediator) {
      that.showToast('error', "该案件暂无调解员接入，无法沟通");
      return
    }
    var state = e.currentTarget.dataset.state
    if (state == '1000') { //当事人
      let index = e.currentTarget.dataset.index
      let createBy = this.data.list.createBy
      wx.navigateTo({
        url: '../../chatGroup/roomList/roomList?caseId=' + caseId + "&mediatorId=" + mediator + "&createBy=" + createBy,
      })
    }
  },
 
  /**
    * 视频调解
    */
  liveChat: function (e) {
    console.log(e.currentTarget.dataset)
    if (e.currentTarget.dataset.isActive == 'false') {
      return
    }
    var that = this
    var caseId = e.currentTarget.dataset.id
    var userName = wx.getStorageSync("userInfo").text;//微信昵称
    wx.setStorageSync('caseId', caseId);
    var state = e.currentTarget.dataset.state
    if (state == '1000') {
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
  
  initData: function() {
    //通过流水号，查找案件信息
    let serialNo = this.data.serialNo
    let url = '/adjust/queryAdjustDetailBySerialNo', that = this;
    app.NetRequest(url, { serialNo: serialNo }, res => {
      console.log(res)
      let lawCase = res.result;
      lawCase.feeDetail = lawCase.feeDetail ? JSON.parse(lawCase.feeDetail) : [];
      //将金额是0.00的项过滤掉
      var type = (lawCase.state >= '1002' && lawCase.state < '2000') ? 'claimAmount' : 'applyAmount'
      lawCase.feeDetail.forEach(v => {
        if(parseInt(v[type]) == '0') {
          v.isChecked = false
        }
      })
      
      that.setData({
        lawCase: lawCase,
        lawMoney: lawCase.lawMoney ? lawCase.lawMoney.toFixed(2):0.00,
        applyTotal: lawCase.applyTotal ? lawCase.applyTotal.toFixed(2) : 0.00,
      })
      console.log(lawCase.feeDetail)

      //获取urls
      that.getImgUrls()

      //计算赔偿申请总额
      let feeTotal = 0;
      lawCase.feeDetail.forEach(function (v) {
        if (v.isChecked) {
          feeTotal += v.applyAmount * 1
        }
      })
      if (feeTotal) {
        this.setData({
          feeTotal: feeTotal.toFixed(2)
        })
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      serialNo: options.serialNo,
      list: wx.getStorageSync('case'),
      userType: app.globalData.userInfo.userType,
      imageAddress: wx.getStorageSync("dataUrl") + '/common/image/getThumbnail/' || app.globalData.imageAddress,
    })
    console.log(this.data.userType,"!!!!!!!!!!!!!!");
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var context = wx.createCanvasContext('share')
    context.setStrokeStyle("#00ff00")
    context.setLineWidth(5)
    context.rect(0, 0, 200, 200)
    context.stroke()
    context.draw(false, this.getTempFilePath)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initData();
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
    let that = this;
    return {
      title: '费用申请明细',
      success: (res) => {
        that.showToast('success', '分享成功！');
      },
      fail: (res) => {
        that.showToast('error', '分享失败！');
      }
    }
  }
})