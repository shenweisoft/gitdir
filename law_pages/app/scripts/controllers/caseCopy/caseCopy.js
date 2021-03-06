/**
 * Created by design on 2017/9/20.
 */
app.filter('statisticalValueNull', function () {
    return function (dt) {
        return dt && dt || '-';
    };
});
angular.module('sbAdminApp').controller('CaseCopyCtrl', function($scope, $log, $http, $state,$stateParams, $filter, $modal, $timeout, DictionaryConfig, LoginService,LawService, LawConfig,LoginConfig, AdminConstant, IncomeNormConstant, CompensateStandardConstant, Upload, toaster,AdjustService,InterfaceService,AdjustConfig,$rootScope) {

    $scope.caseCopy = function () {
        //复制案件
        AdjustService.serialNoCaseCopy({
            serialNo : $scope.serialNo,
            loginAccount : $scope.loginAccount,
            state : $scope.state
        }).success(function (result) {
            console.log("11")
            console.log(result)
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                $rootScope.toaster("success", "复制成功");
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        });
    };
    $scope.caseDelete = function() {
        //删除案件
        AdjustService.caseDelete({
            serialNo : $scope.serialNo,
            loginAccount : $scope.loginAccount,
            state : $scope.state
        }).success(function(result){
            if (result.result === 1) {
                $rootScope.toaster("success", "删除成功");
            }else if (result.result === 2) {
                $rootScope.toaster("error", "没有此流水号的案件信息！");
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        });
    };
    $scope.caseDeleteJyAppraisal = function() {
        //删除鉴定
        AdjustService.deleteSerialNoJyAppraisalService({
            serialNo : $scope.serialNo,
            loginAccount : $scope.loginAccount,
            state : $scope.state
        }).success(function(result){
            if (result.result === 1) {
                $rootScope.toaster("success", "删除鉴定成功");
            }else if (result.result === 2) {
                $rootScope.toaster("error", "没有此流水号的鉴定信息！");
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        });
    };
    $scope.caseModify = function() {
        //案件退回
        AdjustService.caseModify({
            serialNo : $scope.serialNo,
            loginAccount : $scope.loginAccount,
            state : $scope.state
        }).success(function(result){
            if (result.result === 1) {
                $rootScope.toaster("success", "修改成功");
            }else if (result.result === 2) {
                $rootScope.toaster("error", "没有此流水号的案件信息！");
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        });
    };
    $scope.modificationPassWord = function() {
        //修改密码
        AdjustService.modificationPassWordService({
            serialNo : $scope.serialNo,
            loginAccount : $scope.loginAccount,
            state : $scope.state
        }).success(function(result){
            if (result.result === 1) {
                $rootScope.toaster("success", "修改成功");
            }else if (result.result === 2) {
                $rootScope.toaster("warn", "账号不存在！");
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        });
    };
    $scope.modificationLogin = function() {
        //修改登陆账号
        AdjustService.modificationLoginService({
            serialNo : $scope.serialNo,
            loginAccount : $scope.loginAccount,
            state : $scope.state
        }).success(function(result){
            if (result.result === 0) {
                $rootScope.toaster("success", "修改成功");
            }else if (result.result === 1) {
                $rootScope.toaster("error", "没有此账号信息！");
            }else if (result.result === 2) {
                $rootScope.toaster("error", "要修改的账号已存在！");
            }else if (result.result === 3) {
                $rootScope.toaster("error", "有无用的账号信息，已删除！");
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        });
    };


    $scope.queryCase = function() {
        //调解中
        // var url = $state.href("dashboard.case_details",{serialNo:$scope.serialNo});
        // window.open(url,'_blank');
        if($scope.serialNo){
            $state.go('dashboard.case_details', {serialNo: $scope.serialNo});
        }else{
            $rootScope.toaster("error", "错误", "请出入流水号");
        }
    };

    //推送案件信息审判系统
    $scope.sendCaseToJudge = function(){
        InterfaceService.sendClosedCaseToJudge({
            serialNo : $scope.serialNo
        }).success(function(result){
            if (result.code == LawConfig.commonConstant.SUCCESS) {
                $rootScope.toaster("success", "推送成功");
            }else{
                $rootScope.toaster("error", "推送失败", "请查询原因");
            }
        })
    };

    $scope.loginAccountRelieveIsLock = function() {
        //账号解除锁定
        AdjustService.loginAccountRelieveIsLockService({
            loginAccount : $scope.loginAccount
        }).success(function(result){
            if (result.code === LoginConfig.commonConStant.SUCCESS) {
                if(result.result == 0){
                    $rootScope.toaster("error", "该账号不存在！");
                }else{
                    $rootScope.toaster("success", "账号解除锁定");
                }
            }
        });
    };


    //=============================================

    function  Fold() {
        this.orgName = true;
        this.applyMediationCase = true;
        this.mediationMiddleCase = true;
        this.mediationMiddleComplete =true;
        this.mediationSuccessCase =true;
        this.mediationFailureCase =true;
        this.mediationSuccessApplyMoney =false;
        this.mediationSuccessMoney =false;
        this.newLitigationCase =false;
        this.newJudicialCase =false;
        this.endLitigationCase =false;
        this.endJudicialCase =false;
        this.judicialCase =true;
        this.judicialCaseMoney =false;
        this.litigationCase =true;
        this.mediationSuccessRate =true;
        this.claimCase =false;
        this.claimApplyMoney =false;
        this.claimSuccessApplyMoney =false;
        this.claimSuccessCompensateMoney =false;
    }
    $scope.fo = new Fold();

    //改变显示列表
    $scope.listChangeStatistical = function (show) {
        var statisticalCount = 0;
        for(var i in $scope.fo){
            if ($scope.fo.hasOwnProperty(i)) {
                if($scope.fo[i]){
                    statisticalCount ++;
                }
            }
        }

        if(statisticalCount > 8){
            confirm("最多只能选择8个字段");
            $scope.fo[show] = false;
        }
    }


    //定义案件类型
    $scope.lawStateList = [
        {
            name: "基层法院",
            type: "1"
        }, {
            name: "中级法院",
            type: "2"
        }, {
            name: "高级法院",
            type: "3"
        }
    ];

    //定义数据对象
    var DataStatistics = function () {
        //开始时间
        this.searchAdjustStartDate = "";
        //结束时间
        this.searchAdjustEndDate = "";
        //法院类型
        this.type = "";
        //法院名称
        this.orgName = "";
        //保险公司名称
        this.companyName = "";
        //保险公司名称
        this.regionName = "";
        //每页条数
        this.pageSize = DictionaryConfig.pageNum;
        //当前页数 默认为第一页
        this.pageNo = 1;
    };
    $scope.dataStatistics = new DataStatistics();

    //开始日期（日期插件）
    $scope.searchAdjustStartDate = false;
    $scope.openStartDate = function($event, index) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.searchAdjustStartDate = true;

    };
    //结束日期（日期插件）
    $scope.searchAdjustEndDate = false;
    $scope.openEndDate = function($event, index) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.searchAdjustEndDate = true;
    };
    //获取当前日期
    $scope.currentTime = new Date();
    //格式化日期数据
    $scope.formatDate = function (date) {
        if(typeof date != 'string') {
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDate();
            return year+'-'+month+'-'+day;
        }
        return date;
    };

    //查询数据统计
    $scope.queryDataStatistics = function (){
        $scope.dataStatistics.searchAdjustStartDate = $scope.formatDate($scope.dataStatistics.searchAdjustStartDate);  //格式化开始日期
        $scope.dataStatistics.searchAdjustEndDate = $scope.formatDate($scope.dataStatistics.searchAdjustEndDate);   //格式化结束日期
        //列表
        AdjustService.queryDataStatisticsService($scope.dataStatistics).success(function(result){
            if (result.code === LoginConfig.commonConStant.SUCCESS) {
                console.log(result.result);
                $scope.dataStatisticsList = result.result;
            } else {
                $rootScope.toaster("error", "错误","查询出错");
            }
        });
        /*//数量
        AdjustService.queryDataStatisticsCountService($scope.dataStatistics).success(function(result){
            var data = result.result;
            if (result.code === LoginConfig.commonConStant.SUCCESS) {
                $scope.dataStatistics.totalPage = data;
            } else {
                $rootScope.toaster("error", "错误","查询数量出错");
            }
        });*/
    };
    //查询高院数据统计
    $scope.queryHighDataStatistics = function (){

        AdjustService.queryHighDataStatisticsService($scope.dataStatistics).success(function(result){
            if (result.code === LoginConfig.commonConStant.SUCCESS) {
                console.log(result.result);
                $scope.highDataStatisticsList = result.result;
            } else {
                $rootScope.toaster("error", "错误","查询出错");
            }
        });
    };

    //查询高院人员数据统计
    $scope.queryPersonDataStatistics = function (){
        $scope.dataStatistics.searchAdjustStartDate = $scope.formatDate($scope.dataStatistics.searchAdjustStartDate);  //格式化开始日期
        $scope.dataStatistics.searchAdjustEndDate = $scope.formatDate($scope.dataStatistics.searchAdjustEndDate);   //格式化结束日期
        //列表
        AdjustService.queryPersonDataStatisticsService($scope.dataStatistics).success(function(result){
            if (result.code === LoginConfig.commonConStant.SUCCESS) {
                console.log(result.result);
                $scope.personDataStatisticsList = result.result;
            } else {
                $rootScope.toaster("error", "错误","查询出错");
            }
        });
    };

    $scope.pageChanged = function(){
        $scope.queryDataStatistics();
    };

    //导出Excel
    $scope.exportExcel = function(){
        return AdjustConfig.adjustConStant.exportExcelServiceUrl+"?type="+$scope.dataStatistics.type+"&state=&courtCode=&orgId=&courtName="+$scope.dataStatistics.orgName+"&companyName="+$scope.dataStatistics.companyName+"&regionName="+$scope.dataStatistics.regionName+"&searchAdjustEndDate="+$scope.dataStatistics.searchAdjustEndDate+"&searchAdjustStartDate="+$scope.dataStatistics.searchAdjustStartDate;
    };
});