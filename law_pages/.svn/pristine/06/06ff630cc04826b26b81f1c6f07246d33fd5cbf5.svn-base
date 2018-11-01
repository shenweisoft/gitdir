
angular.module('sbAdminApp').controller('secondStep4Ctrl', function($scope, $stateParams, toaster, SecondLitigantionConfig, SecondLitigantionService) {
  //案由
  $scope.factTypeList = SecondLitigantionConfig.factTypeList;

  //赋值step
  $scope.options.step = $stateParams.step;

  console.log($scope.secondInstanceInfoVO);

  $scope.orgLawNameSelected = function () {
    $scope.secondInstanceInfoVO.orgLawName = _.find($scope.orgLawNameList, function (v) {
      return v.id == $scope.secondInstanceInfoVO.orgLawId
    }).orgFullName;
  };

  //定义页面对象
  $scope.options = {
    filingDateOpened: false
  };

  $scope.toDay = new Date();

  //立案登记日期（日期插件）
  $scope.openFilingDate = function($event, index) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.options.filingDateOpened = true;
  };

});

