// pages/litigants/detailsOfClaims/detailsOfClaims.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serialNo: '',
    operateType: '',
    flowList: []
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

  //请求数据
  dataInfo: function() {
    let url = '/interface/reconciliationOfClaimsResults', that = this
    app.NetRequest(url, { serialNo: this.data.serialNo, operateType: this.data.operateType}, res=>{
      console.log(res)
      if(res.code == 0) {
        let flowList = JSON.parse(res.result.tempData).flowList
        that.setData({
          flowList: flowList
        })
        console.log(flowList)
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
      serialNo: options.serialNo,
      operateType: options.operateType
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
    //请求数据
    this.dataInfo()
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