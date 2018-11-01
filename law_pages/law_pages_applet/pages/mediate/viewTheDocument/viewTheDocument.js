// pages/mediate/viewTheDocument/viewTheDocument.js
const app = getApp()
// var WxParse = require('../../../wxParse/wxParse.js');
let util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lawCase: {},
    showSignatureWay: false, //显示签字方式弹框（点击协议签字）
    isLocalSignature: false, //是否允许本地签字
    userInfoType: '', //登录人身份  0申请人 1被申请人
    signImageSrc: '',
    imageAddress: app.globalData.imageAddress,
    document: '',  //当前文书数据
    userInfo: '',
    applicantIdArray: [], //保存document中的singature的applicantId
    wordType: "",
    dateToCN: "",
    certificatesList: ['身份证', '驾驶证', '外籍在华驾驶证', '军队驾驶证', '律师证', '暂未获取'],
    reasonList: ['机动车交通事故责任纠纷', '生命权、健康权、身体权纠纷', '保险人代位求偿权纠纷', '保险合同纠纷'],
    wordType: "",
    isAdjustSignature: false,
    isLoading: false
  },

  //判断调解员是否签过字
  isAdjustSignature: function() {
    let SignatureList = this.data.document.signatureList, adjustId = this.data.lawCase.adjustPersonId, that = this;
    SignatureList.forEach(v=>{
      if (v.applicantId == adjustId) {
        that.setData({
          isAdjustSignature: true
        })
      }
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

  initDocumentData: function() {
    let lawCase = this.data.lawCase, that = this
    lawCase.applicantArray.forEach(v=>{
      //添加生日
      if (v.birthDay) v.birthDayStr = v.birthDay.split(" ")[0].replace("-", "年").replace("-", "月")
      //添加证件类型
      if (v.certificatesType) v.certificatesStr = that.data.certificatesList[v.certificatesType]
    })
    //添加纠纷类型
    lawCase.reasonStr = that.data.reasonList[lawCase.reason - 1]
    //获取当前日期
    var date = new Date(Date.parse(lawCase.adjustDate.replace('年', '-').replace('月', '-').replace('日', '')));
    var y = date.getFullYear()
    var m = date.getMonth() + 1
    var d = date.getDate()
    lawCase.today = y + '年' + m + '月' + d + '日'
    //添加大写日期
    lawCase.upperTodata = that.conversionDate(date)
    //添加调解协议
    lawCase.adjustResultRemarkStr = []
    if (lawCase.adjustResultRemark.indexOf('\n') == -1) {
      lawCase.adjustResultRemarkStr = [lawCase.adjustResultRemark]
    } else {
      lawCase.adjustResultRemark.split('\n').forEach(x=>{
        lawCase.adjustResultRemarkStr.push(x)
      })
    }
    
    //保存数据
    this.setData({
      lawCase: this.data.lawCase
    })
  },

  showSignature: function() {
    //状态1000(调解中)才能签字
    if(this.data.lawCase.state == '1000') {
      this.setData({
        showSignatureWay: true //显示签字方式弹框
      })
    } else {
      this.showToast('error', '只有调解中案件才能签字！')
    }
  },

  //隐藏签字弹框
  hidenSignature: function() {
    this.setData({
      showSignatureWay: false //隐藏签字方式弹框
    })
  },

  //使用本移动设备签字
  toSignature: function() {
    this.setData({
      isLocalSignature: true
    })
    this.hidenSignature()
  },

  //授权签字
  authorization: function() {
    let url = '/adjust/updateDocument', that = this;
    app.NetRequest(url, { id: this.data.document.id, remoteSign: 1}, res=>{
      if(res.code == '0') {
        that.showToast('success', '授权成功！')
        this.setData({
          isLocalSignature: false, //取消本地签字
          ['document.remoteSign']: 1 //开启授权签字(并且隐藏 协议签字 按钮)
        })
        this.isAuthorization() //获取登录人身份
        this.hidenSignature() //隐藏选择框
      } else {
        that.showToast('error', res.message)
      }
    })
  },

  //跳转到签字页面
  handleSignature: function(e) {
    let index = e.currentTarget.dataset.index;
    let person;
    if(!index && index != 0) { //表示调解员签字
      wx.navigateTo({
        url: '../../signature/signature?'
      })
    } else {
      wx.navigateTo({
        url: '../../signature/signature?index=' + index
      })
    }
  },

  //签字页面回调函数
  initSignName: function(imgUrl, index) {
    //console.log(index)
    //保存签名
    let applicantId, url = '/adjust/saveApplerSignatureById', that = this, documentId = this.data.document.id;
    if(index || index == 0) { //申请人，被申请人
      applicantId = this.data.lawCase.applicantArray[index].id
    } else{ //调解员
      applicantId = app.globalData.userInfo.id
      //url = '/adjust/saveDocumentSignatureById'
    }
    let data = { applicantId: applicantId, documentId: documentId, signature: imgUrl }
    //console.log(data)
    app.NetRequest(url, data, res=> {
      if(res.code == '0') {
        //console.log(res)
        that.showToast('success', '签字成功！')
        //that.getDataToSerialNo(that.data.document.serialNo)
        //更新document的signatureList数据
        that.data.document.signatureList.push(res.result)
        that.setData({
          ['document.signatureList']: that.data.document.signatureList
        })
        that.getSignatureListId() //获取applicantId数组
        let pages = getCurrentPages()
        let prevPage = pages[pages.length - 2] //上个页面
        prevPage.getData(true)
      } else {
        that.showToast('success', '签字失败！')
      }
    })
  },

  //通过流水号查找数据
  getDataToSerialNo: function (serialNo) {
    let url = '/adjust/queryAdjustDetailBySerialNo', that = this;
    that.setData({
      isLoading: true
    })
    wx.showLoading({
      title: "加载中"
    })
    app.NetRequest(url, { serialNo: serialNo }, res => {
      wx.hideLoading()
      that.setData({
        isLoading: false
      })
      console.log(res,"!!!!!!!!")
      let lawCase = res.result;
      if (lawCase.feeDetail) {
        lawCase.feeDetail = JSON.parse(lawCase.feeDetail);
      }
      let dateToCN = util.CNDateString(new Date(lawCase.adjustDate)) 
      console.log(dateToCN);
      if (lawCase.adjustDate)lawCase.adjustDate = lawCase.adjustDate.split(" ")[0].replace("-", "年").replace("-", "月")
      if (lawCase.createDate) lawCase.createDate = lawCase.createDate.split(" ")[0].replace("-", "年").replace("-", "月")
      if (lawCase.applicantArray){
        var applicantIndex = 0
        var respondentIndex = 0
        var otherIndex = 0
        var arr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
        lawCase.applicantArray.forEach((v, i) =>{
          if (v.birthDay){
            v.birthDay = v.birthDay.split(" ")[0].replace("-", "年").replace("-", "月")
          }
          if(v.personType == '0'){
            v.no = arr[applicantIndex++]
          }else{
            v.no = arr[respondentIndex++]
          }
          if (v.idType != 0){
            v.no = arr[otherIndex++]
          }
          var agentIndex = 0
          if (v.agentArray){
            v.agentArray.forEach((m, i) => {
              m.no = arr[agentIndex++]
            })
          }
        })
        // lawCase.applicantArray.map((value, index, arr) => {
        //   if (lawCase.applicantArray[index].birthDay) {
        //     lawCase.applicantArray[index].birthDay = lawCase.applicantArray[index].birthDay.split(" ")[0].replace("-", "年").replace("-", "月")
        //   }
        // })
      }
      that.setData({
        lawCase: lawCase,
        dateToCN: dateToCN
      })
      console.log(this.data)
      this.getSignatureListId(); //为已经签字的人添加属性，并显示签字图片
      this.isAuthorization(); //获取登录人身份
      this.initDocumentData(); //填充文书需要的数据
      this.isAdjustSignature(); //调解员是否签字标识
    })
  },

  //为签字的人添加属性
  getSignatureListId: function() {
    let that = this;
    let applicantList = this.data.lawCase.applicantArray;
    let signatureList = this.data.document.signatureList;
    for (let i = 0; i < applicantList.length; i++) { //申请人，被申请人
      for (let k = 0; k < signatureList.length; k++) {
        if (applicantList[i].id == signatureList[k].applicantId) {
          applicantList[i].isSignature = true
          break;
        }
      }
    }
    for (let j = 0; j < signatureList.length; j++) { //调解员
      if (signatureList[j].applicantId == that.data.userInfo.id) {
        that.data.userInfo.isSignature = true
        break;
      }
    }
    this.setData({
      ['lawCase.applicantArray']: this.data.lawCase.applicantArray,
      userInfo: that.data.userInfo
    })
    //console.log(this.data)
  },

  //获取登录人身份
  isAuthorization: function() {
    let that = this
    if (this.data.document.remoteSign == '1') {
      //获取登录人身份证号
      let userInfoIdNo = this.data.userInfo.certificateNumber
      let userInfoPhone = this.data.userInfo.mobile
      //在applicantArray中查找登录人身份
      this.data.lawCase.applicantArray.forEach(v => {
        if (v.idNo && v.idNo == userInfoIdNo) {
          that.setData({
            userInfoType: v.personType
          })
        }
        if (v.telephone && v.telephone == userInfoPhone) {
          that.setData({
            userInfoType: v.personType
          })
        }
      })
    }
  },

  //将日期格式改为大写
  conversionDate: function(date) {
    //获取当前时间年月日
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var mapDate = { //创建数字对应的大写对象
      time0: '〇',
      time1: '一',
      time2: '二',
      time3: '三',
      time4: '四',
      time5: '五',
      time6: '六',
      time7: '七',
      time8: '八',
      time9: '九',
      time10: '十'
    };
    //将每个数字转换成大写
    function getNumberUp(numberArr, type) {
      var arr = [];
      numberArr.forEach(function (v, index) {
        if (type != 'year' && index == '1') {
          if (numberArr[0] == '1') arr.length = 0
          arr.push('十');
        }
        arr.push(mapDate['time' + v]);
      })
      return arr;
    }
    return (getNumberUp(year.toString().split(''), 'year').join('') + '年' + getNumberUp(month.toString().split(''), 'month').join('') + '月' + getNumberUp(day.toString().split(''), 'day').join('') + '日')
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var article = ""
    var path = options.path
    // const url = '/adjust/convertWordToHtml'
    // app.NetRequest(url, { path: path }, res => {
     
    //   //let wxml = encodeURI(res.result);
    //   var wxml = res.result.split('</html>')[0].split('<html xmlns:w="urn:schemas-microsoft-com:office:word">')[1]
    //   wxml = wxml.replace("p{margin: 0px;line-height:60px;}", "")
    //   WxParse.wxParse('article', 'html', wxml, that, 5);
    // })
    
    //通过流水号，查找案件信息
    this.setData({
      document: JSON.parse(options.document),
      userInfo: app.globalData.userInfo,
      wordType: JSON.parse(options.document).wordType
    })
    console.log(this.data.document)

    //console.log(this.data.document)
    this.getDataToSerialNo(this.data.document.serialNo) //获取案件信息
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
    //this.isSignImage() //是否显示签字图片
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