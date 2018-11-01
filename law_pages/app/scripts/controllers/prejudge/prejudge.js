angular.module('sbAdminApp').controller('PrejudgeCtrl', function ($scope, $stateParams,$state, $filter, toaster, DictionaryConfig, PrejudgeService, PrejudgeConfig,$rootScope) {
  //案件预判数据服务
  $scope.prejudgeService = PrejudgeService;
  
  //父对象
  $scope.co = {
    lblApplicant: "被侵权人",
    lblRespondent: "侵权人"
  }
  
  //页面自定义异常
  var level = DictionaryConfig.toaster.level;
  var title = DictionaryConfig.toaster.title;
  $scope.CONSTANT = {
    applicantNameError:"被侵权人姓名不能为空",
    respondentNameError:"侵权人姓名不能为空",
    idNoError:"身份证号不能为空",
    idTypeError:"身份证号码有误",
    householdError:"请选择户籍信息",
    caseTypeError:"请选择案件类型",
    deathDateError:"请选择定残日期",
    responsibilityError:"请选择事故责任",
    responsibleRateError:"请您填写责任比例",
    plateNoError:"车牌号不能为空",
    regionNameError:"请选择赔偿地",
    createDateError:"请选择事故发生日期",
    lossMoneyDetailError:"请认真填写损失金额",
    compensateRateError:"请您填写伤残系数",
    responsibleRateOutError:"被侵权方和侵权方责任比例之和不能超过100%"
  }
  
  //(被)侵权人对象
  $scope.co.Applicant = function(personType) {
    this.personType = personType;
  };
  
  //初始化数据对象
  $scope.law = {
    feeDetail: angular.copy(DictionaryConfig.feeTypeList).filter(function(v){return v.type != '2'}),
    compensateTable: [],
    compensateStandard: {},
    applicantArray: []
  }
  $scope.law.applicantArray.push(new $scope.co.Applicant(0));
  $scope.law.applicantArray.push(new $scope.co.Applicant(1));
  
  //验证案件预判第一页
  var validateStep1 = function(){
    for(var i=0; i<$scope.law.applicantArray.length; i++){
      var applicant = $scope.law.applicantArray[i];
      if(applicant.personType==0){
        //被侵权人姓名
        if(!applicant.personName){
          applicant.personNameError = true;
          $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.applicantNameError);
          return false;
        }else{
          applicant.personNameError = undefined;
        }
        //身份证号
        if(!applicant.idNo){
          applicant.idNoError = true;
          $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.idNoError);
          return false;
        } else if(applicant.idNoError) {
          $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.idTypeError);
          return false;
        } else {
          applicant.idNoError = undefined;
        }
        //户籍信息
        if(!$scope.law.household){
          applicant.householdError = true;
          $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.householdError);
          return false;
        }else {
          applicant.householdError = undefined;
        }
        //案件类型
        if(!$scope.law.caseType){
          $scope.law.caseTypeError = true;
          $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.caseTypeError);
          return false;
        }else{
          $scope.law.caseTypeError = undefined;
        }

        $scope.law.deathDateError = undefined;
        $scope.law.compensateRateError = undefined;
        if($scope.law.caseType == '1' || $scope.law.caseType == '2'){
          //定残日期
          if(!$scope.law.deathDate){
            $scope.law.deathDateError = true;
            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.deathDateError);
            return false;
          }
          //伤残系数
          if(!$scope.law.compensateRate){
            $scope.law.compensateRateError = true;
            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.compensateRateError);
            return false;
          }
        }
      }else{
        //侵权人姓名
        if(!applicant.personName){
          applicant.personNameError = true;
          $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.respondentNameError);
          return false;
        }else applicant.personNameError = undefined;
        //车牌号
        if(!applicant.plateNo){
          applicant.plateNoError = true;
          $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.plateNoError);
          return false;
        }else {
          applicant.plateNoError = undefined;
        }
      }
      //事故责任
      if(!applicant.responsibility){
        applicant.responsibilityError = true;
        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.responsibilityError);
        return false;
      }else {
        applicant.responsibilityError = undefined;
      }
      //责任比例
      if(!applicant.responsibleRate){
        applicant.responsibleRateError = true;
        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.responsibleRateError);
        return false;
      }else {
        applicant.responsibleRateError = undefined;
      }
    }
    //赔偿地
    if(!$scope.law.regionName){
      $scope.regionNameError = true;
      $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.regionNameError);
      return false;
    }else $scope.regionNameError = undefined;
    //事故发生日期
    if(!$scope.law.createDate){
      $scope.createDateError = true;
      $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.createDateError);
      return false;
    }else{
      $scope.createDateError = undefined;
    }
    //被侵权方和侵权方责任比例之和不能超过100
    var responsibleRateTotal = 0;
    for(var i=0; i < $scope.law.applicantArray.length; i++){
      responsibleRateTotal += parseInt($scope.law.applicantArray[i].responsibleRate);
    }
    if(responsibleRateTotal > 100){
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.responsibleRateOutError);
      return false;
    }
    return true;
  };
  
  var validateStep2 = function(){
    if(!$scope.law.feeDetail || !$scope.law.lawMoney){
      $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.lossMoneyDetailError);
      return false;
    }
    return true;
  };
  
  //下一步操作
  $scope.nextStep = function() {
    if ($scope.co.step == 1 && validateStep1()) {
      $scope.save(function() {
        $state.go('home_page.prejudge.step2');
        $scope.co.initFeeCheck();
      })
    } else if ($scope.co.step == 2 && validateStep2()) {
      $scope.save(function() {
        $state.go('home_page.prejudge.step3');
        $scope.co.calculate();
      });
    }
  };
  
  //上一步操作
  $scope.preStep = function() {
    if ($scope.co.step == 2) {
      $state.go('home_page.prejudge.step1', {
        step: 1
      });
    } else if ($scope.co.step == 3) {
      $state.go('home_page.prejudge.step2', {
        step: 2
      });
    }
  };
  
  //保存方法
  $scope.save = function(goState, calculate){
    goState = goState || function() {};
    calculate = calculate || function() {};
    goState();
    calculate();
    var param = angular.copy($scope.law);
    filterParam(param);
    console.log(param)
    $scope.prejudgeService.savePrejudgeCase(param).success(function(res) {
      if (res.code == PrejudgeConfig.commonConstant.SUCCESS) {
        $scope.law.id = res.result.id;
        $scope.law.code = res.result.code;
        if($scope.law.applicantArray){
          $scope.law.applicantArray.forEach(function(v, i) {
            v.id = res.result.applicantArray[i].id;
          })
        }
      }
    })
  };
  
  function filterParam(law) {
    if (law.compensateStandard) law.compensateStandard = JSON.stringify(law.compensateStandard);
    if (law.compensateTable) law.compensateTable = JSON.stringify(law.compensateTable);
    if (law.feeDetail) law.feeDetail = JSON.stringify(law.feeDetail);
    if (law.deathDate) law.deathDate = $filter('date')(law.deathDate, 'yyyy-MM-dd HH:mm:ss');
    if (law.createDate) law.createDate = $filter('date')(law.createDate, 'yyyy-MM-dd HH:mm:ss');
  }

  //重置本地保存的伤残等级(赔付试算)
  localStorage.setItem('rank_appraisal', '[]');
});
