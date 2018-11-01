// pages/litigants/step5/step5.js
const app = getApp();
let dictionary = require('../../../utils/dictionary.js')
let utils = require('../../../utils/util.js')
let config = require('../../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepArray: [{ id: 1, name: '申请人' }, { id: 2, name: '被申请人' }, { id: 3, name: '事实理由' }, { id: 4, name: '证据信息' }, { id: 5, name: '赔偿信息' }],
    lawCase: {},
    step: 5,
    region: '',
    adjustPointArray: [],
    adjustPointNameArray: [],
    adjustPointName: '',
    version: config.version
  },

  //不会填写，跳转到赔付试算
  toPrejudge: function() {
    //将数据存储到本地
    if (this.data.region) {
      this.data.lawCase.region = this.data.region
    }
    wx.setStorageSync('step5-set-key', this.data.lawCase)
    wx.redirectTo({
      url: '../../prejudge/step1/step1?isStep5=true',
    })
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

  //输入金额
  setFee: function(event) {
    let index = event.target.dataset.index;
    this.data.lawCase.feeDetail[index].applyAmount = event.detail.value;
    this.setData({
      ['lawCase.feeDetail']: this.data.lawCase.feeDetail
    })
  },

  //验证数据
  validData: function () {
    let that = this;
    if (that.data.lawCase.applicantArray.length){
      let len = that.data.lawCase.applicantArray.length;
    }
    
    // if (!len) {
    //   that.showToast('error', '请添加申请人！')
    //   return false;
    // }
    if (!this.data.region) {
      that.showToast('error', '请选择调解地区！')
      return false;
    }
    if (!this.data.lawCase.adjustPointCode || !this.data.lawCase.adjustOrgCode) {
      that.showToast('error', '请选择调解点！')
      return false;
    }
    return true;
  },

  //获取赔偿总额
  getLawMoney: function() {
    let feeList = this.data.lawCase.feeDetail, lawMoney = 0
    feeList.forEach(v=>{
      if (v.applyAmount) {
        lawMoney += v.applyAmount*1
      }
    })
    this.setData({
      ['lawCase.lawMoney']: lawMoney
    })
  },

  //格式化数据
  formate: function (lawCase) {
    if (lawCase.createDate) lawCase.createDate = utils.formatTime2(lawCase.createDate)

    //费用项
    if (lawCase.feeDetail && typeof lawCase.feeDetail != 'string')
      lawCase.feeDetail = JSON.stringify(lawCase.feeDetail);

    //数据标准
    if (typeof (lawCase.compensateStandard) != 'string')
     lawCase.compensateStandard = JSON.stringify(lawCase.compensateStandard)
    
    //调解结果
    if (typeof (lawCase.compensateTable) != 'string')
     lawCase.compensateTable = JSON.stringify(lawCase.compensateTable)

    //为选择的费用添加isChecked属性
    if (lawCase.feeDetail && typeof lawCase.feeDetail != 'string')
     lawCase.feeDetail = JSON.stringify(lawCase.feeDetail);

    //日期
    lawCase.applicantArray.forEach(v=>{
      if (v.birthDay) v.birthDay = utils.formatTime2(v.birthDay)
      if (v.applyAmount) v.isChecked = true
    })

    if (lawCase.extPro && typeof (lawCase.extPro) != 'string') lawCase.extPro = JSON.stringify(lawCase.extPro)

    return lawCase
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
    //提交数据
    let url = app.globalData.userInfo.userType == '2' ? '/adjust/insertAdjustDetail' : '/adjust/insertAppPersonAdjustDetail', that = this;
    
    this.getLawMoney(); //计算赔偿总额

    var lawCase = this.formate(that.data.lawCase); //格式化数据
      lawCase.regionName = that.data.region.join('-') //添加regionName属性（以调解地区为主）

    if (isNext == 'next') {
      lawCase.state = '2001'//修改状态
    }
    app.NetRequest(url, that.data.lawCase, res => {
      if (res.code == '0') {
        wx.setStorageSync("where", null);
        wx.setStorageSync('step5-set-key', null)
        if (!isNext) {
          that.showToast('success', '保存成功');
          // wx.setStorageSync("where", null);
        } else if (isNext == 'save') {
          //将当前对象保存到上一步中
          that.saveToPrev()
        } else {
          that.saveWorkFlow(lawCase);
          //跳转到下一步
          wx.switchTab({
            url: '../caseList/caseList',
          })
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

  // 选择调解地区
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var lawCase = e.detail.value[0] + "-" + e.detail.value[1] + "-" + e.detail.value[2];
    var region = [e.detail.value[0], e.detail.value[1], e.detail.value[2]]
    let adjustCity = "";
    if (lawCase) {
      // lawCase.split("省")[1] ? adjustCity = e.detail.value : adjustCity = [e.detail.value[0], '市辖区', e.detail.value[2]];

      (e.detail.value[0].indexOf("省") != -1 || e.detail.value[0].indexOf("自治区") != -1)? adjustCity = e.detail.value : (e.detail.value[1].indexOf("县") != -1 ? adjustCity = e.detail.value : adjustCity = [e.detail.value[0], '市辖区', e.detail.value[2]])
    }
    this.setData({
      region: adjustCity
    })
    let adjustCityName = e.detail.value.join('-');
    //请求接口，调取调解点
    this.getAdjustPoint(adjustCityName, e.detail.value)
    //重置调解点
    this.setData({
      ['lawCase.adjustPointCode']: '',
      ['lawCase.adjustOrgCode']: '',
      adjustPointName: ''
    })
    console.log(this.data.lawCase);
  },
  // 选择调解点
  bindPickerChange: function (e) {
    if (!this.data.region) {
      this.showToast('error', '请选择调解地区！')
      return
    }
    if (this.data.adjustPointNameArray && this.data.adjustPointNameArray.length == 0) {
      this.showToast('error', '请选择调解点！')
      return
    }
    let index = e.detail.value
    this.setData({
      ['lawCase.adjustOrgCode']: this.data.adjustPointArray[index].adjustOrgCode,
      ['lawCase.adjustOrgName']: this.data.adjustPointArray[index].adjustOrgName,
      ['lawCase.adjustPointCode']: this.data.adjustPointArray[index].adjustPointCode,
      ['lawCase.adjustPointName']: this.data.adjustPointArray[index].adjustPointName,
      ['lawCase.lawOrgName']: this.data.adjustPointArray[index].lawOrgName,
      ['lawCase.lawOrgId']: this.data.adjustPointArray[index].lawOrgId,
      adjustPointName: this.data.adjustPointArray[index].adjustPointName,
    })
  },

  //获取调解点数据
  getAdjustPoint: function (adjustCityName, adjustCityNameArr) {
    console.log(adjustCityNameArr,"!!!!!!!!!!!!!!!!");
    let adjustCity = "";
    if (adjustCityName){
      // adjustCityName.split("省")[1] ? adjustCity = adjustCityName : adjustCity = ;
    
      (adjustCityNameArr[0].indexOf("省") != -1 || adjustCityNameArr[0].indexOf("自治区") != -1)? adjustCity = adjustCityName : (adjustCityNameArr[1].indexOf("县") != -1 ? adjustCity = adjustCityName : adjustCity = adjustCityNameArr[0] + '-市辖区-' + adjustCityNameArr[2])
    }
   
    let that = this
    if (adjustCityName) {
      console.log(adjustCity);
      let url ='/adjust/queryMediationOrg'
      app.NetRequest(url, { "adjustCityName": adjustCity}, res=>{
        console.log(res)
        if(res.code == 0) {
          //获取调解点名称数组
          let arr = []
          res.result.forEach(v=>{
            arr.push(v.adjustPointName)
          })
          that.setData({
            adjustPointArray: res.result,
            adjustPointNameArray: arr
          })
        } else {
          that.showToast('error', res.message)
        }
        
      })
    }
  },

  /**
   * build workFlow data 
   */
  buildWorkFlowData: function (adjust) {
    var workFlowData = new dictionary.workFlowData();
    workFlowData.adjustOrgName = adjust.adjustOrgName;
    workFlowData.adjustPointName = adjust.adjustPointName;
    workFlowData.applyTotal = adjust.applyTotal;

    return workFlowData;
  },

  /**
   * save workFlow Info 
   */
  saveWorkFlow: function(){
    var that = this
    var lawCase = that.data.lawCase
    var workFlowData = that.buildWorkFlowData(lawCase);
    var url = '/common/insertJyWorkFlow';
    var data ={
      type: "001",
      orgCode: lawCase.adjustOrgCode,
      orgName: lawCase.adjustOrgName,
      jyAdjustInfoId: lawCase.id,
      result: '0',
      resultName: "提交审核",
      tempData: JSON.stringify(workFlowData)
    }

    app.NetRequest(url, data, function(res){
      console.log(res.result);
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var dataUrl = wx.getStorageSync("dataUrl");
    var lawCase = typeof(options.lawCase) == 'string' ? JSON.parse(options.lawCase) : options.lawCase;
    if (!lawCase.evidenceArray) lawCase.evidenceArray = [];
    if (!lawCase.feeDetail) lawCase.feeDetail = dictionary.feeTypeList;
    if (typeof(lawCase.feeDetail) == 'string') lawCase.feeDetail = JSON.parse(lawCase.feeDetail)
    if (lawCase.adjustPointName) this.setData({adjustPointName: lawCase.adjustPointName})
    if (lawCase.region) this.setData({ region: lawCase.region})
    //过滤掉0.00的价格
    // lawCase.feeDetail = JSON.parse(lawCase.feeDetail)
    lawCase.feeDetail.forEach(v=>{
      if (parseInt(v.applyAmount) == 0) {
        v.applyAmount = ''
      }
    })
    this.setData({
      lawCase: lawCase,
      imageAddress: wx.getStorageSync("dataUrl") + '/common/image/getThumbnail/' || app.globalData.imageAddress,
    })
    console.log(this.data.lawCase)
    var that = this;
   
    if (!this.data.lawCase.regionName){
      if (wx.canIUse('getLocation')) {
        utils.getLocation(function (res) {
          console.log(res);
          var lawCase = res.province + "-" + res.city + "-" + res.district;
          var region = [res.province, res.city, res.district]
          let adjustCity = "";
          if (lawCase) {
            //lawCase.split("省")[1] ? adjustCity = region : adjustCity = [res.province, '市辖区', res.district];
            (res.province.indexOf("省") != -1 || res.province.indexOf("自治区") != -1) ? adjustCity = region : (res.city.indexOf("县") != -1 ? adjustCity = region : adjustCity = [res.province, '市辖区', res.district])
          }
          that.setData({
            region: adjustCity
          })
          that.getAdjustPoint(lawCase, region);
          console.log(that.data.lawCase);
        });
      }
    }else{
      var regionName = this.data.lawCase.regionName
      var regionNameArr = regionName.split("-");
      var region = [regionNameArr[0], regionNameArr[1], regionNameArr[2]]
      let adjustCity = "";
      if (regionName) {
        //regionName.split("省")[1] ? adjustCity = regionName : adjustCity = [regionNameArr[0], '市辖区', regionNameArr[2]];
        (e.detail.value[0].indexOf("省") != -1 || e.detail.value[0].indexOf("自治区") != -1)  ? adjustCity = regionName : (regionNameArr[1].indexOf("县") != -1 ? adjustCity = regionName : adjustCity = [e.detail.value[0], '市辖区', e.detail.value[2]])
      }
      that.setData({
        region: adjustCity
      })
      that.getAdjustPoint(regionName, region);
    }
    var sendData = {
      lawCase: that.data.lawCase,
      userInfo: '0',//只有当事人的时候，不会点击这里
      session: wx.getStorageSync('JSESSIONID'),
      platForm: 'basic'
    }
    that.setData({
      sendData: sendData
    })
    console.log(wx.getStorageSync('userInfo').userType,"$$$$$$");
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