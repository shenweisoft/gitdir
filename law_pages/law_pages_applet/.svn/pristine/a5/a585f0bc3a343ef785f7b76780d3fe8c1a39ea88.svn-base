const app = getApp()
let config = require('../../config.js')
Page({
  data: {
    imgUrls: [
      {
        type: 0,
        url: 'https://www.jtspt.com/wxVoice/banner/banner.png'
      },
      {
        type: 0,
        url: 'https://www.jtspt.com/wxVoice/banner/banner_1.png'
      },
      {
        type: 0,
        url: 'https://www.jtspt.com/wxVoice/banner/banner_2.png'
      },
      {
        type: 0,
        url: 'https://www.jtspt.com/wxVoice/banner/banner_3.png'
      }
      // {
      //   type: 1,
      //   face: 'https://www.jtspt.com/wxVoice/banner/banner_1.png',
      //   url: 'http://192.168.223.147/wxVoice/a.mp4'
      // }
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    session: {},
    miniProgram: null,
    version: config.version
  },

  /**
   * 数据加载
   */
  onLoad: function(){
    var that = this
    that.queryNoticeList();
    var session_id = ''
    wx.getStorageSync('userInfo') ? session_id = wx.getStorageSync('JSESSIONID') : session_id = null
    var data = {
      session: session_id,
      platForm: 'basic'
    }
    that.setData({
      session: data
    })
    console.log(that.data.session,"^^^^^^^^^^^");
    //监听服务器消息
    wx.onSocketMessage(function (res) {
      
    })
  },

  /**
   * 页面加载完成
   */
  onReady: function(){
    
  },

  /**
   * 新闻公告信息
   */
  queryNoticeList: function(){
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
          let noticeList = []
          result.forEach( function(v,i){
            v.imgSrc = '/images/imgSrc' + ((i % 6) + 1) + '.jpg';
            //只显示本地数据
            if (v.type == '0') noticeList.push(v)
          })
          that.setData({
            noticeList: noticeList
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

  /**
   * 查看新闻公告详情
   */
  viewNoticeDetail: function(e){
    var that = this
    var notice = e.currentTarget.dataset.value
    let url = notice.linkUrl ? '../journalism/news/news?linkUrl=' + notice.linkUrl : '../journalism/journalismDetail?notice=' + JSON.stringify(notice)
    wx.navigateTo({
      url: url
    })
  },

  /**
   * 更多新闻公告
   */
  noticeList: function(){
    wx.switchTab({
      url: '../journalism/journalism',
    })
  },

  /**
   * 案件沟通
   */
  chatInCase: function(){
    wx.switchTab({
      url: '../litigants/caseList/caseList',
    })
  },

  /**
   * 视频调解
   */
  videoMediation: function(){
    //判断是否已登录（userInfo标识）
    wx.switchTab({
      url: '../litigants/caseList/caseList',
    })
  },
  
  onPullDownRefresh: function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },

  /**
   * 跳转到帮助
   */
  toHelps: function(e) {
    let userType = e.currentTarget.dataset.userType
    wx.navigateTo({
      url: '../helps/helps?userType=' + userType,
    })
  }
})