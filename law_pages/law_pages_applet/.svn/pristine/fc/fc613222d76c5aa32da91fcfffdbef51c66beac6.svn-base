// pages/mediate/documentList/documentList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    caseVerifyResultCode: [
      {
        "code": '100',
        "text": "调解阶段"
      }, {
        "code": '101',
        "text": "起诉阶段"
      }, {
        "code": '102',
        "text": "审批阶段"
      }, {
        "code": '103',
        "text": "立案阶段"
      }, {
        "code": '104',
        "text": "分案阶段"
      }, {
        "code": '105',
        "text": "司法确认办案"
      }, {
        "code": '106',
        "text": "诉讼办案"
      }, {
        "code": '107',
        "text": "庭前调解"
      }, {
        "code": '108',
        "text": "在线开庭"
      }, {
        "code": '109',
        "text": "案件完结"
      }, {
        "code": '110',
        "text": "补充证据"
      }, {
        "code": '111',
        "text": "鉴定阶段"
      }, {
        "code": '180',
        "text": "理赔信息回传"
      }, {
        "code": '190',
        "text": "发起一键理赔"
      }, {
        "code": "200",
        "text": "理赔结果"
      }, {
        "code": '001',
        "text": "调解申请阶段"
      }, {
        "code": '002',
        "text": "调解审核阶段"
      }, {
        "code": '003',
        "text": "案件转交阶段"
      }, {
        "code": '004',
        "text": "案件接收阶段"
      }, {
        "code": '005',
        "text": "案件退回阶段"
      }],
    levelArray: [],
    num: 0,
    serialNo: '',
    id: ''
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

  //文书构造函数
  Instrument: function(){
    this.type = "";
    this.instrumentArray = [];
  },

  checkFileExist: function (instrument) {
    let url = '/common/isExistByDocId', that = this;
    app.NetRequest(url, { docId: instrument.id}, res=>{
      if (res.code == -1) {
        instrument.isFileExist = false;
      } else {
        instrument.isFileExist = true;
      }
    })
  },

  //查看文书
  checkDetail: function(e) {
    let index1 = e.currentTarget.dataset.parentIndex, index2 = e.currentTarget.dataset.index
    //console.log(this.data.levelArray[0].instrumentArray[index])
    var path = e.currentTarget.dataset.path
    wx.navigateTo({
      url: '../viewTheDocument/viewTheDocument?path='+path+'&document=' + JSON.stringify(this.data.levelArray[index1].instrumentArray[index2])
    })
  },

  //通过流水号获取文书列表
  getData: function(isFather) {
    if (isFather) this.data.levelArray.length = 0; //文书详情后退时，清空案件列表并重新获取
    let url = '/common/getDocumentFile', that = this;
    app.NetRequest(url, { serialNo: this.data.serialNo }, res => {
      if (res.code == '0') {
        console.log(res)
        if (res.result.length > 0) {
          var instrument = new that.Instrument();
          res.result.forEach(function (v, i) {
            that.checkFileExist(v);
            if (instrument.type != v.type) {
              if (i != 0) {
                that.data.levelArray.push(instrument);
              }
              instrument = new that.Instrument();
              instrument.type = v.type;
              instrument.instrumentArray.push(v);
            } else {
              instrument.instrumentArray.push(v);
            }
          })
          that.data.levelArray.push(instrument);
          that.setData({
            levelArray: that.data.levelArray,
            num: res.result.length
          })
          console.log(that.data.levelArray)
        }
      } else {
        that.showToast('error', res.message)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      serialNo: options.serialNo
    })
    //this.getData()
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
    this.getData(true)
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