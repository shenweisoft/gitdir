var app = angular.module('sbAdminApp');

angular.module('sbAdminApp').controller('inspectReportedCtrl', function (Upload,AdjustConfig,AdminConstant,$location,$scope, $stateParams, $state, $http, $log, PoliceConfig, PoliceService, DictionaryConfig, toaster, $filter,IdentityService,$rootScope) {

  //重置保存，完成鉴定，完成补录等按钮状态
  $rootScope.isInspectReported = false;
  $rootScope.isIdentify = false;
  $rootScope.isSupplement = false;
  $rootScope.isReported = false;
  $rootScope.isInjury = false;

  console.log($stateParams)
  var CONTANT = {
    success: 'success',
    error: 'error',
    warn: 'warn',
    sucTxt: '成功',
    errTxt: '错误',
    warnTxt: '警告'
  };

  $scope.$on('switchTab', function (event, type) {
    if(type == 'parties') $rootScope.isInspectReported = true;
    else $rootScope.isInspectReported = false;
  });

  //实际完成日期
  $scope.openCompleteTime = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.completeTimeIsOpen = true;
  };

  //格式化时间
  $scope.formatDate = function () {
    if($scope.police.appraisalInfoList && $scope.police.appraisalInfoList.length > 0) {
      _.each($scope.police.appraisalInfoList, function (v) {
        if(v.completeTime) v.completeTime = $scope.co.parseISO8601(v.completeTime);
      })
    }
  };
  //格式化时间
  $scope.formatDate2 = function () {
    if($scope.police.appraisalInfoList.length > 0) {
      _.each($scope.police.appraisalInfoList, function (v) {
        if(v.completeTime) v.completeTime = $filter('date')(v.completeTime, 'yyyy-MM-dd HH:mm:ss');
      })
    }
  };

  //检验数据有效性
  $scope.validDate = function () {
    if(!$scope.police.appraisalInfoList[0].completeTime) {
      $scope.police.appraisalInfoList[0].completeTimeError = true;
      $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择实际完成日期！');
      return false;
    } else $scope.police.appraisalInfoList[0].completeTimeError = undefined;
    return true;
  };

  //查询案件信息
  $scope.queryAppraisal = function () {
    PoliceService.queryAppraisal({id: $stateParams.id}).success(function (response) {
      if(response.code == PoliceConfig.commonConstant.SUCCESS) {
        console.log(response)
        $scope.police = response.result;
        //判断是否是完成鉴定的
        if($scope.police.appraisalInfoList[0].appraisalState >= '2') $rootScope.isIdentify = true;
        else $rootScope.isIdentify = false;
        //格式化时间
        $scope.formatDate()
      } else {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message)
      }
    });
  };

  //保存
  $scope.$on('updateAppraisalInfo', function (event, type) {
    //格式化时间
    $scope.formatDate2();
    //检验数据有效性
    if(!$scope.validDate()) {
      return false;
    }
    var message = "保存成功！";
    if(type) {
      if($scope.police.appraisalInfoList[0].enclosureInfoList.length==0){
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '检测鉴定报告不能为空!');
        return false;
      }
      $scope.police.appraisalInfoList[0].appraisalState = '2';
      message = "完成鉴定成功！";
      $rootScope.isIdentify = true;
    }
    PoliceService.updateAppraisalInfo(JSON.stringify($scope.police.appraisalInfoList[0])).success(function (response) {
      if(response.code == PoliceConfig.commonConstant.SUCCESS) {
        console.log(response)
        //$scope.police = response.result;
        //格式化时间
        $scope.formatDate()
        $rootScope.toaster(CONTANT.success, CONTANT.sucTxt, message)
      } else {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message)
      }
    })
  });

  //初始化
  $scope.initData = function () {
    $scope.queryAppraisal();
  };

  //初始化
  $scope.initData();

  //实际完成时间
  $scope.compareTime = function(obj){
    if(obj.completeTime){
        var entrustTime = $scope.co.parseISO8601(obj.entrustTime);//委托日期
        var entrustFinishTime = $scope.co.parseISO8601(obj.entrustFinishTime);//委托完成日期
        //var completeTime = $scope.co.parseISO8601(obj.completeTime); //实际完成日期
        if(!((entrustTime.getTime()<=obj.completeTime.getTime())&&(obj.completeTime.getTime()<=entrustFinishTime.getTime()))){
            obj.completeTime = null;
            $rootScope.toaster(CONTANT.error, CONTANT.errTxt, "【委托日期】<=【实际完成日期】<=【委托完成时限】")
        }
    }
  };
  /////////////////////////上传文件/////////////////////////////////
  //ie9一下检查flash版本
  function hasflash() {
    if(navigator.appName == "Microsoft Internet Explorer"&&parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""))<10){
      if (!FileAPI.hasFlash) {
        $scope.haveNoFlash = true;
        $rootScope.toaster("warn", '提示',"请先安装或者升级flash！");
      }
    }
  }
  hasflash();
  $scope.checkflash = function () {
    if($scope.haveNoFlash ){
      $rootScope.toaster("warn", '提示',"请先安装或者升级flash！");
    }
  }
  //限制图片大小
  function imageSize(file) {
    if(file){
      if(parseInt(file.size/(1024*1024))>= 10 ){
        $rootScope.toaster(level.warn, "提示","请上传小于10M大小的图片");
      }
    }
  }
  //添加文件
  $scope.addEvidence = function(files, obj, type) {
    if(!files) return;
    if(type) files = [files];
    if (files.length) {
      for (var i = 0; i < files.length; i++) {
        imageSize(files[i]);
        var fileName = files[i].name.substring(0,files[i].name.lastIndexOf('.'));
        type? $scope.uploadPicture(fileName,files[i],files.length,obj,type) : $scope.uploadPicture(fileName,files[i],files.length,obj,'');
      }
    }
  };
  //遮罩层 - 图片上传期间出现
  $scope.fileUploading = false;
  //上传图片
  $scope.uploadPicture = function(fileName,file,length,obj,type){
    if(!file){
      $rootScope.toaster(level.warn, title.warn, $scope.CONSTANT.messagePictrueTypeError);
      return;
    }
    //var type = file.name.split('.')[1];
    //if(type == 'jpg'|| type == 'png'){
    if(!type) {
      var evidence = new $scope.co.Evidence("");
      if(!obj.enclosureInfoList||obj.enclosureInfoList.length==0){
        obj.enclosureInfoList = [];
      }
      obj.enclosureInfoList.unshift(evidence);
    }
    //}
    $scope.fileUploading = true;
    Upload.upload({
      url: AdjustConfig.pictureConstant.policeUploadImgUrl,
      data: {
        file: file,
        type: type? '0':'1'
      }
    }).progress(function (evt) {
      //进度条
      if(!type) evidence.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    }).success(function(resp) {
      console.log(resp);
      switch (type) {
        case 'face': obj.identityCardApic = resp.result.path; break;
        case 'back': obj.identityCardBpic = resp.result.path; break;
      }
      if (type == 'face') { //身份证正面照，解析
        $http({
          method: 'post',
          url: '/lawProject/common/cardDisc',
          data: {
            "path": resp.result.path,
            "type": "applicant"
          }
        }).success(function(res) {
          if (res.code == AdjustConfig.commonConStant.SUCCESS && res.result) {
            obj.userName = res.result.name;
            obj.personCard = res.result.code;
            obj.sex = res.result.sex == '男' ? 1 : 0;
            obj.placeOfDomicile = res.result.addr;
          } else if (res.code == AdjustConfig.commonConStant.FAILURE) {
            $rootScope.toaster(CONTANT.error, CONTANT.errTxt, "身份证识别失败!");
          }
        })
      }
      $scope.fileUploading = false;
      if(!type) {
        evidence.id = resp.result.id;
        evidence.oldname = resp.result.oldname;
        evidence.path = resp.result.path;
        evidence.fileType = resp.result.fileType;
        evidence.isChecked = false; //设置默认不选中样式
      }
    }).error(function (data, status, headers, config) {
      console.log('error status: ' + data);
      $scope.fileUploading = false;
    });
  };

  //文件选择
  $scope.handleEnclosure = function (enclosureInfo, list, obj) {
    enclosureInfo.isChecked = !enclosureInfo.isChecked;
    //获取已选择的个数
    obj.enclosureArr = _.filter(list, function(v) {
      return v.isChecked
    });
    //当全部选中时，勾选全选框
    if(obj.enclosureArr.length == list.length) {
      obj.isAllChecked = true;
    } else {
      obj.isAllChecked = false;
    }
  };

  //全选
  $scope.handleAllChecked = function (event, list, obj) {
    if($(event.target).prop('checked')){
      //全选
      _.each(list, function (v) {
        v.isChecked = true;
      })
    } else {
      //全不选
      _.each(list, function (v) {
        v.isChecked = false;
      })
    }
    //获取已选择的个数
    obj.enclosureArr = _.filter(list, function(v) {
      return v.isChecked
    })
  };
  //下载文件
  $scope.downloadFile = function (file) {
      window.location.href=PoliceConfig.policeConstant.policeUploadUrl+'?id='+file.id;
  };
  //删除文件
  $scope.deleteEnclosure = function (obj) {
    if(confirm('确认删除所选文件？')) {
      var newEnclosureInfoList = angular.copy(obj.enclosureInfoList);
      //从前端删除所选文件
      function deleteFromThisLocality() {
        obj.enclosureInfoList.length = 0;
        _.each(newEnclosureInfoList, function (v) {
          if(!v.isChecked) obj.enclosureInfoList.push(v);
        });
        $rootScope.toaster(CONTANT.success, CONTANT.sucTxt, '删除成功！')
      }

      var idArr = [];
      _.each(newEnclosureInfoList, function (v) {
        if(v.id && v.isChecked) idArr.push(v.id);
      });
      //请求后台，删除文件
      PoliceService.deleteBatchFile({ids: idArr}).success(function (response) {
        if(response.code == PoliceConfig.commonConstant.SUCCESS) {
          console.log(response);
          deleteFromThisLocality();
        } else {
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message)
        }
      })
    }
  };

});