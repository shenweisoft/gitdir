const app = getApp()

var touchs = [];
var canvasw = 0;
var canvash = 0;

// pages/template/template.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    signImage: '',
    canvasw: '',
    canvash: '',
    isSignature: '' //判断是否有签字
  },

  //////////////////签名/////////////////////
  //获取系统信息
  getSysInfo: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        var pix = res.pixelRatio
        that.setData({
          canvasw: res.windowWidth * pix,
          canvash: res.windowHeight * pix
        })
      }
    })
  },

  // 画布的触摸移动开始手势响应
  start: function (event) {
    // console.log("触摸开始" + event.changedTouches[0].x)
    // console.log("触摸开始" + event.changedTouches[0].y)
    //获取触摸开始的 x,y
    let point = { x: event.changedTouches[0].x, y: event.changedTouches[0].y }
    touchs.push(point)
  },

  // 画布的触摸移动手势响应
  move: function (e) {
    let point = { x: e.touches[0].x, y: e.touches[0].y }
    touchs.push(point)
    if (touchs.length >= 2) {
      this.draw(touchs)
    }
  },

  // 画布的触摸移动结束手势响应
  end: function (e) {
    console.log("触摸结束" + e)
    //清空轨迹数组
    for (let i = 0; i < touchs.length; i++) {
      touchs.pop()
    }
    this.setData({
      isSignature: true
    })
  },

  // 画布的触摸取消响应
  cancel: function (e) {
    console.log("触摸取消" + e)
  },

  // 画布的长按手势响应
  tap: function (e) {
    console.log("长按手势" + e)
  },

  error: function (e) {
    console.log("画布触摸错误" + e)
  },

  //绘制
  draw: function (touchs) {
    let point1 = touchs[0]
    let point2 = touchs[1]
    touchs.shift()
    this.data.content.moveTo(point1.x, point1.y)
    this.data.content.lineTo(point2.x, point2.y)
    this.data.content.stroke()
    this.data.content.draw(true)
  },
  //清除操作
  clearClick: function () {
    //清除画布
    this.data.content.clearRect(0, 0, canvasw, canvash)
    this.data.content.draw()
    this.drawBg()
  },
  //保存图片
  saveClick: function () {
    if (!this.data.isSignature) {
      wx.showModal({
        title: '提示',
        content: '签字页不能为空',
      })
      return;
    }
    var that = this
    console.log(this.data.content)
    wx.canvasToTempFilePath({
      canvasId: 'firstCanvas',
      success: function (res) {
        //打印图片路径
        console.log(res.tempFilePath)
        //设置保存的图片
        var param = { type: 'signName' };
        app.NetUpload(res.tempFilePath, param, function (res) {
          var res = JSON.parse(res);
          //获取页面栈
          let pages = getCurrentPages()
          let prevPage = pages[pages.length - 2] //上个页面
          prevPage.initSignName(res.result, that.data.index);
          wx.navigateBack({
            delta: 1
          })
        })
      }
    })
  },

  drawBg: function () {
    var that = this
    wx.getImageInfo({
      src: '/images/signNameBack.png',
      success: function (res) {
        var content = wx.createCanvasContext('firstCanvas')
        content.drawImage('/images/signNameBack.png', 0, 0, that.data.canvasw, that.data.canvash)
        content.save()
        content.draw(true)
        content.setLineWidth(5)
        //设置线两端端点样式更加圆润
        content.setLineCap('round')
        //设置两条线连接处更加圆润
        content.setLineJoin('round')
        that.setData({
          content: content
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSysInfo();
    this.drawBg()
    //获得Canvas的上下文
    let content = wx.createCanvasContext('firstCanvas')
    //设置背景色
    content.fillStyle = "#fff";
    //设置线的颜色
    content.setStrokeStyle("#000")
    //设置线的宽度
    content.setLineWidth(5)
    //设置线两端端点样式更加圆润
    content.setLineCap('round')
    //设置两条线连接处更加圆润
    content.setLineJoin('round')
    //保存index
    this.setData({
      index: options.index,
      content: content
    })
    //提示横屏签字
    wx.showModal({
      title: '提示',
      content: '请横屏签字，且只有一次机会！',
      showCancel: false
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

  },
})