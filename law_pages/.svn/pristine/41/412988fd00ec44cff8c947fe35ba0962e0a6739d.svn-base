app.controller('DataPermissionCtrl', function($scope, $modalInstance, $timeout, items, LoginService, LoginConfig, AdminConstant, toaster, $rootScope) {
  $scope.loginService = LoginService;
  $scope.items = items;
  
  $scope.blurAdmin = function(){
    if($scope.isShowTree){
      $timeout(function(){
        $scope.isShowTree = false;
      }, 200);
    }
  };
  
  //填充区域信息
  $scope.adminRegion = AdminConstant.administrationRegions;
  $scope.isShowTree = false;
  $scope.selectAdmin = function(node, selected, event) {
    var selectedNodes = selected.selected;
    if (selectedNodes.length > 0) {
      var newValue = $scope.adminRegion[selectedNodes[0]].fullName;
      var newId = $scope.adminRegion[selectedNodes[0]].id;
      var regionCode = $scope.adminRegion[selectedNodes[0]].regionCode;
      if ($scope.regionName != newValue) {
        $scope.regionName = newValue;
        $scope.regionId = newId;
        $scope.isShowTree = false;
  
        $scope.queryData(regionCode);
      }
    }
  }
  
  $scope.queryData = function(regionId){
    $scope.loginService.getDataPermission({
      category: '#02',
      regionCode: regionId
    }).success(function(res){
      $scope.dataPermissionList = res.result;
    })
  }
  
  //点击取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
  
  var validateForm = function(){
    if(!$scope.regionName){
      $rootScope.toaster("区域不能为空")
      return false;
    }
  
    if(!$scope.adjustOrg){
      $rootScope.toaster("请选择调解中心")
      return false;
    }
    
    return true;
  }
  
  //点击确认
  $scope.addDataPermission = function() {
    if(validateForm()){
      $scope.loginService.addUserDataPermission({
        "userId": $scope.items.selectedNode.id.substr($scope.items.selectedNode.id.lastIndexOf('.') + 1),
        "userName": $scope.items.selectedNode.text,
        "regionCode":$scope.regionId,
        "regionName":$scope.regionName,
        "orgId": $scope.adjustOrg.id,
        "orgName": $scope.adjustOrg.text
      }).success(function(res) {
        if(res.code == LoginConfig.commonConStant.SUCCESS){
          $modalInstance.close();
        }else{
          $rootScope.toaster("后台出错了")
        }
      });
    }
  };
  
  //点击取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
