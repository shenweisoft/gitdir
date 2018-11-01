var app = angular.module('sbAdminApp');


angular.module('sbAdminApp').controller('insuranceReportedCtrl', function (LoginService,AdjustService,AdjustConfig,PoliceConfig,AdminConstant,$location,$scope, $stateParams, $state, $http, $log, PoliceConfig, PoliceService, DictionaryConfig, toaster, $filter,IdentityService,$rootScope,$modal) {

  //重置保存，完成鉴定，完成补录等按钮状态
  $rootScope.isInspectReported = false;
  $rootScope.isIdentify = false;
  $rootScope.isSupplement = false;
  $rootScope.isReported = false;
  $rootScope.isInjury = false;

  var CONTANT = {
    success: 'success',
    error: 'error',
    warn: 'warn',
    sucTxt: '成功',
    errTxt: '错误',
    warnTxt: '警告'
  };

  //输入框限制
  $scope.inputVerify = function (info, attr, max, correlationAttr) {
    if(info[attr]*1 > max) info[attr] = max;
    if(correlationAttr) {
      if((info[attr]*1 + info[correlationAttr]*1) > 100) {
        info[attr] = 100 - info[correlationAttr]*1;
      }
    }
  };

  $scope.riskTypesCheckedFun = function (checked, list) {
    if(!checked) {
      return '';
    }
    var arr = checked.split(',');
    var str = [];
    for(var i = 0; i < arr.length; i++) {
      str.push(list[arr[i]].value);
    }
    return str.join('，');
  };
  console.log($stateParams)

  $scope.validDate = function () {
    $scope.vehicleCompany = $scope.police.jpoliceVehicVO[0].vehiclePolicyInfoList[0].vehicleCompany[0];
    console.log($scope.vehicleCompany)
    if(!$scope.vehicleCompany.insuranceCompany) {


    }
    if($scope.vehicleCompany.riskTypes == '1' || $scope.vehicleCompany.riskTypes == '2') { //三者险 车损险
      if((!$scope.vehicleCompany.thirdParty && $scope.vehicleCompany.thirdParty!='0') && (!$scope.vehicleCompany.vehicleLossInsurance && $scope.vehicleCompany.vehicleLossInsurance != '0')) {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, "请填写保额！");
        return false;
      }
      if((!$scope.vehicleCompany.thirdPartyFranchise && $scope.vehicleCompany.thirdPartyFranchise != '0') && ($scope.vehicleCompany.vehicleRate != '0' && !$scope.vehicleCompany.vehicleRate) ) {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, "请填写免赔率！");
        return false;
      }
      if((!$scope.vehicleCompany.thirdPartyRate && $scope.vehicleCompany.thirdPartyRate != '0') && ($scope.vehicleCompany.vehiceFranchise != '0' && !$scope.vehicleCompany.vehiceFranchise)) {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, "请填写赔偿比例！");
        return false;
      }
    }
    return true;
  };

  //查询数据
  $scope.queryCompany = function () {
    PoliceService.queryCompany({id: $stateParams.id}).success(function (response) {
      if(response.code == PoliceConfig.commonConstant.SUCCESS) {
        console.log(response)
        $scope.police = response.result;
        //判断是否已补充完成
        if($scope.police.jpoliceVehicVO[0].vehiclePolicyInfoList[0].vehicleCompany[0].sendState >= '3') $rootScope.isReported = true;

        else $rootScope.isReported = false;
      } else {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message);
      }
    })
  };

  //保存与完成补录
  $scope.$on('addAccidentSecond', function (event, type){
    //验证数据有效性
    if(!$scope.validDate()) {
      return false;
    }
    var message = "保存成功！";
    if(type){ //完成补录
      $scope.vehicleCompany.sendState = '3';
      message = "完成补录成功！";
      $rootScope.isReported = true;
      //将本保险公司填入
      if(!$scope.vehicleCompany.insuranceCompany) $scope.vehicleCompany.insuranceCompany = $scope.userDepar.orgName;
    }
    PoliceService.updateVehicleCompany(JSON.stringify($scope.vehicleCompany)).success(function (response) {
      if(response.code == PoliceConfig.commonConstant.SUCCESS) {
        console.log(response)
        $rootScope.toaster(CONTANT.success, CONTANT.sucTxt, message);
      } else {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message);
      }
    });
  });

  //人伤对象
  function PeopleInjured(){
    this.requestType = "001";
    this.accidentCode = "";
    this.code = "";
    this.serialNo = "";
  }
  //报案号提取
  $scope.$on('queryPeopleInjured', function () {

    var peopleInjured = new PeopleInjured();
    peopleInjured.accidentCode = $scope.police.jpoliceVehicVO[0].vehiclePolicyInfoList[0].vehicleCompany[0].reportNo; //事故号
    var insurance = _.find($scope.insuranceList, {text: $scope.police.jpoliceVehicVO[0].vehiclePolicyInfoList[0].vehicleCompany[0].insuranceCompany}); //保险名称
    peopleInjured.code = insurance.code;
    //peopleInjured.serialNo = $scope.adjust.serialNo;
    //通过接口查询信息
    PoliceService.queryPeopleInjuredService(peopleInjured).success(function(result){
      //数据库保存的人伤关联信息
      $log.info(result+"66666");
      //如果成功则弹出接口返回信息
      if (result.code == AdjustConfig.commonConStant.SUCCESS) {
        $scope.injureList = result.result.injureList;
        interfacePopupModal(result.result,peopleInjured.accidentCode);
      }else{
        $rootScope.toaster("warn", "提示","当前赔案下没有匹配的人伤任务，请联系保险公司进行处理!");
      }
    });
  });

  //////////////////////报案号弹出框/////////////////////////
  //接口返回信息
  function interfacePopupModal(result,accidentCode){
    var popupModal = $modal.open({
      templateUrl: 'views/pages/policeInfo/reportExtract.html',
      controller: 'reportExtractCtrl',
      size: 'lg',
      resolve: {
        items: function(){
          return {
            result: result,
            //applicant:applicant,
            accidentCode:accidentCode,
            vehicleCompany:$scope.police.jpoliceVehicVO[0].vehiclePolicyInfoList[0].vehicleCompany[0]
            //serialNo:$scope.adjust.serialNo,
            //injureApplyerInfoList:$scope.injureApplyerInfoList
          }
        }
      }
    });
  };

  //初始化
  $scope.initData = function () {
    $scope.userDepar = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
    $scope.queryCompany();
  };

  //初始化
  $scope.$on('user2Child', function () {
    $scope.initData();
  });
  if(LoginService.user.userPermissions) {
    $scope.initData();
  }
});

//人伤接口弹出信息
angular.module('sbAdminApp').controller('reportExtractCtrl', function($scope, $stateParams, $state, $location, $timeout, $http, $log,items,$modalInstance,AdjustService, AdjustConfig,toaster) {
  //人伤主信息
  $log.info(items.result);

  $scope.claiminfo = items.result.claiminfo;

  $scope.vehicleCompany = items.vehicleCompany;
  //伤者信息
  $scope.injureList = items.result.injureList;


  //添加关联关系
  $scope.saveInjureApplyerInfoService = AdjustService.saveInjureApplyerInfo;

  //添加关联
  $scope.addPeople = function(claiminfo){
    if(claiminfo.sumBusiness || claiminfo.sumBusiness =='0'){
      $scope.vehicleCompany.thirdParty = claiminfo.sumBusiness;
    }
    if(claiminfo.franchise || claiminfo.franchise =='0'){
      $scope.vehicleCompany.thirdPartyFranchise = claiminfo.franchise;
      $scope.vehicleCompany.thirdPartyRate = 100 - claiminfo.franchise;
    }
    $scope.cancel();
  };

  $scope.cancel = function(){
    $modalInstance.dismiss('cancel');
  };
});