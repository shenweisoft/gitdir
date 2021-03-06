/**
 * Created by shenwei on 2017/4/20.
 */
var app = angular.module('sbAdminApp');
app.filter('statisticalValueNull', function () {
    return function (dt) {
        return dt && dt || '0';
    };
});
app.filter('adjustValueNull', function () {
    return function (dt) {
        return dt && dt || '-';
    };
});
app.filter('stateChangeText', function () {
    return function (id, data) {
        var result = _.find(data, {
            id: id
        });
        return result ? result.value : ""
    }
});
angular.module('sbAdminApp').controller('CaseStatisticsListCtrl', function ($scope, $stateParams, $state, $location, $timeout, $http, $log, DictionaryConfig, LawService, $filter, LawConfig,toaster, LoginService, $rootScope, AdjustService, LoginConfig, AdjustConfig) {

    //法律状态集合
    $scope.lawStateList = DictionaryConfig.lawStateList;

    $scope.initStatisticsList = [];
    $scope.courtStatisticsList = [];
    $scope.mediationStatisticsList = [];
    $scope.mediatorStatisticsList = [];
    $scope.adjustDataList = [];

    //日历打开
    $scope.dateOpen = {
        opened:false,
        opened1:false
    };
    //日历打开方法
    $scope.open = function ($event,currentOpen) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.dateOpen[currentOpen] = true;
    };
    //当前日期
    $scope.currentDate = new Date();

    //定义数据对象
    function DataStatistics(){
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
        //每页几条
        this.pageSize = DictionaryConfig.pageNum;
        //第几页
        this.pageNo = 1;
        this.orgId = "";
        this.courtCode = "";
        this.category= "";
    };

    $scope.dataStatistics = new DataStatistics();

    //初始化日期
    $scope.initDate = function(param){
        var now = new Date(); //当前日期
        var nowDayOfWeek = now.getDay(); //今天本周的第几天
        var nowDay = now.getDate(); //当前日
        var nowMonth = now.getMonth(); //当前月
        var nowYear = now.getYear(); //当前年
        nowYear += (nowYear < 2000) ? 1900 : 0;
        if(param == 'day'){
            $scope.dataStatistics.searchAdjustStartDate = new Date();
        }else if(param == 'weekday'){
            $scope.dataStatistics.searchAdjustStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
        }else if(param == 'month'){
            $scope.dataStatistics.searchAdjustStartDate = new Date(nowYear, nowMonth, 1);
        }else if(param == 'year'){
            $scope.dataStatistics.searchAdjustStartDate = new Date(nowYear, 0, 1);
        }
        $scope.dataStatistics.searchAdjustEndDate = new Date();
        $scope.queryStatistics();
    };

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


    function  Fold() {
        this.orgName = true;
        this.applyMediationCase = true;
        this.applyMediationMoney = false;
        this.mediationMiddleCase = true;
        this.mediationMiddleComplete =true;
        this.mediationSuccessCase =true;
        this.mediationFailureCase =true;
        this.mediationSuccessApplyMoney =false;
        this.mediationSuccessMoney =true;
        this.newLitigationCase =false;
        this.newJudicialCase =false;
        this.endLitigationCase =false;
        this.endJudicialCase =true;
        this.judicialCase =true;
        this.judicialCaseMoney =false;
        this.litigationCase =false;
        this.mediationSuccessRate =false;
        this.claimCase =false;
        this.claimApplyMoney =false;
        this.claimSuccessApplyMoney =false;
        this.claimSuccessCompensateMoney =false;
    }
    $scope.fo = new Fold();

    /*//改变显示列表
    $scope.listChangeStatistical = function (show) {
        var statisticalCount = 0;
        for(var i in $scope.fo){
            if ($scope.fo.hasOwnProperty(i)) {
                if($scope.fo[i]){
                    statisticalCount ++;
                }
            }
        }

        if(statisticalCount > 9){
            confirm("最多只能选择9个字段");
            $scope.fo[show] = false;
        }
    };*/

    $scope.queryMediationDataStatistics = function(data){
        if(!data.category){
            $scope.category = $scope.sysUser.userDepartList[0].category;
        }
        if($scope.category == '#01'){
            $scope.dataStatistics.courtCode = data.courtCode;
        }else{
            $scope.dataStatistics.orgId = data.orgId;
        }
        //调解点数据列表
        AdjustService.queryMediationDataStatisticsService($scope.dataStatistics).success(function(result){
            if (result.code === LoginConfig.commonConStant.SUCCESS) {
                console.log(result.result);;
                $scope.mediationStatisticsList = result.result;
                $scope.courtStatisticsList.length = 0;
                $scope.courtStatisticsList.length = 0;
                $scope.mediatorStatisticsList.length = 0;
                $scope.adjustDataList.length = 0;
                $scope.orgName = data.orgName;
            } else {
                $rootScope.toaster("error", "错误","查询出错");
            }
        });
    };

    //查询数据统计
    $scope.queryStatistics = function (){
        $scope.searchAdjustStartDate = $scope.dataStatistics.searchAdjustStartDate;
        $scope.searchAdjustEndDate = $scope.dataStatistics.searchAdjustEndDate;
        // $scope.dataStatistics = new DataStatistics();
        $scope.dataStatistics.searchAdjustStartDate = $filter('date')($scope.searchAdjustStartDate, "yyyy-MM-dd");  //格式化开始日期
        $scope.dataStatistics.searchAdjustEndDate = $filter('date')($scope.searchAdjustEndDate, "yyyy-MM-dd");   //格式化结束日期

        $scope.sysUser = LoginService.user.sysUser;

        $scope.dataStatistics.orgId = $scope.sysUser.userDepartList[0].orgId;
        var orgName = $scope.sysUser.userDepartList[0].orgName;
        $scope.category = $scope.sysUser.userDepartList[0].category;
        //var regionName = $scope.sysUser.regionName.split("-");
        var regionName = JSON.parse(LoginService.user.sysUser.userDepartList[0].extPro).regionName.split("-");
        var a = regionName.length;
        var s = orgName.indexOf("中级");

        if(orgName.indexOf("高级") != -1 && $scope.category == '#01'){
            $scope.dataStatistics.regionName = regionName[0];
            $scope.dataStatistics.type = '3';
        }else if(orgName.indexOf("中级") != -1 && $scope.category == '#01'){
            $scope.dataStatistics.regionName = regionName[1];
            $scope.dataStatistics.type = '2';
            if(regionName[0].indexOf("北京") > -1 || regionName[0].indexOf("上海") > -1 || regionName[0].indexOf("重庆") > -1 || regionName[0].indexOf("天津") > -1){
                $scope.dataStatistics.regionName = regionName[0];
            }
        }else{
            if($scope.category == '#01'){
                $scope.dataStatistics.regionName = '';
                $scope.dataStatistics.type = '1';
            }
            $scope.dataStatistics.category = $scope.category;
        }
        if($scope.category == '#01'){
            //初始化数据列表
            AdjustService.queryInitDataStatisticsService($scope.dataStatistics).success(function(result){
                if (result.code === LoginConfig.commonConStant.SUCCESS) {
                    console.log(result.result);
                    $scope.initStatisticsList = result.result;
                    $scope.orgName = orgName;
                    $scope.courtStatisticsList.length = 0;
                    $scope.mediationStatisticsList.length = 0;
                    $scope.mediatorStatisticsList.length = 0;
                    $scope.adjustDataList.length = 0;
                } else {
                    $rootScope.toaster("error", "错误","查询出错");
                }
            });
        }else{
            $scope.queryMediationDataStatistics($scope.dataStatistics);
        }

    };


    //查询数据统计
    $scope.queryCourtStatisticsList = function (data){
        $scope.searchAdjustStartDate = $scope.dataStatistics.searchAdjustStartDate;
        $scope.searchAdjustEndDate = $scope.dataStatistics.searchAdjustEndDate;
        $scope.dataStatistics = new DataStatistics();
        $scope.dataStatistics.searchAdjustStartDate = $scope.searchAdjustStartDate;
        $scope.dataStatistics.searchAdjustEndDate = $scope.searchAdjustEndDate;
        $scope.dataStatistics.courtCode = data.courtCode;
        $scope.dataStatistics.category = $scope.sysUser.userDepartList[0].category;
        //法院数据列表
        AdjustService.queryDataStatisticsService($scope.dataStatistics).success(function(result){
            if (result.code === LoginConfig.commonConStant.SUCCESS) {
                console.log(result.result);
                if(result.result[0].sdepId){
                    $scope.mediationStatisticsList = result.result;
                    $scope.courtStatisticsList.length = 0;
                }else{
                    $scope.courtStatisticsList = result.result;
                    $scope.mediationStatisticsList.length = 0;
                }
                $scope.initStatisticsList.length = 0;
                $scope.mediatorStatisticsList.length = 0;
                $scope.adjustDataList.length = 0;
            } else {
                $rootScope.toaster("error", "错误","查询出错");
            }
        });
    };

    //导出Excel
    $scope.exportExcel = function(){
        console.log($scope.dataStatistics.searchAdjustStartDate)

        if($scope.initStatisticsList.length > 0){
            console.log("初始化 === "+$scope.initStatisticsList.length+"；属性："+$scope.dataStatistics.orgId);
            return AdjustConfig.adjustConStant.exportExcelServiceUrl+"?type="+$scope.dataStatistics.type+"&state=0&courtCode=&orgId="+$scope.dataStatistics.orgId+"&courtName=&companyName=&regionName="+$scope.dataStatistics.regionName+"&searchAdjustEndDate="+$scope.dataStatistics.searchAdjustEndDate+"&searchAdjustStartDate="+$scope.dataStatistics.searchAdjustStartDate;
        }else if($scope.courtStatisticsList.length > 0){
            console.log("法院 === "+$scope.courtStatisticsList.length+"；属性："+$scope.dataStatistics.orgId);
            return AdjustConfig.adjustConStant.exportExcelServiceUrl+"?type=&state=1&courtCode="+$scope.dataStatistics.courtCode+"&orgId=&courtName=&companyName=&regionName=&searchAdjustEndDate="+$scope.dataStatistics.searchAdjustEndDate+"&searchAdjustStartDate="+$scope.dataStatistics.searchAdjustStartDate;
        }else if($scope.mediationStatisticsList.length > 0){

            console.log("调解 === "+$scope.mediationStatisticsList.length+"；orgId："+$scope.dataStatistics.orgId+"；courtCode："+$scope.dataStatistics.courtCode+"；category："+$scope.dataStatistics.category);
            if($scope.dataStatistics.category == '#01'){
                //调解走code
                return AdjustConfig.adjustConStant.exportExcelServiceUrl+"?type=&state=2&courtCode="+$scope.dataStatistics.courtCode+"&orgId=&courtName=&companyName=&regionName=&searchAdjustEndDate="+$scope.dataStatistics.searchAdjustEndDate+"&searchAdjustStartDate="+$scope.dataStatistics.searchAdjustStartDate;
            }else{
                return AdjustConfig.adjustConStant.exportExcelServiceUrl+"?type=&state=2&courtCode=&orgId="+$scope.dataStatistics.orgId+"&courtName=&companyName=&regionName=&searchAdjustEndDate="+$scope.dataStatistics.searchAdjustEndDate+"&searchAdjustStartDate="+$scope.dataStatistics.searchAdjustStartDate;
            }
        }else if($scope.mediatorStatisticsList.length > 0){
            console.log("调解员 === "+$scope.mediatorStatisticsList.length+"；属性："+$scope.dataStatistics.sdepId);
            return AdjustConfig.adjustConStant.exportExcelServiceUrl+"?type=&state=3&courtCode=&orgId="+$scope.dataStatistics.sdepId+"&courtName=&companyName=&regionName=&searchAdjustEndDate="+$scope.dataStatistics.searchAdjustEndDate+"&searchAdjustStartDate="+$scope.dataStatistics.searchAdjustStartDate;
        }else if($scope.adjustDataList.length > 0){
            console.log("案件信息 === "+$scope.adjustDataList.length+"；属性："+$scope.dataStatistics.adjustPersonId+"；部门："+$scope.dataStatistics.sdepId);
            return AdjustConfig.adjustConStant.exportExcelServiceUrl+"?type=&state=4&courtCode="+$scope.dataStatistics.sdepId+"&orgId="+$scope.dataStatistics.adjustPersonId+"&courtName=&companyName=&regionName=&searchAdjustEndDate="+$scope.dataStatistics.searchAdjustEndDate+"&searchAdjustStartDate="+$scope.dataStatistics.searchAdjustStartDate;
        }
    };


    //获取用户
    if(LoginService.user.userPermissions){
        $scope.queryStatistics();
    }
    $scope.$on('user2Child', function(event){
        $scope.queryStatistics();
    });




    $scope.queryMediatorDataStatistics = function(data){
        $scope.dataStatistics.sdepId = data.sdepId;
        //调解员信息列表
        AdjustService.queryMediatorDataStatisticsService($scope.dataStatistics).success(function(result){
            if (result.code === LoginConfig.commonConStant.SUCCESS) {
                console.log(result.result);
                $scope.mediatorStatisticsList = result.result;
                $scope.mediationStatisticsList.length = 0;
                $scope.courtStatisticsList.length = 0;
                $scope.mediationStatisticsList.length = 0;
                $scope.adjustDataList.length = 0;
                $scope.orgName = data.orgName;
            } else {
                $rootScope.toaster("error", "错误","查询出错");
            }
        });
    };


    $scope.statisticsSendBack = function(){
        $scope.dataStatistics.searchAdjustStartDate = "";  //格式化开始日期
        $scope.dataStatistics.searchAdjustEndDate = "";   //格式化结束日期
        $scope.queryStatistics();
    };


    $scope.queryAdjustDataStatistics = function(data){
        if(data){
            $scope.dataStatistics.adjustPersonId = data.userId;
        }
        //调解员数据列表
        AdjustService.queryAdjustDataStatisticsService($scope.dataStatistics).success(function(result){
            if (result.code === LoginConfig.commonConStant.SUCCESS) {
                console.log(result.result);
                $scope.adjustDataList = result.result;
                $scope.mediatorStatisticsList.length = 0;
                $scope.courtStatisticsList.length = 0;
                $scope.mediationStatisticsList.length = 0;
                $scope.mediatorStatisticsList.length = 0;
                if(data) $scope.orgName = data.orgName;
            } else {
                $rootScope.toaster("error", "错误","查询出错");
            }
        });
        //调解员数据列表
        AdjustService.queryAdjustDataStatisticsCountService($scope.dataStatistics).success(function(result){
            if (result.code === LoginConfig.commonConStant.SUCCESS) {
                console.log(result.result);
                $scope.dataStatistics.totalPage = result.result;
            } else {
                $rootScope.toaster("error", "错误","查询出错");
            }
        });
    };

    //跳转相应详细页
    $scope.goCase = function (res) {
        $scope.url = 'dashboard.case_details'
        $state.go($scope.url, {serialNo: res.serialNo});
    };
});