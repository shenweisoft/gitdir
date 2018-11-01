/**
 * Created by shenwei on 2017/5/5.
 */
'use strict';
var app = angular.module('sbAdminApp');

app.filter('appraisalItem', function() {
  return function(idStr,data) {
    var arr = [];
    if(idStr && (idStr.indexOf(',') !== -1)){
      idStr.split(",").forEach(function(val){
        var result = _.find(data, {id: val});
        arr.push(result.value);
      });
    }
    return arr? arr:""
  }
});
app.filter('listFilter', function() {
  return function(arr,id) {
    var list = [];
    arr.forEach(function (v) {
      v.classify.split(",").forEach(function (m) {
        if(m == id) list.push(v);
      })
      console.log(v,id);
    })
    return list && list
  }
});
app.filter('idValue', function() {
  return function(id,arr) {
    var value;
    id && id.split(",").forEach(function (v) {
      value = _.find(arr, {id: v}).value;
    });

    return value && value;
  }
});

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
app.filter('selectedCount', function() {
  return function(arr) {
    return arr.filter(function(v) {
      return v.selected;
    }).length;
  }
});
angular.module('sbAdminApp').controller('viewEvidenceCtrl', function ($scope, DictionaryConfig,AppraisalConfig,AppraisalService,$stateParams,AdjustConfig,$filter,toaster,AdjustService,Upload,LawConfig,$modal,$state,$rootScope) {
  //根据流水号查询鉴定详细信息
  $scope.queryAppraisalDetailInfoService = AppraisalService.saveAppraisalDetailInfo;
  //保存证据
  $scope.saveAppraisalEvidenceService = AppraisalService.saveAppraisalEvidence;
  //图片地址
  $scope.imageAddress = AdjustConfig.pictureConstant.smallPictureUrl;
  //费用类型集合
  $scope.appraisalClassifyList = DictionaryConfig.appraisalClassifyList;
  //鉴定类型集合
  $scope.appraisalTypeList = DictionaryConfig.appraisalTypeList;
  //鉴定项目集合
  $scope.appraisalItemList = DictionaryConfig.appraisalItemList;
  //委托主体
  $scope.principalAgentList = DictionaryConfig.principalAgentList;
  //鉴定用途
  $scope.identificationPurposeList = DictionaryConfig.identificationPurposeList;
  //取得详细信息表的状态
  $scope.appraisalDetailState = DictionaryConfig.appraisalDetailState;
  //更新任务
  $scope.updateAppraisalDetailInfoService = AppraisalService.updateAppraisalDetailInfo;
  //更新主表状态
  $scope.updateAppraisalInfoService = AppraisalService.updateAppraisalInfo;
  $scope.adjustService = AdjustService;
  $scope.CONSTANT = {
    "evidenceNameError": "请输入证据名称",
    "evidenceDescriptionError": "请输入证据描述",
    "evidenceClassifyError": "请选择证据分类",
    "evidenceError": "请您添加证据"
  };
  $scope.supplement = $stateParams.supplement;
  //证据信息
  $scope.evidenceInfo = function () {
    $scope.appraisalEvidenceList = [];
    $scope.stage = 'info';//查看证据
    //查询鉴定详细信息
    $scope.queryAppraisalDetailInfoService({
      id: $stateParams.id
    }).success(function (result) {
      if (result.code == AppraisalConfig.commonConstant.SUCCESS) {
        $scope.appraisalDetail = result.result;
        $scope.appraisalDetail.appraisalEvidenceList.forEach(function (v) {
          if(v.state == '2'){
            $scope.appraisalEvidenceList.push(v);
          }
        })
      } else {
        $rootScope.toaster("error", "错误", result.message);
      }
    })
  }

  //补充证据
  $scope.supplementEvidence = function () {
    $scope.stage = 'supplement';//补充证据
    //查询鉴定详细信息
    $scope.queryAppraisalDetailInfoService({
      id: $stateParams.id
    }).success(function (result) {
      if (result.code == AppraisalConfig.commonConstant.SUCCESS) {
        $scope.appraisalDetail = result.result;
        result.result.appraisalEvidenceList.forEach(function (v) {
          if(v.state == '1'){
            $scope.supAppraisalEvidenceList.push(v);
          }
        })
      } else {
        $rootScope.toaster("error", "错误", result.message);
      }
    })
  }


  if($stateParams.supplement ){
    $scope.supAppraisalEvidenceList = [];
    $scope.supplementEvidence();//补充证据
  }else{
    $scope.evidenceInfo();//查看证据
  }

  //根据类型筛选集合内容
  $scope.collapseVar = '';
  $scope.filterFeeType = function(id){
    if(id){
      //筛选
      $scope.appraisalEvidenceList = $filter('listFilter')($scope.appraisalDetail.appraisalEvidenceList,id);
      //渲染底色的横线
      $scope.collapseVar = id;
    }else{
      $scope.appraisalEvidenceList =  $scope.appraisalDetail.appraisalEvidenceList;
      $scope.collapseVar = 0;
    }
  };

  //定义证据构造器
  function AppraisalEvidence(picture,name,description,operateState){
    this.jyAppraisalDetailInfoId = $stateParams.id;
    this.classify = "";
    this.picture = picture;
    this.state = "1";
    this.name = name || "";
    this.description = description || "";
    this.tagClose = false;
    this.selected = false;
    this.operateState = operateState || '1003';
  }
  $scope.imageAddress = AdjustConfig.pictureConstant.smallPictureUrl;
  //添加证据
  $scope.addAppraisalEvidence = function(files,info){
    if(!files) return;
    if (files && files.length) {
      for (var i = 0; i < files.length; i++) {
        imageSize(files[i]);    // 图片大小大于10M
        var fileName = files[i].name.substring(0,files[i].name.lastIndexOf('.'));
        $scope.uploadPicture(fileName,files[i]);
      }
    }
  };

  //上传图片
  $scope.uploadPicture = function(fileName,file){
    Upload.upload({
      url: LawConfig.pictureConstant.uploadImageUrl,
      data: {
        file: file,
        type: 'appraisal'
      }
    }).success(function(res) {
      if (res.code == AppraisalConfig.commonConstant.SUCCESS) {
        //新建证据对象
        var appraisalEvidence = new AppraisalEvidence(res.result);
        appraisalEvidence.name = fileName;
        //数据添加对象
        $scope.supAppraisalEvidenceList.push(appraisalEvidence);
      } else if (res.code == AppraisalConfig.commonConStant.FAILURE) {
        $rootScope.toaster("error", "错误", result.message);
      }
    });
  };

  //证据删除
  $scope.removeEvidences = function(appraisalEvidence) {
    var indices = [];
    var idArray = [];
    if(appraisalEvidence){
      if(appraisalEvidence.id) idArray.push(appraisalEvidence.id);
      indices.push($scope.supAppraisalEvidenceList.indexOf(appraisalEvidence));
    }else{
      $scope.supAppraisalEvidenceList.forEach(function(v, i) {
        if (v.selected) indices.unshift(i);
        if (v.selected && v.id) idArray.push(v.id);
      })
    }

    function deleteSelected(arr, indiz) {
      indiz.forEach(function(v) {
        arr.splice(v, 1);
      })
    }

    if (idArray.length) {
      $scope.adjustService.removeAppraisalEvidence({
        idArray: idArray
      }).success(function(result) {
        if (result.code == AdjustConfig.commonConStant.SUCCESS) {
          //删除所有ID对应的对象
          deleteSelected($scope.supAppraisalEvidenceList, indices);
        } else if (result.code == AdjustConfig.commonConStant.FAILURE) {
          $rootScope.toaster("error", "错误", result.message);
        }
      });
    } else {
      deleteSelected($scope.supAppraisalEvidenceList, indices);
    }
  }
  //编辑证据标签
  $scope.addTag = function (appraisalEvidence, appraisalClassifyId){

    var feeType = $scope.appraisalClassifyList.filter(function(item) {
      return item.id == appraisalClassifyId;
    });
    if (!appraisalEvidence.classify) {
      appraisalEvidence.chooseTagArray = [];
      appraisalEvidence.chooseTagArray.push(feeType[0]);
      appraisalEvidence.classify += appraisalClassifyId;
    } else if (appraisalEvidence.classify.indexOf(appraisalClassifyId) == -1) {
      appraisalEvidence.chooseTagArray.push(feeType[0]);
      appraisalEvidence.classify += "," + appraisalClassifyId;
    }
  };
  //关闭证据标签
  $scope.closeTag = function (appraisalEvidence,id) {
    var feeType = appraisalEvidence.chooseTagArray.filter(function(item) {
      return item.id == id;
    });
    var tagIndex = appraisalEvidence.chooseTagArray.indexOf(feeType[0]);
    appraisalEvidence.chooseTagArray.splice(tagIndex, 1);

    appraisalEvidence.classify = "";
    appraisalEvidence.chooseTagArray.forEach(function(v) {
      if (!appraisalEvidence.classify) {
        appraisalEvidence.classify += v.id
      } else {
        appraisalEvidence.classify += "," + v.id;
      }
    })
  }

  //证据全选
  $scope.selectAllItems = false;
  $scope.selectAllappraisal = function() {
    $scope.selectAllItems = !$scope.selectAllItems;
    $scope.supAppraisalEvidenceList.forEach(function(v, i) {
      if ($scope.selectAllItems) {
        v.selected = true;
      } else {
        v.selected = false;
      }
    })
  }
  //选择证据
  $scope.selectEvidence = function (appraisalEvidence) {
    appraisalEvidence.selected = !appraisalEvidence.selected;
    $scope.selectAllItems = true;
    $scope.supAppraisalEvidenceList.forEach(function(v, i) {
      if(!v.selected) {
        $scope.selectAllItems = false;
      }
    })
  }
  //选择已有证据
  $scope.chooseEvidence = function () {
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/appraisal/choose_evidence.html',
      controller: 'chooseEvidenceCtrl',
      size: 'lg',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/choose_evidence.js']
          })
        }
      }
    });
    //返回值
    modalInstance.result.then(function (res) {
      console.log(res);
      res.forEach(function (v) {
        //新建证据对象
        var appraisalEvidence = new AppraisalEvidence(v.picture,v.name,v.description,v.operateState);
        appraisalEvidence.operateName = v.operateName;
        //数据添加对象
        $scope.supAppraisalEvidenceList.push(appraisalEvidence);
      })

    }, function () {
    });
  };

  //保持信息
  $scope.saveAppraisal = function (goState) {
    var saveFlag = goState;
    goState = goState || function () {};
    //保存信息
    $scope.saveAppraisalEvidenceService({
      evidenceList :$scope.supAppraisalEvidenceList
    }).success(function (result) {
      if (result.code == AppraisalConfig.commonConstant.SUCCESS) {
        $scope.supAppraisalEvidenceList.forEach(function (v,i) {
          v.id = result.result[i];
        });
        if(!saveFlag && saveFlag != 0){
          $rootScope.toaster("success", "成功", "保存成功！");
        }
        goState();
      } else {
        $rootScope.toaster("error", "错误", result.message);
      }
    });
  };
  //确定举证
  $scope.comfirmProof = function () {
    if(validateEvidenceForm()){
      $scope.supAppraisalEvidenceList.forEach(function (v,i) {
        v.state = '2';  //1代表暂存，2代表可视
      });
      $scope.saveAppraisal(function () {

        //更新主表状态
        /*var appraisalInfo = {};
        //接收和处理环节的补充完证据以后都去待接收环节

        console.log( $scope.appraisalDetail)
        appraisalInfo.state = DictionaryConfig.appraisalState.launchState;
        appraisalInfo.serialNo = $stateParams.serialNo;
        appraisalInfo.id = $scope.appraisalDetail.jyAppraisalInfoId;

        $scope.updateAppraisalInfoService(appraisalInfo).success(function (data) {
          if(data.code == AppraisalConfig.commonConstant.SUCCESS){

          }else{
            $rootScope.toaster("error", "错误", data.message);
          }
        });*/
        //更新子表
        $scope.appraisalDetail.isAdminicle = false;
        $scope.updateAppraisalDetailInfoService($scope.appraisalDetail).success(function (result) {
          if(result.code == AppraisalConfig.commonConstant.SUCCESS){
            //页面显示空的证据
            $scope.supAppraisalEvidenceList = [];
            window.opener.location.reload();
            $state.go('appraisal_supComplete');
          }else{
            $rootScope.toaster("error", "错误", result.message);
          }
        });

      })
    }
  }
  //验证证据
  function validateEvidenceForm() {
    var appraisalDetail = {};
    //如果证据不存在
    if (! $scope.supAppraisalEvidenceList ||  $scope.supAppraisalEvidenceList.length == 0) {
      appraisalDetail.evidenceError = $scope.CONSTANT.evidenceError;
      $rootScope.toaster("error", "错误",  $scope.CONSTANT.evidenceError);
      return false;
    } else {
      for (var i = 0; i < $scope.supAppraisalEvidenceList.length; i++) {
        var appraisalEvidence = $scope.supAppraisalEvidenceList[i];
        appraisalEvidence.evidenceNameError = "";
        appraisalEvidence.evidenceDescriptionError = "";
        //证据名称
        if (!appraisalEvidence.name) {
          appraisalEvidence.evidenceNameError = $scope.CONSTANT.evidenceNameError;
          $rootScope.toaster("error", "错误",  $scope.CONSTANT.evidenceNameError);
          return false;
        }
        //证据描述
        if (!appraisalEvidence.description) {
          appraisalEvidence.evidenceDescriptionError = $scope.CONSTANT.evidenceDescriptionError;
          $rootScope.toaster("error", "错误",  $scope.CONSTANT.evidenceDescriptionError);
          return false;
        }
      /*  //证据类型
        if (!appraisalEvidence.classify) {
          appraisalEvidence.evidenceClassifyError = $scope.CONSTANT.evidenceClassifyError;
          $rootScope.toaster("error", "错误",  $scope.CONSTANT.evidenceClassifyError);
          return false;
        }*/
      }
    }
    return true;
  }

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
        $rootScope.toaster("warn", '提示',"请上传小于10M大小的图片");
      }
    }
  }
});