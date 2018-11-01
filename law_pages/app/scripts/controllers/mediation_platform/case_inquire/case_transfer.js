'use strict';
var app = angular.module('sbAdminApp');
app.filter('pointFilter', function() {
    return function(arr) {
        var list = [];
        arr && arr.forEach(function (val) {
           var exist =  _.find(list,{deptId:val.deptId});
            if(!exist){
                list.push(val)
            }
        })
      return list &&　list
    }
});
app.filter('pointPersonFilter', function() {
    return function(arr,pointId) {
        arr = arr &&  arr.filter(function (val) {
                var insuranceCompany = val.insuranceCompany ? '('+val.insuranceCompany+')':''
              val.adjustName =   val.name +insuranceCompany;
            return val.deptId == pointId
        })
        return arr
    }
});
angular.module('sbAdminApp').controller('CaseTransferCtrl', function ($scope, $stateParams,$log, items,$modalInstance,AdjustService, $state, $modal, DictionaryConfig, $location, $filter, LoginService,toaster,AdjustConfig,$rootScope) {


    $scope.items = items;
    $scope.adjust = items.law;
    //查询调解Service
    $scope.adjustService = AdjustService;
    //调解ID
    $scope.adjustId = $stateParams.adjustId;
    //查询调解员
    $scope.selectSecondInstanceUserService = $scope.adjustService.selectSecondInstanceUser;
    //查询调解员
    $scope.selectSysUserOrDeptOrOrgByOrgIdService = $scope.adjustService.selectSysUserOrDeptOrOrgByOrgId;
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
    if ($scope.adjust.id) {
        $scope.adjustService.queryAdjust({
            "id": $scope.adjust.id
        }).success(function(result) {
            var data = result.result;
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                $scope.law = data;
                $scope.law.name = $stateParams.name;
                //查询调解员集合
                queryAdjustPersonList($scope.law.adjustOrgCode);
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
    }

    function queryAdjustPersonList(orgId){
        $scope.selectSysUserOrDeptOrOrgByOrgIdService({
            "orgId": orgId
        }).success(function(result) {
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                $scope.adjustPersonList = result.result;

                $log.info(result.result);
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
    }

    //更换人员列表
    $scope.changePoint = function (){
        var currentPerson = _.find($scope.adjustPersonList,{deptId:$scope.law.beforeAdjustPointCode});
        $scope.adjustPointName = $scope.law.adjustPointName;
        $scope.law.adjustPointName = currentPerson.deptName;
        $scope.law.beforeAdjustPointName = $scope.adjustPointName;
    }
    //更换人员列表
    $scope.changePerson = function (){
        var currentPerson = _.find($scope.adjustPersonList,{id:$scope.law.beforePersonnelId});
        $scope.adjustName = $scope.law.adjustName;
        $scope.law.adjustName = currentPerson.name;
        $scope.law.beforePersonnelName = $scope.adjustName;
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
        this.type = "003";
        this.serialNo = $scope.law.serialNo;
        this.operatorId = $scope.sysUser.id;
        this.operatorName = $scope.sysUser.text;
        this.orgName = $scope.userDepart.orgName;
        this.jyAdjustInfoId = $scope.law.id;
        this.tempData = "";
        this.result = '0';
        this.resultName = '案件转交';
    };

    //封装流程信息
    $scope.packageWorkFlowData = function(){
        //主表
        $scope.workFlow = new WorkFlow();
        //业务表
        var tempData = new DictionaryConfig.workFlowData();
        //收件日期
        tempData.receiveDate = $scope.law.receiveDate;
        tempData.adjustOrgName = $scope.law.adjustOrgName;
        tempData.adjustPointName = $scope.law.adjustPointName;
        tempData.serialNo = $scope.law.serialNo;
        tempData.applyTotal = $scope.law.applyTotal;
        tempData.personName = _.find($scope.adjustPersonList,{id:$scope.law.beforePersonnelId}).name;

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
                $modalInstance.close();
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
    };



    //提交
    $scope.approvalSubmit = function () {
        if(!$scope.law.beforeAdjustPointCode){
            $rootScope.toaster(level.error, title.error, "请选择调解点");
            return false;
        }
        if(!$scope.law.beforePersonnelId){
            $rootScope.toaster(level.error, title.error, "请您选择调解员");
            return false;
        }
        if(!confirm("确认转交？")){
            return false;
        }
        //提交之前的状态
        $scope.state = $scope.law.state;
        //提交之后的状态
        $scope.law.state = '2002';
        //拿出来上次保存的用户id
        $scope.adjustPersonId = $scope.law.adjustPersonId;
        $scope.adjustPointCode = $scope.law.adjustPointCode;
        //这次的id覆盖上次保存的id
        $scope.law.adjustPersonId = $scope.law.beforePersonnelId;
        $scope.law.adjustPointCode = $scope.law.beforeAdjustPointCode;

        $scope.law.adjustPointName = (_.find($scope.adjustPersonList,{deptId:$scope.law.adjustPointCode})).deptName;
        //拿出来上次的id覆盖
        $scope.law.beforePersonnelId = $scope.adjustPersonId;
        $scope.law.beforeAdjustPointCode = $scope.adjustPointCode;
        $scope.allocationMediationPersonnel($scope.law).success(function (result){
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                //插入流程表
                $scope.insertWorkFlow();
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

});