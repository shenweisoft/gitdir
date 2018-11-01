angular.module('sbAdminApp').controller('PrejudgeHistoryCtrl', function ($scope, $stateParams, $state, $modal, $log, PrejudgeService, PrejudgeConfig, DictionaryConfig, toaster,$rootScope) {
  $scope.co.step = undefined;
  //案件预判数据服务
  $scope.prejudgeService = PrejudgeService;
  
  $scope.responsibilityList = DictionaryConfig.responsibilityList;
  $scope.residenceTypeList = DictionaryConfig.residenceTypeList;
  $scope.caseTypeList = DictionaryConfig.caseTypeList;
  
  //查询历史预判
  $scope.viewPrejudgeHistory = function(){
    if(!$scope.idNo){
      $scope.idNoError=true;
      $rootScope.toaster("error", "错误", "请填写要查询的身份证号")
      return;
    }else $scope.idNoError=undefined;
    if(!$scope.code){
      $scope.codeError=true;
      $rootScope.toaster("error", "错误", "请填写案件查询码")
      return;
    }else $scope.codeError=undefined;
    
    $scope.prejudgeService.getPrejudgeCase({
      idNo:$scope.idNo,
      code:$scope.code
    }).success(function(res){
      if(res.code == PrejudgeConfig.commonConstant.SUCCESS){
        $scope.history = res.result;
        filterQuery($scope.history)
        console.log($scope.history)
      }
    })
  }
  
  function filterQuery(law) {
    if (law.applicantArray) {
      law.applicantArray.forEach(function(v) {
        if (v.createDate) v.birthDay = parseISO8601(v.createDate);
      })
    }
    if (law.compensateStandard) law.compensateStandard = JSON.parse(law.compensateStandard);
    if (law.compensateTable) law.compensateTable = JSON.parse(law.compensateTable);
    if (law.feeDetail) law.feeDetail = JSON.parse(law.feeDetail);
    if (law.deathDate) law.deathDate = parseISO8601(law.deathDate);
    if (law.createDate) law.createDate = parseISO8601(law.createDate);
  }
  
  function parseISO8601(dateStringInRange) {
    var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d) (\d{2}):(\d{2}):(\d{2})\s*$/,
      date = new Date(NaN), month,
      parts = isoExp.exec(dateStringInRange);
    
    if(parts) {
      month = +parts[2];
      date.setFullYear(parts[1], month - 1, parts[3]);
      if(month != date.getMonth() + 1) {
        date.setTime(NaN);
      }
    }
    return date;
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