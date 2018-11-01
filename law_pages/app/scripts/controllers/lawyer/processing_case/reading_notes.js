angular.module('sbAdminApp').controller('ReadingNotesCtrl', function($scope, $stateParams, $log, LoginConfig, LoginService,LawService, LawConfig, DictionaryConfig, $state,$rootScope) {



  //阅读完成
  $scope.goProposer = function () {
    $scope.generateDocument();
      $state.go("dashboard.sue_detail", {serialNo:$stateParams.serialNo,courtCode:$stateParams.courtCode,id:$stateParams.id, step:1});
  }
  
  $scope.CONSTANT = {
    messageBackend:"后太忙，请稍后再试"
  }
  
  $scope.generateDocument = function() {
    function documentBuild(text) {
      var bodyObj = '<body class="b1 b2">' + text + '</body>';
      return bodyObj;
    }
    
    var result = $('#content').html();
    result = documentBuild(result);
  
    LawService.buildWord({
      serialNo: $stateParams.serialNo,
      type: DictionaryConfig.caseVerifyResultCode[1].code,
      wordType:"10",
      fileName: "民事诉讼须知",
      content: result
    }).success(function(result) {
      if (result.code == LawConfig.commonConstant.FAILURE) {
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
      }
    })
  }
})