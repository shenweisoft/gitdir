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

app.controller('secondStep5Ctrl', function($scope, $stateParams, toaster, SecondLitigantionConfig, SecondLitigantionService, Upload,$rootScope) {
  //赋值step
  $scope.options.step = $stateParams.step;

  //预览图路径
  $scope.imageAddress = SecondLitigantionConfig.pictureConstant.smallPictureUrl;
  //下载文件路径
  $scope.downloadFileUrl = SecondLitigantionConfig.lawCaseConStant.downLoadEvidenceUrl;

  //定义图片构造函数
  var Evidence = function(picture) {
    this.classify = "";
    this.picture = picture;
    this.tagClose = false;
    this.selected = false;
    this.personType = '0';
    this.chooseTagArray = [];
    this.operateState = '1000';
    this.delFlag=0;
    this.progressPercentage = 0;
  };

  $scope.init = function () {
    //查询案件证据
    $scope.queryEvidence();
  };

  //查询当前案件证据信息
  $scope.queryEvidence = function () {
    console.log($scope.secondInstanceInfoVO)
    SecondLitigantionService.queryEvidenceFileListInfo({serialNo: $scope.secondInstanceInfoVO.serialNo}).success(function (res) {
      if(res.code == SecondLitigantionConfig.commonConStant.SUCCESS) {
        //将证据列表向上传给父级，用于验证
        $scope.$emit('getUploadEvidenceList', res.result);
        //根据证据不同状态进行分组
        //重置数组数据
        $scope.appealEvidence.length = 0;
        $scope.materialsEvidence.length = 0;
        $scope.restsEvidence.length = 0;
        _.each(res.result, function (v) {
          if(v.evidenceType == 0) {
            $scope.appealEvidence.push(v)
          } else if(v.evidenceType == 1) {
            $scope.materialsEvidence.push(v);
          } else {
            $scope.restsEvidence.push(v);
          }
        })
      } else {
        $rootScope.toaster($scope.validate.error, $scope.validate.errorTxt, res.message);
      }
    })
  };

  //批量证据增加
  $scope.imageAddress = SecondLitigantionConfig.pictureConstant.smallPictureUrl;
  $scope.addEvidence = function(files, evidenceType) {
    if(!files) return;
    if (files && files.length) {
      //$scope.co.doingShow = true;
      for (var i = 0; i < files.length; i++) {
        /*//为每个图片对象添加类型
        files[i].evidenceType = type;*/
        imageSize(files[i]);
        var fileName = files[i].name.substring(0,files[i].name.lastIndexOf('.'));
        $scope.uploadPicture(fileName,files[i],files.length, evidenceType);
        console.log(files[i])
      }
    }
  };

  //上传图片
  $scope.uploadPicture = function(fileName,file,length, evidenceType){
    if(!file){
      $rootScope.toaster("warn", "提示", $scope.CONSTANT.messagePictrueTypeError);
      return;
    }
    //var type = file.name.split('.')[1];
    Upload.upload({
      url: SecondLitigantionConfig.pictureConstant.upLoadEvidenceFile,
      data: {
        file: file,
        name: file.name,
        type: 'evidence',
        evidenceType: evidenceType,
        serialNo:$scope.secondInstanceInfoVO.serialNo
      }
    }).progress(function (evt) {
      //evidence.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    }).success(function(resp) {
      console.log(resp)
      //将该证据显示在页面中
      if(resp.result.evidenceType == '0') {
        $scope.appealEvidence.push(resp.result)
      } else if(resp.result.evidenceType == '1') {
        $scope.materialsEvidence.push(resp.result);
      } else {
        $scope.restsEvidence.push(resp.result);
      }
    }).error(function (data, status, headers, config) {
      console.log('error status: ' + data);
    });
  };

  //下载文件
  $scope.downloadFile = function (evidence) {
    return $scope.downloadFileUrl+'?docId='+evidence.id;
  };

  //删除文件
  $scope.deleteFile = function (evidence, index) {
    if(confirm("确定删除吗？")){
      console.log(evidence)
      SecondLitigantionService.deleteEvidenceInfo({id: evidence.id}).success(function (res) {
        if(res.code == SecondLitigantionConfig.commonConStant.SUCCESS) {
          $rootScope.toaster($scope.validate.success, $scope.validate.successTxt, "删除成功");
          //重新请求证据列表
          //$scope.queryEvidence();
          //在列表中删除数据
          if(evidence.evidenceType == '0') {
            $scope.appealEvidence.splice(index, 1);
          } else if(evidence.evidenceType == '1') {
            $scope.materialsEvidence.splice(index, 1);
          } else {
            $scope.restsEvidence.splice(index, 1);
          }
        } else {
          $rootScope.toaster($scope.validate.error, $scope.validate.errorTxt, res.message);
        }
      })
    }
  };

  //限制图片大小
  function imageSize(file) {
    if(file){
      if(parseInt(file.size/(1024*1024))>= 10 ){
        $rootScope.toaster("warn", "提示", "请上传小于10M大小的文件");
      }
    }
  }

  //判断是否显示预览图
  $scope.isImg = function (evidence) {
    var imgReg = /\.jpg$|\.jpeg$|\.bmp$|\.png$|\.gif$/i;
    if(imgReg.test(evidence.evidenceName)) {
      return true;
    } else return false;
  };

  //当父级页面数据赋值后，初始化当前页面
  $scope.$on('init', function () {
    $scope.init();
  });

});