/**
 * Created by shenwei on 2017/5/11.
 */
'use strict';
var app = angular.module('sbAdminApp');
app.filter('stringDate', function() {
    return function(dt) {
        if(typeof (dt) == "string")
        {
            dt = dt.replace(/\-/gi,"\/");
            dt = Date.parse(dt);
        }
        return dt && dt;
    }
});
app.filter('id2AppraisalItem', function() {
    return function(idStr,data) {
        var str = "";
        var isFirst = true;
        // if(idStr && (idStr.indexOf(',') !== -1)){
        if(idStr && idStr != '' && idStr.split(',').length > 0){
            idStr.split(",").forEach(function(val){
                if(!isFirst){
                    str += ",";
                }
                var result = _.find(data, {id: val});
                str += result.value;
                isFirst = false;
            });
        }
        return str? str:""
    }
});
angular.module('sbAdminApp').controller('AppraisalReturnListCtrl', function($scope, LoginService,$stateParams, $state,$http, $log, AppraisalConfig,AppraisalService,DictionaryConfig,toaster,$location,$rootScope) {
    //鉴定项目集合
    $scope.appraisalItemList = DictionaryConfig.appraisalItemList;
    //查询数据Service
    $scope.queryAppraisalDetailListService = AppraisalService.queryAppraisalDetailList;
    //查询分页信息Service
    $scope.queryAppraisalDetailCountService = AppraisalService.queryAppraisalDetailCount;
    //获取url
    var url = $location.url();
    var arr =url.split("/");
    $scope.url = arr[arr.length-1];
    //封装输入对象
    function SearchVO() {
        this.state = DictionaryConfig.appraisalDetailState.returnState;
        this.searchArea = "";
        this.lawOrgId = "";
        //每页条数
        this.pageSize = DictionaryConfig.pageNum;
        //当前页数 默认为第一页
        this.pageNo = 1;
        //总共页数 默认一页
        this.totalPage = 1;
    }
    //初始化对象
    $scope.searchVO = new SearchVO();
    //得到组织并初始化集合数据
    function initData(){
        //获取部门信息
        $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
        $scope.sysUser = LoginService.user.sysUser;
        $scope.searchVO.lawOrgId = $scope.userDepart.orgId;
        $log.info($scope.searchVO);
        //查询数据
        $scope.queryAppraisalDetailListService($scope.searchVO).success(function (result) {
            if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                $log.info(result.result);
                $scope.appraisalDetailInfoList = result.result;
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        });
        //查询总数
        $scope.queryAppraisalDetailCountService($scope.searchVO).success(function (result) {
            if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                $scope.searchVO.totalPage = result.result;
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        });
    }
    //初始化获取组织
    $scope.initOrg = function () {
        //根据组织机构获取人员列表
        $scope.$on('user2Child', function(){
            initData();
        });
        if (LoginService.user.userPermissions) {
            initData();
        }
    };
    //初始化数据
    $scope.initOrg();

    //查询详细
    $scope.queryDetail = function(appraisalDetailInfo){
        $state.go("dashboard.appraisalReturnDetail",{serialNo:appraisalDetailInfo.serialNo,appraisalDetailInfoId:appraisalDetailInfo.id,appraisalNo:appraisalDetailInfo.appraisalNo,appraisalInfoId:appraisalDetailInfo.jyAppraisalInfoId});
    };
});