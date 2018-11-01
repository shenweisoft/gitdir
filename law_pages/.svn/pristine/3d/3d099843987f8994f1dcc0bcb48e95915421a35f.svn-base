
angular.module('sbAdminApp').controller('homePageCtrl', function(DictionaryConfig, $scope, $state,PrejudgeService,PrejudgeConfig,$modal,$stateParams,LoginService,$interval,LoginConfig,$log,LawService,toaster,$rootScope) {




    $scope.sendSocket = function(){

        $state.go('chatSocket');
    }



    var level = DictionaryConfig.toaster.level;
    var title = DictionaryConfig.toaster.title;

    //内部常量
    $scope.CONSTANT = {
      "messageRemarkNull": "请您输入意见",
      "messageReceiveDateNull": "收件日期不能为空",
      "messageReceiveDateError": "收件日期格式不正确",
      "messageIsAgreeNull": "请您选择审批意见",
      "messageLawMoneyNull": "标的金额不能为空",
      "messageLawMoneyError": "标的金额格式不正确",
      "messageFeeNull": "预收受理费不能为空",
      "messageFeeError": "预收受理费格式不正确",
      "messageLawNoNameNull" : "案号年份不能为空",
      "messageLawNoNameError" : "案号年份格式不正确",
      "messageLawNoNull": "案号不能为空",
      "messageLawNoError": "案号格式不正确",
      "messageFilingDateNull": "立案日期不能为空",
      "messageFilingDateError": "立案日期格式不正确",
      "messageJurisdictionReasonNull": "受辖理由不能为空",
      "messageCourtDateNull": "开庭时间不能为空",
      "messageCourtDateError": "开庭时间格式不正确",
      "messageChiefJudgeIdNull": "审判长不能为空",
      "messageChiefJudgeNull": "审判员不能为空",
      "messageUndertakeJudgeNull":"承办法官不能为空",
      "messageClerkIdNull": "书记员不能为空",
      "messageCourtIdNull": "法庭名称不能为空",
      "messageCourtNumNull": "庭次不能为空",
      "messageCourtNumError": "庭次格式不正确",
      "messageUndertakerIdNull": "承办人不能为空",
      "messageMemberOneIdNull": "合议庭成员1不能为空",
      "messageMemberTwoIdNull": "合议庭成员2不能为空",
      "messageUndertakerPhoneNull": "联系电话不能为空",
      "messageUndertakerPhoneError": "手机号码格式不正确",
      "messageMenberNull": "合议庭成员不能相同"
    };

    //获取环境配置Service
    $scope.queryJyEnvironmentInfoService = LoginService.queryJyEnvironmentInfo;
    //定义查询用户SessionService
    $scope.queryUserInfoService = LoginService.queryUserInfo;
    //定义退出Service
    $scope.logoutService = LoginService.logout;
    //获取地址
    $scope.locationUrl = window.location.href;
    //$scope.signUrl = 'http://jttj.court.gov.cn/#/home_page/home'; //首信地址
    //$scope.signIp = 'http://210.73.66.152/#/home_page/home';
    //$scope.sign = $scope.locationUrl==$scope.signUrl || $scope.locationUrl==$scope.signIp;
    $scope.signUrl = 'jttj.court.gov.cn'; //首信地址
    $scope.signIp = '210.73.66.152';
    if($scope.locationUrl.indexOf($scope.signUrl) !== -1 || $scope.locationUrl.indexOf($scope.signIp) !== -1){
        $scope.sign = true;
    }else{
        $scope.sign = false;
    }

    $scope.online = $stateParams.online;
    //主页显示页面
    $scope.headerActive = 'home';
    $scope.loginShow = true;
    $scope.prejudgeService = PrejudgeService;

    $scope.data = {
      problemList:[], //常见问题
      statuteList:[],//法律法规
      judicialList:[] //司法解释
    };

    //获取用户信息，初始化session 去后台数据库查找
    $scope.queryUserInfoService().success(function(result) {
      if (result.result) {
        //用户赋值
        $scope.user  = result.result;
        $scope.username = $scope.user.sysUser.text;
      if($scope.user.sysUser.userType == '0'){//公民
          $scope.loginShow = false;
        }
      }else{
        $scope.loginShow = true;
      }
    });
    //获取环境配置
    $scope.queryJyEnvironmentInfoService({}).success(function(result){
      if (result.code==LoginConfig.commonConStant.SUCCESS) {
        $scope.environmentalAllocation = result.result.environmentType;
      }
    })
    //退出用户
    $scope.exit = function () {
      $scope.logoutService({}).success(function(result) {
        $scope.loginShow = true;
      });
    };
    $scope.getDataInfo = function () {
        $scope.prejudgeService.queryNoticeList({pageNo:'1',pageSize:'1000'}).success(function(result) {
          var data = result.result;
          if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
            if(data){
              var problemList = data.filter(function(v){return v.type == 0;});
              if(problemList){
                $scope.data.problemList = problemList.slice(0,3);//截取3条
              }
              var statuteList = data.filter(function(v){return v.type == 2;});
              if(statuteList){
                $scope.data.statuteList = statuteList.slice(0,2);
              }
              var judicialList = data.filter(function(v){return v.type == 3;});
              if(judicialList){
                $scope.data.judicialList = judicialList.slice(0,7);
              }
            }
          } else {
            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
          }
        })
      };

  $scope.getDataInfo();

  //登陆
  $scope.login = function(type){
    //如果已经登陆
    $scope.queryUserInfoService().success(function(result) {
      if (result.result) {
        if(result.result.sysUser.userType == '0'){
          $state.go('dashboard.sue_input',{type:type});
        }else{
          $state.go('dashboard.home');
        }
      }else{
        $state.go('login');
      }
    });
  };


  //在线开庭打开新窗口
  $scope.online = function () {
    $scope.headerActive='home';
    var url = $state.href("online_trial");
    window.open(url,'_blank');
  };

  //文书
  $scope.instrumentList = function () {
   $scope.$parent.headerActive= '';
   $state.go("home_page.instrument");
  };
  
  $scope.toManagePlatForm = function(){
    var url = "http://www.jtspt.com/lawStatistics";
    window.open(url,'_blank');
  }

  //更多
  $scope.more = function () {
    $scope.$parent.headerActive = '';
  };

  //进入司法邮箱
  $scope.goEmail = function(){
    //如果已经登陆
    $scope.queryUserInfoService().success(function(result) {
      if (result.result) {
        LawService.getSingleLoginOnMail().success(function(res){
          window.open(res.result,'_blank');
        });
      }else{//如果没有登陆
        var url = "http://mail.jtspt.com";
        window.open(url,'_blank');
      }
    });
  };


  /*图片轮播*/
  //查询banner图
  $scope.indexbannerImgListData = LoginService.indexbannerImgListData
  //查询banner图Url前半部
  $scope.firstImgUrl=LoginConfig.pictureConstant.bigPictureUrl
  //banner数组
  $scope.slides = [];
  //查询banner图Url后半部list
  $scope.indexbannerImgListData().success(function (result) {
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
           $scope.imgUrlList = result.result
           for (var i =0; i < $scope.imgUrlList.length; i++) {
                // 判断图片位置
                if($scope.imgUrlList[i].hierarchy=="banner"){ //banner图片
                    var imgUrlList=$scope.imgUrlList[i].path;
                    function obj (url){
                        this.image = url;
                    }
                    //图片地址拼接填充到数组里
                    $scope.slides.push(new obj($scope.firstImgUrl+imgUrlList));
                }else if($scope.imgUrlList[i].hierarchy=="top2"){ //logo图片
                    $scope.headerNavImgUrl=$scope.firstImgUrl+$scope.imgUrlList[i].path;
                }else if($scope.imgUrlList[i].hierarchy=="top1"){//导航入口
                      $scope.btnColor = {
                        "background-color" : $scope.imgUrlList[i].color
                      }
                }else if($scope.imgUrlList[i].hierarchy=="bg1"){//背景色
                      $scope.bgColor = {
                        "background-color" : $scope.imgUrlList[i].color
                      }
                }else if($scope.imgUrlList[i].hierarchy=="top2bg"){//logo图片背景 
                      $scope.top2bgColor = {
                        "background-color" : $scope.imgUrlList[i].color
                      }
                }
            }
        } else {
            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
        }
   })

  $scope.direction = 'left';
  $scope.currentIndex = 0;

  $scope.setCurrentSlideIndex = function (index) {
    $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
    $scope.currentIndex = index;
    $interval.cancel( $scope.currentInterval);
    play()
  };

  $scope.isCurrentSlideIndex = function (index) {
    return $scope.currentIndex === index;
  };

  $scope.prevSlide = function () {
    $scope.direction = 'left';
    $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
    $interval.cancel( $scope.currentInterval);
    play()
  };

  $scope.nextSlide = function () {
    $scope.direction = 'right';
    $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
    $interval.cancel( $scope.currentInterval);
    play()
  };

  function play() {
    $scope.currentInterval = $interval($scope.nextSlide,5000);
  }
  play();
}) .animation('.slide-animation', function () {
  return {
    beforeAddClass: function (element, className, done) {
      var scope = element.scope();

      if (className == 'ng-hide') {
        var finishPoint = element.parent().width();
        if(scope.direction !== 'right') {
          finishPoint = -finishPoint;
        }
        TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
      }
      else {
        done();
      }
    },
    removeClass: function (element, className, done) {
      var scope = element.scope();

      if (className == 'ng-hide') {
        element.removeClass('ng-hide');

        var startPoint = element.parent().width();
        if(scope.direction === 'right') {
          startPoint = -startPoint;
        }

        TweenMax.fromTo(element, 0.5, { left: startPoint }, {left: 0, onComplete: done });
      }
      else {
        done();
      }
    }
  };
});

angular.module('sbAdminApp').controller('helpCenterCtrl', function($scope, $state,PrejudgeService,PrejudgeConfig,$modal,$stateParams,LoginService,LoginConfig) {
  //
  $scope.online = $stateParams.online;
  //帮助中心显示页面
  $scope.page = $scope.online ? 5:1;

  if($scope.online){
    $scope.$parent.headerActive = 'help'
  }
})