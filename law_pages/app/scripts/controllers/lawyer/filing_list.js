'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:FilingListCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
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
angular.module('sbAdminApp').controller('FilingListCtrl', function($scope, AppraisalConfig,$stateParams,PrejudgeService,AppraisalService,PrejudgeConfig, $state, $location, $timeout, $http,toaster, $log,DictionaryConfig,LawService,LawConfig, LoginService,$rootScope) {

  //查询立案集合Service
  $scope.lawService = LawService;
  //状态字典信息
  $scope.state = DictionaryConfig.lawState;
  //定义状态常量
  $scope.STATE_CONSTANT = {
    "adjustResult":"0",
    "litigationType":"0",//司法类型
    "judicialType":"1", //诉讼类型
    "all":"-1",//全部
    "adjustType":"2"//调解立案
  };
  
  //创建对象构造器
  function FilingSearchVO(){
    this.state = "";
    this.searchArea = "";
    this.lawOrgId = "";
    this.adjustResult = "";
    this.type = "-1";
    //每页条数
    this.pageSize = DictionaryConfig.pageNum;
    //当前页数 默认为第一页
    this.pageNo = 1;
    //总共页数 默认一页
    this.totalPage = 1;
  }
  //初始化对象
  $scope.filingSearchVO = new FilingSearchVO();
  //后台查询数据
  function initData(){


    $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
    $scope.sysUser = LoginService.user.sysUser;

    //赋予组织权限
    $scope.filingSearchVO.lawOrgId = $scope.userDepart.orgId;
    //待审批/待立案/待分案根据url进行判断
    var url = $location.url();
    if(url.indexOf("approval") > 0){//待审批
      $scope.filingSearchVO.state = DictionaryConfig.lawState.prosecutionFinishState;
      //请求司法确认
      $scope.filingSearchVO.adjustResult = $scope.STATE_CONSTANT.adjustResult;
    }else if(url.indexOf("filing") > 0){//待立案
      $scope.filingSearchVO.state = DictionaryConfig.lawState.approvalState;
    }else if(url.indexOf("division") > 0){//待分案
      $scope.filingSearchVO.state = DictionaryConfig.lawState.filingState;
    }else if(url.indexOf("schedule") > 0){//待排期
        $scope.filingSearchVO.state = DictionaryConfig.lawState.scheduleState;
        $scope.filingSearchVO.type = "1";
    }
    
    var param = angular.copy($scope.filingSearchVO);
    param.searchArea = DictionaryConfig.filterWidthReg(param.searchArea)
    //查询数据
    $scope.lawService.queryFilingList(param).success(function(result) {
      //请求成功
      if (result.code == LawConfig.commonConstant.SUCCESS) {
        $scope.caseList = result.result;
        $log.info($scope.caseList);
      }else{
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageNetError);
      }
    });
    //查询总条数
    $scope.lawService.queryFilingCount(param).success(function(result) {
      if (result.code == LawConfig.commonConstant.SUCCESS) {
        $scope.filingSearchVO.totalPage =  result.result;
      }else{
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageNetError);
      }
    })
  }
  //查询组织
  $scope.initPage = function () {
    //根据组织机构获取人员列表
    $scope.$on('user2Child', function(){
      initData();
    });
    if (LoginService.user.userPermissions) {
      initData();
    }
  };

  //鉴定须知显示
  $scope.isInformation = false;
  $scope.Information = function (serialNo,isSendAppraisal) {
    $scope.serialNo = serialNo
    var userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
    if(userDepart.isSendAppraisal == 1  && isSendAppraisal == 0){
      $scope.isInformation = true;
    }else{
      $scope.sendAppraisal()
    }
  }
  
  //发起鉴定
  $scope.prejudgeService = PrejudgeService;
    
  $scope.sendAppraisal = function(){
      //查询法院是否对接了鉴定系统
      var loginAccount = LoginService.user.sysUser.loginAccount
      var userType = LoginService.user.sysUser.userType
      var data = {
          serialCode: $scope.serialNo, //流水号
          loginAccount: loginAccount,
          userType: userType
      }
      $scope.prejudgeService.identification(data).success(function (result) {
          if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
              if (result.result.errorCode == PrejudgeConfig.serviceConstant.SUC_JIANDING) {
                  var url = result.result.openUrl;
                  //查询法院是否对接了鉴定系统请求相对应的方法
                  if(url){
                    if(url.toLowerCase().indexOf("http") != -1){
                      window.open(url,'_blank')
                    } else {
                      window.open("http://"+url,'_blank')
                    }
                    location.reload();
                  }else{
                    queryAppraisal($scope.serialNo);
                  }
              }else{
                  $rootScope.toaster("error", "提示", result.result.errorMessage);
                  queryAppraisal($scope.serialNo);
              }
          }else {
              $rootScope.toaster("error", "错误", result.message);
          }
      })
  }


  //设置请求对象
  $scope.service = {
    getInquireListService: AppraisalService.appraisalLaunchList,  //查询法官发起鉴定列表Service
    getInquireCountService: AppraisalService.appraisalLaunchCount,  //查询总条数
    queryInHandAppraisalInfoService: AppraisalService.queryInHandAppraisalInfo,   //查询鉴定Service
    queryLawInfo: LawService.queryLawInfo   //查询调解单
};
   //案件鉴定状态对象
