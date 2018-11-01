angular.module('sbAdminApp').directive('headerRight', function() {
  return {
    templateUrl: 'scripts/directives/header/header-notification/header-right.html',
    restrict: 'E',
    replace: true,
    controller: function($scope, LoginService, $state,LoginConfig,$log) {

      //定义菜单显示常量
      $scope.ORGANIZATION_CONSTANT = {
        "citizenHide": "1"//如果为公民或者管理员隐藏组织字段
      }
      //定义退出Service
      $scope.logoutService = LoginService.logout;
      //定义查询用户SessionService
      $scope.queryUserInfoService = LoginService.queryUserInfo;
      //定义更新sessionService
      $scope.updateUserSessionService = LoginService.updateUserSession;

      //退出方法
      $scope.logout = function() {
        if(confirm('是否确认退出？')) {
          $scope.logoutService({}).success(function(result) {
            if(sessionStorage.getItem("jtsptLoginType") == '5'){
                $state.go("policeLogin",{type:sessionStorage.getItem("jtsptLoginType")});
            }else {
                $state.go("home_page.homeContent");
            }
          });
        }
      };
      //权限权限是否为公民
      function handlePermissions(){

        $scope.backendData = $scope.user.userPermissions;
        if($scope.backendData == 'citizen' || $scope.user.sysUser.loginAccount == 'admin'){
          $scope.citizenHide = $scope.ORGANIZATION_CONSTANT.citizenHide;
          if($scope.backendData == 'citizen'){
            $scope.huouseShow = true;
          }
        }
      }

      function init(){
        $scope.user  = LoginService.user;
        $scope.head = $scope.user.sysUser.head?LoginConfig.pictureConstant.smallPictureUrl + $scope.user.sysUser.head:"views/images/img01.jpg";
        $scope.currentOrg =  $scope.user.sysUser.userDepartList[$scope.user.sysUser.currentOrg];
        //取得权限
        handlePermissions();
      }

      //获取用户
      if(LoginService.user.userPermissions){
        init();
      }
      $scope.$on('user2Child', function(event){
        init();
      });
      //选择组织
      $scope.chooseOrganization = function (index) {
        //更新session
        $scope.updateUserSessionService({
          index:index
        }).success(function(result){
          if (result.result) {
            $scope.currentOrg =  $scope.user.sysUser.userDepartList[index];
            //返回map进行赋值对象
            $scope.user = result.result;
            LoginService.user = result.result;
            $scope.$emit('user2Root');
          }
        });
      };
      $scope.goHome = function () {
        $state.go("home_page.homeContent");
      }
    }
  }
});