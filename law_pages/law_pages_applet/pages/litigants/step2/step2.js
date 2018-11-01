// pages/newCases/step2/step2.js
const app = getApp();
const utils = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepArray: [],
    step: 2,
    idTypeArr: ['公民', '法人', '其他组织'],
    lawCase: {},
    certificatesTypeArr: ['身份证', '驾驶证', '外籍在华驾驶证', '军队驾驶证', '律师证', '暂未获取'],
    showToast: false,
    toastType: '',
    content: '',
    userType: ''
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

  /**
   * 被申请人信息
   */
  Responden: function () {
    this.idType = '0'
    this.personName = "";
    this.certificateType = "";
    this.idNo = "";
    this.telephone = "";
    this.personType = '1';
    this.enterpriseType = '1';
  },

  //新增申请人
  addRespondent: function () {
    this.data.lawCase.applicantArray.push(new this.Responden());
    this.setData({
      ['lawCase.applicantArray']: this.data.lawCase.applicantArray
    })
  },

  //删除被申请人
  deleteRespondent: function (event) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除该项吗？',
      success: function (res) {
        if (res.confirm) {
          if (that.data.lawCase.applicantArray.filter((v) => { return v.personType == '1' }).length == 1) {
            wx.showToast({
              title: '至少保留一人！',
            })
            return;
          }
          let index = event.target.dataset.index;
          that.data.lawCase.applicantArray.splice(index, 1);
          that.setData({
            ['lawCase.applicantArray']: that.data.lawCase.applicantArray
          })
        }
      }
    })
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

  //选择框
  selectedValue: function(event) {
    console.log(event)
    let index = event.target.dataset.index;
    let dataType = event.target.dataset.dataType;
    let value = event.detail.value
    console.log(value)
    this.setData({
      ['lawCase.applicantArray[' + index + ']' + '.' + dataType]: value
    })
    console.log(this.data.lawCase)
  },

  //上传图片
  uploadImg: function (event) {
    var that = this;
    let index = event.target.dataset.index;
    let dataType = event.target.dataset.dataType;
    wx.chooseImage({
      count: 1, // 设置最多可以选择的图片张数，默认9,如果我们设置了多张,那么接收时//就不在是单个变量了,
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        console.log(res)
        let filePath = res.tempFilePaths[0];
        app.NetUpload(filePath, { type: 'applicant' }, res => {
          res = JSON.parse(res);
          console.log(res);
          that.setData({
            ['lawCase.applicantArray[' + index + ']' + '.' + dataType]: res.result
          })
          // 解析身份证正面照  
          if (dataType == 'idFacePicture') {
            let url = '/common/cardDisc', data = { "path": res.result, "type": "applicant" }
            app.NetRequest(url, data, res => {
              console.log(res)
              if (res.code == 0) {
                that.setData({
                  ['lawCase.applicantArray[' + index + ']' + '.certificatesType']: '0',
                  ['lawCase.applicantArray[' + index + ']' + '.personName']: res.result.name,
                  ['lawCase.applicantArray[' + index + ']' + '.idNo']: res.result.code,
                  ['lawCase.applicantArray[' + index + ']' + '.nation']: res.result.nation,
                  ['lawCase.applicantArray[' + index + ']' + '.domicile']: res.result.addr,
                  ['lawCase.applicantArray[' + index + ']' + '.residence']: res.result.addr,
                  ['lawCase.applicantArray[' + index + ']' + '.sendAddress']: res.result.addr,
                })
              } else {
                that.showToast('error', res.message);
                console.log(that.data.showToast)
              }
            })
          }
        })
      },
      fail: function (res) {
        //that.showToast('error', res.message)
      }
    })
  },

  //验证身份证
  checkIdentity: function (event) {
    let index = event.target.dataset.index, that = this;
    let applicant = that.data.lawCase.applicantArray[index]
    if (!utils.checkIdentity(applicant) && applicant.certificatesType == '0') {
      that.showToast('error', '证件号码格式有误！')
    }
  },

  //验证数据
  validData: function () {
    let that = this;
    let len = that.data.lawCase.applicantArray.length;
    let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/; //手机号正则
    if (!len) {
      that.showToast('error', '请添加申请人！')
      return false;
    }
    for (var i = 0; i < len; i++) {
      let applicant = that.data.lawCase.applicantArray[i];
      if (applicant.personType == '1') { //被申请人
        if (applicant.idType == '0') { //公民
          if (!applicant.personName) {
            that.showToast('error', '请输入被申请人姓名！')
            return false;
          }
          if (!applicant.certificatesType) {
            that.showToast('error', '请选择证件类型！')
            return false;
          }
          if (!applicant.idNo && applicant.certificatesType != '5') {
            that.showToast('error', '请输入证件号码！')
            return false;
          }
          if (applicant.idNo && applicant.certificatesType == '0' && !(utils.checkIdentity(applicant))) {
            that.showToast('error', '证件号码格式有误！')
            return false;
          }
          if (!applicant.telephone) {
            that.showToast('error', '请输入手机号码！')
            return false;
          }
          if (applicant.telephone && !phoneReg.test(applicant.telephone)) {
            that.showToast('error', '手机号码格式有误！')
            return false;
          }
        }
        if (applicant.idType == '1' || applicant.idType == '2') { //法人
          if (!applicant.orgName) {
            that.showToast('error', '请输入名称！')
            return false;
          }
          if (!applicant.telephone) {
            that.showToast('error', '请输入联系电话！')
            return false;
          }
        }
      }
    }
    return true;
  },

  //格式化日期数据
  formateData: function () {
    let that = this;
    let len = that.data.lawCase.applicantArray.length;
    for (var i = 0; i < len; i++) {
      let applicant = that.data.lawCase.applicantArray[i];
      //添加年龄
      if (!applicant.age && applicant.idType == '0' && applicant.certificatesType == '0') applicant.age = utils.getAge(utils.formatDate(applicant.birthDay), utils.formatDate(new Date()));
      if (applicant.birthDay) applicant.birthDay = utils.formatTime2(applicant.birthDay)
    }
  },

  //遍历申请人，被申请人  添加id  防止点击下一步重复增加
  applicantAddId: function (res) {
    this.data.lawCase.applicantArray.forEach((v, index) => {
      v.id = res.result.jyApplyerResultVOList[index].id
    })
    this.setData({
      ['lawCase.applicantArray']: this.data.lawCase.applicantArray
    })
  },
  errorTip: function (title) {
    wx.showToast({
      title: title,
      icon: 'success',
      duration: 2000
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

  //保存
  save: function (event, isNext) {
    //验证数据
    if (isNext != 'save' && !this.validData()) {
      return false;
    }
    //格式化数据
    this.formateData();
    console.log(this.data.lawCase);
    let telephone = [], idNo = [];
    let applicantArray = this.data.lawCase.applicantArray
    for (var i = 0; i < applicantArray.length; i++) {
      telephone[i] = applicantArray[i].telephone
      idNo[i] = applicantArray[i].idNo
    }
    let newArr = telephone.sort();
    let newIdNo = idNo.sort();
    for (var i = 0; i < newArr.length; i++) {
      if (newIdNo[i] && newIdNo[i + 1]) {
        if (newIdNo[i] == newIdNo[i + 1]) {
          this.showToast('error', "证件号不可相同！");
          return false
        }
      }
      if (newArr[i] && newArr[i + 1]) {
        if (newArr[i] == newArr[i + 1]) {
          this.showToast('error', "手机号码不可相同！");
          return false
        }
      }
    }
    //提交数据
    let url = app.globalData.userInfo.userType == '2' ? '/adjust/insertAdjustDetail' : '/adjust/insertAppPersonAdjustDetail', that = this;
    app.NetRequest(url, that.data.lawCase, res => {
      console.log(res)
      if (res.code == '0') {
        this.applicantAddId(res) //遍历申请人，被申请人，并添加id
        if (!isNext) {
          that.showToast('success', '保存成功');
        } else if (isNext == 'save') {
          //将当前对象保存到上一步中
          that.saveToPrev()
        } else {
          //判断用户身份
          if (app.globalData.userInfo.userType == '2') {
            //调解员
            wx.navigateTo({
              url: '../step4/step4?lawCase=' + JSON.stringify(that.data.lawCase)
            })
          } else {
            //当事人
            wx.navigateTo({
              url: '../step3/step3?lawCase=' + JSON.stringify(that.data.lawCase)
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
  prev: function() {
    this.save('', 'save');
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let lawCase = JSON.parse(options.lawCase);
    var dataUrl = wx.getStorageSync('dataUrl')
    this.setData({
      lawCase: lawCase,
      userType: app.globalData.userInfo.userType,
      imageAddress: wx.getStorageSync("dataUrl") + '/common/image/getThumbnail/' || app.globalData.imageAddress,
    })
   
    //判断用户身份
    var stepArray;
    if (app.globalData.userInfo.userType == '2') {
      stepArray = [{ id: 1, name: '申请人' }, { id: 2, name: '被申请人' }, { id: 3, name: '证据信息' }];
    } else {
      stepArray = [{ id: 1, name: '申请人' }, { id: 2, name: '被申请人' }, { id: 3, name: '事实理由' }, { id: 4, name: '证据信息' }, { id: 5, name: '赔偿信息' }];
    }
    this.setData({
      stepArray: stepArray
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //查询被申请人个数
    var num = this.data.lawCase.applicantArray.filter(v => {
      return v.personType == '1';
    }).length
    //默认添加被申请人
    if (!num) this.addRespondent();
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