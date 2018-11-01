/**
 * Created by Administrator on 2017/3/22 0022.
 */
angular.module('sbAdminApp').controller('SmallLawsuitCtrl', function($scope, $log, DictionaryConfig, $state, $stateParams, toaster, LawService, LawConfig, LoginService, $interval,$timeout,$rootScope) {
  $scope.lawService = LawService;
  var level = DictionaryConfig.toaster.level;
  var title = DictionaryConfig.toaster.title;
  
  // $scope.messageNum = 0;

  $scope.CONSTANT = {
    "lawInitError":"案件信息初始化失败!",
    "messageInitError":"庭前调解信息初始化失败!",
    "messageNullError":"不能发送空信息",
    "messageSendError":"信息发送失败",
    "messageSessionDestroy":"会话已经销毁"
  }

  //查询详细案件,头部字段
  $scope.queryFilingDetails = function () {
    $scope.lawService.queryLawDetail({
      "serialNo": $stateParams.serialNo
    }).success(function (result) {
      if(result.code ==  LawConfig.commonConstant.SUCCESS ){
        $scope.law = result.result;
        $scope.codeFileName = result.result.codeFileName?LawConfig.lawConstant.lawCodeFileUrl + result.result.codeFileName:'views/images/1(2).png';
        //判断原告被告是否同意调解
        isAgree($scope.law);
      }else{
        $rootScope.toaster(level.error, title.error, result.message);
      }
    })

  };
  $scope.queryFilingDetails();

  //判断原告被告是否同意调解
  function isAgree(res) {
    //原告是否同意
    $scope.law.applyAgree = res.applyAgree ? res.applyAgree : '0';
    //被告是否同意
    $scope.law.respondentAgree = res.respondentAgree ? res.respondentAgree : '0';
    //申请法官介入
    $scope.law.applyJudge = res.applyJudge ? res.applyJudge : false;
  }

  //查询用户角色 personType    0:原告  1:被告 法官:2
  $scope.queryLawBindInfo = function () {
    $scope.lawService.queryLawBindInfo({
      "serialNo": $stateParams.serialNo
    }).success(function (result) {
      if(result.code ==  LawConfig.commonConstant.SUCCESS ){
        $scope.type = result.result;
        $scope.initMessage(0);
      }else{
        $rootScope.toaster(level.error, title.error, result.message);
      }
    })
  }
  $scope.queryLawBindInfo();


  //获取用户id,用来判断是不是本人
  $scope.$on('user2Child', function(){
    $scope.userId = LoginService.user.sysUser.id;
  });
  if (LoginService.user.userPermissions) {
    $scope.userId = LoginService.user.sysUser.id;
  }

  //初始化数据，请求消息
  $scope.messageArray=[];
  $scope.initMessage = function (isLive) {
    $scope.lawService.getCourtMediationMessage({
      "serialNo":$stateParams.serialNo,
      "isLive": isLive,
      "personType":$scope.type.personType
    }).success(function(result){
      // console.log(result)
      if(result.code ==  LawConfig.commonConstant.SUCCESS ){
        result.result.chatList && result.result.chatList.forEach(function(v){
          $scope.messageArray.push(v);
        });
        //判断原告被告是否同意调解
        isLive&&isAgree(result.result);
        //最底部刷新
        !isLive && $timeout(scrollTop,100);
      }else{
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageInitError);
      }
    })
  };

  var timer = $interval(function () {
    $scope.initMessage(1);
  }, 10000);

  //滚动条在最底部,数据刷新
  function scrollTop() {
    var div = document.getElementById('scrollDiv');
    if(div.scrollTop != div.scrollHeight){
      div.scrollTop = div.scrollHeight;
    }
  }
  //监听消息数组，
  $scope.$watch('messageArray',function (n,o) {
    if(n != o){
      //滚动条
      $timeout(scrollTop,100);
    }
  },true);

  var Message = function(){
    this.personName=LoginService.user.sysUser.text;
    this.createDate = new Date();
    this.serialNo= $scope.law.serialNo;
    this.content = $scope.saySomething;
    this.personType= $scope.type.personType ;
    this.userId = LoginService.user.sysUser.id;
  }

  //庭前调解聊天室
  $scope.sendMessage = function(){
    var message;
    if($scope.saySomething)
      message = new Message();
    else {
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageNullError);
      return false;
    }
    $scope.lawService.insertCourtMediationMessage(message).success(function(result){
      if(result.code ==  LawConfig.commonConstant.SUCCESS ){
        $scope.messageArray.push(message);
        $scope.saySomething = "";
        scrollTop();
      }else{
        $rootScope.toaster(level.error, title.error, result.message);
      }
    });

  };
  //回车发送
  $scope.keyDown = function (event) {
    var e = event || window.event;
    if(e && e.keyCode==13){
      $scope.sendMessage();
    }
  }


  //重启调解
  $scope.restartMediation = function(){
    //调解状态置0
    $scope.lawService.restartMediation({
      "serialNo":$scope.law.serialNo
    }).success(function (result) {
      if(result.code ==  LawConfig.commonConstant.SUCCESS ){
        //立即更新状态
        isAgree({});
      }else{
        $rootScope.toaster(level.error, title.error,result.message);
      }
    });
  };
  
  //结束调解
  $scope.mediationOver = function(){
    if(confirm("确认要结束调解吗？")) {
      if(timer) $interval.cancel(timer);
      $log.log($scope.CONSTANT.messageSessionDestroy);
      $scope.lawService.endPretrialMediation({
        "serialNo":$scope.law.serialNo
      }).success(function (result) {
        if(result.code ==  LawConfig.commonConstant.SUCCESS ){
          //go
          var redirect = $scope.law.isSmallAmount ? "small" : "common";
          var sendInfo = angular.toJson({type:$scope.law.state,redirect:redirect,isSuccess:result.result});
          $state.go('dashboard.pending_complete',{pageInfo:sendInfo})
        }else{
          $rootScope.toaster(level.error, title.error,result.message);
        }
      });
    }

  };
  
  //会话销毁
  $scope.$on("$destroy", function() {
    if(timer) $interval.cancel(timer);
    $log.log($scope.CONSTANT.messageSessionDestroy);
  });

  //申请法官介入
  $scope.judgeInvolved = function () {
    $scope.lawService.applyForJudge({
      "serialNo":$stateParams.serialNo
    }).success(function (result) {
      if(result.code ==  LawConfig.commonConstant.SUCCESS ){
        $scope.law.applyJudge = 1;
      }else{
        $rootScope.toaster(level.error, title.error,result.message);
      }
    });

  };

  //同意或者放弃调解,同意是1，放弃是2
  $scope.agreeMediation = function (operate,agree) {
    //按钮是置灰状态，代表不可点击
    if(operate == 1|| operate == 2){
      return false;
    }
    $scope.lawService.isAgreeMediation({
      "serialNo":$scope.law.serialNo,
      "agree": agree,
      "personType":$scope.type.personType
    }).success(function (result) {
      if(result.code ==  LawConfig.commonConstant.SUCCESS ){
        if($scope.type.personType == 0){
          $scope.law.applyAgree = agree;
        }
        if($scope.type.personType == 1){
          $scope.law.respondentAgree = agree;
        }
      }else{
        $rootScope.toaster(level.error, title.error,result.message);
      }
    });
  };

  //调解方案
  $scope.mediationPlan = function(){
    var url = $state.href("mediationPlan",{serialNo:$scope.law.serialNo, "personType":$scope.type.personType});
    window.open(url,'_blank');
  }
})

