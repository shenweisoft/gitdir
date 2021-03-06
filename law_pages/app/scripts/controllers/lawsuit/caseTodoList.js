'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:FilingListCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp').controller('CaseTodoCtrl', function ($scope, $stateParams, $state, AppraisalConfig, PrejudgeService, AppraisalService, PrejudgeConfig, $location, $timeout, $http, $log, $filter, DictionaryConfig, LawService, LawConfig, toaster, LoginService, $rootScope) {
  //案件Service
  $scope.lawService = LawService;

  $scope.factTypeList = DictionaryConfig.factTypeList;
  $scope.LAW_STATE = DictionaryConfig.lawState;
  $scope.blankShow = false;
  var level = {
    "success": "success",
    "warn": "warn",
    "error": "error"
  }
  var title = {
    "success": "成功",
    "warn": "提示",
    "error": "错误"
  }

  $scope.CONSTANT = {
    "messageBackend": "请联系管理员"
  }

  //定义状态常量
  $scope.STATE_CONSTANT = {
    "courtMediationState": "1005",
    "courtSessionState": "1006",
    "all": "-1", //查询范围：[1005, 1006]
    "lawCaseType": 1
  };


  //每页显示条数
  $scope.itemNum = DictionaryConfig.pageNum;
  $scope.pageData = {
    currentPage: '1',
    caseList: [],
    showList: [],
    listTitle: '',
  };
  $scope.pages = {};

  function CaseSearchVO() {
    //创建对象构造器
    this.lawOrgId = $scope.userDepart.orgId;
    this.state = $scope.STATE_CONSTANT.all; //状态
    this.type = $scope.STATE_CONSTANT.lawCaseType; //
    this.isSmallAmount = '';
    this.pageNo = 1;
    this.pageSize = DictionaryConfig.pageNum;
    this.applyJudge = ''; //申请法官介入
    this.courtStartDate = '';
    this.courtEndDate = '';
  }

  $scope.searchData = function () {
    if (!$scope.pages) $scope.pages = new CaseSearchVO();
    $scope.queryCaseList($scope.pages, $scope.pages);
  }

  //单击查询
  $scope.queryCaseList = function (pageA, pageB) {
    if (!pageA) pageA = $scope.pages;
    var paramA = angular.copy(pageA)
    if (paramA.searchArea) paramA.searchArea = DictionaryConfig.filterWidthReg(paramA.searchArea)

    $scope.lawService.queryFilingList(paramA).success(function (result) {
      if (result.code == LawConfig.commonConstant.SUCCESS) { //请求成功
        $scope.pageData.showList = [];
        $scope.pageData.caseList = result.result;
        $scope.pageData.caseList && $scope.pageData.caseList.forEach(function (v, i) {
          //是否能开庭标识,默认不能开庭
          var isShowFlag = false;
          //需要查看开庭时间，是否允许开庭
          var nowDate = new Date(new Date().getTime() + DictionaryConfig.courtBeforeHour);
          //如果下次开庭时间存在
          if (v.nextCourtDate) {
            if (v.nextCourtDate <= $filter('date')(nowDate, "yyyy-MM-dd HH:mm:ss")) {
              isShowFlag = true;
            }
          } else {
            //如果开庭日期存在，则根据开庭日期判断
            if (v.courtDate) {
              if (v.courtDate <= $filter('date')(nowDate, "yyyy-MM-dd HH:mm:ss")) {
                isShowFlag = true;
              }
            }
          }
          //如果不是暂缓缴费并且又没有付款，则不能开庭
          if (v.isDeferredCharges != '1' && v.payState != '1') {
            isShowFlag = false;
          }
          v.isShowFlag = isShowFlag;
          if (i < $scope.itemNum) {
            $scope.pageData.showList.push(v);
          }
        });
        $log.info($scope.pageData.caseList);
        //空白页展示
        if (!$scope.pageData.caseList.length) {
          $scope.blankShow = true;
        }
      } else if (result.code == LawConfig.commonConstant.FAILURE) {
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
      }
    });

    //Todo查询总条数
    if (pageB) {
      var pageB = angular.copy(pageB)
      if (pageB.searchArea) pageB.searchArea = DictionaryConfig.filterWidthReg(pageB.searchArea)
      $scope.lawService.queryFilingCount(pageB).success(function (result) {
        if (result.code == LawConfig.commonConstant.SUCCESS) { //请求成功
          $scope.pageData.totalItems = result.result;
        } else {
          $rootScope.toaster(level.error, title.error, result.message);
        }
      })
    }
  };

//鉴定须知显示
$scope.isInformation = false;
$scope.Information = function (serialNo,isSendAppraisal) {
    $scope.serialNo = serialNo
    var userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
    if(userDepart.isSendAppraisal == 1 && isSendAppraisal == 0){  //法院发起鉴定并且案子没有发起过鉴定
      $scope.isInformation = true;
    }else{
      $scope.sendAppraisal()
    }
}

  //发起鉴定
  $scope.prejudgeService = PrejudgeService;
  $scope.sendAppraisal = function () {
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
          if (url) {
            if (url.toLowerCase().indexOf("http") != -1) {
              window.open(url,'_blank')
            } else {
              window.open("http://"+url,'_blank')
            }
            location.reload()
          } else {
            $scope.queryAppraisal($scope.serialNo);
          }
        } else {
          $rootScope.toaster("error", "提示", result.result.errorMessage);
          $scope.queryAppraisal($scope.serialNo);
        }
      } else {
        $rootScope.toaster("error", "错误", result.message);
      }
    })
  }


  //设置请求对象
  $scope.service = {
    getInquireListService: AppraisalService.appraisalLaunchList, //查询法官发起鉴定列表Service
    getInquireCountService: AppraisalService.appraisalLaunchCount, //查询总条数
    queryInHandAppraisalInfoService: AppraisalService.queryInHandAppraisalInfo, //查询鉴定Service
    queryLawInfo: LawService.queryLawInfo //查询调解单
  };
  //案件鉴定状态对象
  function AppraisalInfo() {
    this.appraisalFlag = false; //案件鉴定状态标识,true可发起鉴定  false查看案件信息
    this.serialNo = ""; //案件号
    this.personType = 1; //登录用户身份标识*
    this.appraisalInfoId = ""; //当前案件的鉴定id（当此案件在鉴定中时存在）
  }


  //根据流水号查询鉴定案件（发起鉴定按钮）
  $scope.queryAppraisal = function (serialNo) {
    //初始化案件鉴定对象，并为流水号赋值
    $scope.appraisalInfo = new AppraisalInfo();
    $scope.appraisalInfo.serialNo = serialNo;
    //查询调解单
    if (serialNo) {
      $scope.service.queryLawInfo({
        "serialNo": serialNo
      }).success(function (result) {
        var data = result.result;
        if (result.code == LawConfig.commonConstant.SUCCESS) {
          $scope.adjust = data;
          //根据流水号查询是否存在没有完成的鉴定任务
          $scope.service.queryInHandAppraisalInfoService({
            serialNo: serialNo
          }).success(function (result) {
            var loginAccount = LoginService.user.sysUser.loginAccount
            if (result.code == AppraisalConfig.commonConstant.SUCCESS) {
              //根据result与result.result.state来判断案件是否发起过鉴定
              if (result.result) {
                if (result.result.state == DictionaryConfig.appraisalState.finishState || result.result.state == DictionaryConfig.appraisalState.temporaryState ||  $scope.adjust.oldIsSendAppraisal == 0) {
                  $scope.appraisalInfo.appraisalFlag = true;
                } else {
                  $scope.appraisalInfo.appraisalInfoId = result.result.id;
                }
              } else {
                $scope.appraisalInfo.appraisalFlag = true;
              }
              //如果存在没有完成的鉴定任务跳转到公告
              if ($scope.appraisalInfo.appraisalFlag) {
                //鉴定须知url
                var url = $state.href("appraisal_notice", {
                  serialNo: $scope.adjust.serialNo,
                  caseType: '2',
                  orgId: $scope.adjust.adjustOrgCode,
                  name: "appraisal_notice",
                  pointId: $scope.adjust.adjustPointCode,
                  pointName: $scope.adjust.adjustPointName,
                  judge: 'true',
                  loginAccount: loginAccount
                });
                // if(confirm("确定要发起鉴定吗？")){
                // $scope.newUrl = url
                // document.getElementById('new_url').click(); //此处打开新页面  
                window.open(url,'_blank');
                location.reload();
                // }
              } else {
                //显示案件信息
                var url = $state.href("dashboard.appraisalQueryDetail", {
                  serialNo: $scope.appraisalInfo.serialNo,
                  personType: $scope.appraisalInfo.personType,
                  appraisalInfoId: $scope.appraisalInfo.appraisalInfoId,
                  judge: 'true'
                });
                window.open(url,'_blank');  
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

  //初始化
  $scope.initPage = function () {
    //根据组织机构获取人员列表
    $scope.$on('user2Child', function () {
      initData();
    });
    if (LoginService.user.userPermissions) {
      initData();
    }
  };
  $scope.initPage();

  function initData() {
    $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
    $scope.sysUser = LoginService.user.sysUser;
    $scope.pages = new CaseSearchVO();
    $scope.pages.isSmallAmount = ($state.current.url == "/smallCaseTodo" && '1') || ($state.current.url == "/commonCaseTodo" && '0') || '';
    $scope.pages.applyJudge = ($state.current.url == "/courtMediationList" && true) || '';
    $scope.pages.state = $scope.courtOrOnline = ($state.current.url == "/courtMediationList" && $scope.STATE_CONSTANT.courtMediationState) || ($state.current.url == "/online_sessionList" && $scope.STATE_CONSTANT.courtSessionState) || $scope.STATE_CONSTANT.all;
    //今日调解
    if ($state.current.url == "/online_sessionList") {
      $scope.pages.courtStartDate = $filter('date')(new Date(), "yyyy-MM-dd 00:00:00");
      $scope.pages.courtEndDate = $filter('date')(new Date(), "yyyy-MM-dd 00:00:00");
    }
    //初始化集合
    $scope.queryCaseList($scope.pages, $scope.pages);
  }

  //点击当前页面，展示数据
  $scope.pageChanged = function () {
    if (!$scope.pages) $scope.pages = new CaseSearchVO();
    $scope.pages.pageNo = $scope.pageData.currentPage;
    $scope.queryCaseList($scope.pages, $scope.pages);
  }

  //切换类型[1007:庭前调解， 1008:在线开庭]
  $scope.filerState = $scope.STATE_CONSTANT.all;
  $scope.selectType = function (val) {
    $scope.filerState = val;
  };

  //查询详细
  $scope.queryDetail = function (lawCase) {
    switch (lawCase.state) {
      case $scope.STATE_CONSTANT.courtMediationState:
        $state.go("dashboard.courtMediation", {
          serialNo: lawCase.serialNo
        });
        break;
      case $scope.STATE_CONSTANT.courtSessionState:
        $state.go("dashboard.online_session", {
          serialNo: lawCase.serialNo
        });
        break;
    }
  };

  //在线开庭
  $scope.onlineCourt = function (lawCase) {
    $scope.lawService.onlineCourt({
      serialNo: lawCase.serialNo,
      lawNo: lawCase.lawNo
    }).success(function (res) {
      if (res.code == LawConfig.commonConstant.SUCCESS) { //请求成功
        window.open(res.result, '_blank');
      } else {
        $rootScope.toaster(level.error, title.error, res.message);
      }
    })
  };

  //重置详细搜索数据
  $scope.reset = function () {
    $scope.pages = new CaseSearchVO();
  };

});
