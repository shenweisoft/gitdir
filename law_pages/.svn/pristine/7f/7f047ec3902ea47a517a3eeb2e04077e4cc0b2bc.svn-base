/**
 * Created by shenwei on 2017/4/13.
 */
angular.module('sbAdminApp').controller('CourtListCtrl', function($scope, LoginService,LoginConfig,$log,toaster,$state,$modal,$stateParams, $rootScope) {
    //组织名称
    $scope.orgName = $stateParams.orgName;
    //查询
    $scope.queryOrgCourtByOrgIdService = LoginService.queryOrgCourtByOrgId;
    //删除
    $scope.deleteSysOrgCourtByIdService = LoginService.deleteSysOrgCourtById;
    //查询法庭集合
    $scope.queryOrgCourtByOrgIdService({
        orgId:$stateParams.orgId
    }).success(function(result) {
        $log.info(result);
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
            $scope.sysOrgCourtList = result.result;
        }else{
          $rootScope.toaster("error", "错误", result.message);
        }
    });
    //新建法庭
    $scope.newCourt = function(sysOrgCourt) {
        var newCourtPopup= $modal.open({
          templateUrl: 'views/pages/organize_manage/newCourt.html',
          controller: 'newCourtCtrl',
          size: '',
          resolve: {
            items: function() {
              return {
                  orgId: $stateParams.orgId,
                  sysOrgCourt:sysOrgCourt
              }
            }
          }
        });
        //返回值
        newCourtPopup.result.then(function(data) {
            $scope.sysOrgCourtList.push(data);
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    //删除法庭
    $scope.deleteCourt = function(sysOrgCourt){

        if(confirm("您确认删除么？")){
            $scope.deleteSysOrgCourtByIdService({
                id:sysOrgCourt.id
            }).success(function(result) {
                if (result.code == LoginConfig.commonConStant.SUCCESS) {
                    var tempIndex;
                    $scope.sysOrgCourtList.filter(function(val, index) {
                        if (val.id == sysOrgCourt.id) {
                            tempIndex = index;
                            return true;
                        }
                        return false;
                    });
                    $scope.sysOrgCourtList.splice(tempIndex, 1);
                }else{
                  $rootScope.toaster("error", "错误", result.message);
                }
            });
        }
    }
});

angular.module('sbAdminApp').controller('newCourtCtrl', function($scope, items ,$modalInstance,LoginConfig,LoginService,$log,toaster,$rootScope) {

    //更新
    $scope.saveSysOrgCourtService = LoginService.saveSysOrgCourt;
    //定义法庭对象
    var SysOrgCourt = function(){
        //主键
        this.id = "";
        //组织ID
        this.orgId = items.orgId;
        //法庭名称
        this.courtName = "";
        //排序
        this.sort = "";
        //是否启用 默认启用
        this.enable = "1";
    };
    //如果存在则修改
    if(items.sysOrgCourt){
        $scope.sysOrgCourt = items.sysOrgCourt;
    }else{
        $scope.sysOrgCourt = new SysOrgCourt();
    }

    //定义错误信息常量
    $scope.CONSTANT = {
        "courtNameErrorMessage": "请您输入法庭名称",
        "sortErrorMessage": "请您输入排序",
        "sortError":"请您输入数字"
    };

    //验证表单
    function validateForm(){
        //法庭名称
        if(!$scope.sysOrgCourt.courtName){
            $rootScope.toaster("error", "错误", $scope.CONSTANT.courtNameErrorMessage);
            $("input[name='courtName']").focus();
            return false;
        }
        //序号
        if(!$scope.sysOrgCourt.sort){
            $rootScope.toaster("error", "错误", $scope.CONSTANT.sortErrorMessage);
            $("input[name='sort']").focus();
            return false;
        }else{
            var reg = new RegExp("^[0-9]*$");
            if(!reg.test($scope.sysOrgCourt.sort)){
                $rootScope.toaster("error", "错误", $scope.CONSTANT.sortError);
                $("input[name='sort']").focus();
                return false;
            }
        }
        return true;
    }

    //保存
    $scope.saveSysOrgCourt = function(){
        //验证表单
        if(validateForm()){
            $log.info($scope.sysOrgCourt);
            $scope.saveSysOrgCourtService($scope.sysOrgCourt).success(function(result) {
                if (result.code == LoginConfig.commonConStant.SUCCESS) {
                    $log.info(result);
                    if(!$scope.sysOrgCourt.id){
                        $scope.sysOrgCourt.id = result.result;
                        $modalInstance.close($scope.sysOrgCourt);
                    }else{
                        $modalInstance.dismiss('cancel');
                    }
                }else{
                  $rootScope.toaster("error", "错误", result.message);
                }
            });
        }
    }
    //点击取消
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

});