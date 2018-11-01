var app = angular.module('sbAdminApp');

app.controller('downloadSignCtrl', function($scope, AppraisalService, $stateParams,LoginConfig,LawConfig,AdjustConfig,toaster,$rootScope){
  //获取图片列表
  $scope.getAppraisalImageFileService = AppraisalService.getAppraisalImageFile;
  //获取图片
  $scope.getAppraisalImageFileService({
    wordType: '40',
    appraisalNo:$stateParams.appraisalNo
  }).success(function (res) {
    console.log(res)
    $scope.fileList = res.result;
    if (res.code == AdjustConfig.commonConStant.SUCCESS) {
      $scope.imageList = [];
      if(res.result){
        res.result.forEach(function (v) {
          if(v.picture) {
            var url = LoginConfig.pictureConstant.bigPictureUrl + v.path;
            $scope.imageList.push(url);
          }
        })
      }
    } else {
      $rootScope.toaster("error", "错误", res.message);
    }
  })

  //下载鉴定报告
  $scope.downloadFile = function (file) {
    return LawConfig.fileConstant.downloadInstrumentUrl + "?docId="+file.id;
  }

})