// pages/journalism/journalism.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgArray: ['imgSrc1', 'imgSrc2', 'imgSrc3', 'imgSrc4', 'imgSrc5', 'imgSrc6']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.queryNoticeList();
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
  
  },

  /**
   * 新闻公告信息
   */
  queryNoticeList: function () {
    var that = this
    let Server = wx.getStorageSync("dataUrl") || app.globalData.dataUrl;
    var url = Server + '/homePage/queryNoticeList'
    var data = {}

    wx.request({
      url: url,
      method: 'post',
      data: data,
      header: {},
      success: res => {
        if (res.data.code == app.globalData.Constant.SUCCESS) {
          var result = res.data.result;
          result.forEach((v, i) => {
            v.imgSrc = '/images/imgSrc' + ((i % 6) + 1) + '.jpg'
          })
          that.setData({
            noticeList: result
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.queryNoticeList();
  },
  /**
   * 查看公告详情
   */
  viewDetail: function(e){
    var notice = e.currentTarget.dataset.value
    let url = notice.linkUrl ? '../journalism/news/news?linkUrl=' + notice.linkUrl : '../journalism/journalismDetail?notice=' + JSON.stringify(notice)
    wx.navigateTo({
      url: url
    })
  }
})