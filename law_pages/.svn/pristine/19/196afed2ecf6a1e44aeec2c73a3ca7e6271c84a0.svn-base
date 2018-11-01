'use strict';
var app = angular.module('sbAdminApp');

app.directive('floatOnly', function($filter, $timeout) {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      var checkTimeout;
      element.bind('keyup', function(inputValue, e) {
        if(checkTimeout){
          $timeout.cancel(checkTimeout)
          checkTimeout = null;
        }
        var strinput = modelCtrl.$modelValue;
        checkTimeout = $timeout(function() {
          if(strinput && !isNaN(strinput)){
            strinput = strinput ? strinput.toString().replace(/[^\d.]/g, '') : "";
            if(strinput.indexOf(".") > 0 && strinput.length - 1 != strinput.indexOf(".")){
              var floatLength = strinput.length - strinput.indexOf(".") - 1;
              floatLength = floatLength > 2 ? 2:floatLength;
              strinput = parseFloat(strinput).toFixed(floatLength);
            }
          }else{
            strinput = "";
          }
          modelCtrl.$setViewValue(strinput);
          modelCtrl.$render();
        }, 1500);
      });
    }
  }
})


app.controller('secondInstanceLitigantionCtrl', function ($scope, SecondLitigantionConfig, SecondLitigantionService, LawConfig, $stateParams, $state, toaster, $location, $filter,LoginService,$rootScope) {
  //内部常量
  $scope.stepArray= [{
    id: "1",
    value: "上诉人"
  },{
    id: "2",
    value: "被上诉人"
  }, {
    id: "3",
    value: "原审当事人"
  }, {
    id: "4",
    value: "案件基本信息"
  }, {
    id: "5",
    value: "添加证据"
  }];

  //定义案件主表信息（包含案件信息）
  var SecondInstanceInfoVO = function (){
    this.id = "";
    this.serialNo = "";  //流水号
    this.orgLawNo = ""; //原审案号
    this.reason = "1"; //案由
    this.filingDate = ""; //立案登记日期
    this.claims = ""; //上诉请求
    this.factReason = ""; //事实与理由
    this.orgLawName = ""; //原审法院
    this.orgLawId = ""; //原审法院id
    this.secondInstanceApplicantArray = [];  //上诉人 被上诉人 原审当事人
  };

  //定义上诉人、被上诉人、原审当事人对象
  var LitigantionAppealVO = function (personType) {
    this.id = "";
    this.lawType = "0";  //原审诉讼地位 1：原告 2：被告
    this.personName = "";  //名称
    this.idType = "0";  //身份类型 0：公民 1：法人 2：其他组织
    this.personType = personType;  //用户类型 0：上诉人 1：被上诉人 2：原审当事人
    this.companyType = "1"; //保险公司类型
    this.certificatesType = "0";  //证件类型
    this.legalType = "1"; //代表人类型
    this.legalName = ""; //代表人姓名
    this.certificatesNo = "";  //证件号
    this.position = ""; //公司职务
    this.comCode = ""; //组织机构代码
    this.sex = "0";  //性别
    this.birthday = "";  //出生日期
    this.nation = "";  //民族
    this.telephone = "";  //手机号
    this.email = "";  //电子邮箱
    this.domicile = "";  //户籍地
    this.residence = "";  //居住地
    this.sendAddress = ""; //送达地址
    this.companyName = ""; //公司名称
    this.centralCompanyName = ""; //总公司
    this.lossNo = ""; //报案号
    this.secondInstanceAgentInfoList = [];  //代理人数据
    this.plateNo = ""; //车牌号
    this.idFacePicture = $scope.options.defaultImg2; //证件正面图
    this.idBackPicture = $scope.options.defaultImg3; //证件背面图
  };

  //定义代理人对象
  var AgentVO = function () {
    this.id = "";
    this.agentType = "0";  //代理人类型 0：委托 1：法定
    this.entrustPower = "0";  //委托权限 0：一般授权代理 1：特别授权代理
    this.entrustPowerDetail = [];  //委托详情
    this.mainContacts = ""; //是否主要联系人
    this.agentIdentity = "0"; //代理人身份 0：律师 1：公民 2：法律工作者3：其他
    this.agentIdentityItem = "1";  //代理人类型公民时显示（1：近亲属 2：单位职员 3：公司员工 4：有关社会团体推荐 5：其他）
    this.relation = "";  //与上诉人关系
    this.agentName = "";  //代理人姓名
    this.certificatesType = "0";  //证件类型
    this.idNo = ""; //证件号
    this.birthDay = ""; //出生日期
    this.sex = "0"; //性别
    this.nation = ""; //民族
    this.telephone = ""; //电话
    this.companyName = ""; //单位名称
    this.sendAddress = ""; //送达地址
    this.idFront = $scope.options.defaultImg2; //身份证正面
    this.idBack = $scope.options.defaultImg3; //身份证背面
    this.entrustFile = $scope.options.defaultImg; //委托书
    this.feeCertificate = $scope.options.defaultImg; //不收取费用证明书
    this.relationSupport = $scope.options.defaultImg; //与当事人关系证明
  };

  //内部对象
  $scope.options = {
    mainFlow: true,  //控制头部菜单显示隐藏
    step: "",  //当前步骤
    defaultImg: "views/images/_r2_c2.png",
    defaultImg2: "views/images/7.png",
    defaultImg3: "views/images/6.png",
    birthdayOpened: false, //出生日期插件显示隐藏控制
    agentBirthdayOpened: false, //代理人出生日期显隐控制
    agentPowerObj: {}, //存储选择的委托权限详情
    idTypeList: SecondLitigantionConfig.idTypeConstant, //身份类型
    agentTypeList: SecondLitigantionConfig.agentTypeConstant, //代理人类型
    legalTypeList: SecondLitigantionConfig.legalTypeList, //代表人类型
    companyTypeList: SecondLitigantionConfig.companyTypeList, //公司类型
    entrustPowerList: SecondLitigantionConfig.proxyPermissionConstant, //委托权限
    agentPowerList: SecondLitigantionConfig.agentPowerList, //委托权限详情
    agentIdentityList: SecondLitigantionConfig.proxyTypeConstant, //代理人身份
    agentIdentityItemList: SecondLitigantionConfig.agentIdentifySubList, //代理人类型公民时显示
    relationList: SecondLitigantionConfig.relation2Applicant, //与上诉人关系
    certificatesTypeList: SecondLitigantionConfig.certificateTypeConstant  //证件类型
  };
  //定义图片请求头部
  $scope.imageAddress = LawConfig.pictureConstant.bigPictureUrl;

  //定义页面常量
  $scope.CONSTANT = {
    "messageLawTypeNull": "请选择原审诉讼地位",
    "messageApplicantNameNull": "申请人姓名不能为空",
    "messageRespondentNameNull": "被申请人姓名不能为空",
    "messagePartiesNameNull": "原审当事人姓名不能为空",
    "messageIdNoNull": "身份证号不能为空",
    "messageIdentityFormatError": "身份证号格式有误",
    "messageBirthDayNull": "出生日期不能为空",
    "messageNationNull": "民族不能为空",
    "messageTelephoneNull": "电话号码不能为空",
    "messagePhoneFormatError": "电话号码格式有误",
    "messageEmailFormatError": "电子邮箱格式有误",
    "messageDomicileNull": "户籍所在地不能为空",
    "messageResidenceNull": "居住地不能为空",
    "messageSendAddressNull": "送达地址不能为空",
    "messageOrgNameNull": "企业名称不能为空",
    "messageOrgNameNull2": "组织名称不能为空",
    "messageUnitNameNull": "单位名称不能为空",
    "messageLegalNameNull": "代表人姓名不能为空",
    "messageAgentNameNull": "代理人姓名不能为空",
    "messagePositionNull": "公司职务不能为空",
    "messagePlateNoNull": "保险公司不能为空",
    "agentBeyondMax": "每个申请人最多拥有两个代理人",
    "messagePictrueTypeError": "请上传文件",
    "messageOrgLawNoNull": "原审案号不能为空",
    "messageOrgLawNameNull": "原审法院不能为空",
    "messageReasonNull": "案由不能为空",
    "messageFilingDateNull": "立案登记日期不能为空",
    "messageClaimsNull": "上诉请求不能为空",
    "messageFactReasonNull": "事实与理由不能为空",
    "messageAppellateNull": "请上传民事上诉状、答辩状",
    "messageHostMaterialsNull": "请上传主体材料",
    "messageSaveSuccess": "保存成功"
  };

  //定义验证数据弹框提示
  $scope.validate = {
    "error": "error",
    "warn": "warn",
    "success": "success",
    "errorTxt": "错误",
    "warnTxt": "提示",
    "successTxt": "成功"
  };

  //民事上诉状
  $scope.appealEvidence = [];
  //主体材料
  $scope.materialsEvidence = [];
  //其他证据材料
  $scope.restsEvidence = [];

  //查询时，转换数据格式（json->object or -> string）
  var jsonConversionObject = function (secondInstanceInfoVO) {
    //主表数据
    if(secondInstanceInfoVO.filingDate) secondInstanceInfoVO.filingDate = secondInstanceInfoVO.filingDate.split(' ')[0];
    //上诉、被上诉、原审当事
    secondInstanceInfoVO.secondInstanceApplicantArray.forEach(function (value) {
      if(value.birthday) value.birthday = value.birthday.split(' ')[0];

      //代理人
      if(value.secondInstanceAgentInfoList && value.secondInstanceAgentInfoList.length > 0) {
        value.secondInstanceAgentInfoList.forEach(function (value) {
          if(value.birthDay) value.birthDay = value.birthDay.split(' ')[0];
          if(value.entrustPowerDetail) {  //将代理人选择详细部分转换为对象
            var arr = angular.copy(value.entrustPowerDetail).split(',');
            value.entrustPowerDetail = {};
            _.each(arr, function (v) {
              value.entrustPowerDetail['id_'+v] = true;
            })
          } else {
            value.entrustPowerDetail = {};
          }
          console.log(value.entrustPowerDetail);
        })
      }
    });
  };

  //保存时，转换数据格式（object->json）
  var objectConversionJson = function (secondInstanceInfoVO) {
    //主表数据
    if(secondInstanceInfoVO.filingDate) secondInstanceInfoVO.filingDate = dateToString(secondInstanceInfoVO.filingDate);
    //上诉、被上诉、原审当事
    secondInstanceInfoVO.secondInstanceApplicantArray.forEach(function (v) {
      if(v.birthday) v.birthday = dateToString(v.birthday);
      
      //代理人
      if(v.secondInstanceAgentInfoList && v.secondInstanceAgentInfoList.length > 0) {
        v.secondInstanceAgentInfoList.forEach(function (m) {
          if(m.birthDay) {
            if(typeof m.birthDay === 'object') {
              m.birthDay = $filter('date')(m.birthDay, 'yyyy-MM-dd HH:mm:ss');
            } else {
              var date = new Date(m.birthDay.split(',').join('/'));
              m.birthDay = $filter('date')(date, 'yyyy-MM-dd HH:mm:ss');
            }
          }
          if(m.entrustPowerDetail) {
            var obj = angular.copy(m.entrustPowerDetail);
            m.entrustPowerDetail = [];
            for(var i in obj) {
              if(obj[i]) m.entrustPowerDetail.push(i.substring(3));
            }
            if(i == 0) m.entrustPowerDetail = '';
            else m.entrustPowerDetail = m.entrustPowerDetail.join(',');
          }

        })
      }
    });
  };

  //页面初始化
  $scope.init = function () {
    $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
    $scope.sysUser = LoginService.user.sysUser;
    //判断是否有传来的id（是否由列表点击而来）
    if($stateParams && $stateParams.id) {
      //存在id，根据id请求后台数据
      SecondLitigantionService.querySecondIntanceInfo({id: $stateParams.id}).success(function (res) {
        if(res.code == SecondLitigantionConfig.commonConStant.SUCCESS){
          $scope.secondInstanceInfoVO = res.result;
          console.log(res);
          jsonConversionObject($scope.secondInstanceInfoVO);
          $scope.$broadcast("init");
        } else {
          $rootScope.toaster($scope.validate.error, $scope.validate.errorTxt, res.message); //原审当事人人
        }
      })
    } else {
      //不存在id，表示新建案件
      //创建案件主表对象
      $scope.secondInstanceInfoVO = new SecondInstanceInfoVO();
      //创建上诉人，被上诉人对象并存入主表（原审当事人为选择性添加）
      $scope.secondInstanceInfoVO.secondInstanceApplicantArray.push(new LitigantionAppealVO("0"));
      $scope.secondInstanceInfoVO.secondInstanceApplicantArray.push(new LitigantionAppealVO("1"));
      //$scope.secondInstanceInfoVO.secondInstanceApplicantArray.push(new LitigantionAppealVO("2"));
    }

    //根据二审法院id查询原审法院列表
    $scope.querySecondIntance = function () {
      SecondLitigantionService.querySysOrgInfo({secondintanceOrgId: $scope.userDepart.orgId}).success(function (res) {
        console.log(res);
        if(res.code == SecondLitigantionConfig.commonConStant.SUCCESS) {
          $scope.orgLawNameList = res.result;
        } else {
          $rootScope.toaster($scope.validate.error, $scope.validate.errorTxt, res.message);
        }
      })
    };
    $scope.querySecondIntance();
  };

  //验证数据格式
  var validateStep123 = function () { //第一二三步验证
    //删除左右两侧空格
    String.prototype.trim=function(){
      return this.replace(/(^\s*)|(\s*$)/g, "");
    };
    //定义验证数据方法（申请、被申请、原审当事人）
    var applicantValidateFun = function (applicantList) {
      var mailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; //邮箱
      var phoneReg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/; //电话
      //遍历所有用户
      for(var i = 0; i < applicantList.length; i++) {
        var v = applicantList[i];
        console.log(v)
        if(v.agentType === undefined) { //上诉、被上诉、原审当事人
          //公民
          if(v.idType == 0) {
            //原审诉讼地位
            console.log(v.lawType)
            if(!v.lawType || v.lawType == '0') {
              v.lawTypeError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageLawTypeNull);
              return false;
            } else v.lawTypeError = undefined;
            //申请人姓名
            if (!v.personName) {
              v.personNameError = true;
              if($scope.options.step == 1){
                $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageApplicantNameNull); //申请人
              }else if($scope.options.step == 2){
                $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageRespondentNameNull); //被申请人
              } else {
                $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messagePartiesNameNull); //原审当事人人
              }
              return false;
            } else v.personNameError = undefined;
            //证件号码
            //v.certificatesNo? v.idNo = v.certificatesNo: '';
            if (!v.certificatesNo) {
              v.idNoError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageIdNoNull);
              return false;
            } else if(v.certificatesType==0 && !checkIdentity(v)){
              return false;
            } else v.idNoError = undefined; delete v.idNo;
            // 出生日期
            if (!v.birthday) {
              v.birthDayError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageBirthDayNull);
              return false;
            }else v.birthDayError = undefined;
            //民族
            if (!v.nation) {
              v.nationError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageNationNull);
              return false;
            } else v.nationError = undefined;
            //电话号码
            if (v.telephone && !phoneReg.test(v.telephone)) {
              v.telephoneError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messagePhoneFormatError);
              return false;
            } else v.telephoneError = undefined;
            //邮箱
            if (v.email && !mailReg.test(v.email)) {
              v.emailError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageEmailFormatError);
              return false;
            } else v.emailError = undefined;
            //户籍所在地
            if (!v.domicile) {
              v.domicileError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageDomicileNull);
              return false;
            } else v.domicileError = undefined;
            //居住地
            if (!v.residence) {
              v.residenceError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageResidenceNull);
              return false;
            } else v.residenceError = undefined;
            //送达地址
            if (!v.sendAddress) {
              v.sendAddressError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageSendAddressNull);
              return false;
            } else v.sendAddressError = undefined;

          }
          //法人
          if(v.idType == 1) {
            //企业名称
            if (!v.personName) {
              v.personNameError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageOrgNameNull);
              return false;
            } else v.personNameError = undefined;
            //代表人姓名
            if (!v.legalName && v.lawType == 1) {
              v.legalNameError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageLegalNameNull);
              return false;
            } else v.legalNameError = undefined;
            //公司职务
            if (!v.position) {
              v.positionError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messagePositionNull);
              return false;
            } else v.positionError = undefined;
            //手机号码
            if /*(!v.telephone) {
              v.telephoneError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageTelephoneNull);
              return false;
            } else if*/(v.telephone && !phoneReg.test(v.telephone)) {
              v.telephoneError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messagePhoneFormatError);
              return false;
            } else v.telephoneError = undefined;
            //居住地
            if (!v.residence) {
              v.residenceError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageResidenceNull);
              return false;
            } else v.residenceError = undefined;
            //送达地址
            if (!v.sendAddress) {
              v.sendAddressError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageSendAddressNull);
              return false;
            } else v.sendAddressError = undefined;
          }
          //其他组织
          if (v.idType == "2") {
            //组织名称
            if (!v.personName) {
              v.personNameError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageOrgNameNull2);
              return false;
            } else v.personNameError = undefined;
            //代表人姓名
            if (!v.legalName) {
              v.legalNameError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageLegalNameNull);
              return false;
            } else v.legalNameError = undefined;
            //公司职务
            if (!v.position) {
              v.positionError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messagePositionNull);
              return false;
            } else v.positionError = undefined;
            //手机号码
            if /*(!v.telephone) {
              v.telephoneError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageTelephoneNull);
              return false;
            } else if*/(v.telephone && !phoneReg.test(v.telephone)) {
              v.telephoneError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messagePhoneFormatError);
              return false;
            } else v.telephoneError = undefined;
            //居住地
            if (!v.residence) {
              v.residenceError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageResidenceNull);
              return false;
            } else v.residenceError = undefined;
            //送达地址
            if (!v.sendAddress) {
              v.sendAddressError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageSendAddressNull);
              return false;
            } else v.sendAddressError = undefined;
          }
        } else {  //代理人
          if (v.agentType == "0") {//委托
            //代理人类型
            if (v.agentIdentity == "1") {
              if(v.agentIdentityItem == "1" && !v.relation){
                v.agentIdentityItemError = true;
                $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, "与当事人关系不能为空!");
                return false;
              }else v.agentIdentityItemError = undefined;
              //证件号码
              if (!v.idNo && v.certificatesType != 5) {
                v.idNoError = true;
                $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageIdNoNull);
                return false;
              }else if(v.certificatesType=='0' && !checkIdentity(v, true)){
                return false;
              } else v.idNoError = undefined;

              if(!v.birthDay){
                v.birthDayError = true;
                $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, "代理人生日不能为空!");
                return false;
              } else v.birthDayError = undefined;
              if(!v.nation){
                v.nationError = true;
                $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, "代理人民族不能为空!");
                return false;
              } else v.nationError = undefined;
            }
            //证件号码
            if (!v.idNo && v.certificatesType != 5) {
              v.idNoError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageIdNoNull);
              return false;
            }else if(v.certificatesType=='0' && !checkIdentity(v, true)){
              return false;
            } else v.idNoError = undefined;
            //代理人姓名
            if (!v.agentName) {
              v.agentNameError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageLegalNameNull);
              return false;
            } else v.agentNameError = undefined;
            //手机号码
            if (!v.telephone) {
              v.telephoneError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageTelephoneNull);
              return false;
            } else if(v.telephone && !phoneReg.test(v.telephone)) {
              v.telephoneError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messagePhoneFormatError);
              return false;
            } else v.telephoneError = undefined;
            //邮箱
            if (v.email && !mailReg.test(v.email)) {
              v.emailError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageEmailFormatError);
              return false;
            } else v.emailError = undefined;
            if (!v.domicile && v.agentIdentity=='1') {//公民时需要填写户籍地
              v.domicileError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageDomicileNull);
              return false;
            } else v.domicileError = undefined;

            //送达地址
            if (!v.sendAddress) {
              v.sendAddressError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageSendAddressNull);
              return false;
            } else v.sendAddressError = undefined;
          }
          //法定
          if (v.agentType == "1") {
            //clearAgentType(v.agentType)
            //证件类型
            if (!v.certificatesType) {
              v.certificatesTypeError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageIdTypeNull);
              return false;
            } else v.certificatesTypeError = undefined;
            //证件号码
            if (!v.idNo && v.certificatesType != 5) {
              v.idNoError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageIdNoNull);
              return false;
            } else v.idNoError = undefined;
            //代理人姓名
            if (!v.agentName) {
              v.agentNameError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageAgentNameNull);
              return false;
            } else v.agentNameError = undefined;
            //手机号码
            var phoneAgentReg = /^1[3|4|5|8][0-9]\d{4,8}$/;
            if (!v.telephone) {
              v.telephoneError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageTelephoneNull);
              return false;
            } else if(v.telephone && !phoneAgentReg.test(v.telephone)) {
              v.telephoneError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messagePhoneFormatError);
              return false;
            } else v.telephoneError = undefined;
            //邮箱
            if (v.email && !mailReg.test(v.email)) {
              v.emailError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageEmailFormatError);
              return false;
            } else v.emailError = undefined;
            //户籍所在地
            if (!v.domicile) {
              v.domicileError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageDomicileNull);
              return false;
            } else v.domicileError = undefined;
            //居住地
            if (!v.residence) {
              v.residenceError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageResidenceNull);
              return false;
            } else v.residenceError = undefined;
            //送达地址
            if (!v.sendAddress) {
              v.sendAddressError = true;
              $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageSendAddressNull);
              return false;
            } else v.sendAddressError = undefined;
          }
        }
      }
      return true;
    };

    //验证数据格式
    return (function () {
      var applicantList = [];
      //获取当前步骤申请人数据
      console.log($scope.secondInstanceInfoVO)
      _.each($scope.secondInstanceInfoVO.secondInstanceApplicantArray, function (v) {
        if($scope.options.step - 1 == v.personType) applicantList.push(v); //填入申请人
        if(v.secondInstanceAgentInfoList && v.secondInstanceAgentInfoList.length > 0) { //填入代理人
          _.each(v.secondInstanceAgentInfoList, function (x) {
            applicantList.push(x);
          })
        }
      });
      if($scope.options.step == 3 && (!applicantList || (applicantList && applicantList.length == 0))) {
        return true;
      }
      return applicantValidateFun(applicantList);
    })();
  };

  var validateStep4 = function () { //第四步验证
    var v = $scope.secondInstanceInfoVO;
    if(!v.orgLawNo) {
      v.orgLawNoError = true;
      $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageOrgLawNoNull);
      return false;
    } else v.orgLawNoError = undefined;
    if(!v.orgLawId) {
      v.orgLawIdError = true;
      $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageOrgLawNameNull);
      return false;
    } else v.orgLawIdError = undefined;
    if(!v.reason) {
      v.reasonError = true;
      $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageReasonNull);
      return false;
    } else v.reasonError = undefined;
    if(!v.filingDate) {
      v.filingDateError = true;
      $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageFilingDateNull);
      return false;
    } else v.filingDateError = undefined;
    if(!v.claims) {
      v.claimsError = true;
      $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageClaimsNull);
      return false;
    } else v.claimsError = undefined;
    if(!v.factReason) {
      v.factReasonError = true;
      $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageFactReasonNull);
      return false;
    } else v.factReasonError = undefined;
    return true;
  };

  var validateStep5 = function () { //第五步验证
    var v = $scope.secondInstanceInfoVO;
    //遍历证据列表，获取民事上诉状evidenceType:0 与 主体材料 evidenceType:1
    console.log($scope.appealEvidence)
    if($scope.appealEvidence.length == 0) {
      $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageAppellateNull);
      return false;
    }
    if($scope.materialsEvidence.length == 0) {
      $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageHostMaterialsNull);
      return false;
    }
    return true;
  };

  //保存
  $scope.handleSave = function (goState) {
    objectConversionJson($scope.secondInstanceInfoVO); //格式化数据
    console.log($scope.secondInstanceInfoVO);
    SecondLitigantionService.saveSecondIntanceInfo($scope.secondInstanceInfoVO).success(function (res) {
      if(res.code == SecondLitigantionConfig.commonConStant.SUCCESS) {
        console.log(res)
        if(!goState) {
          $rootScope.toaster($scope.validate.success, $scope.validate.successTxt, $scope.CONSTANT.messageSaveSuccess);
        }
        if($location.url().indexOf("//") !== -1) {
          if(goState){
            $location.url('/dashboard/secondInstanceLitigantion/'+res.result.id+'/secondStep123/' + (parseInt($scope.options.step) + 1));
          } else{
            $location.url('/dashboard/secondInstanceLitigantion/'+res.result.id+'/secondStep123/' + parseInt($scope.options.step));//防止刷新丢失数
          }
          //生成二维码
          //$scope.mediateCode(result.result);
          return;
        }
        $scope.init(); //重新请求数据并未案件赋值id，流水号等数据
        goState = goState || function(){};
        goState();
      } else {
        $rootScope.toaster($scope.validate.error, $scope.validate.errorTxt, res.message);
      }
    })
  };

  //上一步
  $scope.handlePrev = function () {
    //跳转页面
    if($scope.options.step >= 1 && $scope.options.step <= 5) {
      $scope.options.step--;
      if($scope.options.step >= 3) $state.go("dashboard.secondInstanceLitigantion.secondStep123", {step: $scope.options.step});
      if($scope.options.step == 4) $state.go("dashboard.secondInstanceLitigantion.step4", {step: $scope.options.step});
      if($scope.options.step == 5) $state.go("dashboard.secondInstanceLitigantion.step5", {step: $scope.options.step});
    }
  };

  //下一步
  $scope.handleNext = function () {
    if($scope.options.step <= 3 && validateStep123()) {
      //跳转页面
      $scope.handleSave(function() {
        $scope.options.step++;
        if($scope.options.step == 4) {
          $state.go("dashboard.secondInstanceLitigantion.step4", {step: $scope.options.step});
        } else {
          $state.go("dashboard.secondInstanceLitigantion.secondStep123", {step: $scope.options.step});
        }
      });
    } else if($scope.options.step == 4 && validateStep4()) {
      $scope.options.step++;
      $scope.handleSave(function() {
        $state.go("dashboard.secondInstanceLitigantion.step5", {step: $scope.options.step});
      });
    }
  };
  //定义二审流程对象
  function SecondInstanceWorkFlow(){
    //类型 状态 1000：立案登记  1001：立案审批 1002：分案 1003：排期 1004：庭审赔偿计算（办案） 1005：结案
    this.type = $scope.secondInstanceInfoVO.state;
    //流水号
    this.serialNo = $scope.secondInstanceInfoVO.serialNo;
    //结果 (0:表示同意  1：表示拒绝 2：表示成功)
    this.result = $scope.secondInstanceInfoVO.isAgree;
    //结果备注
    this.remark = $scope.secondInstanceInfoVO.remark;
    //json字段
    this.tempData = "";
  }
  //处理流程
  function saveSecondInstanceWorkFlow(){
    //插入流程表
    $scope.secondInstanceWorkFlow = new SecondInstanceWorkFlow();

    $scope.secondInstanceWorkFlow.resultName = "登记成功";

    //插入操作
    SecondLitigantionService.saveSecondInstanceWorkFlowInfo($scope.secondInstanceWorkFlow).success(function (res){
      if(res.code == SecondLitigantionConfig.commonConStant.SUCCESS) {
        $state.go("dashboard.secondPendingComplete", {state: "1001"});
      } else {
        $rootScope.toaster($scope.validate.error, $scope.validate.errorTxt, res.message);
      }
    });
  }
  //提交
  $scope.handleSubmit = function () {
    //判断民事上诉状与
    if(validateStep5() && confirm("是否确认提交？")) {
      //修改案件状态
      $scope.secondInstanceInfoVO.state = "1001";
      //插入立案登记人
      $scope.secondInstanceInfoVO.filingName = $scope.sysUser.text;
      //跳转页面到等待数秒
      $scope.handleSave(function() {
        //保存流程表
        saveSecondInstanceWorkFlow();
      });
    }
  };

  //子级新增上诉人、被上诉人、原审当事人函数
  $scope.$on('addApplicant', function () {
    $scope.secondInstanceInfoVO.secondInstanceApplicantArray.push(new LitigantionAppealVO(parseInt($scope.options.step) - 1));
  });

  //子级删除上诉人、被上诉人、原审当事人函数
  $scope.$on('deleteApplicant', function (event, applicant) {
    console.log(applicant)
    if(applicant.id) { //如果存在id，证明已经保存过，需调用接口删除
      SecondLitigantionService.deleteSecondInstanceApplyerInfo({id: applicant.id}).success(function (res) {
        console.log(res)
        if(res.code == SecondLitigantionConfig.commonConStant.SUCCESS) {
          //从页面数组删除该项
          $scope.secondInstanceInfoVO.secondInstanceApplicantArray.splice($scope.secondInstanceInfoVO.secondInstanceApplicantArray.indexOf(applicant), 1);
          $rootScope.toaster($scope.validate.success, $scope.validate.successTxt, "删除成功");
        } else {
          $rootScope.toaster($scope.validate.error, $scope.validate.errorTxt, res.message);
        }
      })
    } else { //没有id，证明没有保存过，直接从页面删除即可
      $scope.secondInstanceInfoVO.secondInstanceApplicantArray.splice($scope.secondInstanceInfoVO.secondInstanceApplicantArray.indexOf(applicant), 1);
      $rootScope.toaster($scope.validate.success, $scope.validate.successTxt, "删除成功");
    }

  });

  //子级新增代理人函数
  $scope.$on('addAgent', function (event, target) {
    target.push(new AgentVO());
  });

  //子级删除代理人函数
  $scope.$on('deleteAgent', function (event, applicant, agent) {
    if(agent.id) {
      SecondLitigantionService.deleteSecondInstanceAgentInfo({id: agent.id}).success(function (res) {
        if(res.code == SecondLitigantionConfig.commonConStant.SUCCESS) {
          $scope.init();
        } else {
          $rootScope.toaster($scope.validate.error, $scope.validate.errorTxt, res.message);
        }
      })
    } else {
      applicant.secondInstanceAgentInfoList.splice(applicant.secondInstanceAgentInfoList.indexOf(agent), 1);
    }
    $rootScope.toaster("success", "成功", "删除成功");
  });
  
  //子级上传证据，获取证据列表
  $scope.$on('getUploadEvidenceList', function (event, uploadEvidenceList) {
    $scope.uploadEvidenceList = uploadEvidenceList;
  });

  //出生日期（日期插件）
  $scope.openBirthdayInfoDate = function($event, index) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.options.birthdayOpened = true;
  };

  //代理人出生日期（日期插件）
  $scope.openAgentBirthdayInfoDate = function($event, index) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.options.agentBirthdayOpened = true;
  };

  //日期对象转化成字符串
  var dateToString = function (date) {
    console.log(date);
    if(typeof date === 'object') {
      date = $filter('date')(date, 'yyyy-MM-dd HH:mm:ss');
    } else {
      var nowDate = new Date(date.split(',').join('/'));
      date = $filter('date')(nowDate, 'yyyy-MM-dd HH:mm:ss');
    }
    return date;
  };

  //验证身份证
  var checkIdentity = function(applicant, isAgent) {
    var wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
    var valideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
    function isTrueValidateCodeBy18IdCard(idCard) {
      var idCardArray = [];
      for (var i = 0; i <= 17; i++) {
        var char = idCard.charAt(i);
        if(idCard.charAt(i).toUpperCase() == 'X'){
          char = 10;// 将最后位为x的验证码替换为10方便后续操作
        }
        idCardArray.push(parseInt(char));
      }
      var sum = 0; // 声明加权求和变量
      for (var i = 0; i < 17; i++) {
        sum += wi[i] * idCardArray[i]; // 加权求和
      }
      var valCodePosition = sum % 11; // 得到验证码所位置
      return idCardArray[17] == valideCode[valCodePosition];
    }
    if(!isAgent) {
      applicant.idNo = applicant.certificatesNo;
    }

    if (applicant.certificatesType == 0 && applicant.idNo) {
      if(typeof applicant.idNo !== 'string') applicant.idNo = applicant.idNo.toString();
      applicant.idNo = applicant.idNo.replace(/ /g, "");
      if (applicant.idNo.length == 15) {
        var year = applicant.idNo.substring(6, 8);
        var month = applicant.idNo.substring(8, 10);
        var day = applicant.idNo.substring(10, 12);
        var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
        if (tempDate.getYear() == parseFloat(year) && tempDate.getMonth() == parseFloat(month) - 1 && tempDate.getDate() == parseFloat(day)) {
          applicant.birthDay = tempDate;
          applicant.sex = applicant.idNo.substring(14, 15) % 2 == 0 ? '1' : '0';
          applicant.idNoError = false;
        } else {
          applicant.idNoError = true;
          $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageIdentityFormatError);
          return false;
        }
      } else if (applicant.idNo.length == 18 && isTrueValidateCodeBy18IdCard(applicant.idNo)) {
        var year = applicant.idNo.substring(6, 10);
        var month = applicant.idNo.substring(10, 12);
        var day = applicant.idNo.substring(12, 14);
        var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
        if (tempDate.getFullYear() == parseFloat(year) && tempDate.getMonth() == parseFloat(month) - 1 && tempDate.getDate() == parseFloat(day)) {
          applicant.birthDay = tempDate;
          applicant.sex = applicant.idNo.substring(16, 17) % 2 == 0 ? '1' : '0';
          applicant.idNoError = false;
        } else {
          applicant.idNoError = true;
          $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageIdentityFormatError);
          return false;
        }
      } else {
        //校验香港身份证规则
        var taiwanreg = /^[A-Z][0-9]{9}$/;
        //校验台湾身份证规则
        var xianggangreg = /^[A-Z][0-9]{6}\([0-9A-Z]\)$/;
        var xianggangreg1 = /^[A-Z][0-9]{6}\（[0-9A-Z]\）$/;
        //校验澳门身份证规则
        var aomenreg = /^[157][0-9]{6}\([0-9]\)$/;
        var aomenreg1 = /^[157][0-9]{6}\（[0-9]\）$/;
        if (!(taiwanreg.test(applicant.idNo) || xianggangreg.test(applicant.idNo) || xianggangreg1.test(applicant.idNo) || aomenreg.test(applicant.idNo) || aomenreg1.test(applicant.idNo))) {
          applicant.idNoError = true;
          $rootScope.toaster($scope.validate.warn, $scope.validate.warnTxt, $scope.CONSTANT.messageIdentityFormatError);
          return false;
        } else applicant.idNoError = false;
      }
      if (isAgent && applicant.certificatesType!=0) {
        applicant.birthDay = applicant.sex = undefined;
      }
    }
    return true;
  };

  //获取登录用户id
  $scope.$on('user2Child', function(){
    //初始化数据
    $scope.init();
  });
  if (LoginService.user.userPermissions) {
    //初始化数据
    $scope.init();
  }
});
