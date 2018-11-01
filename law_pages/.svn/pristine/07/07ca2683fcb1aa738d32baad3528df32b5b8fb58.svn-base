angular.module('sbAdminApp').controller('AIOPicCtrl', function(AdjustConfig,PoliceService, $scope, $stateParams, $state) {

  //显示返回按钮
  $scope.showHeaderBackBtn = true;

  //上传申请人图片功能
  $scope.imageAddress = AdjustConfig.pictureConstant.OneMachinePictureUrl;
  ///lawProject/common/image/getThumbnail/

  $scope.initData = function () {
    //请求检验鉴定信息
    PoliceService.queryEnclosuList({id: $stateParams.appraisalId}).success(function (res) {

      if (res.code == AdjustConfig.commonConStant.SUCCESS) {
        console.log(res)
        $scope.appraisalInfoList = res.result;
      } else  {
        //toaster.pop('error', '错误',res.message );
      }
    });
  };


  $scope.initData();
});