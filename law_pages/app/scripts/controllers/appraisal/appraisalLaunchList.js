/**
 * Created by zhangkai on 2017/11/22.
 */
'use strict';
var app = angular.module('sbAdminApp');
/**
 * Controller of the sbAdminApp
 */

angular.module('sbAdminApp').controller('AppraisalLaunchListCtrl', function($filter,$scope, PrejudgeConfig,LoginService,$stateParams,PrejudgeService,$location, $state,$http, $log, AppraisalConfig, AppraisalService, DictionaryConfig, toaster, AdjustConfig, LawService, LawConfig, AdjustService,$rootScope) {

    //设置常量
    $scope.options = {
        listTitle: '鉴定发起',   //列表标题
        listData: [],       //列表数据
        filterShow: false,  //详细查询（小沙漏）显示隐藏状态
        lawStateList: DictionaryConfig.lawAdjustList,   //详细搜索状态项数组
        appraisalInfoId: ''   //发起鉴定案件id
    };
    
    //设置请求对象
    $scope.service = {
        getInquireListService: AppraisalService.appraisalLaunchList,  //查询法官发起鉴定列表Service
        getInquireCountService: AppraisalService.appraisalLaunchCount,  //查询总条数
        queryInHandAppraisalInfoService: AppraisalService.queryInHandAppraisalInfo,   //查询鉴定Service
        queryLawInfo: LawService.queryLawInfo   //查询调解单
    };

    //设置详细查询搜索对象
    function SearchVo(){
        //全局搜索
        this.searchOverallSituation = "";
        //流水号
        this.serialNo = "";
        //案号
        this.lawNo = "";
        //当事人搜索
        this.applicantOrRespondent = "";
        //调解开始日期
        this.filingStartDate = "";
        //调解结束日期
        this.filingEndDate = "";
        //调解员查询
        this.adjustName = "";
        //搜索案件状态
        this.state = "";
        //默认从第一页开始查询
        this.pageNo = 1;
        //每页显示条数
        this.pageSize = DictionaryConfig.pageNum;
        //案件状态数组
        this.stateArray = "1002,1003,1004,1005,1006";
    }
    //初始化详细查询对象
    $scope.searchVo = new SearchVo();

    //案件鉴定状态对象
    function AppraisalInfo(){
        this.appraisalFlag = false;  //案件鉴定状态标识,true可发起鉴定  false查看案件信息
        this.serialNo = "";   //案件号
        this.personType = 1;  //登录用户身份标识*
        this.appraisalInfoId = "";   //当前案件的鉴定id（当此案件在鉴定中时存在）
    }

    //初始化数据函数
    function initData(){
        //调用后台接口，请求数据列表
        $scope.getDataInfo();
    }

    //初始化（进入页面、刷新时触发）
    $scope.initPage = function () {
        //当刷新时，sidebar.js请求后台获取用户信息赋值给全局变量LoginService.user，同时触发user2Root函数，
        //law_page.js捕捉user2Root函数并触发user2Child函数
        $scope.$on('user2Child', function(){
            initData();
        });
        //当页面没有刷新过时，LoginService.user变量存储有sidebar保存的信息，可直接访问
        if (LoginService.user.userPermissions) {
            initData();
        }
    };

    //从后台获取数据
    $scope.getDataInfo = function() {
        //获取列表数据
        $scope.service.getInquireListService($scope.searchVo).success(function(result) {
            if(result.code == AdjustConfig.commonConStant.SUCCESS){
                $scope.options.listData = result.result;
            } else {
                $rootScope.toaster("error", "错误", result.message);
            }
        });
        //查询总条数
        $scope.service.getInquireCountService($scope.searchVo).success(function(result) {
            if(result.code == AdjustConfig.commonConStant.SUCCESS){
                $scope.searchVo.totalPage =  result.result;
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        });
    };



    //发起鉴定
    $scope.prejudgeService = PrejudgeService;
    
    $scope.sendAppraisal = function(serialNo){
        //查询法院是否对接了鉴定系统
        var loginAccount = LoginService.user.sysUser.loginAccount
        var userType = LoginService.user.sysUser.userType
        var data = {
            serialCode: serialNo, //流水号
            loginAccount: loginAccount,
            userType: userType
        }
        $scope.prejudgeService.identification(data).success(function (result) {
            if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
                if (result.result.errorCode == PrejudgeConfig.serviceConstant.SUC_JIANDING) {
                    var url = result.result.openUrl;
                    //查询法院是否对接了鉴定系统请求相对应的方法
                    url?window.location.href=url:$scope.queryAppraisal(serialNo);
                }else{
                    $rootScope.toaster("error", "提示", result.result.errorMessage);
                    $scope.queryAppraisal(serialNo);
                }
            }else {
                $rootScope.toaster("error", "错误", result.message);
            }
        })
    }




    //根据流水号查询鉴定案件（发起鉴定按钮）
    $scope.queryAppraisal = function(serialNo){
        //初始化案件鉴定对象，并为流水号赋值
        $scope.appraisalInfo = new AppraisalInfo();
        $scope.appraisalInfo.serialNo = serialNo;
        //查询调解单
        if (serialNo) {
            $scope.service.queryLawInfo({
                "serialNo": serialNo
            }).success(function(result) {
                var data = result.result;
                if (result.code == LawConfig.commonConstant.SUCCESS) {
                    $scope.adjust = data;
                    //根据流水号查询是否存在没有完成的鉴定任务
                    $scope.service.queryInHandAppraisalInfoService({
                        serialNo:serialNo
                    }).success(function (result) {
                        if (result.code == AppraisalConfig.commonConstant.SUCCESS) {
                            //根据result与result.result.state来判断案件是否发起过鉴定
                            if(result.result){
                                if(result.result.state == DictionaryConfig.appraisalState.finishState || result.result.state == DictionaryConfig.appraisalState.temporaryState){
                                    $scope.appraisalInfo.appraisalFlag = true;
                                }else{
                                    $scope.appraisalInfo.appraisalInfoId = result.result.id;
                                }
                            }else{
                                $scope.appraisalInfo.appraisalFlag = true;
                            }
                            //如果存在没有完成的鉴定任务跳转到公告
                            if($scope.appraisalInfo.appraisalFlag){
                                //鉴定须知url
                                var url = $state.href("appraisal_notice",{serialNo:$scope.adjust.serialNo,caseType:'2',orgId:$scope.adjust.adjustOrgCode, name:"appraisal_notice",pointId:$scope.adjust.adjustPointCode,pointName:$scope.adjust.adjustPointName,judge:'true'});
                                // if(confirm("确定要发起鉴定吗？")){
                                    window.open(url,'_blank');
                                // }
                            }else{
                                //显示案件信息
                                $state.go("dashboard.appraisalQueryDetail",{serialNo:$scope.appraisalInfo.serialNo,personType:$scope.appraisalInfo.personType,appraisalInfoId:$scope.appraisalInfo.appraisalInfoId,judge:'true'});
                            }
                        }
                    })
                } else {
                    $rootScope.toaster("error", "错误", result.message);
                }
            })
        }
    };

    //点击分页按钮
    $scope.pageChanged = function () {
        //使用新的searchVo对象获取新数据
        $scope.getDataInfo();
    };

    //点击全局搜索按钮
    $scope.queryAll = function () {
        var searchOverallSituation = $scope.searchVo.searchOverallSituation;
        $scope.searchVo = new SearchVo();
        $scope.searchVo.searchOverallSituation = searchOverallSituation;
        $scope.initPage();
    };

    $scope.queryAllCaseList = function () {
        //设置当前页数为1
        $scope.searchVo.pageNo = 1;
        //开始日期处理
        if($scope.searchVo.filingStartDate instanceof Date){
            $scope.searchVo.filingStartDate = $filter('date')( $scope.searchVo.filingStartDate,"yyyy-MM-dd");
        }
        //结束日期处理
        if($scope.searchVo.filingEndDate instanceof Date){
            $scope.searchVo.filingEndDate = $filter('date')($scope.searchVo.filingEndDate, 'yyyy-MM-dd');
        }
        //将全局搜索属性重置为空
        $scope.searchVo.searchOverallSituation = "";
        //从后台获取数据
        $scope.getDataInfo();
        //隐藏详细搜索菜单
        //$scope.options.filterShow = false;
    };

    //流水号点击，查询详细数据
    $scope.goCase = function(formCase) {
        //调解中
        if(formCase.state==DictionaryConfig.lawState.adjustListState){
            $state.go("dashboard.mediation",{id:formCase.id});
        }else{
            $state.go("dashboard.case_details",{serialNo:formCase.serialNo});
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

    //重置详细搜索数据
    $scope.reset  = function () {
        $scope.searchVo = new SearchVo();
    };

    //调用初始化数据
    $scope.initPage();
});