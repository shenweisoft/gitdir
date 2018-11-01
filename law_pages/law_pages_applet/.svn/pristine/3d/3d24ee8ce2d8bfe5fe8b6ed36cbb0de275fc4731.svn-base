// pages/template/template.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signImage: '',
    reasonList: ['机动车交通事故责任纠纷', '生命权、健康权、身体权纠纷', '保险人代位求偿权纠纷', '保险合同纠纷']
  },

  //获取当前日期
  getDate: function() {
    
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

  //存储输入的数据
  setApplicantData: function (event) {
    let index = event.target.dataset.index;
    let dataType = event.target.dataset.dataType;
    this.setData({
      ['lawCase.applicantArray[' + index + ']' + '.' + dataType]: event.detail.value
    })
    console.log(this.data.lawCase)
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
    this.getDate()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this.data)
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
})