function AppraisalInfo(){
    this.appraisalFlag = false;  //案件鉴定状态标识,true可发起鉴定  false查看案件信息
    this.serialNo = "";   //案件号
    this.personType = 1;  //登录用户身份标识*
    this.appraisalInfoId = "";   //当前案件的鉴定id（当此案件在鉴定中时存在）
}


   //根据流水号查询鉴定案件（发起鉴定按钮）
  function queryAppraisal(serialNo){
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
                            if(result.result.state == DictionaryConfig.appraisalState.finishState || result.result.state == DictionaryConfig.appraisalState.temporaryState || $scope.adjust.oldIsSendAppraisal == 0){
                                $scope.appraisalInfo.appraisalFlag = true;
                            }else{
                                $scope.appraisalInfo.appraisalInfoId = result.result.id;
                            }
                        }else{
                            $scope.appraisalInfo.appraisalFlag = true;
                        }
                        var loginAccount = LoginService.user.sysUser.loginAccount
                        //如果存在没有完成的鉴定任务跳转到公告
                        if($scope.appraisalInfo.appraisalFlag){
                            //鉴定须知url
                            var url = $state.href("appraisal_notice",{serialNo:$scope.adjust.serialNo,caseType:'2',orgId:$scope.adjust.adjustOrgCode, name:"appraisal_notice",pointId:$scope.adjust.adjustPointCode,pointName:$scope.adjust.adjustPointName,judge:'true',loginAccount:loginAccount});
                            // if(confirm("确定要发起鉴定吗？")){
                              // $scope.newUrl = url
                              // document.getElementById('new_url').click(); //此处打开新页面   
                                window.open(url,'_blank');
                                location.reload(); 
                            // }
                        }else{
                            //显示案件信息
                            var url = $state.href("dashboard.appraisalQueryDetail",{serialNo:$scope.appraisalInfo.serialNo,personType:$scope.appraisalInfo.personType,appraisalInfoId:$scope.appraisalInfo.appraisalInfoId,judge:'true'});
                            window.open(url,'_blank');
                            // $scope.newUrl = url
                            // document.getElementById('new_url').click(); //此处打开新页面   
                            location.reload(); 
                        }
                    }
                })
            } else {
                $rootScope.toaster("error", "错误", result.message);
            }
        })
    }
};


  //开始调用数据
  $scope.initPage();

  //点击当前页面，展示数据
  $scope.pageChanged = function () {
    $scope.initPage();
  };

  //搜索数据
  $scope.searchData = function(){
    $scope.initPage();
  };
  
  //切换类型
  $scope.selectType = function(val){
    $scope.filingSearchVO.type = val;
    //调用
    $scope.initPage();
  };

  //查询详细
  $scope.queryDetail = function(filing){
    $state.go("dashboard.filing_detail",{serialNo:filing.serialNo,id:filing.id});
  }


  $scope.printData = function(){

     // $state.go("dashboard.policeDistinguish");
      LawService.printData({}).success(function(result) {
        //请求成功
        if (result.code == LawConfig.commonConstant.SUCCESS) {

        }else{
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageNetError);
        }
    });

  }


});
