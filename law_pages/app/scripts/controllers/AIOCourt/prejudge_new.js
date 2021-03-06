angular.module('sbAdminApp').controller('prejudgeNewCtrl', function (PoliceConfig,PoliceService,DictionaryConfig,PrejudgeService,PrejudgeConfig, AdminConstant,$location,$scope,$rootScope, $stateParams, $state, $http, $log, AlgorithmConfig, AlgorithmService, DictionaryConfig, toaster, $filter,IdentityService) {
  $scope.prejudgeService = PrejudgeService;
  $scope.lawCase = {
  createDate: DictionaryConfig.getDate(),
  regionName: '',
  applicantArray:[{
          personType: '0',
          household: '0',
          responsibleRate: 100,
          birthDay: DictionaryConfig.getDate(),
          outPatientTimes: '',
          restDaysOfOutPatient: '',
          hospitalizationArray: []
      }],
      accidentType: '0',
      caseType: '0',
      isDeadAtTheScene: '',
      household: '1',
      deathDate: '',
      standardYear: new Date().getFullYear(),
      feeDetail: angular.copy(DictionaryConfig.wxfeeTypeList),
      treatmentType: '1',
      responsibility: '0',
      compensateTable: [],
      compensateStandard: [],
      disabledLevelArray: [],
      treatmentType: '1',
      applyTotal: 0
  }
  $scope.maxDate = DictionaryConfig.getDate();
//阻止默认事件
$scope.stopprevent = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();
}
  //控制预约弹出框
  $scope.wxchart == false
  $scope.step = {
    stepId: 1
  }
  $scope.selectShow = true

  //下一步点击相应步骤跳转页面
  $scope.nexthandleSkipStep = function (step) {
   
      //根据参数判断是一体机还是pc并跳转到相应页面
      window.location.href.split("/#/")[1].split('/prejudge_new/')[0]=='home_page'? url = 'home_page.prejudge_new.AIOCourtSetp': url = 'AIOCourtSetpBox.AIOCourtSetp'
      step = parseInt(step);
      if (step == $scope.step) return; 
      switch (step) {
          case 1:
              if($scope.lawCase.caseType == '2' && $scope.lawCase.isDeadAtTheScene){ //当场死亡
                $state.go(url+'3')
              }else if($scope.lawCase.caseType == '3'){ //仅财产损失
                $state.go(url+'4')
              }else{
                $state.go(url+'2')
              }
              break;
          case 2:
              //页面自定义异常
              var level = DictionaryConfig.toaster.level;
              var title = DictionaryConfig.toaster.title;
              if($scope.lawCase.treatmentType=='1' || $scope.lawCase.treatmentType=='3'){
                  if(!$scope.lawCase.applicantArray[0].outPatientTimes){
                      $rootScope.toaster(level.error, title.error, "门诊次数不能为空");
                      return false;
                  }
                  if(!$scope.lawCase.applicantArray[0].restDaysOfOutPatient){
                      $rootScope.toaster(level.error, title.error, "医嘱休息天数不能为空");
                      return false;
                  }
              }
              if($scope.lawCase.treatmentType=='2' || $scope.lawCase.treatmentType=='3'){
                  var hospitalization = $scope.lawCase.applicantArray[0].hospitalizationArray
                  for (var i = 0; i < hospitalization.length; i++){
                      //医嘱休息天数
                      if (!hospitalization[i].restDaysOfHospitalization) {
                          $rootScope.toaster(level.error, title.error, "医嘱休息天数不能为空");
                          return false;
                      }
                  }
              }
              $scope.calculateDaysOfHospital();
              $scope.calculateCompensateRate();
              if( $scope.lawCase.caseType == '1' && $scope.lawCase.disabledLevelArray.length<=0){
                $rootScope.toaster(level.error, title.error, "请选择伤残等级");
                return false;
              }
              $state.go(url+'3');
              break;
          case 3:
              $state.go(url+'4');
              break;
          case 4:
              $scope.calculateTotalLoss()
              $state.go(url+'5');
              break;
      }
  }

  $scope.calculateDaysOfHospital = function(){
      $scope.applicant = $scope.lawCase.applicantArray[0]
      $scope.lawCase.compensateDays = 0
      $scope.lawCase.hospitalDays = 0
      if ($scope.lawCase.treatmentType == '1'){//门诊治疗
          $scope.lawCase.compensateDays = parseInt($scope.applicant.restDaysOfOutPatient);
      }else if ($scope.lawCase.treatmentType == '2'){//住院治疗
          $scope.applicant.hospitalizationArray.forEach(function(v) {
              v.leaveHospitalDate =  DictionaryConfig.formatDate(v.leaveHospitalDate);
              v.hospitalizedDate =  DictionaryConfig.formatDate(v.hospitalizedDate);
              $scope.lawCase.compensateDays += parseInt(DictionaryConfig.getDays(v.leaveHospitalDate, v.hospitalizedDate)) + 1 + parseInt(v.restDaysOfHospitalization)
              $scope.lawCase.hospitalDays += parseInt(DictionaryConfig.getDays(v.leaveHospitalDate, v.hospitalizedDate)) + 1
          })
      } else if ($scope.lawCase.treatmentType == '3'){//门诊+住院
          $scope.lawCase.compensateDays += parseInt($scope.applicant.restDaysOfOutPatient);
          $scope.applicant.hospitalizationArray.forEach(function(v) {
              v.leaveHospitalDate =  DictionaryConfig.formatDate(v.leaveHospitalDate);
              v.hospitalizedDate =  DictionaryConfig.formatDate(v.hospitalizedDate);
              $scope.lawCase.compensateDays += parseInt(DictionaryConfig.getDays(v.leaveHospitalDate, v.hospitalizedDate)) + 1 + parseInt(v.restDaysOfHospitalization)
              $scope.lawCase.hospitalDays += parseInt(DictionaryConfig.getDays(v.leaveHospitalDate, v.hospitalizedDate)) + 1
          })
      }
  }

  /**
   * 计算伤残赔偿系数
   */
  $scope.calculateCompensateRate = function(){
      if ($scope.lawCase.disabledLevelArray && $scope.lawCase.disabledLevelArray.length > 0){
          $scope.rateArray = $scope.lawCase.disabledLevelArray.map(function(v){
              return v.rate;
          }).sort(function (a, b) {
              return b - a;
          });
          $scope.tensDigit = $scope.rateArray[0]
          $scope.singleDigit = 0
      if ($scope.rateArray.length > 1) {
          $scope.rateArray.forEach(function(v, index) {
              if (index > 0) {
                  $scope.singleDigit += parseInt(v) / 10
              }
          })
          $scope.singleDigit = $scope.singleDigit > 9 ? 9 : $scope.singleDigit
      }
      $scope.lawCase.compensateRate = ($scope.tensDigit + $scope.singleDigit) > 100 ? 100 : $scope.tensDigit + $scope.singleDigit
      }
  }

  
  $scope.calculateTotalLoss = function () {
      $scope.lawCase.applyTotal = 0;
      $scope.lawCase.feeDetail.forEach(function(v) {
        if(v.id == '19' && v.personArray){//处理事故人员误工费
          var currentTotal = 0
          v.personArray.forEach(function(m) {
            currentTotal += parseFloat(m.applyAmount || 0)
          })
          v.applyAmount = currentTotal
          $scope.lawCase.applyTotal += currentTotal
        } else if (v.id == '09'){//护理费
          var currentTotal = 0
          v.nursingArray.forEach(function(m) {
            currentTotal += parseFloat(m.applyAmount || 0)
          })
          v.applyAmount = currentTotal
          $scope.lawCase.applyTotal += currentTotal
        } else if (v.id == '14'){//被扶养人生活费
          v.applyAmount = 0;
          if (v.dependents.apply){
            if (v.dependents.apply.length == 1) {//单个抚养人
              var dependent = v.dependents.apply[0]
              var standardFee = $scope.lawCase.compensateStandard[dependent.household].expense
              //抚养年限x上一年度城镇居民人均年消费性支出额或者农村居民人均年生活消费支出额/共同抚养人数×伤残系数
              dependent.applyAmount = parseFloat(dependent.fyAge || 0) * parseFloat(standardFee || 0) / parseFloat(dependent.count || 0) * (parseFloat($scope.lawCase.compensateRate) / 100)
              $scope.lawCase.applyTotal += dependent.applyAmount
              v.applyAmount = (parseFloat(v.applyAmount) + parseFloat(dependent.applyAmount || 0)).toFixed(2)
            } else {//多个被扶养人
              // a、计算每个抚养人还需要多少年的抚养时间
              // b、确定每个人的每年的抚养费（上一年度城镇居民人均年消费性支出额或者农村居民人均年生活消费支出额 / 共同抚养人数）
              // c、将所有人的抚养费相加与当地标准比较：判断结果是否大于上一年度人居生活消费支出，结果小于支出数额的按照实际数额，结果大于支出数额的按照标准支出。
              // d、依次计算各抚养时间段内人员的抚养费，年数 * 费用。依次循环，直至无抚养人需要负担。
              // e、最终将多个结果相加为总费用 * 伤残系数。
              
              v.dependents.apply.sort(function (a, b) {//根据抚养年限排序，由大到小
                return a.fyAge - b.fyAge;
              });
               var countFee = 0
              $scope.dependentStandard = $scope.lawCase.compensateStandard[$scope.lawCase.household].expense
              v.dependents.apply.forEach(function(m, i, arr) {
                  var tmpFee = 0;
                  var preYear = 0;
                if (i != 0) {
                  preYear = arr[i - 1].fyAge;
                }
                arr.forEach(function(j) {
                  tmpFee += ( $scope.dependentStandard * $scope.lawCase.compensateRate / 100 / j.count);
                })
                //取标准和计算值中小的
                tmpFee = Math.min(tmpFee,  $scope.dependentStandard);
                countFee += (tmpFee * (m.fyAge - preYear));
                m.applyAmount = parseFloat(countFee);
              })
              $scope.lawCase.applyTotal += parseFloat(countFee)
              v.applyAmount = (parseFloat(v.applyAmount) + parseFloat(countFee || 0)).toFixed(2)
            }
          }
        } else {//其他类型的费用
          $scope.lawCase.applyTotal += parseFloat(v.applyAmount||0)
        }
      })
      $scope.lawCase.applyTotal = ($scope.lawCase.applyTotal).toFixed(2)
  }

  //点击上一步相应步骤跳转页面
  $scope.prevhandleSkipStep = function (step) {
      //根据参数判断是一体机还是pc并跳转到相应页面
      window.location.href.split("/#/")[1].split('/prejudge_new/')[0]=='home_page'? url = 'home_page.prejudge_new.AIOCourtSetp': url = 'AIOCourtSetpBox.AIOCourtSetp'
      step = parseInt(step);
      if (step == $scope.step) return; //禁止点击当前步骤或未填写的步骤
      //跳转到相应页面
      switch (step) {
          case 2:
          $scope.lawCase.isDeadAtTheScene == "1"?$scope.selectShow = true:$scope.selectShow = false;
          $state.go(url+'1');
          break;
          case 3:
            //是不是当场死亡
            $scope.lawCase.caseType == '2' && $scope.lawCase.isDeadAtTheScene?$state.go(url+'1'):$state.go(url+'2')
          break;
          case 4:
          $scope.lawCase.caseType ==3?$state.go(url+'1'):$state.go(url+'3') //是不是仅财产损失
          break;
          case 5:
          $state.go(url+'4');
          break;
      }
  };

  //日期转化
  function filterParam(adjust) {
    adjust.applicantArray.forEach(function(v) {
        if (v.birthDay) v.birthDay = DictionaryConfig.formatDate(v.birthDay) + " 00:00:00"
        if (v.riskTypes) v.riskTypes = JSON.stringify(v.riskTypes);
      });
      if (adjust.compensateStandard && adjust.compensateStandard instanceof Object) adjust.compensateStandard = JSON.stringify(adjust.compensateStandard);
      if (adjust.compensateTable && adjust.compensateTable instanceof Object) adjust.compensateTable = JSON.stringify(adjust.compensateTable);
      if (adjust.feeDetail && adjust.feeDetail instanceof Object) adjust.feeDetail = JSON.stringify(adjust.feeDetail);
      if (adjust.deathDate) adjust.deathDate =  DictionaryConfig.formatDate(adjust.deathDate) + " 00:00:00"
      if (adjust.createDate) adjust.createDate =  DictionaryConfig.formatDate(adjust.createDate) + " 00:00:00"
      if (adjust.payDate) adjust.payDate = DictionaryConfig.formatDate(adjust.payDate) + " 00:00:00"
      if (adjust.adjustDate) adjust.adjustDate = DictionaryConfig.formatDate(adjust.adjustDate) + " 00:00:00"
    
    return adjust;
  }

//第五步点击完成
$scope.finishhandleSkipStep = function () {
    var lawCase = filterParam(angular.copy($scope.lawCase))
  
    $scope.prejudgeService.saveJyPrejudgeInfo(lawCase).success(function (result) {
        if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
            if (result.result) {
                console.log(result.result);
                $scope.backIndex();
            }
        }
    })
  }
  //关闭
  $scope.backIndex = function () {
    $scope.lawCase = {};
    window.location.href.split("/#/")[1].split('/prejudge_new/')[0]=='home_page'? url = 'home_page': url = 'AIOCourtIndex'
    $state.go(url);
}

 //检测pc端刷新
 if(window.location.href.split("/#/")[1].split('/prejudge_new/')[0]=='home_page'){
    if (!window.name) { 
        window.name="myname" 
    }else{ 
        alert("检测到刷新页面，数据需要重新填写");
        $state.go('home_page.prejudge_new.AIOCourtSetp1');
    }
}
});