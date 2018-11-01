
//部门的信息Controller
app.controller('NewDepartmentCtrl', function($scope, $log, $state, $modal, LoginConfig, LoginService, items, $modalInstance) {
  //根据组织新建部门
  $scope.saveDepartmentByOrg = LoginService.saveDepartmentByOrg;
  //修改部门信息
  $scope.editDepartment = LoginService.editDepartment;

  $scope.CONSTANT = {
    messageDeptName: "部门名称不能为空",
    messageDeptCode: "部门代码不能为空",
    messageDeptType: "业务类型不能为空",
    messageDeptNumber:"部门名称不能全为数字",
    messageAddress:'具体地址不能为空'
  }

  $scope.items = items;
  $scope.title = "新建部门";

  if ($scope.items.dept) {
    $scope.title = "修改部门";
    $scope.deptId = $scope.items.dept.id;
    $scope.deptName = $scope.items.dept.text;
    $scope.address = $scope.items.dept.address;
    var extPro = items.dept.extPro;
    $scope.deptCode = extPro && extPro.deptCode;
    $scope.deptType = extPro && extPro.deptType;
    $scope.items.dragIn = $scope.items.dept.isDragIn;
  }else{
    if($scope.items.selectedNode.category == '#02'){
        $scope.items.dragIn = '1';
    }
  }

  //验证部门新建信息
  var validateForm = function() {
    //部门名称
    $scope.deptNameErrorMessage = "";
    if (!$scope.deptName) {
      $scope.deptNameErrorMessage = $scope.CONSTANT.messageDeptName;
      return false;
    }else{
      var reg = new RegExp("^[0-9]*$");
      if(reg.test($scope.deptName)){
        $scope.deptNameErrorMessage = $scope.CONSTANT.messageDeptNumber;
        return false;
      }
    }
    //部门代码
    $scope.deptCodeErrorMessage = "";
    if (!$scope.deptCode) {
      $scope.deptCodeErrorMessage = $scope.CONSTANT.messageDeptCode;
      return false;
    }

    //部门地址
    $scope.addressErrorMessage = "";
    if (!$scope.address) {
        $scope.addressErrorMessage = $scope.CONSTANT.messageAddress;
        return false;
    }


    return true;
  }

  var Department = function(id, deptName, orgId, isDragIn, extPro,address) {
    this.id = id;
    this.text = deptName;
    this.orgId = orgId;
    this.isDragIn = isDragIn;
    this.extPro = extPro;
    this.address = address;
  }

  //保存新建部门（根据组织）
  $scope.saveDepartment = function() {
    if (!$scope.items.dept) { //新建
      var dept = new Department(null, $scope.deptName, $scope.items.selectedNode.id, $scope.items.dragIn, JSON.stringify({
        'deptCode': $scope.deptCode,
        'deptType': $scope.deptType
      }),$scope.address);
      $scope.saveDepartmentByOrg(dept).success(function(result) {
        if (result.code == LoginConfig.commonConStant.SUCCESS) { //请求成功
          $modalInstance.close();
        } else{
          //TODO
          alert("请联系系统管理员");
        }
      });
    } else { //编辑
      var dept = new Department($scope.deptId, $scope.deptName, null, $scope.items.dragIn, JSON.stringify({
        "deptCode": $scope.deptCode,
        "deptType": $scope.deptType
      }),$scope.address);
      $scope.editDepartment(dept).success(function(result) {
        if (result.code == LoginConfig.commonConStant.SUCCESS) { //请求成功
          $modalInstance.close();
        } else{
          //TODO
          alert("请联系系统管理员");
        }
      });
    }
  };
  //点击确认
  $scope.ok = function() {
    if (validateForm())
      $scope.saveDepartment();
  };
  //点击取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
})