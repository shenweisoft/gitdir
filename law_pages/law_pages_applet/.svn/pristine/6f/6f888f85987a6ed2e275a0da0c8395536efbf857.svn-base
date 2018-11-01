// pages/litigants/addEvidence/addEvidence.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lawCase: {},
    urls: []
  },

  //证据对象构造函数
  Evidence: function (name, picture, serialNo) {
    this.name = name;
    this.picture = picture;
    this.serialNo = serialNo
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

  //获取证据src数组
  getImgUrls: function () {
    let urls = [], that = this;
    if (this.data.lawCase.evidenceArray) {
      this.data.lawCase.evidenceArray.forEach(function (v) {
        urls.push(that.data.imageAddress + v.picture)
      })
    }
    this.setData({
      urls: urls
    })
  },

  //上传证据
  uploadEvidence: function () {
    var that = this;
    if (!that.data.lawCase || !that.data.lawCase.evidenceArray) {
      wx.showModal({
        title: '提示',
        content: '该案件暂时无法上传证据！',
        showCancel: true
      })
      return;
    }
    wx.chooseImage({
      count: 9, // 设置最多可以选择的图片张数，默认9,如果我们设置了多张,那么接收时//就不在是单个变量了,
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          let filePath = res.tempFilePaths[i];
          app.NetUpload(filePath, { type: 'applicant' }, res => {
            res = JSON.parse(res);
            
            var evidence = new that.Evidence('证据', res.result, that.data.lawCase.serialNo)
            that.data.lawCase.evidenceArray.push(evidence);
            that.setData({
              ['lawCase.evidenceArray']: that.data.lawCase.evidenceArray
            })
            that.getImgUrls()
          })
        }
      },
      fail: function (res) {
        //that.showToast('error', res.message)
      }
    })
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

  //长按图片删除
  deleteEvidence: function (event) {
    let index = event.currentTarget.dataset.index;
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除么?',
      success: function (res) {
        if (res.confirm) {
          //调取接口
          let url = '/adjust/deleteJyEvidenceInfo'
          let id = that.data.lawCase.evidenceArray[index].id
          app.NetRequest(url, {idArray: [id]}, res=>{
            if(res.code == 0) {
              that.data.lawCase.evidenceArray.splice(index, 1)
              that.setData({
                ['lawCase.evidenceArray']: that.data.lawCase.evidenceArray
              })
              //获取urls
              that.getImgUrls();
              that.showToast('success', '删除成功！');
            }
          })
        }
      }
    })
  },

  //提交按钮
  save: function() {
    //提交数据
    let url = '/adjust/insertAppPersonAdjustDetail', that = this;

    if(this.data.lawCase.evidenceArray.length == 0) {
      that.showToast('error', '请上传证据！');
      return
    }
    app.NetRequest(url, JSON.stringify(that.data.lawCase), res => {
      console.log(res)
      if (res.code == '0') {
        that.showToast('success', '保存成功');
        that.setData({
          ['lawCase.evidenceArray']: res.result.jyEvidenceInfoVOList
        })
        console.log(that.data.lawCase)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //通过流水号，查找案件信息
    let serialNo = options.serialNo == 'undefined'? '' : options.serialNo;
    let url = '/adjust/queryAdjustDetailBySerialNo', that = this, id = options.id
    app.NetRequest(url, { serialNo: serialNo, id: id }, res=>{
      console.log(res)
      if(res.code == '0') {
        that.setData({
          lawCase: res.result
        })
        that.getImgUrls()
      } else {
        wx.showModal({
          title: '提示',
          content: '暂无相关数据',
          showCancel: true
        })
      }
    })
    this.setData({
      imageAddress: wx.getStorageSync("dataUrl") + '/common/image/getThumbnail/' || app.globalData.imageAddress,
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