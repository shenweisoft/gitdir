/**
 * Created by Administrator on 2017/3/2 0002.
 */
'use strict';
var app = angular.module('sbAdminApp');
/**
 * @ngdoc function
 * @name sbAdminApp.controller:processingCtrl
 * @description
 * # processingCtrl
 * Controller of the sbAdminApp
 */
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
app.filter('isNotNull1', function() {
    return function(person) {
        return person == 'null' ? '-' : person;
    }
});
app.filter('valueNull1', function() {
    return function(val) {
        return val && val || '-';
    }
});
angular.module('sbAdminApp').controller('adjustExamineListCtrl', function ($scope, $log, AdjustService, $state, $modal, DictionaryConfig, $location, $filter, LoginService,toaster,AdjustConfig,$rootScope) {

    //取得当前URL
    var url = $location.url();
    var arr =url.split("/");
    url = arr[arr.length-1];
    if(url == 'case_inquire'){
        $scope.urlFlag = true;
    }
    //是否显示过滤选项框
    $scope.filterShow = false;
    //未搜索到结果显示
    $scope.blankShow = false;
    //案由类型
    $scope.factTypeList = DictionaryConfig.factTypeList;
    //调解状态集合
    $scope.mediationState = DictionaryConfig.mediationState;
    //定义当前时间
    $scope.currentDate = new Date();
    //查询列表Service
    $scope.queryMediationReceiveListService = AdjustService.queryMediationReceiveList;
    //查询总数量Service
    $scope.queryCountAdjustService = AdjustService.queryMediationReceiveCount;
    //定义查询搜索对象
    function SearchVo(){
        //全局搜索
        this.searchOverallSituation = "";
        //流水号
        this.searchSerialNo = "";
        //调解号
        this.searchRegulationNo = "";
        //当事人搜索
        this.searchPersonName = "";
        //案由
        this.searchReason = "";
        //调解开始日期
        this.searchAdjustStartDate = "";
        //调解截至日期
        this.searchAdjustEndDate = "";
        //调解员查询
        this.searchAdjustName = "";
        this.adjustType = '1';
        //搜索状态，查找是处理中案件还是调解完成
        this.searchState = "2001";
        //默认从第一页开始查询
        this.pageNo = 1;
        //每页显示条数
        this.pageSize = DictionaryConfig.pageNum;
    }
    //初始化查询对象
    $scope.searchVo = new SearchVo();

    function getDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        return y+"-"+m+"-"+d;
    }
    //获得本周周一
    function getFirstDayOfWeek () {
        var now = new Date();
        var nowTime = now.getTime() ;
        var day = now.getDay();
        var oneDayLong = 24*60*60*1000 ;
        var MondayTime = nowTime - (day-1)*oneDayLong  ;
        var monday = new Date(MondayTime);

        var y = monday.getFullYear();
        var m = monday.getMonth()+1;//获取当前月份的日期
        var d = monday.getDate();
        return y+"-"+m+"-"+d;
    };

    //初始化数据
    function initData(){
        //查询用户以及部门
        $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
        $scope.sysUser = LoginService.user.sysUser;
        //初始化组织与部门
        $scope.searchVo.orgId = $scope.userDepart.orgId;
        $scope.searchVo.createPointId = $scope.userDepart.deptId;

        //从页面首页跳转的案件（今日调解案件以及本周调解案件）
        $scope.searchVo.searchAdjustStartDate = (url == 'todayMediation'&& getDateStr(0))|| (url == 'weekMediation'&& getFirstDayOfWeek()) || '';
        $scope.searchVo.searchAdjustEndDate = (url == 'todayMediation'&& getDateStr(1))|| (url == 'weekMediation'&& getDateStr(1)) || '';

        //列表的标题
        $scope.searchVo.listTitle = (url == 'processing'&& '处理中案件') || (url == 'case_inquire'&& '案件查询')|| (url == 'todayMediation'&& '今日调解')|| (url == 'weekMediation'&& '本周调解')|| (url == 'needTodoList'&& '待办事项');
        //首页待办事项？
        //从后台获取数据
        $scope.getDataInfo();
    }

    //初始化
    $scope.initPage = function () {
        //初始化组织
        //根据组织机构获取人员列表
        $scope.$on('user2Child', function(){
            initData();
        });
        if (LoginService.user.userPermissions) {
            initData();
        }
    };

    //从后台获取数据
    $scope.getDataInfo = function () {
        //处理转义字符等数据
        if($scope.searchVo.searchOverallSituation) $scope.searchVo.searchOverallSituation = DictionaryConfig.filterWidthReg($scope.searchVo.searchOverallSituation)
        //查询列表详细数据
        $scope.queryMediationReceiveListService($scope.searchVo).success(function(result) {
            if(result.code == AdjustConfig.commonConStant.SUCCESS){
                $scope.caseList = result.result;
                //空白页展示
                if(!$scope.caseList.length){
                    $scope.blankShow = true;
                }
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        });
        //查询总条数
        $scope.queryCountAdjustService($scope.searchVo).success(function(result) {
            if(result.code == AdjustConfig.commonConStant.SUCCESS){
                $scope.searchVo.totalPage =  result.result;
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        })
    };
    //初始化数据
    $scope.initPage();
    //点击当前页面，展示数据
    $scope.pageChanged = function () {
        $scope.getDataInfo();
    };

    //全局查询
    $scope.queryAll =function () {
        var searchOverallSituation = $scope.searchVo.searchOverallSituation;
        $scope.searchVo = new SearchVo();
        $scope.searchVo.searchOverallSituation = searchOverallSituation;
        $scope.initPage();
    };
    // 详细查询
    $scope.queryList = function () {
        //默认当前页数为1
        $scope.searchVo.pageNo = 1;
        //开始日期处理
        if($scope.searchVo.searchAdjustStartDate instanceof Date){
            $scope.searchVo.searchAdjustStartDate = $filter('date')( $scope.searchVo.searchAdjustStartDate,"yyyy-MM-dd");
        }
        //结束日期处理
        if($scope.searchVo.searchAdjustEndDate instanceof Date){
            $scope.searchVo.searchAdjustEndDate = $filter('date')($scope.searchVo.searchAdjustEndDate, 'yyyy-MM-dd');
        }
        //将全局属性重置为空
        $scope.searchVo.searchOverallSituation = "";
        //从后台获取数据
        $scope.getDataInfo();
    };

    // 重置查询
    $scope.reset = function () {
        $scope.searchVo =  new SearchVo();
    };
    //页面跳转
    $scope.goCase = function (formCase) {
        //调解中
        if(formCase.state==DictionaryConfig.lawState.adjustListState && (formCase.isReturn == '0' || formCase.isReturn == null || formCase.isReturn == '' || formCase.isReturn == 'undefined')){
            $state.go("dashboard.mediation",{id:formCase.id});
        }else{
            $state.go("dashboard.case_details",{serialNo:formCase.serialNo,isReturn:formCase.isReturn,state:formCase.state,id:formCase.id,codeFileName:formCase.codeFileName});
        }
    };

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
    //跳转到案件详细页
    $scope.goStateCase = function () {
        $state.go("dashboard.case_details");
    };

    $scope.goStateCaseDetails = function (adjustId) {
        $state.go("dashboard.lawyer_case_details",{adjustId:adjustId});
    }

    $scope.distributionCase = function(caseInfo){
        $state.go("dashboard.adjustExamineDetail",{adjustId:caseInfo.id,name:caseInfo.name});
    }

});


