'use strict';

angular.module('sbAdminApp').filter('certificatesTypeToText', function() {
  return function(id,data) {
    var result = _.find(data, {
      id: id
    });
    return result ? result.value:""
  }
});

angular.module('sbAdminApp').controller('secondStep123Ctrl', function(IdentityService,$log,$scope, $stateParams, toaster, SecondLitigantionConfig, SecondLitigantionService, Upload, $http, $timeout,$rootScope) {
  //保险公司
  $scope.insuranceList = SecondLitigantionConfig.insuranceList;
  //常用保险公司
  $scope.commonInsuranceList = [];

  console.log($stateParams);

  //赋值step
  $scope.options.step = $stateParams.step;

  //定义常用保险公司对象
  var CommonInsurance = function(applicant) {
    this.companyName = applicant.personName || "";
    this.headOffice = applicant.centralCompanyName || "";
    //this.lossNo = applicant.lossNo || "";
    this.legalType = applicant.legalType || "1";
    this.job = applicant.position || "";
    this.orgCode = applicant.comCode || "";
    this.telephone = applicant.telephone || "";
    //this.plateNo = applicant.plateNo || "";
    this.residence = applicant.residence || "";
    this.sendAddress = applicant.sendAddress || "";
  };

  //定义人伤对象
  function PeopleInjured(){
    this.requestType = "001";
    this.accidentCode = "";
    this.code = "";
    this.serialNo = "";
  }

  //查询常用保险公司
  var queryGeneralInsurance = function () {
    SecondLitigantionService.queryGeneralInsuranceInfo({companyName: ''}).success(function (res) {
      console.log(res);
      if(res.code == SecondLitigantionConfig.commonConStant.SUCCESS) {
        $scope.commonInsuranceList = res.result;
      } else {
        $rootScope.toaster($scope.validate.error, $scope.validate.errorTxt, res.message);
      }
    })
  };
  queryGeneralInsurance();

  //保险公司单击事件
  $scope.selectItems = function(applicant, insurance) {
    applicant.centralCompanyName = insurance.text;
    applicant.insuranceCompanyId = insurance.id;
    //applicant.companyCode = insurance.code;
    $scope.insuranceShow = false;
  };

  //常用保险公司
  $scope.selectCompanyPopup = false;

  //保存常用保险公司
  $scope.saveInsurance = function(applicant) {
    if(validateInsurance(applicant)){ //检测必填项
      var commonInsurance = new CommonInsurance(applicant);
      SecondLitigantionService.updateGeneralInsuranceInfo(commonInsurance).success(function(result) {
        console.log(result)
        if (result.result) {
          commonInsurance = result.result;
          queryGeneralInsurance();
        }
        var message = "常用保险公司保存成功";
        $rootScope.toaster("success", "成功", message);
      })
    }
  };

  //选择常用保险公司
  $scope.selectCommonInsurance = function(applicant) {
    //保险公司单击事件
    var id = applicant.commonInsurance;
    var insurance = $scope.commonInsuranceList.filter(function(v){
      return v.id == id;
    });
    if(insurance[0]){
      applicant.personName = insurance[0].companyName || "";
      applicant.centralCompanyName = insurance[0].headOffice || "";
      applicant.legalType = insurance[0].legalType || "1";
      applicant.position = insurance[0].job || "";
      applicant.comCode = insurance[0].orgCode || "";
      applicant.telephone = insurance[0].telephone || "";
      applicant.residence = insurance[0].residence || "";
      applicant.sendAddress = insurance[0].sendAddress || "";
    }
  };

  //检测保险公司数据是否填写完整
  function validateInsurance(applicant, type){
    if(!applicant.personName){
      $rootScope.toaster("warn", "提示", "请填写企业名称");
      return false;
    }
    if(type == '1' && !applicant.centralCompanyName){
      $rootScope.toaster("warn", "提示", "请填写保险公司名称");
      return false;
    }
    return true;
  }

  //查询人伤信息
  $scope.queryPeopleInjured = function(applicant){
    if(applicant.id){
      $scope.queryPeopleInjuredAchieve(applicant);
    }else{
      $rootScope.toaster("warn", "提示", "请先保存数据");
    }
  };

  //查询人伤方法
  $scope.queryPeopleInjuredAchieve = function(applicant){
    if(validatePeopleInjured(applicant)){
      var peopleInjured = new PeopleInjured();
      peopleInjured.accidentCode = applicant.lossNo;
      var insurance = _.find($scope.insuranceList, {text: applicant.centralCompanyName});
      peopleInjured.code = insurance.code;
      peopleInjured.serialNo = $scope.secondInstanceInfoVO.serialNo;
      //通过接口查询信息
      /*$scope.queryPeopleInjuredService(peopleInjured).success(function(result){
        //数据库保存的人伤关联信息
        $log.info(result);
        //如果成功则弹出接口返回信息
        if (result.code == AdjustConfig.commonConStant.SUCCESS) {
          $scope.injureList = result.result.injureList;
          if($scope.injureList){
            $scope.injureList.forEach(function(val){
              var obj = $scope.injureApplyerInfoList.filter(function(v){
                return v.accidentCode == result.result.claiminfo.accidentCode && v.flowNo == val.flowNo && v.jyApplyerInfoId == applicant.id;
              });
              if(obj.length > 0){
                val.showFlag = "1";
              }
            });
          }
          interfacePopupModal(result.result,applicant);
        }else{
          $rootScope.toaster("error", "错误",result.message);
        }
      });*/
    }
  };

  //验证请求信息
  function validatePeopleInjured(applicant){
    if(!applicant.centralCompanyName){
      $rootScope.toaster("error", "错误", "请您选择总公司！");
      return false;
    }
    if(!applicant.lossNo){
      $rootScope.toaster("error", "错误", "请您输入报案号！");
      return false;
    }
    return true;
  }

  //初始化页面数据
  $scope.init = function () {
    //获取当天日期
    $scope.toDay = formatDate(new Date());
  };

  //证件类型改变时，改变证件默认图片
  $scope.certificatesTypeChange = function (v, isReset) {
    if(v.certificatesType == '0') { //显示身份证图片
      if(isReset) {
        v.idFacePicture = $scope.options.defaultImg2;
        v.idBackPicture = $scope.options.defaultImg3;
      } else {
        v.idFacePicture = v.idFacePicture? v.idFacePicture : $scope.options.defaultImg2;
        v.idBackPicture = v.idBackPicture? v.idBackPicture : $scope.options.defaultImg3;
      }
    } else {
      if(isReset) {
        v.idFacePicture = $scope.options.defaultImg;
        v.idBackPicture = $scope.options.defaultImg;
      } else {
        v.idFacePicture = v.idFacePicture? v.idFacePicture : $scope.options.defaultImg;
        v.idBackPicture = v.idBackPicture? v.idBackPicture : $scope.options.defaultImg;
      }
    }
  };

  //选择系统保险公司
  $scope.insuranceShow = false;
  $scope.insuranceFocus = function() {
    if (!$scope.insuranceShow) $scope.insuranceShow = true;
  };
  $scope.blurInsurance = function(){
    if($scope.insuranceShow){
      $timeout(function(){
        $scope.insuranceShow = false;
      }, 200);
    }
  };

  //格式化时间对象（object->string）
  var formatDate = function (dateObj) {
    if(typeof dateObj == 'object') {
      var year = dateObj.getFullYear();
      var month = dateObj.getMonth() + 1;
      var date = dateObj.getDate();
      return year+"-"+month+"-"+date;
    }
    return dateObj;
  };

  //添加上诉人，被上诉人，原审当事人
  $scope.addApplicant = function () {
    $scope.$emit('addApplicant');
  };

  //删除上诉人，被上诉人，原审当事人
  $scope.deleteApplicant = function (applicant) {
    if(confirm('确认删除该'+$scope.stepArray[$scope.options.step-1].value+'？ 删除后无法恢复')) {
      //判断 上诉和被上诉人最少为1，当事人最少为0
      var personType = applicant.personType;  //获取此对象用户类型  0：上诉人 1：被上诉人 2：原审当事人
      if(personType != 2) {
        var filterArr = _.filter($scope.secondInstanceInfoVO.secondInstanceApplicantArray, function (v) {
          return v.personType == personType;
        });
        if(filterArr.length > 1) {
          $scope.$emit('deleteApplicant', applicant);
        } else {
          $rootScope.toaster("warn", "提示", "至少存在一项"+$scope.stepArray[$scope.options.step-1].value);
        }
      } else {
        $scope.$emit('deleteApplicant', applicant);
      }
    }
  };

  //删除代理人
  $scope.deleteAgent = function (applicant, agent) {
    if(confirm('确认删除代理人？')) {
      $scope.$emit('deleteAgent', applicant, agent)
    }
  };

  //添加代理人
  $scope.addAgent = function (applicant) {
    console.log(applicant)
    //判断代理人个数（最多为两个）
    if(applicant.secondInstanceAgentInfoList && applicant.secondInstanceAgentInfoList.length >= 2) {
      $rootScope.toaster("error", "错误", $scope.CONSTANT.agentBeyondMax);
      return;
    }
    //判断是否存在代理人
    /*if(applicant.secondInstanceAgentInfoList && applicant.secondInstanceAgentInfoList.length != 0) {
      //验证代理人信息
    }*/
    usePersonAgentVO(applicant.secondInstanceAgentInfoList? applicant.secondInstanceAgentInfoList : applicant.secondInstanceAgentInfoList = []);
  };

  //代理人委托详细选择
  $scope.agentPower = function (event, agent, obj) {
    if(agent.entrustPowerDetail instanceof Array) {
      agent.entrustPowerDetail = {};
    }
    if(event.target.checked) {
      agent.entrustPowerDetail['id_'+obj.id] = true;
    } else {
      agent.entrustPowerDetail['id_'+obj.id] = false;
    }
    console.log(agent.entrustPowerDetail)
  };

  //上传图片功能
  $scope.imageAddress = SecondLitigantionConfig.pictureConstant.smallPictureUrl;
  $scope.uploadImage = function(file, target, type, flag) {//flag -> 'applicant' 或 'agent'
    imageSize(file);
    if(!file){
      $rootScope.toaster("warn", "提示", $scope.CONSTANT.messagePictrueTypeError);
      return;
    }
    Upload.upload({
      url: SecondLitigantionConfig.pictureConstant.uploadImageUrl,
      data: {
        type: flag
      },
      file: file
    }).success(function(resp) {
      switch (type.trim()) {
        case 'face': target.idFacePicture = resp.result; break;
        case 'back': target.idBackPicture = resp.result; break;
        case 'entrust': target.entrustFile = resp.result; break;
        case 'agentFace': target.idFront = resp.result; break;
        case 'agentBack': target.idBack = resp.result; break;
        case 'feeCertificate': target.feeCertificate = resp.result; break;
        case 'relationSupport': target.relationSupport = resp.result; break;
      }
      if (type == 'face' || type == 'agentFace') { //身份证正面照，解析
        $http({
          method: 'post',
          url: '/lawProject/common/cardDisc',
          data: {
            "path": resp.result,
            "type": "applicant"
          }
        }).success(function(res) {
          if(res.code == '0' && res.result.birthday && new Date(res.result.birthday) == "Invalid Date") { //判断上传的身份证日期是否合法
            $rootScope.toaster("warn", "提示", "上传的身份证格式不正确，请重新上传！");
            target.idFacePicture = $scope.options.defaultImg2; //证件正面图
            return false;
          }
          if (res.code == SecondLitigantionConfig.commonConStant.SUCCESS && res.result) {
            if(type == 'agentFace') {
              target.agentName = res.result.name;
              target.idNo = res.result.code;
              target.birthDay = res.result.birthday;
            } else {
              target.personName = res.result.name;
              target.certificatesNo = res.result.code;
              target.nation = res.result.nation;
              if(target.nation.indexOf("族") < 0){
                target.nation += "族";
              }
              target.birthday = res.result.birthday;
            }
            target.sex = res.result.sex == '男' ? 0 : 1;
            target.residence = res.result.addr;
            target.domicile = res.result.addr;
            target.sendAddress = res.result.addr;
          } else if (res.code == SecondLitigantionConfig.commonConStant.FAILURE) {
            $rootScope.toaster("error", "错误", "身份证识别失败!");
          }
        })
      }
    }).error(function(resp, status, headers, config){

    });
  };

  //删除已上传的图片
  $scope.removeApplicantImage = function(applicant, attr){
    console.log(attr)
    if(attr.indexOf('agent') != -1) { //代理人
      switch (attr){
        case 'agentFace': applicant.idFront = $scope.options.defaultImg;break;
        case 'agentBack': applicant.idBack = $scope.options.defaultImg;break;
        case 'agentEntrust': applicant.entrustFile = $scope.options.defaultImg; break;
        case 'agentFeeCertificate': applicant.feeCertificate = $scope.options.defaultImg; break;
        case 'agentRelationSupport': applicant.relationSupport = $scope.options.defaultImg; break;
      }
    } else {
      switch (attr){
        case 'face': applicant.idFacePicture = $scope.options.defaultImg;break;
        case 'back': applicant.idBackPicture = $scope.options.defaultImg;break;
        case 'entrust': applicant.entrustFile = $scope.options.defaultImg; break;
      }
    }
  };

  //上传图片检测
  //ie9一下检查flash版本
  function hasflash() {
    if(navigator.appName == "Microsoft Internet Explorer"&&parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""))<10){
      if (!FileAPI.hasFlash) {
        $scope.haveNoFlash = true;
        $rootScope.toaster("warn", "提示", "请先安装或者升级flash！");
      }
    }
  }
  hasflash();

  $scope.checkflash = function () {
    if($scope.haveNoFlash ){
      $rootScope.toaster("warn", "提示", "请先安装或者升级flash！");
    }
  };

  //限制图片大小
  function imageSize(file) {
    if(file){
      if(parseInt(file.size/(1024*1024))>= 10 ){
        $rootScope.toaster("warn", "提示", "请上传小于10M大小的图片");
      }
    }
  }

  //调用父级代理人对象
  var usePersonAgentVO = function (target) {
    $scope.$emit('addAgent', target);
  };

  //初始化页面数据
  $scope.init();

  $scope.checkIdentity = function(applicant){ //申请人
    //表示是身份证号
    if(applicant.certificatesType == '0'){
      var identityFlag = IdentityService.identityCodeValid(applicant.certificatesNo,applicant);
      if(!identityFlag){
        $rootScope.toaster("error", "错误", "身份证输入错误!");
      }
    }
  }

  $scope.agentCheckIdentity = function(agent){ //代理人
    //表示是身份证号
    if(agent.certificatesType == '0'){
      var identityFlag = IdentityService.identityCodeValid(agent.idNo,agent, "isAgent");
      if(!identityFlag){
        $rootScope.toaster("error", "错误", "身份证输入错误!");
      }
    }
  }
});