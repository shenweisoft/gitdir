// pages/litigants/step4/step4.js
const app = getApp();
const utils = require('../../../utils/util.js')
let dictionary = require('../../../utils/dictionary.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepArray: [],
    lawCase: {},
    step: 3,
    urls: [],
    userInfo: ''
  },

  //证据对象构造函数
  Evidence: function (name, picture) {
    this.name = name;
    this.picture = picture;
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
  getImgUrls: function() {
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
  uploadEvidence: function() {
    var that = this;
    wx.chooseImage({
      count: 9, // 设置最多可以选择的图片张数，默认9,如果我们设置了多张,那么接收时//就不在是单个变量了,
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        //储存urls
        that.setData({
          urls: res.tempFilePaths
        })
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          let filePath = res.tempFilePaths[i];
          app.NetUpload(filePath, { type: 'applicant' }, res => {
            res = JSON.parse(res);
            that.data.lawCase.evidenceArray.push(new that.Evidence('证据', res.result));
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
  bigImg: function(event) {
    let current = event.currentTarget.dataset.src;
    let urls = this.data.urls;
    wx.previewImage({
      current: current,
      urls: urls
    })
  },

  //长按图片删除
  deleteEvidence: function(event) {
    let index = event.currentTarget.dataset.index;
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除么?',
      success: function (res) {
        if (res.confirm) {
          that.data.lawCase.evidenceArray.splice(index, 1)
          that.setData({
            ['lawCase.evidenceArray']: that.data.lawCase.evidenceArray
          })
          //获取urls
          that.getImgUrls();
        }
      }
    }) 
  },

  //为证据添加id
  evidenceAddId: function(res) {
    this.data.lawCase.evidenceArray.forEach( (v, index) => {
      v.id = res.result.jyEvidenceInfoVOList[index].id
    })
    this.setData({
      ['lawcase.evidenceArray']: this.data.lawCase.evidenceArray
    })
  },

  //将当前对象保存到上一步中
  saveToPrev: function () {
    let pages = getCurrentPages()
    let prev = pages[pages.length - 2]
    prev.setData({
      lawCase: this.data.lawCase
    })
    wx.navigateBack({
      delta: 1
    })
  },

  //格式化日期数据
  formateData: function (lawCase) {
    let that = this;
    let len = lawCase.applicantArray.length;
    for (var i = 0; i < len; i++) {
      let applicant = lawCase.applicantArray[i];
      //添加年龄
      if (!applicant.age && applicant.idType == '0' && applicant.certificatesType == '0' && applicant.birthDay)
       applicant.age = utils.getAge(utils.formatDate(applicant.birthDay), utils.formatDate(new Date()));
      
      //添加生日
      if (applicant.birthDay)
       applicant.birthDay = utils.formatTime2(applicant.birthDay)
    }

    //调解结果
    if (lawCase.compensateTable && typeof lawCase.compensateTable != 'string')
     lawCase.compensateTable = JSON.stringify(lawCase.compensateTable)

    //数据标准
    if (lawCase.compensateStandard && typeof lawCase.compensateStandard != 'string')
     lawCase.compensateStandard = JSON.stringify(lawCase.compensateStandard)

    //费用信息
    if (lawCase.feeDetail && typeof lawCase.feeDetail != 'string')
     lawCase.feeDetail = JSON.stringify(lawCase.feeDetail)

    //创建日期
    if (lawCase.createDate) lawCase.createDate = utils.formatTime2(lawCase.createDate)

    //死亡日期
    if (lawCase.deathDate) lawCase.deathDate = utils.formatTime2(lawCase.deathDate)

    return lawCase;
  },

  //保存
  save: function (event, isNext) {
    //提交数据
    let url = app.globalData.userInfo.userType == '2' ? '/adjust/insertAdjustDetail' : '/adjust/insertAppPersonAdjustDetail', that = this;
    //格式化数据
    var param = this.formateData(that.data.lawCase);
    app.NetRequest(url, param, res => {
      console.log(res)
      if (res.code == '0') {
        wx.setStorageSync("where", null);
        //为证据添加id
        this.evidenceAddId(res)
        if (!isNext) {
          that.showToast('success', '保存成功');
        } else if (isNext == 'save') {
          //将当前对象保存到上一步中
          that.saveToPrev()
        } else {
          //跳转到下一步
          //判断用户身份
          if (app.globalData.userInfo.userType == '2') {
            //调解员
            wx.switchTab({
              url: '../caseList/caseList',
            })
          } else {
            //当事人
            wx.navigateTo({
              url: '../step5/step5?lawCase=' + JSON.stringify(that.data.lawCase)
            })
          }
        }
      }
    })
  },

  //下一步
  next: function () {
    this.save('', 'next');
  },

  //上一步
  prev: function () {
    this.save('', 'save');
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var lawCase = '';
    var where = JSON.parse(wx.getStorageSync("where"))
    console.log(where,"((((((((((");
    if (where && where.referrerInfo && where.referrerInfo.extraData && where.referrerInfo.extraData.userInfo == '0') { //判断是当事人过来的，不会点这里 ) {
      lawCase = where.referrerInfo.extraData.lawCase;  
      var fee = where.referrerInfo.extraData.lawCase.feeDetail
    }else{
      lawCase = JSON.parse(options.lawCase)
    }

    if (!lawCase.evidenceArray) lawCase.evidenceArray = [];
    var dataUrl = wx.getStorageSync("dataUrl");
    this.setData({
      lawCase: lawCase,
      userInfo: app.globalData.userInfo,
      imageAddress: wx.getStorageSync("dataUrl") + '/common/image/getThumbnail/' || app.globalData.imageAddress,
    })
    //判断用户身份
    let stepArray, step;
    if (app.globalData.userInfo.userType == '2') {
      stepArray = [{ id: 1, name: '申请人' }, { id: 2, name: '被申请人' }, { id: 3, name: '证据信息' }];
      step = 3;
    } else {
      stepArray = [{ id: 1, name: '申请人' }, { id: 2, name: '被申请人' }, { id: 3, name: '事实理由' }, { id: 4, name: '证据信息' }, { id: 5, name: '赔偿信息' }];
      step = 4;
    }
    this.setData({
      stepArray: stepArray,
      step: step
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
    if(this.data.urls.length == 0) {
      //获取urls
      this.getImgUrls();
    }
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