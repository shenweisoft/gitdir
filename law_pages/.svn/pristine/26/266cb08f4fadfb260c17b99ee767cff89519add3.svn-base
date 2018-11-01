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
angular.module('sbAdminApp').controller('caseInquireCtrl', function ($scope, $log, AdjustService, $state, $modal, DictionaryConfig, $location, $filter, LoginService,toaster,AdjustConfig,$rootScope,$stateParams) {

  //取得当前URL
  var url = $location.url();
  var arr =url.split("/");
  url = $stateParams.pageNo ?arr[arr.length-3] : arr[arr.length-2];
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
  $scope.getInquireListService = AdjustService.getInquireList;
  //查询总数量Service
  $scope.queryCountAdjustService = AdjustService.queryCountAdjust;

  $scope.allocationMediationPersonnel = AdjustService.allocationMediationPersonnelService;

  //定义查询搜索对象
  function SearchVo(){
    //全局搜索
    this.searchOverallSituation = $stateParams.searchOverallSituation ||"";
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
    //查询状态(处理中为1，调解完成为2)
    this.searchFlag = (url == 'processing'&& '1') || (url == 'case_inquire'&& '2') || "";
    //调解截至日期
    this.searchAdjustEndDate = "";
    //调解员查询
    this.searchAdjustName = "";
    //搜索状态，查找是处理中案件还是调解完成
    this.searchState = "";
    //默认从第一页开始查询
    this.pageNo = $stateParams.pageNo || 1;
    //总页数
    this.totalPage =  0 ;
    //每页显示条数
    this.pageSize = DictionaryConfig.pageNum;
    //每页显示条数
    this.type = '1';
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

    //定义案件类型
    $scope.adjustTypeList = [
        {
            type: "1",
            name: "本人案件"
        }, {
            type: "2",
            name: "调解部门案件"
        }
    ];

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
      if($scope.searchVo.type == '1'){
          $scope.searchVo.adjustPersonId = $scope.sysUser.id;
      }else{
          $scope.searchVo.adjustPersonId = "";
      }
    //处理转义字符等数据
    if($scope.searchVo.searchOverallSituation) $scope.searchVo.searchOverallSituation = DictionaryConfig.filterWidthReg($scope.searchVo.searchOverallSituation)
    //查询列表详细数据
    $scope.getInquireListService($scope.searchVo).success(function(result) {
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
        $scope.searchVo.totalPage = result.result
      }else{
        $rootScope.toaster("error", "错误", result.message);
      }
    })
  };
    //初始化数据
    $scope.initPage();
  //点击当前页面，展示数据
  $scope.pageChanged = function () {
      if(url == 'case_inquire'){
          $location.url('/dashboard/case_inquire/'+$scope.searchVo.pageNo+'/');
      }else{
          $scope.getDataInfo();
      }

  };
  
  //全局查询
  $scope.queryAll =function () {
      if(url == 'case_inquire'){
          $location.url('/dashboard/case_inquire/1/'+$scope.searchVo.searchOverallSituation);
      }else{
          var searchOverallSituation = $scope.searchVo.searchOverallSituation;
          if(!$scope.searchVo){
              $scope.searchVo = new SearchVo();
              $scope.searchVo.searchOverallSituation = searchOverallSituation;
          }
          $scope.initPage();
      }

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
  };



//定义流程主表信息
    var WorkFlow = function() {
        this.type = "004";
        this.operatorId = $scope.sysUser.id;
        this.operatorName = $scope.sysUser.text;
        this.orgName = $scope.userDepart.orgName;
        this.tempData = "";
        this.result = '0';
        this.resultName = '案件接收';
    };

    //封装流程信息
    $scope.packageWorkFlowData = function(law,type){
        //主表
        $scope.workFlow = new WorkFlow();
        $scope.workFlow.serialNo = law.serialNo;
        $scope.workFlow.jyAdjustInfoId = law.id;
        if(type == '2'){
            $scope.workFlow.type = "005";
            $scope.workFlow.resultName = "案件退回";
        }
        //业务表
        var tempData = new DictionaryConfig.workFlowData();
        //收件日期
        tempData.adjustOrgName = law.adjustOrgName;
        tempData.adjustPointName = law.adjustPointName;
        tempData.serialNo = law.serialNo;
        tempData.applyTotal = law.applyTotal;

        $scope.workFlow.tempData = JSON.stringify(tempData);
    };

    //查询调解Service
    $scope.adjustService = AdjustService;

    //插入流程表
    $scope.insertWorkFlow = function(law,type){
        //封装流程表
        $scope.packageWorkFlowData(law,type);
        //插入流程表信息
        $scope.adjustService.insertJyWorkFlow($scope.workFlow).success(function(result) {
            console.log(result);
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
    };



  //接收
  $scope.updateAdjustState = function (law,type){
    //保存前状态
    $scope.state = law.state;
    //默认接收
    if(type == 1){
        if(!confirm("确认接收？")){
            return false;
        }
        law.state = '1000';
    }else if(type == 2){//退回
        if(!confirm("确认退回？")){
            return false;
        }
        if(law.beforePersonnelId){
            law.state = '1000';
            $scope.adjustPersonId = law.adjustPersonId;
            law.adjustPersonId = law.beforePersonnelId;
            law.beforePersonnelId = $scope.adjustPersonId;
            $scope.adjustName = law.adjustName;
            law.adjustName = law.beforePersonnelName;
            law.beforePersonnelName = $scope.adjustName;

            if(law.beforeAdjustPointCode){
                $scope.adjustPointCode = law.adjustPointCode;
                law.adjustPointCode = law.beforeAdjustPointCode;
                law.beforeAdjustPointCode = $scope.adjustPointCode;
                $scope.adjustPointName = law.adjustPointName;
                law.adjustPointName = law.beforeAdjustPointName;
                law.beforeAdjustPointName = $scope.adjustPointName;
            }
        }else{
            law.state = '2001';
        }
    }
    $scope.allocationMediationPersonnel(law).success(function (result){
        if (result.code == AdjustConfig.commonConStant.SUCCESS) {
            $log.info(result.result);
            $scope.insertWorkFlow(law,type);
        } else {
            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
        }
    });
  };


 $scope.transfer = function(law){
     var modalInstance = $modal.open({
         templateUrl: 'views/pages/mediation_platform/case_inquire/case_transfer.html',
         controller: 'CaseTransferCtrl',
         size: 'md',
         resolve: {
             items: function() {
                 return {
                     law: law
                 };
             }
         }
     });
     //返回值
     modalInstance.result.then(function(data) {
         $scope.getDataInfo();
     }, function() {});
 }


 $scope.turnJudicial = function(law){
     if(!confirm("是否申请司法确认？")){
         return false;
     }
     //司法确认,生成司法确认申请书
     AdjustService.turnJudicialService({
         serialNo: law.serialNo
     }).success(function(result) {
         if (result.code == AdjustConfig.commonConStant.SUCCESS) {
             $scope.getDataInfo();
         }else{
             $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
         }
     })

 }


 $scope.viewFlow = function(law){
     $state.go("dashboard.case_details",{serialNo:law.serialNo,isReturn:law.isReturn,state:law.state,id:law.id,codeFileName:law.codeFileName});
 };

    //更换查询列表类型
    $scope.changePerson = function (){
        console.log($scope.type);
        $scope.getDataInfo();
    };

});


