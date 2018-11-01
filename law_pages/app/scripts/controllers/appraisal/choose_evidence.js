/**
 * Created by Administrator on 2017/5/9 0009.
 */
var app = angular.module('sbAdminApp');

app.filter('appraisalItem', function() {
  return function(idStr,data) {
    var arr = [];
    // if(idStr && (idStr.indexOf(',') !== -1)){
    if(idStr && idStr != '' && idStr.split(',').length > 0){
      idStr.split(",").forEach(function(val){
        var result = _.find(data, {id: val});
        arr.push(result.value);
      });
    }
    return arr? arr:""
  }
});
app.filter('selectedCount', function() {
  return function(arr) {
    return arr.filter(function(v) {
      return v.selected;
    }).length;
  }
});

angular.module('sbAdminApp').controller('chooseEvidenceCtrl', function ($scope,$modalInstance,AdjustService,$stateParams,AdjustConfig,DictionaryConfig) {
  $scope.adjustService = AdjustService;
  //图片地址
  $scope.imageAddress = AdjustConfig.pictureConstant.bigPictureUrl;
  //费用类型
  $scope.feeTypeList = DictionaryConfig.feeTypeList;
  //查询列表
  $scope.evidenceList = [];

  $scope.step12EvidenceArray =JSON.parse(sessionStorage.getItem($stateParams.serialNo));
  //证据查询
  $scope.queryEvidence = function () {
    $scope.adjustService.queryAdjustEvidence({"serialNo": $stateParams.serialNo}).success(function (result) {
      if (result.code == AdjustConfig.commonConStant.SUCCESS) {
        $scope.evidenceList = result.result;
        $scope.step12EvidenceArray.forEach(function(v){
          $scope.evidenceList.push(v);
        });
      } else if (result.code == AdjustConfig.commonConStant.FAILURE) {
        toaster.pop("error", "错误", result.message);
      }
    })
  }
  $scope.queryEvidence();

  //选择全部
  $scope.selectAllItems = false;
  $scope.selectAllappraisal = function (list) {
    $scope.selectAllItems = !$scope.selectAllItems;
    list.forEach(function(v) {
      if ($scope.selectAllItems) {
        v.selected = true;
      } else {
        v.selected = false;
      }
    })
  }
  //点击关闭
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  //确认选择
  $scope.ok = function () {
    var chooseArr = [];
    $scope.evidenceList.forEach(function (v) {
      if(v.selected)chooseArr.push(v);
    });
    $modalInstance.close(chooseArr);  //关闭时返回数据
  };
})
