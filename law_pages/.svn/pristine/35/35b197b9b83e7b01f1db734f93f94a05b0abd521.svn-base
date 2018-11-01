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
app.controller('PrejudgeStep2Ctrl', function ($scope, $stateParams,$state, $modal, $log, DictionaryConfig) {


  //当前步骤
  $scope.co.step = 2;
  $scope.feeHousehold = $scope.law.household==3?2:$scope.law.household;
  
  $scope.feeCheckChanged = function(fee, id) {
    if (["12", "13", "14", "15", "16"].indexOf(id) != -1 && fee.isChecked) {
      if (id == "12" || id == "13")
        $scope.law.feeDetail.forEach(function(v) {
          if (v.id == "15" || v.id == "16") v.isChecked = false;
        });
      else if (id == "15" || id == "16") {
        $scope.law.feeDetail.forEach(function(v) {
          if (v.id == "12" || v.id == "13") v.isChecked = false;
        });
        $scope.law.compensateRate = 100;
      }
    }
  };
  //计算总价
  $scope.refreshTotal = function() {
    $scope.law.applyTotal = 0;
    $scope.law.lawMoney = 0;
    var checkedList = $scope.law.feeDetail.filter(function(v) {
      return v.isChecked;
    })
    checkedList.forEach(function(v) {
      if (v.applyAmount && parseFloat(v.applyAmount))
        $scope.law.applyTotal += parseFloat(v.applyAmount)
      if (v.claimAmount && parseFloat(v.claimAmount))
        $scope.law.lawMoney += parseFloat(v.claimAmount)
      if(v.claimNonMed && parseFloat(v.claimNonMed)){//计算非医保金额
        $scope.law.lawMoney += parseFloat(v.claimNonMed);
      }
    })

    $scope.law.applyTotal = $scope.law.applyTotal.toFixed(2);
    $scope.law.lawMoney = $scope.law.lawMoney.toFixed(2);
  }
  
  //计算每行的和
  $scope.computeChange = function(fee, isForward) {
    var household = $scope.law.household==3?2:$scope.law.household;
    switch(fee.id){
      case '06':fee.claimPerUnit = $scope.law.compensateStandard.hospitalFoodSubsidies;break;
      case '07':fee.claimPerUnit = $scope.law.compensateStandard.thesePayments;break;
      case '08':fee.claimPerUnit = $scope.law.compensateStandard.lostIncome;break;
      case '09':fee.claimPerUnit = $scope.law.compensateStandard.standardNurseFee;break;
      case '11':fee.claimPerUnit = $scope.law.compensateStandard.accommodationFee;break;
      case '12':fee.claimPerUnit = $scope.law.compensateStandard[household].income;break;
      case '15':fee.claimPerUnit = $scope.law.compensateStandard[household].income;break;
      case '16':fee.claimPerUnit = $scope.law.compensateStandard.funeralFeeStandard;break;
    }
    if (fee.claimPerUnit && fee.claimUnit) {
      fee.claimAmount = fee.claimUnit * fee.claimPerUnit;
      if (fee.template == "3")
        fee.claimAmount *= ($scope.law.compensateRate / 100);
      fee.claimAmount.toFixed(2)
      $scope.refreshTotal();
    }
  };


  $scope.handleFee = function(){
    var household = $scope.law.household==3?2:$scope.law.household;
    $scope.law.feeDetail.forEach(function(v) {
      if (v.id == "12" || v.id == "15"){
        if($scope.law.compensateStandard[household]){
          v.claimAmount = v.claimUnit * $scope.law.compensateStandard[household].income * $scope.law.compensateRate/100;
          v.claimAmount = parseFloat(v.claimAmount).toFixed(2);
        }
      }
    });
    $scope.refreshTotal();
  };

  $scope.handleFee();
  //费用计算
  $scope.co.calculate = function() {
    if (!$scope.law.compensateTable) $scope.law.compensateTable = [];
    if ($scope.law.compensateTable.length)
      $scope.law.compensateTable.splice(0, $scope.law.compensateTable.length);
    
    //责任人
    var respondents = $scope.law.applicantArray.filter(function(e) {
      return e.personType == 1;
    });
    
    //计算每个侵权方商业险赔付金额及每个侵权方自付金额, 总的剩余金额(逐步扣完商业险后的剩余金额)
    var surplusAmount2 = $scope.law.lawMoney;
    if (surplusAmount2 > 0) {
      //循环侵权人，计算每个侵权人商业险应该赔付的费用
      respondents.forEach(function(v) {
        // 没有商业险，侵权人自己承担
        if (v.responsibleRate > 0) {
          var personAmount = $scope.law.lawMoney * v.responsibleRate / 100;
          var countStr = "";
          countStr += $scope.law.lawMoney + " * " + v.responsibleRate + " % " + " = " + personAmount;
          $scope.law.compensateTable.push({
            payType: "3",
            calcFormula: countStr,
            calcIndemnitySum: personAmount.toFixed(2),
            personName: v.personName,
            personType: v.personType,
            idType: v.idType
          });
          surplusAmount2 -= personAmount;
        }
      });
    }
    
    //被侵权方自行承担金额
    if (surplusAmount2 > 0) {
      //被侵权方信息
      $scope.law.compensateTable.push({
        payType: "3",
        calcFormula: surplusAmount2,
        calcIndemnitySum: surplusAmount2.toFixed(2),
        personName: $scope.law.applicantArray.filter(function(v){return v.personType==0})[0].personName,
        personType: 0
      });
    }
    
    //诉讼费
    $scope.moneyFeeList = DictionaryConfig.moneyFeeList;
    var currentMoney = $scope.law.lawMoney;
    var moneyFee = $scope.moneyFeeList.filter(function(v) {
      return currentMoney >= v.startMoney*10000 && currentMoney < v.endMoney*10000;
    });
    $scope.law.acceptanceFee =$scope.law.lawMoney * moneyFee[0].feeMoney + moneyFee[0].plusMoney;
    $scope.law.acceptanceFee = parseFloat($scope.law.acceptanceFee).toFixed(2)
  }
  
  $scope.addDependent = function(val) {
    var dependents = _.find($scope.law.feeDetail, {
      id: "14"
    }).dependents
    if (val == 'apply') {
      if (dependents.apply.length == 0 && dependents.apply.length != 0) {
        dependents.apply = angular.copy(dependents.apply);
      }
    }
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/mediation_platform/litigation_mediation/adjust_information_popup.html',
      controller: 'AdjustInformationPopupCtrl',
      size: 'lg',
      resolve: {
        items: function() {
          var depent = _.find($scope.law.feeDetail, {
            id: "14"
          }).dependents;
          return {
            dependents: depent[val],
            deathDate: $scope.law.deathDate,
            compensateRate: $scope.law.compensateRate,
            household: $scope.law.household,
            refData: $scope.law.compensateStandard,
            serialNo:$scope.law.serialNo
          }
        }
      }
    });
    //返回值
    modalInstance.result.then(function(data) {
      var target = _.find($scope.law.feeDetail, {
        id: "14"
      });
      if (val == 'apply') {
        target.applyAmount = data;
        if (!target.claimAmount)
          target.claimAmount = data;
      } else {
        target.claimAmount = data;
      }
      $scope.refreshTotal();
    }, null);
  };
  
  //计算总合计
  $scope.calcTotal = function(compensateTable, type){
    var total = 0.00;
    if(compensateTable){
      compensateTable.filter(function(v){
        return v.payType==type;
      }).forEach(function(v){
        total += parseFloat(v.calcIndemnitySum);
      })
    }
    return total.toFixed(2)
  }
  
  //选择依据
  $scope.openCriteria = function (lg, fee) {
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/lawsuit/criteria.html',
      controller: 'ModalLawItemsCtrl',
      size: lg,
      resolve: {
        items: function () {
          return fee.selectedItemArray==undefined?angular.copy(DictionaryConfig.lawItemArray.filter(function(v){return v.feeType == fee.id})):fee.selectedItemArray;
          
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      fee.selectedItemArray = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
  //添加护理费、误工费、处理人误工费
  $scope.addNursingFee = function(val,fee){

    $scope.law.standardYear = $scope.law.createDate;
    var addNursingFeeModel =  $modal.open({
      templateUrl: 'views/pages/mediation_platform/litigation_mediation/nursingFee_popup.html',
      controller: 'NursingFeePopupCtrl',
      backdrop:'static',
      size: 'lg',
      resolve: {
        items: function() {
          return {
            fee: fee,
            val:val,
            adjust: $scope.law
          }
        }
      }
    });

    addNursingFeeModel.result.then(function(data){
      $scope.refreshTotal();
    })
  };


})

//选择依据
angular.module('sbAdminApp').controller('ModalLawItemsCtrl', function ($scope, $modalInstance, DictionaryConfig, items) {
  //法律条文
  $scope.lawItemArray = items;
  $scope.selectLawItem = function($event, v){
    if($event.target.checked) v.selected = true;
    else v.selected = false;
  }
  
  $scope.ok = function () {
    $modalInstance.close($scope.lawItemArray);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

app.controller('AdjustInformationPopupCtrl', function($scope, DictionaryConfig, $state, $modal, items, $modalInstance, toaster,$rootScope) {
  $scope.dependents = items.dependents;
  $scope.deathDate = items.deathDate;
  $scope.household = items.household == 3?2:items.household;
  $scope.compensateStandard = items.refData;
  $scope.compensateRate = items.compensateRate;
  
  $scope.openBirthDate = function($event, dependent) {
    $event.preventDefault();
    $event.stopPropagation();
    dependent.birthDateOpened = true;
  };
  $scope.accountTypeList = DictionaryConfig.accountTypeList;
  
  $scope.add = function() {
    var dependent = {
      id: new Date().getTime(),
      birthDateOpened: false,
      household: $scope.household
    }
    $scope.dependents.push(dependent);
  }
  
  $scope.deleteDependent = function(index) {
    $scope.dependents.splice(index, 1);
  };
  
  $scope.computeFyAge = function(dependent) {
    dependent.age = Math.floor(($scope.deathDate.getTime() - dependent.birthDate.getTime()) / (24 * 365 * 3600000));
    if (dependent.age <= 18)
      dependent.fyAge = 18 - dependent.age;
    else if (dependent.age > 18 && dependent.age <= 60)
      dependent.fyAge = 20;
    else if (dependent.age > 60 && dependent.age < 75)
      dependent.fyAge = 80 - dependent.age;
    else if (dependent.age >= 75)
      dependent.fyAge = 5;
  }
  
  //点击确认
  $scope.ok = function() {
    $scope.household = $scope.household==3?2:$scope.household;
    var dependentStandard = $scope.compensateStandard[$scope.household].expense;
    var flag = true;
    $scope.dependents.forEach(function(v) {
      if(!v.name){
        $rootScope.toaster("error", "错误", "请填写抚养人姓名!");
        $scope.nameError = true;
        flag = false;
      }else $scope.nameError = false;
      if(!v.birthDate){
        $rootScope.toaster("error", "错误", "请填写抚养人真实出生日期!");
        $scope.birthDateError = true;
        flag = false;
      }else $scope.birthDateError = false;
      if(!v.count){
        $rootScope.toaster("error", "错误", "请填写共同抚养人数!");
        $scope.countError = true;
        flag = false;
      }else $scope.countError = false;
      
      v.expense = $scope.compensateStandard[v.household].expense
    });
    $scope.dependents.sort(function(a, b) {
      return a.fyAge - b.fyAge;
    });
    
    var countFee = 0;
    $scope.dependents.forEach(function(v, i, arr) {
      var tmpFee = 0;
      var preYear = 0;
      var year = v.fyAge;
      for (var j = i; j < arr.length; j++) {
        tmpFee += (arr[j].expense * $scope.compensateRate / 100 / arr[j].count);
      }
      if (i != 0) {
        preYear = arr[i - 1].fyAge;
      }
      if (tmpFee > dependentStandard)
        tmpFee = dependentStandard;
      countFee += (tmpFee * (year - preYear));
    });
    if(flag){
      $modalInstance.close(countFee.toFixed(2));
    }
  };
  //点击取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
})
