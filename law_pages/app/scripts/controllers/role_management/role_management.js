'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp').controller('RoleManagementCtrl', function($scope, $modal, $log, LoginConfig, LoginService, DictionaryConfig, $state) {

  //定义查询角色集合Service
  $scope.queryRoleListService = LoginService.queryRoleList;
  //定义删除角色Service
  $scope.removeRoleByIdService = LoginService.removeRoleById;
  //定义根据ID查询角色信息
  $scope.queryRoleByIdService = LoginService.queryRoleById;
  //从配置文件中查询角色集合
  $scope.roleList = DictionaryConfig.orgTypeConstant;
  //默认角色为0
  $scope.parentIdKey = "#01";
  //刷新视图
  function refreshView() {
    //刷新View 集合
    $scope.sysViewRoleList = $scope.sysRoleList.filter(function(val, index, arr) {
      return val.parentId == $scope.parentIdKey;
    });
  }
  //查询角色列表
  $scope.queryRoleListService().success(function(result) {
    $log.log(result);
    //请求成功
    if (result.code == LoginConfig.commonConStant.SUCCESS) {
      $scope.sysRoleList = result.result;
      refreshView();
    }else{
      //TODO
      alert("请联系系统管理员");
    }
  });

  //点击角色管理查询各自角色的列表
  $scope.collapseVar = 0;
  $scope.queryRoleList = function(parentRoleId) {
    if (parentRoleId == $scope.collapseVar) $scope.collapseVar = 0;
    else $scope.collapseVar = parentRoleId;
    $scope.parentIdKey = parentRoleId;
    $scope.sysViewRoleList = $scope.sysRoleList.filter(function(val, index, arr) {
      return val.parentId == parentRoleId;
    });
  };

  //删除角色
  $scope.delRole = function(sysRole) {

    if(confirm("您确认删除吗？")){
      $scope.removeRoleByIdService({
        "id": [sysRole.id]
      }).success(function(result) {
        $log.log(result.data);
        //请求成功
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
          var tempIndex;
          $scope.sysRoleList.filter(function(val, index, arr) {
            if (val.id == sysRole.id) {
              tempIndex = index;
              return true;
            }
            return false;
          });
          $scope.sysRoleList.splice(tempIndex, 1);
          refreshView();
        }else{
          //TODO
          alert("请联系系统管理员");
        }
      });
    }
  };

  //预查询角色信息
  $scope.queryRole = function(sysRole) {
    
    var popupModal = $modal.open({
      templateUrl: 'views/pages/role_management/role_management_popup.html',
      controller: 'RoleManagementPopupCtrl',
      size: 'lg',
      resolve: {
        items: function(){
          return {
            sysRole: sysRole,
            parentId: $scope.parentIdKey
          }
        }
      }
    });
    //角色弹出框的返回值
    popupModal.result.then(function(data) {
      $log.info(data);
      //修改
      if (sysRole) {
        sysRole.name = data.name;
        sysRole.description = data.description;
        sysRole.parentId = data.parentId.id;
      } else {
        //新建
        $scope.sysRoleList.push(data);
      }
      refreshView();
    }, function() {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
  //权限弹出窗口
  $scope.queryJurisdiction = function(sysRole) {
    
    var popupJurisdictionModal = $modal.open({
      templateUrl: 'views/pages/role_management/role_management_popup2.html',
      controller: 'PopupJurisdictionModalCtrl',
      size: 'lg',
      resolve: {
        items: function() {
          return {
            sysRole: sysRole
          }
        }
      }
    });
  };
});
//新建或者修改角色
angular.module('sbAdminApp').controller('RoleManagementPopupCtrl', function($scope, $modal, items, $modalInstance, $log, LoginConfig, LoginService, DictionaryConfig, $state) {

  //定义错误信息常量
  $scope.CONSTANT = {
    "roleNameErrorMessage": "请您输入角色名称",
    "roleGroupErrorMessage": "请您选择角色组"
  };
  // 定义查询角色新建Service
  $scope.createRoleService = LoginService.createRole;
  //定义修改角色Service
  $scope.editRoleService = LoginService.editRole;
  //角色集合
  $scope.roleList = DictionaryConfig.orgTypeConstant;
  //如果是修改则赋予默认值
  $scope.parentId = _.find($scope.roleList, {id: items.parentId});
  
  if (items.sysRole) {
    $scope.name = items.sysRole.name;
    $scope.description = items.sysRole.description;
  }
  //表单验证
  function validateForm() {
    $scope.roleNameErrorMessage = "";
    $scope.roleGroupErrorMessage = "";
    //角色名称
    if (!$scope.name) {
      $("[name='name']").focus();
      $scope.roleNameErrorMessage = $scope.CONSTANT.roleNameErrorMessage;
      return false;
    }
    //角色组
    if (!$scope.parentId) {
      $("[name='parentId']").focus();
      $scope.roleGroupErrorMessage = $scope.CONSTANT.roleGroupErrorMessage;
      return false;
    }
    return true;
  }
  //新建角色
  $scope.createRole = function(flag) {

    if (validateForm()) {
      //表示修改
      if (items.sysRole) {
        $scope.editRoleService({
          "id": items.sysRole.id,
          "parentId": $scope.parentId.id,
          "name": $scope.name,
          "description": $scope.description
        }).success(function(result) {
          //请求成功
          if (result.code == LoginConfig.commonConStant.SUCCESS) {
            $modalInstance.close({
              name: $scope.name,
              parentId: $scope.parentId,
              description: $scope.description
            });
            if (flag == 1) {
              $scope.saveRoleAndJurisdiction(items.sysRole);
            }
          }else{
            //TODO
            alert("请联系系统管理员");
          }
        });
      } else {
        //表示新增
        $scope.createRoleService({
          "parentId": $scope.parentId.id,
          "name": $scope.name,
          "description": $scope.description
        }).success(function(result) {
          //请求成功
          if (result.code == LoginConfig.commonConStant.SUCCESS) {
            $modalInstance.close(result.result);
            if (flag == 1) {
              $scope.saveRoleAndJurisdiction(result.result);
            }
          }else{
            //TODO
            alert("请联系系统管理员");
          }
        });
      }
    }
  };
  //保存和分配权限
  $scope.saveRoleAndJurisdiction = function(sysRole) {
    var popupJurisdictionModal = $modal.open({
      templateUrl: 'views/pages/role_management/role_management_popup2.html',
      controller: 'PopupJurisdictionModalCtrl',
      size: 'lg',
      resolve: {
        items: function() {
          return {
            sysRole: sysRole
          }
        }
      }
    });
  };

  //取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

});

//权限
angular.module('sbAdminApp').controller('PopupJurisdictionModalCtrl', function($scope, $modal, $modalInstance, $log, LoginConfig, LoginService, DictionaryConfig, $state, items) {
  
  //定义修改角色Service
  $scope.editRoleService = LoginService.editRole;
  //从角色中取得所有的权限
  $scope.sysPermissionsList = angular.copy(DictionaryConfig.sysPermissionsContant);
  //取得权限默认值
  if(items.sysRole && items.sysRole.perIds){
    $scope.sysPermissionsList.forEach(function(val) {
      val.subList.forEach(function(val1) {
        if (items.sysRole.perIds.indexOf(val1.id) > -1) {
          val1.selected = true;
        } else {
          val1.selected = false;
        }
      });
    });
  }
  //点击保存
  $scope.savePermission = function() {
    //取得所选中的权限
    $scope.pValue = "";
    var isFirst = true;
    $scope.sysPermissionsList.forEach(function(val) {
      val.subList.forEach(function(val1) {
        if (val1.selected) {
          if (!isFirst) {
            $scope.pValue += ",";
          }
          $scope.pValue += val1.id;
          isFirst = false;
        }
      });
    });
    //更新权
    $scope.editRoleService({
      "id": items.sysRole.id,
      "perIds": $scope.pValue
    }).success(function(result) {
      //请求成功
      if (result.code == LoginConfig.commonConStant.SUCCESS) {
        items.sysRole.perIds = $scope.pValue;
        $modalInstance.dismiss('cancel');
      }else{
        //TODO
        alert("请联系系统管理员");
      }
    });
  };

  //取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});