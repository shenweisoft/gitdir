const app = getApp()
Page({
  data: {
    userType: '',
    listArray: ''
  },

  //请求数据
  initData: function() {
    let url = '/common/queryAppHelpInfo', userType = this.data.userType, that = this
    app.NetRequestLogin(url, { userType: userType}, res=>{
      if(res.code == 0) {
        that.setData({
          listArray: res.result
        })
      }
    })
  },

  //查看帮助图片
  checkImg: function(e) {
    let path = e.currentTarget.dataset.path, that = this
    wx.previewImage({
      current: path,
      urls: [path]
    })
  },

  /**
   * 数据加载
   */
  onLoad: function (options) {
    this.setData({
      userType: options.userType
    })
    this.initData()
    //动态改变头部信息
    if (this.data.userType == '0') {
      wx.setNavigationBarTitle({
        title: '当事人帮助与反馈',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '调解员帮助与反馈',
      })
    }
    
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.initData();
  },

  /**
   * 页面加载完成
   */
  onReady: function () {

  }
})