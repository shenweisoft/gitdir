app.controller('AddRoleCtrl', function($scope, $modalInstance, LoginService, items,LoginConfig,$log) {

  $scope.CONSTANT = {
    "deptErrorMessage": "请您选择兼职部门",
    "roleErrorMessage": "请您选择兼职角色",
    "deptNoSelectedMessage":"需先选兼职部门才能选角色"
  };

  $scope.addUserDeptRole = LoginService.addUserDeptRole;
  $scope.items = items;
  $scope.isSelf = "0";

  $scope.changeType = function() {
    if ($scope.selectedDept) {
      var orgId = $scope.selectedDept.substr(0, $scope.selectedDept.indexOf('.'));
      var category = _.find($scope.items.originalData, {
        id: orgId
      })
      category = category && category.category;
      $scope.roleTypeFilteredData = $scope.items.roleTypeData.filter(function(v) {
        return v.parentId == category;
      });
    }
  };

  $scope.selectRole = function(){
    if(!$scope.roleTypeFilteredData){
      $scope.roleErrorMessage = $scope.CONSTANT.deptNoSelectedMessage;
    }
  }

  //验证表单信息
  function validateForm(){
    $scope.deptErrorMessage = "";
    $scope.roleErrorMessage = "";
    if(!$scope.selectedDept){
      $scope.deptErrorMessage = $scope.CONSTANT.deptErrorMessage;
      return false;
    }
    if(!$scope.role){
      $scope.roleErrorMessage = $scope.CONSTANT.roleErrorMessage;
      return false;
    }
    return true;
  }
  //点击确认
  $scope.ok = function() {

    if(validateForm()){
      if ($scope.selectedDept != $scope.items.selectedNode.id) {
        $scope.addUserDeptRole({
          "userId": $scope.items.selectedNode.id.substr($scope.items.selectedNode.id.lastIndexOf('.') + 1),
          "deptId": $scope.selectedDept,
          "roleid": $scope.role.id,
          "isSelf": $scope.isSelf
        }).success(function(userData) {
          //请求成功
          if(userData.code == LoginConfig.commonConStant.SUCCESS){
            $modalInstance.close();
          }else{
            //TODO
            alert("请联系系统管理员");
          }
        });
      }
    }
  };
  //点击取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
