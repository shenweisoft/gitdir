'use strict';
/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp').directive('sidebar', ['$location', function() {
  return {
    templateUrl: 'scripts/directives/sidebar/sidebar.html',
    restrict: 'EA',
    replace: true,
    scope: {},
    controller: function($scope, LoginService, DictionaryConfig, $log,PrejudgeService,PrejudgeConfig,$rootScope) {
      //定义菜单显示常量
      $scope.MENU_CONSTANT = {
          "citizenShow": "1" //显示我要起诉/我要应诉
        }
        //定义查询用户SessionService
      $scope.queryUserInfoService = LoginService.queryUserInfo;
      //取得当前系统的菜单 TODO shoud be removed later!
      //$scope.menuList = DictionaryConfig.menuSystemList;

      //定义用户权限
      var backendData;
      if (!LoginService.user.userPermissions) {
        //从LoginService中获取user用户
        $scope.queryUserInfoService().success(function(result) {
          if (result.result) {
            //用户赋值
            LoginService.user = $scope.user = result.result;
            backendData = $scope.user.userPermissions;
            $scope.$emit('user2Root');
            handlePermission(backendData);
          }
        })
      } else{
       
        $scope.user = LoginService.user;
       
        backendData = $scope.user.userPermissions;
        handlePermission(backendData);
      }

      //处理返回的权限是否为citizen,如果为空则显示申请人和被申请人的菜单
      function handlePermission(backendData) {
        if (backendData == 'citizen') {
         
          $scope.menuList = DictionaryConfig.menuCommonList;
          $scope.citizen = $scope.MENU_CONSTANT.citizenShow;
        } else {
          constructMenu();
        }
      }

      //根据权限查询需要的菜单
      function constructMenu() {
        //组建新的Url集合
        var urlArray = [];
        //将所有URL的ID放入到urlArray中 8.1，8.2
        if (backendData) {
          backendData.forEach(function(val) {
            var sysPermissionsMenu = _.find(DictionaryConfig.sysPermissionsMenuContant, function(item) {
              return item.id == val;
            });
            if(sysPermissionsMenu && sysPermissionsMenu.url) {
              urlArray.push(sysPermissionsMenu.url);
            }
          });
        }
        //组建新的MenuArrayTree
        $scope.menuArray = [];
        //设置默认父节点根据其进行判断
        $scope.parentSeqArray = [];
        //去掉重复数据
        urlArray = _.union(urlArray);
        //循环URL
        urlArray.forEach(function(val, index, arr) {
          //通过其子节点的SEQ找到父节点的SEQ的值
          var parentSeq = val.substr(0, val.indexOf("."));
          if(!parentSeq){
            parentSeq = val;
          }
          //通过其子节点的SEQ找到父节点的SEQ的Menu
          var menu = _.find(DictionaryConfig.menuSystemList, function(item) {
            //console.log(item)
            return item.seq == parentSeq;
          });
          //如果Menu存在
          if (menu) {
            //找个这个主节点下的子节点
            var subMenu = _.find(menu.subMenu, function(item) {
              return item.seq == val;
            });
            if(subMenu){
              //如果从来不存在主节点
              if ($scope.parentSeqArray.indexOf(menu.seq) < 0) {
                //创建一个新的Menu
                var newMenu = angular.copy(menu);
                //删除所有的子节点集合
                newMenu.subMenu.splice(0, menu.subMenu.length);
                //赋予新的主节点 子节点的集合
                newMenu.subMenu.push(subMenu);
                //放入到新的菜单集合中
                $scope.menuArray.push(newMenu);
                //更新初始值
                $scope.parentSeqArray.push(newMenu.seq);
              } else {
                //从新的菜单集合中找到主节点
                var menuA = _.find($scope.menuArray, function(item) {
                  return item.seq == parentSeq;
                });
                //将子节点放入其中
                menuA.subMenu.push(subMenu);
              }
            }else{
              $scope.menuArray.push(angular.copy(menu));
            }
          }
        });
        //首页进行初始化
        //var homeElement = DictionaryConfig.menuSystemList[0];
        //是否发起鉴定
        if(LoginService.user.sysUser.userDepartList.length>0){
          $scope.isSendAppraisal = LoginService.user.sysUser.userDepartList[$scope.user.sysUser.currentOrg].isSendAppraisal;
        }
        $scope.menuList = $scope.menuArray;
        //$scope.menuList.unshift(homeElement);
      }
      //鉴定查询
      $scope.isSendAppraisalFn = function(seq){
        if( (seq=="12.2" || seq=='11.3') && $scope.isSendAppraisal=='1'){
              //查询法院是否对接了鉴定系统
              var loginAccount = LoginService.user.sysUser.loginAccount
              var userType = LoginService.user.sysUser.userType
              var data = {
                  serialCode: '-1', //流水号
                  loginAccount: loginAccount,
                  userType: userType,
                  parentOrgName: LoginService.user.sysUser.userDepartList[$scope.user.sysUser.currentOrg].parentOrgName,
              }
              $scope.prejudgeService = PrejudgeService;
              $scope.prejudgeService.identification(data).success(function (result) {
                  if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
                      if (result.result.errorCode == PrejudgeConfig.serviceConstant.SUC_JIANDING) {
                          var url = result.result.openUrl;
                          //查询法院是否对接了鉴定系统请求相对应的方法
                          if(url){
                            window.open(url,"_blank")
                            location.reload();
                          }
                      }else{
                          $rootScope.toaster("error", "提示", result.result.errorMessage);
                      }
                  }else {
                      $rootScope.toaster("error", "错误", result.message);
                  }
              })
        }else{
          $scope.multiCheck(seq)
        }
      }
      $scope.collapseVar = 0;
      $scope.multiCollapseVar = 0;
      $scope.check = function(x) {
        if (x == $scope.collapseVar) $scope.collapseVar = 0;
        else $scope.collapseVar = x;
      };
      $scope.multiCheck = function(y) {
        if (y == $scope.multiCollapseVar) $scope.multiCollapseVar = 0;
        else $scope.multiCollapseVar = y;
      };

      //窄屏更改二级菜单
      $scope.showSubMenu = "";
      $scope.twoLevelMenuShow=false;
      $scope.twoLevelMenu = function(menuName){
        $scope.showSubMenu = menuName;
        $scope.twoLevelMenuShow=true;
      };
    }
  }


}])