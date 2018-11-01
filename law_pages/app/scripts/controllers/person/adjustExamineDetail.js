'use strict';
var app = angular.module('sbAdminApp');
angular.module('sbAdminApp').controller('adjustExamineDetailCtrl', function ($scope, $stateParams,$log, AdjustService, $state, $modal, DictionaryConfig, $location, $filter, LoginService,toaster,AdjustConfig,$rootScope) {

    //查询调解Service
    $scope.adjustService = AdjustService;
    //调解ID
    $scope.adjustId = $stateParams.adjustId;
    //查询调解员
    $scope.selectSecondInstanceUserService = $scope.adjustService.selectSecondInstanceUser;
    //
    $scope.allocationMediationPersonnel = $scope.adjustService.allocationMediationPersonnelService;

    //内部常量
    $scope.CONSTANT = {
        "messageRemarkNull": "请您输入审批意见",
        "messageReceiveDateNull": "收件日期不能为空",
        "messageIsAgreeNull": "请您选择审批意见",
        "mediationPersonnel":"调解员不能为空！"
    };

    var level = {
        "warn": "warn",
        "error": "error",
        "success": "success"
    };
    var title = {
        "error": "错误",
        "success": "成功"
    };

    //日期处理,提交时
    function dealDate1() {
        if($scope.law.adjustDate) $scope.law.adjustDate =  $filter('date')($scope.law.adjustDate, 'yyyy-MM-dd HH:mm:ss');
        if($scope.law.receiveDate) $scope.law.receiveDate =  $filter('date')($scope.law.receiveDate, 'yyyy-MM-dd HH:mm:ss');
        if($scope.law.filingDate) $scope.law.filingDate =  $filter('date')($scope.law.filingDate, 'yyyy-MM-dd HH:mm:ss');
        if($scope.law.courtDate) $scope.law.courtDate = $filter('date')($scope.law.courtDate, 'yyyy-MM-dd HH:mm:ss');
    }

    //查询调解单
    if ($scope.adjustId) {
        $scope.adjustService.queryAdjust({
            "id": $scope.adjustId
        }).success(function(result) {
            var data = result.result;
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                $scope.law = data;
                $scope.law.name = $stateParams.name;
                if($scope.law.adjustReturn || $scope.law.adjustReturnRemark){
                    $scope.law.adjustReturn = '';
                    $scope.law.adjustReturnRemark = '';
                }
                //查询调解员集合
                queryAdjustPersonList($scope.law.adjustPointCode);
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
    }

    function queryAdjustPersonList(deptId){
        $scope.selectSecondInstanceUserService({
            "deptId": deptId
        }).success(function(result) {
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                $scope.adjustPersonList = result.result;

                $log.info(result.result);
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
    }
    //日历打开,收件日期
    $scope.open = function ($event, law) {
        $event.preventDefault();
        $event.stopPropagation();
        law.opened = true;
        law.openedFiling = false;
        law.openedCourt = false;
    };

    //更换人员列表
    $scope.changePerson = function (){
        var currentPerson = _.find($scope.adjustPersonList,{id:$scope.law.adjustPersonId});
        $scope.law.adjustName = currentPerson.name;
    }


    //从session中获取组织人员
    $scope.getCurrentOrg = function () {
        //根据组织机构获取人员列表
        $scope.$on('user2Child', function(){
            initOrg();
        });
        if (LoginService.user.userPermissions) {
            initOrg();
        }
    };
    //初始化用户刷新
    function initOrg(){
        $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
        $scope.sysUser = LoginService.user.sysUser;
    }

    $scope.getCurrentOrg();


    //定义流程主表信息
    var WorkFlow = function() {
        this.type = "002";
        this.serialNo = $scope.law.serialNo;
        this.operatorId = $scope.sysUser.id;
        this.operatorName = $scope.sysUser.text;
        this.orgName = $scope.userDepart.orgName;
        this.remark = $scope.law.adjustReturnRemark;
        this.jyAdjustInfoId = $scope.law.id;
        this.tempData = "";
        this.result = $scope.law.adjustReturn == '1'? '0':'1';
        this.resultName = $scope.law.adjustReturn == '1'?"审核同意":"驳回审核";
        this.remark = $scope.law.adjustReturnRemark;
    };


    //封装流程信息
    $scope.packageWorkFlowData = function(){
        //主表
        $scope.workFlow = new WorkFlow();
        //业务表
        var tempData = new DictionaryConfig.workFlowData();
        //收件日期
        tempData.receiveDate = $scope.law.receiveDate;
        //驳回
        if($scope.law.adjustReturn == '1'){
            $scope.workFlow.resultName = "同意审批";
        }else{
            $scope.workFlow.resultName = "驳回审批";
        }
        tempData.adjustOrgName = $scope.law.adjustOrgName;
        tempData.adjustPointName = $scope.law.adjustPointName;
        tempData.serialNo = $scope.law.serialNo;
        tempData.applyTotal = $scope.law.applyTotal;
        tempData.personName = $scope.law.personName;

        $scope.workFlow.tempData = JSON.stringify(tempData);
    };

    //插入流程表
    $scope.insertWorkFlow = function(){
        //封装流程表
        $scope.packageWorkFlowData();
        $log.info($scope.workFlow);
        //插入流程表信息
        $scope.adjustService.insertJyWorkFlow($scope.workFlow).success(function(result) {
            console.log(result);
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                var sendInfo = angular.toJson({type:$scope.state,adjustReturn:$scope.law.adjustReturn});
                $state.go("dashboard.pending_complete",{pageInfo:sendInfo});
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
    };



    //提交
    $scope.approvalSubmit = function () {
        if($scope.law.adjustReturn == 1){
            dealDate1();
            //收案时间
            if(!$scope.law.receiveDate){
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageReceiveDateNull);
                $('[name="receiveDate"]').focus();
                return false;
            }
            //调解员
            if(!$scope.law.adjustPersonId){
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.mediationPersonnel);
                $('[name="courtId"]').focus();
                return false;
            }
        }
        //审批意见
        if(!validateApprovalOpinionForm()){
            return false;
        }
        if(!confirm("确认提交？")){
            return false;
        }
        //提交之前的状态
        $scope.state = $scope.law.state;
        //提交之后的状态
        $scope.law.state = $scope.law.adjustReturn == '1'?'1000':'2000';
        if ($scope.law.receiveDate) $scope.law.receiveDate = $filter('date')($scope.law.receiveDate, 'yyyy-MM-dd HH:mm:ss');
        $scope.allocationMediationPersonnel($scope.law).success(function (result){
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                $scope.law.serialNo = result.result.serialNo;
                //插入流程表
                $scope.insertWorkFlow();
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        });
    };

    //驳回时必须填,意见
    function validateOverrule() {
        if($scope.law.adjustReturn == 2 && !$scope.law.adjustReturnRemark){
            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageRemarkNull);
            $('[name="remark"]').focus();
            return false;
        }
        return true;
    }
    //审批意见
    function validateApprovalOpinionForm(){
        //审批意见
        if($scope.law.adjustReturn == null){
            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageIsAgreeNull);
            return false;
        }else{
            if(!validateOverrule()){
                return false;
            }
        }
        return true;
    }

    //跳转查询卷宗
    $scope.adjustInfoDetail = function(){
        var url = $state.href("dossierDetail",{serialNo:$scope.law.serialNo,id:$scope.law.id});
        window.open(url,'_blank');
    };
    //查询证据
    $scope.queryEvidence = function(){
        var url = $state.href("evidence_detail",{serialNo:$scope.law.serialNo,id:$scope.law.id});
        window.open(url,'_blank');
    };

    //查询跟踪流程
    $scope.queryTrackInfo = function(){
        var url = $state.href("queryTrackInfo",{serialNo:$scope.law.serialNo,id:$scope.law.id});
        window.open(url,'_blank');
    };


});