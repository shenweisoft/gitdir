/**
 * Created by shenwei on 2017/5/9.
 */
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
app.filter('id2Text', function() {
    return function(id,data) {
        var result = _.find(data, {
            id: id+""
        });
        return result? result.value:""
    }
});

app.filter('valueNull1', function() {
    return function(val) {
        return val && val || '-';
    }
});
app.filter('orgNull', function() {
    return function(val) {
        return  val && val || "法院";
    }
});

angular.module('sbAdminApp').controller('AppraisalTaskListCtrl', function($location,$scope, LoginService,$stateParams, $state,$http, $log, AppraisalConfig,AppraisalService,DictionaryConfig,toaster,AdjustService,$rootScope) {
    
    //查询数据Service
    $scope.queryAppraisalListService = AppraisalService.queryAppraisalList;
    //查询分页信息Service
    $scope.queryAppraisalCountService = AppraisalService.queryAppraisalCount;
    //进行中查询数据Service
    $scope.queryAppraisalInHandingListService = AppraisalService.queryAppraisalInHandingList;
    //进行中查询分页信息Service
    $scope.queryCountAppraisalInHandingService = AppraisalService.queryCountAppraisalInHanding;
    //评价查询数据Service
    $scope.queryUnEvaluateAppraisalListService = AppraisalService.queryUnEvaluateAppraisalList;
    //评价查询分页信息Service
    $scope.queryCountUnEvaluateAppraisalListService = AppraisalService.queryCountUnEvaluateAppraisalList;
    //接收查询数据Service
    $scope.queryAppraisalReceiveListService = AppraisalService.queryAppraisalReceiveList;
    //接收查询分页信息Service
    $scope.queryCountAppraisalReceiveService = AppraisalService.queryCountAppraisalReceive;

    //状态集合
    $scope.appraisalStateValue = DictionaryConfig.appraisalStateValue;
    $scope.appraisalStateValueProgress = DictionaryConfig.appraisalStateValueProgress;
    $scope.appraisalState = DictionaryConfig.appraisalState;
    //获取url
    var url = $location.url();
    var arr =url.split("/");
    $scope.url = arr[arr.length-1];

    //封装输入对象
    function SearchVO(){
        this.state =($scope.url=="appraisalFinish"  && DictionaryConfig.appraisalState.finishState)|| ($scope.url == 'appraisalNeedTodo'&& DictionaryConfig.appraisalState.launchState)|| ($scope.url == 'appraisalTaskList'&& DictionaryConfig.appraisalState.launchState)||($scope.url == 'appraisalEvaluateList'&& DictionaryConfig.appraisalState.finishState)||($scope.url == 'appraisalToBeSubmit'&& DictionaryConfig.appraisalState.temporaryState)||"";
        this.searchArea = "";
        //每页条数
        this.pageSize = DictionaryConfig.pageNum;
        //鉴定机构ID
        this.appraisalOrgId = "";
        //调解机构ID
        this.createOrgId = "";
        //法院ID
        this.lawOrgId = "";
        //用户ID
        this.createBy = "";
        //当前页数 默认为第一页
        this.pageNo = 1;
        //总共页数 默认一页
        this.totalPage = 1;
        //是否评价
        this.isEvaluate = ''
        this.progressFlag = '';
        //调解员查询列表传1
        this.caseType  = '';
    }
    
    //初始化对象
    $scope.searchVO = new SearchVO();

    //得到组织并初始化集合数据
    function initData(){
        //获取部门信息
        if(LoginService.user.sysUser.userDepartList.length>0){
            $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
            $scope.isSendAppraisal = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg].isSendAppraisal;
        }
       
        $scope.sysUser = LoginService.user.sysUser;
        //发起鉴定的时候标题栏的显示为历史查询
        
        //进行中的列表查询,待办事项
        if($scope.url == 'appraisalProgressList'|| $scope.url == 'appraisalNeedTodo'){
            $scope.searchVO.progressFlag = '1';
        }
        //评价列表查询
        if($scope.url == 'appraisalEvaluateList'){
            $scope.searchVO.isEvaluate = false;
        }
        //待提交列表
        $scope.searchVO.createPointId = ((url=="appraisalToBeSubmit" ) && $scope.userDepart.deptId) || null;

        //案件查询
        if($scope.url == 'appraisalQueryList' && ($scope.sysUser.userType == '1' || $scope.sysUser.userType == '3')){
            $scope.searchVO.progressFlag = '2'
        }
        //法官
        if($scope.sysUser.userType == '1'){
            $scope.searchVO.lawOrgId = $scope.userDepart.orgId;
        }else if($scope.sysUser.userType == '2'  &&  $scope.sysUser.loginAccount != 'admin'){//调解员
            $scope.searchVO.createOrgId = $scope.userDepart.orgId;
            $scope.searchVO.caseType = '1';
            $scope.searchVO.createBy = $scope.sysUser.id;
        }else if($scope.sysUser.userType == '3'){//鉴定员
            $scope.searchVO.appraisalOrgId = $scope.userDepart.orgId;
        }else if($scope.sysUser.userType == '0'){//公民
            $scope.searchVO.createBy = $scope.sysUser.id;
        }

        $log.info($scope.searchVO);
        var param = angular.copy($scope.searchVO)
        if(param.searchArea) param.searchArea = DictionaryConfig.filterWidthReg(param.searchArea)
        if($scope.url == 'appraisalProgressList'|| $scope.url == 'appraisalNeedTodo'){  //进行中
            //查询数据
            $scope.queryAppraisalInHandingListService(param).success(function (result) {
                if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                    $scope.appraisalInfoList = result.result;
                }else{
                    $rootScope.toaster("error", "错误", result.message);
                }
            });
            //查询总数
            $scope.queryCountAppraisalInHandingService(param).success(function (result) {
                if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                    $scope.searchVO.totalPage = result.result;
                }else{
                    $rootScope.toaster("error", "错误", result.message);
                }
            });
        }else if($scope.url == 'appraisalEvaluateList'){    //评价
            //查询数据
            $scope.queryUnEvaluateAppraisalListService(param).success(function (result) {
                if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                    $scope.appraisalInfoList = result.result;
                }else{
                    $rootScope.toaster("error", "错误", result.message);
                }
            });
            //查询总数
            $scope.queryCountUnEvaluateAppraisalListService(param).success(function (result) {
                if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                    $scope.searchVO.totalPage = result.result;
                }else{
                    $rootScope.toaster("error", "错误", result.message);
                }
            });
        }else if($scope.url == 'appraisalTaskList'){    //接收
            //查询数据
            $scope.queryAppraisalReceiveListService(param).success(function (result) {
                if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                    $scope.appraisalInfoList = result.result;
                }else{
                    $rootScope.toaster("error", "错误", result.message);
                }
            });
            //查询总数
            $scope.queryCountAppraisalReceiveService(param).success(function (result) {
                if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                    $scope.searchVO.totalPage = result.result;
                }else{
                    $rootScope.toaster("error", "错误", result.message);
                }
            });
        }else{
            //查询数据
            $scope.queryAppraisalListService(param).success(function (result) {
                if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                    $scope.appraisalInfoList = result.result;
                    //补充证据标签
                    $scope.appraisalInfoList.forEach(function (v) {
                        if(v.detailState == DictionaryConfig.appraisalDetailState.launchState &&  v.isAdminicle && ($scope.url == 'appraisalProgressList' || $scope.url == 'appraisalNeedTodo')){
                            v.detailState = DictionaryConfig.appraisalDetailState.supplementState;
                        }
                    })
                    $log.info($scope.appraisalInfoList);
                }else{
                    $rootScope.toaster("error", "错误", result.message);
                }
            });
            //查询总数
            $scope.queryAppraisalCountService(param).success(function (result) {
                if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                    $scope.searchVO.totalPage = result.result;
                }else{
                    $rootScope.toaster("error", "错误", result.message);
                }
            });
        }
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

    //根据流水号查询详情
    $scope.queryDetail = function(appraisalInfo){

        if($scope.url == 'appraisalTaskList'){
            console.log(appraisalInfo)
            console.log({serialNo:appraisalInfo.serialNo,appraisalNo:appraisalInfo.appraisalNo,appraisalInfoId:appraisalInfo.id})
            $state.go("dashboard.appraisalInfoDetail",{serialNo:appraisalInfo.serialNo,appraisalNo:appraisalInfo.appraisalNo,appraisalInfoId:appraisalInfo.id});
        }else if ($scope.url == 'appraisalProgressList'|| $scope.url == 'appraisalToBeSubmit'){//进行中得案件
            if(appraisalInfo.state == '1000') {//暂存
                progress();
            }else{
                $state.go("dashboard.appraisalQueryDetail",{serialNo:appraisalInfo.serialNo,appraisalNo:appraisalInfo.appraisalNo,personType:1,appraisalInfoId:appraisalInfo.id});
            }

        }else if($scope.url == 'appraisalEvaluateList'){//鉴定评价
            $state.go("dashboard.appraisalEvaluateDetail",{serialNo:appraisalInfo.serialNo,appraisalNo:appraisalInfo.appraisalNo,appraisalInfoId:appraisalInfo.id});
        } else{//查询案件
            if(appraisalInfo.state == '1000') {//暂存
                progress();
            }else{
                if($scope.sysUser.userType == '0' || ($scope.sysUser.userType == '2'  &&  $scope.sysUser.loginAccount != 'admin')){
                    $state.go("dashboard.appraisalQueryDetail",{serialNo:appraisalInfo.serialNo,appraisalNo:appraisalInfo.appraisalNo,personType:1,appraisalInfoId:appraisalInfo.id});
                }else{
                    $state.go("dashboard.appraisalQueryDetail",{serialNo:appraisalInfo.serialNo,appraisalNo:appraisalInfo.appraisalNo,appraisalInfoId:appraisalInfo.id,url:"query"});
                }
            }
        }

        //如果是待提交状态
        function progress() {
            $scope.caseType = "1";
            if($scope.sysUser.userType == '0'){//公民
                $scope.caseType = "2";
            }
            var url = $state.href("appraisal_notice",{serialNo:appraisalInfo.serialNo, caseType:$scope.caseType,name:"appraisal_notice", userType:$scope.caseType});
            AdjustService.getForwardUrl({
                orgId:appraisalInfo.lawOrgId
            }).success(function(res){
                if(res.result && res.result.identificationInformationDoc){
                    url = $state.href("appraisal_notice",{serialNo:appraisalInfo.serialNo,caseType:$scope.caseType, name:res.result.identificationInformationDoc,userType:$scope.caseType});
                }
                window.open(url,'_blank');
            });
        }

    };
});