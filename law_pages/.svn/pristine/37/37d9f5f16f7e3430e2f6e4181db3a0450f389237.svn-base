'use strict';
var app = angular.module('sbAdminApp');
app.directive('intOnly', function($filter) {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      element.bind('keyup', function(inputValue, e) {
        var strinput = modelCtrl.$modelValue + "";
        strinput = strinput ? strinput.replace(/[^\d.]/g, '') : '0'
        modelCtrl.$setViewValue(parseInt(strinput));
        modelCtrl.$render();
      });
    }
  }
});

app.controller('PrejudgeStep1Ctrl', function ($scope, $stateParams,$state, $timeout, $http, $location, $modal, toaster, DictionaryConfig, AdminConstant, CompensateStandardConstant, IncomeNormConstant,PrejudgeService, PrejudgeConfig,AdjustService,AdjustConfig,$filter,LoginService,$rootScope) {
  //所属步骤
  $scope.co.step = 1;
  $scope.currentDate = new Date();
  //案件类型
  $scope.caseTypeList = DictionaryConfig.caseTypeList;
  //户籍信息
  $scope.residenceTypeList = DictionaryConfig.residenceTypeList;
  //事故责任
  $scope.responsibilityList = DictionaryConfig.responsibilityList;
  //填充区域信息
  $scope.adminRegion = AdminConstant.administrationRegions;
  //正常收入
  $scope.incomeNorm = IncomeNormConstant.incomeNorm;
  //费用标准
  $scope.compensateStandard = CompensateStandardConstant.compensateStandard;
  //后台查询计算器的相关标准
  $scope.queryCalculateStandardService = AdjustService.queryCalculateStandard;
  
  $scope.prejudgeService = PrejudgeService;

    //获取赔偿年度
    $scope.yearList = DictionaryConfig.getYearList();

  $scope.queryStartYearService = AdjustService.queryStartYear;
  //根据年度和区域查询计算器备注
  $scope.queryMtRegionalNameRemarkService = LoginService.queryMtRegionalNameRemark;
  
  //页面自定义异常
  var level = DictionaryConfig.toaster.level;
  var title = DictionaryConfig.toaster.title;
  $scope.CONSTANT = {
    messageAtleastOneNoApplicant:"至少有一个侵权人",
    messageIdentityFormatError:"身份证号码有误",
    responsibleRateOutError:"被侵权方和侵权方责任比例之和不能超过100%"
  }
  
  //地址树加载
  $scope.isShowTree = false;
  $scope.treeConfig = {
    core: {
      multiple: false,
      animation: true,
      error: function(error) {
        $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
      },
      check_callback: true,
      worker: true
    },
    types: {
      "default": {
        icon: 'iconfont icon-dizhi'
      },
      folder: {
        icon: 'iconfont icon-wenjian1'
      }
    },
    version: 1,
    plugins: ['types']
  };
  
  $scope.blurAdmin = function(){
    if($scope.isShowTree){
      $timeout(function(){
        $scope.isShowTree = false;
      }, 200);
    }
  };
  
  //选择节点信息
  $scope.selectAdmin = function(node, selected, event) {
    var selectedNodes = selected.selected;
    if (selectedNodes.length > 0 && selected.node.type=='default') {
      var selectedRegion = $scope.adminRegion[selectedNodes[0]];
      if ($scope.law.regionName != selectedRegion.fullName) {
        $scope.law.regionName = selectedRegion.fullName;
        angular.element("#regNamebox").hide();
        $scope.isShowTree = false;
        //选择区域的时候进行触发计算赔偿标准和居民收入支出标准
        $scope.findIncomeAndCompensate(true);
      }
    }
  };
  
  $scope.findIncomeAndCompensate = function() {
    if ($scope.law.regionName && $scope.law.createDate && $scope.law.household) {
      //计算居民收支标准以及赔偿标准
      queryCalculateStandard(true);
    }
  };

  //计算器传输对象
  function CalculateVO(){
    this.regionName = $scope.law.regionName;
    this.household = $scope.law.household;
  };

  function queryStandard(flag){

    $scope.queryCalculateStandardService($scope.calculateVO).success(function(result) {
      //请求成功
      if (result.code == AdjustConfig.commonConStant.SUCCESS) {
        var calculateResultVO = result.result;
        console.info(result.result);
        //计算费用标准
        //误工费
        if(calculateResultVO.lostIncome){
          $scope.law.compensateStandard.lostIncome = calculateResultVO.lostIncome;
        }else{
          $scope.law.compensateStandard.lostIncome = "";
        }
        //护理费
        if(calculateResultVO.standardNurseFee){
          $scope.law.compensateStandard.standardNurseFee = calculateResultVO.standardNurseFee;
        }else{
          $scope.law.compensateStandard.standardNurseFee = "";
        }
        //住院伙食补助费
        if(calculateResultVO.hospitalFoodSubsidies){
          $scope.law.compensateStandard.hospitalFoodSubsidies = calculateResultVO.hospitalFoodSubsidies;
        }else{
          $scope.law.compensateStandard.hospitalFoodSubsidies = "";
        }
        //营养费
        if(calculateResultVO.thesePayments){
          $scope.law.compensateStandard.thesePayments = calculateResultVO.thesePayments;
        }else{
          $scope.law.compensateStandard.thesePayments = "";
        }
        //交通费
        if(calculateResultVO.transportationFee){
          $scope.law.compensateStandard.transportationFee = calculateResultVO.transportationFee;
        }else{
          $scope.law.compensateStandard.transportationFee = "";
        }
        //住宿费
        if(calculateResultVO.accommodationFee){
          $scope.law.compensateStandard.accommodationFee = calculateResultVO.accommodationFee;
        }else{
          $scope.law.compensateStandard.accommodationFee = "";
        }
        //丧葬费
        if(calculateResultVO.funeralFeeStandard){
          $scope.law.compensateStandard.funeralFeeStandard = (parseFloat(calculateResultVO.funeralFeeStandard)/12).toFixed(2);
        }else{
          $scope.law.compensateStandard.funeralFeeStandard = "";
        }
        //精神抚慰金标准
        if(calculateResultVO.spiritualConsolationFee){
          $scope.law.compensateStandard.spiritualConsolationFee = calculateResultVO.spiritualConsolationFee;
        }else{
          $scope.law.compensateStandard.spiritualConsolationFee = "";
        }

        //计算居民收入支出标准
        //农村赔偿标准
        //城镇在岗职工收入标准
        if(calculateResultVO.urbanSalary){
          $scope.law.compensateStandard.wageIncome = calculateResultVO.urbanSalary;
        }else{
          $scope.law.compensateStandard.wageIncome = "";
        }

        if(!calculateResultVO.ruralNetIncome){
          calculateResultVO.ruralNetIncome = "";
        }
        if(!calculateResultVO.ruralAverageOutlay){
          calculateResultVO.ruralAverageOutlay = "";
        }
        if(!calculateResultVO.urbanDisposableIncome){
          calculateResultVO.urbanDisposableIncome = "";
        }
        if(!calculateResultVO.urbanAverageOutlay){
          calculateResultVO.urbanAverageOutlay = "";
        }
        //农村
        $scope.law.compensateStandard["1"] = {
          "income": calculateResultVO.ruralNetIncome,
          "expense": calculateResultVO.ruralAverageOutlay
        };
        //城镇赔偿标准
        $scope.law.compensateStandard["2"] = {
          "income": calculateResultVO.urbanDisposableIncome,
          "expense": calculateResultVO.urbanAverageOutlay
        };
        //循环计算器详细表
        $scope.law.feeDetail.forEach(function(v) {
          if (v.id == "12" || v.id == "15") {
            //农村或者城镇赔偿标准
            var ruleMoney = $scope.law.compensateStandard[$scope.law.household];
            if( ruleMoney && parseFloat(ruleMoney.income) > 0){
              //申请金额
              if((!flag && (!v.applyPerUnit || parseFloat(v.applyPerUnit) <= 0)) || flag){
                v.applyPerUnit = ruleMoney.income;
                v.applyAmount = v.applyPerUnit * v.applyUnit * $scope.law.compensateRate / 100;
              }
              //调解金额
              if((!flag && (!v.claimPerUnit || parseFloat(v.claimPerUnit) <= 0)) ||  flag){
                v.claimPerUnit = ruleMoney.income;
                v.claimAmount = v.claimPerUnit * v.claimUnit * $scope.law.compensateRate / 100;
              }
            }
          }

          if (v.id == "16") {
            v.claimUnit = 6;
            v.claimAmount = (parseFloat($scope.law.compensateStandard.funeralFeeStandard) * v.claimUnit).toFixed(2);
          }
        });
      }else{
        //请求失败
        $rootScope.toaster("error", "错误", result.message);
      }
    });

  }

  //查询计算器备注
  function queryMtRegionalNameRemark() {
    //查询数据
    $scope.queryMtRegionalNameRemarkService($scope.calculateVO).success(function(result){
      if (result.code == AdjustConfig.commonConStant.SUCCESS) {
        if(result.result){
          //备注集合列表
          var mtRegionalNameRemark = result.result;
          //医疗费
          var medicalFee = _.find($scope.law.feeDetail,{id:'03'});
          medicalFee.remark = mtRegionalNameRemark.medicalFee;
          //后续治疗费
          var followUpFee = _.find($scope.law.feeDetail,{id:'04'});
          followUpFee.remark = mtRegionalNameRemark.followUpFee;
          //住院伙食补助费
          var foodSubsidy = _.find($scope.law.feeDetail,{id:'06'});
          foodSubsidy.remark = mtRegionalNameRemark.foodSubsidy;
          //营养费
          var nutritionFee = _.find($scope.law.feeDetail,{id:'07'});
          nutritionFee.remark = mtRegionalNameRemark.nutritionFee;
          //误工费
          var lossOfWorking = _.find($scope.law.feeDetail,{id:'08'});
          lossOfWorking.remark = mtRegionalNameRemark.lossOfWorking;
          //护理费
          var nursingFee = _.find($scope.law.feeDetail,{id:'09'});
          nursingFee.remark = mtRegionalNameRemark.nursingFee;
          //残疾赔偿金
          var disabilityFee = _.find($scope.law.feeDetail,{id:'12'});
          disabilityFee.remark = mtRegionalNameRemark.disabilityFee;
          //残疾辅助器具费
          var disabilityAids = _.find($scope.law.feeDetail,{id:'13'});
          disabilityAids.remark = mtRegionalNameRemark.disabilityAids;
          //被抚养人生活费
          var dependentsFee = _.find($scope.law.feeDetail,{id:'14'});
          dependentsFee.remark = mtRegionalNameRemark.dependentsFee;
          //精神损害抚慰金
          var mentalDamage = _.find($scope.law.feeDetail,{id:'17'});
          mentalDamage.remark = mtRegionalNameRemark.mentalDamage;
          //死亡赔偿金
          var deathFee = _.find($scope.law.feeDetail,{id:'15'});
          deathFee.remark = mtRegionalNameRemark.deathFee;
          //丧葬费
          var funeralExpenses = _.find($scope.law.feeDetail,{id:'16'});
          funeralExpenses.remark = mtRegionalNameRemark.funeralExpenses;
          //处理事故人员误工费
          var accidentPersonnel = _.find($scope.law.feeDetail,{id:'80'});
          accidentPersonnel.remark = mtRegionalNameRemark.accidentPersonnel;
          //交通费
          var trafficExpense = _.find($scope.law.feeDetail,{id:'10'});
          trafficExpense.remark = mtRegionalNameRemark.trafficExpense;
          //住宿费
          var hotelExpense = _.find($scope.law.feeDetail,{id:'11'});
          hotelExpense.remark = mtRegionalNameRemark.hotelExpense;
          //财产损失
          var propertyLoss = _.find($scope.law.feeDetail,{id:'30'});
          propertyLoss.remark = mtRegionalNameRemark.propertyLoss;
          //车辆损失
          var vehicleLoss = _.find($scope.law.feeDetail,{id:'40'});
          vehicleLoss.remark = mtRegionalNameRemark.vehicleLoss;
          //拖车费
          var trailerFee = _.find($scope.law.feeDetail,{id:'50'});
          trailerFee.remark = mtRegionalNameRemark.trailerFee;
          //施救费
          var rescueFee = _.find($scope.law.feeDetail,{id:'70'});
          rescueFee.remark = mtRegionalNameRemark.rescueFee;
          //停车费
          var parkingRate = _.find($scope.law.feeDetail,{id:'60'});
          parkingRate.remark = mtRegionalNameRemark.parkingRate;
          //鉴定费
          var appraisalFee = _.find($scope.law.feeDetail,{id:'18'});
          appraisalFee.remark = mtRegionalNameRemark.appraisalFee;
          //其它费用
          var otherExpenses = _.find($scope.law.feeDetail,{id:'71'});
          otherExpenses.remark = mtRegionalNameRemark.otherExpenses;
        }
      }
    });
  }
  //根据参数查询后端标准
  function queryCalculateStandard(flag){
    $scope.calculateVO = new CalculateVO();
    $scope.calculateVO.compensateStartDate = $scope.law.createDate +"-07-01 12:12:12";

    //根据事故发生日期在居民收支表中查询起始年度
    $scope.queryStartYearService($scope.calculateVO).success(function(result){
      if (result.code == AdjustConfig.commonConStant.SUCCESS) {
        console.info(result);
        if(result.result){
          //根据起始年度查询标准
          $scope.calculateVO.standardYear = result.result;
          queryStandard(flag);
          //查询费用备注
          queryMtRegionalNameRemark();
        }
      }
    });
  }

  //计算预填残疾赔偿金与死亡赔偿金的年限 [定残死亡日期与出生日期的关系]
  $scope.computePayYear = function(){
    var applicant = $scope.law.applicantArray.filter(function(v){
      return v.personType==0
    });
    
    if($scope.law.deathDate && applicant[0].birthDay){
      var betweenYear = getDateYearSub($scope.law.deathDate, applicant[0].birthDay);
      if(betweenYear <= 60 )
        $scope.payYear = 20;
      if(betweenYear > 60 && betweenYear <= 75)
        $scope.payYear = 20-(betweenYear - 60);
      if(betweenYear > 75)
        $scope.payYear = 5;
  
      $scope.law.feeDetail.forEach(function(v) {

        if (v.id == "12" || v.id == "15"){
          v.applyUnit = v.claimUnit = $scope.payYear;
          console.info(v);
        }
      });
    }
  };
  
  //计算两个日期的年限差
  function getDateYearSub(startDate, endDate) {
    var day = 24 * 60 * 60 *1000;
    //得到前一天(算头不算尾)
    var sDate = new Date(startDate.getTime() - day);
    var eDate = endDate;
    
    //获得各自的年、月、日
    var sY  = sDate.getFullYear();
    var eY  = eDate.getFullYear();
    var betweenYear = sY - eY;
    if(betweenYear > 0) {
      return betweenYear
    } else {
      return 0;
    }
  }
  
  //添加侵权方
  $scope.addRespondent = function(){
    var respondent = new $scope.co.Applicant(1);
    $scope.law.applicantArray.push(respondent);
  };
  
  //删除侵权方
  $scope.removeRespondent = function(applicant){
    if(confirm("确定删除当前侵权人么?")){
      if ($scope.law.applicantArray.filter(function(v){return v.personType==1;}).length > 1) {
        var index = $scope.law.applicantArray.indexOf(applicant);
        if (applicant.id) {
          $scope.prejudgeService.removeApplicant({
            "id": applicant.id
          }).success(function(result) {
            if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
              $scope.law.applicantArray.splice(index, 1);
            } else if (result.code == PrejudgeConfig.commonConstant.FAILURE) {
              $rootScope.toaster(level.error, title.error, "侵权人删除出错");
            }
          });
        } else {
          $scope.law.applicantArray.splice(index, 1)
        }
      } else {
        var message = $scope.CONSTANT.messageAtleastOneNoApplicant;
        $rootScope.toaster(level.error, title.error, message);
      }
    }
  };
  
  $scope.responsibilityChanged = function(applicant){
    if(applicant.responsibility){
      switch(applicant.responsibility){
        case '1': applicant.responsibleRate="100";break;
        case '2': applicant.responsibleRate="70";break;
        case '3': applicant.responsibleRate="50";break;
        case '4': applicant.responsibleRate="30";break;
        case '5': applicant.responsibleRate="0";break;
      }
      $scope.responsibleRateChanged(applicant);
    }
  };
  
  $scope.caseTypeChanged = function(){
    if($scope.law.caseType){
      switch($scope.law.caseType){
        case '2': $scope.law.compensateRate = 100;break;
        case '3': $scope.law.compensateRate = 0;break;
      }
    }
  };

  //伤残系数
  $scope.compensateRateChanged = function(law) {
    law.compensateRate = law.compensateRate ? law.compensateRate.toString().replace(/[^\d.]/g, '') : '';
    if (law.compensateRate > 100) {
      law.compensateRate = 100;
    }
  };
  //责任比例
  $scope.responsibleRateChanged = function(applicant){

    applicant.responsibleRate = applicant.responsibleRate ? applicant.responsibleRate.toString().replace(/[^\d.]/g, '') : '';
    if (applicant.responsibleRate > 100) {
      applicant.responsibleRate = 100;
    }
  };
  
  $scope.co.initFeeCheck = function(){
    $scope.law.feeDetail.forEach(function(v){
      if($scope.law.caseType==1){//伤残
        if(v.id=='03' || v.id=='04' || v.id=='06' || v.id=='07'|| v.id=='08'|| v.id=='09'|| v.id=='12'|| v.id=='17'|| v.id=='18') v.isChecked=true;
      }else if($scope.law.caseType==2){//死亡
        if(v.id=='03' || v.id=='09' || v.id=='14' || v.id=='15'|| v.id=='16'|| v.id=='17'|| v.id=='18') v.isChecked=true;
      }else{//一般损伤
        if(v.id=='03' || v.id=='06' || v.id=='07' || v.id=='08') v.isChecked=true;
      }
    })
  };
  
  //打开定残日期
  $scope.openDeathDate = function($event, applicant){
    $event.preventDefault();
    $event.stopPropagation();
    applicant.deathDateOpened = true;
  };
  
  //打开事故发生日期
  $scope.createDateOpened = false;
  $scope.openCreateDate = function($event){
    $event.preventDefault();
    $event.stopPropagation();
    $scope.createDateOpened = true;
  };
  
  //验证身份证
  $scope.checkIdentity = function(applicant) {
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
    if (applicant.idNo) {
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
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageIdentityFormatError);
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
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageIdentityFormatError);
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
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageIdentityFormatError);
        } else applicant.idNoError = false;
      }
    }
  };
  angular.element("#regNameInput").click(function(e){
     angular.element("#regNamebox").show();
      stopBubble(e);
  });
  angular.element("#regNamebox").click(function(e){
      stopBubble(e);
  });
  angular.element("body").click(function(){
     angular.element("#regNamebox").hide();
  });
  function stopBubble(e) {
    // 如果提供了事件对象，则这是一个非IE浏览器
    if ( e && e.stopPropagation ) {
        // 因此它支持W3C的stopPropagation()方法 
        e.stopPropagation();
    } else { 
        // 否则，我们需要使用IE的方式来取消事件冒泡
        window.event.cancelBubble = true;
    }
  }

  //鉴定伤残等级
  $scope.showRankAppraisal = function () {
    //判断当前所属的状态（调解、起诉）
    if($location.url().split('/').indexOf('mediation') !== -1) {
      //调解
      $scope.isMediation = 0;
    } else {
      //起诉、庭前调解时
      $scope.isMediation = 1;
    }
    if($scope.adjust || $scope.law) {
      var id = $scope.adjust? $scope.adjust.id: $scope.law.id;
      var serialNo = $scope.adjust? $scope.adjust.serialNo: $scope.law.serialNo;
      //打开等级鉴定页面，并将单子id与流水号通过url传入
      var url = $state.href('rankAppraisal');
      window.open(url+'?id='+id+'&serialNo='+serialNo+'&flag='+$scope.isMediation, '_blank');
    } else {
      //赔偿试算，不存在案件流水号
      var url = $state.href('rankAppraisal');
      window.open(url, '_blank');
    }
  };
});

//原生js调用angular中的scope参数  （伤残等级鉴定页面调用）
function saveRankAppraisal(count){
    //通过元素id来获取Angular应用
    var appElement = document.getElementById('prejudgeStep1');
    //获取$scope变量
    var $scope = angular.element(appElement).scope();
    //调用$scope中的方法与赋值
    $scope.law.compensateRate = count;
    $scope.compensateRateChanged($scope.law);
    //上一行改变了msg的值，如果想同步到Angular控制器中，则需要调用$apply()方法即可
    $scope.$apply();
}
