angular.module('sbAdminApp').controller('indexImgMaintainCtrl', function($scope, $state,PrejudgeService,PrejudgeConfig,$modal,$stateParams,LoginService,$interval,LoginConfig,$log,LawService,AdjustConfig,Upload) {
  //查询banner图
  $scope.indexbannerImgListData = LoginService.indexbannerImgListData
  //查询banner图Url前半部
  $scope.firstImgUrl=LoginConfig.pictureConstant.bigPictureUrl
  //banner数组
  $scope.slides = [];
  //获取banner图片路径
  var Obj = function(url) {
    this.image = url;
  }
  //查询banner图Url后半部list
  $scope.indexbannerImgListData({}).success(function (result) {
    if (result.code == LoginConfig.commonConStant.SUCCESS) {
      $scope.imgUrlList = result.result
      for (var i =0; i < $scope.imgUrlList.length; i++) {
        // 判断图片页面位置
        if($scope.imgUrlList[i].hierarchy=="banner"){
          var imgUrlList=$scope.imgUrlList[i].path;
          //图片地址拼接填充到数组里
          $scope.slides.push(new Obj($scope.firstImgUrl+imgUrlList));
        }
      }
    } else {
      toaster.pop(level.error, title.error, $scope.CONSTANT.messageBackend);
    }
  })
  // 显示页面维护弹出框
  $scope.editImg=function(){
    var popupModal = $modal.open({
      templateUrl: 'views/pages/indexImgMaintain/indexImgMaintainlist.html',
      controller: 'indexImgMaintainlistCtrl',
      size: 'lg',
      resolve: {
        items: function(){
          return {}
        }
      }
    });
  }
  /*图片轮播*/
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

// banner图片维护弹出框
angular.module('sbAdminApp').controller('indexImgMaintainlistCtrl', function($scope, $state,PrejudgeService,PrejudgeConfig,$modal,$stateParams,LoginService,$interval,LoginConfig,$log,LawService,AdjustConfig,Upload,toaster,$rootScope) {
  //获取图片列表
  $scope.getImgListData = LoginService.getImgListData;
  //删除图片列表
  $scope.deleteImgListData = LoginService.deleteImgListData;
  //增加banner图
  $scope.addImgListData = LoginService.addImgListData;
  $scope.CONSTANT = {
    "messagePictrueTypeError":"请上传图片格式文件",
    "messageBackend":"查询后台数据失败！请联系管理员",
    "errormessag":"请联系系统管理员",
    "success":"修改成功",
    "addSuccess":"新增成功"
  }
  var level = {
    "warn": "warn",
    "error": "error",
    "success": "success"
  }
  var title = {
    "error": "错误",
    "success": "成功"
  }
  $scope.aadbox = false;
   
  //限制图片大小
  function imageSize(file) {
    if(file){
      if(parseInt(file.size/(1024*1024))>= 10 ){
        $rootScope.toaster(level.warn, title.warn,"请上传小于10M大小的图片");
      }
    }
  }
  //上传申请人图片功能
  $scope.uploadImage = function(file, imgObj) {
    imageSize(file);
    if(!file){
      $rootScope.toaster(level.warn, title.warn, $scope.CONSTANT.messagePictrueTypeError);
      return;
    }

    Upload.upload({
      url: LoginConfig.pictureConstant.uploadBannerImageUrl,
      data: {
        type: 'imgObj'
      },
      file: file
    }).success(function(resp) {
        imgObj.path = resp.result;
    }).error();
  };
  //构建img对象
  var ImgObj = function(){
    this.id = "";
    this.pictureName = "";
    this.sort = "";    //排序
    this.hierarchy = ""; //布局位置
    this.path = "";   //地址保存路径
    this.state ="";  //发布状态 0/1
    this.color ="";   //颜色
  }
  //初始化对象
  $scope.imgObj = new ImgObj();
  //获取图片列表显示
  $scope.initData = function () {
    $scope.getImgListData($scope.imgObj).success(function (result) {
      if (result.code == LoginConfig.commonConStant.SUCCESS) {
          $scope.imgObjList = result.result;
      } else {
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
      }
    })
  }
  $scope.initData();
  //增加banner图片
  $scope.addBanner = function(obj){
    if(obj){//修改
      $scope.addImgListData(obj).success(function (result) {
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
            $rootScope.toaster(level.success, title.success, $scope.CONSTANT.success);
        } else {
            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
        }
      })
    }else{//新增
      $scope.addImgListData($scope.imgObj).success(function (result) {
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
            $scope.imgObj.id = result.result.id;
            //向集合中添加一条记录
            $scope.imgObjList.unshift($scope.imgObj);
            $scope.imgObj = new ImgObj();
            $scope.addbox=false;
            $rootScope.toaster(level.success, title.success, $scope.CONSTANT.addSuccess);
        } else {
            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
        }
      })
    }
  }
  //删除banner图片
  $scope.deleteBanner =function(obj){
    $scope.deleteImgListData(obj).success(function(result){
      if (result.code == LoginConfig.commonConStant.SUCCESS) {
          $scope.imgObjList = result.result;
      } else {
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
      }
    })
  }
});