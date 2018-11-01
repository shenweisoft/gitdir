/**
 * Created by Administrator on 2018/5/24.
 */
var app = angular.module('sbAdminApp');
app.filter('str2JsonContent', function() {
    return function(extPro) {
        var obj = JSON.parse(extPro);
        return obj.regionName;
    }
});
app.controller('PoliceSysOrgListCtrl', function($scope, LoginService,LoginConfig,$log,toaster,$state,$modal, AdjustConfig,$rootScope) {

    //定义查询组织Service
    $scope.queryCourtOrgService = LoginService.selectCourtOrPolice;

    //刷新组织 只要交警数据
    $scope.refreshOrgList = function(){
       // var regex = new RegExp('#05', 'g'); // 使用g表示整个字符串都要匹配
        $scope.sysOrgViewList = $scope.sysOrgList.filter(function(v) {
            if($scope.searchArea){
                if(v.text.indexOf($scope.searchArea) > -1){
                    return v;
                }
            }else{
                if(v.category == '#05' ){
                    return v;
                }
            }
        })
    };

    $scope.$on('saveSuccess', function () {
        $scope.refreshOrgList();
    });

    //查询组织数据
    $scope.queryCourtOrgService().success(function(result) {
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
            $log.info(result);
            $scope.sysOrgList = result.result;
            //过滤组织
            $scope.refreshOrgList();
        }else{
            $rootScope.toaster("error", "错误", result.message);
        }
    });
    //关联机构设置
    $scope.relationSysOrg = function(sysOrg,type){
        $state.go("dashboard.policeSysOrgRelation",{orgId:sysOrg.id,orgName:sysOrg.text,type:type});
    };

});
