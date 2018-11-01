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
angular.module('sbAdminApp').controller('secondInstanceEvidenceCtrl', function ($scope, DictionaryConfig,AppraisalConfig,AppraisalService,$stateParams,AdjustConfig,$filter,toaster,AdjustService,Upload,LawConfig,$modal,$state,SecondLitigantionService,SecondLitigantionConfig,$rootScope) {
  //根据流水号查询鉴定详细信息
  $scope.queryAppraisalDetailInfoService = SecondLitigantionService.queryEvidenceFileListInfo;
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
  //证据类型分类
  $scope.evidenceTypeList = [
    {id: "1", text: "民事上诉状、答辩状"},
    {id: "2", text: "主体材料"},
    {id: "3", text: "其他证据材料"}
  ];
  $scope.supplement = $stateParams.supplement;
  //证据信息
  $scope.evidenceInfo = function () {
    $scope.appraisalEvidenceList = [];
    $scope.stage = 'info';//查看证据
    //查询鉴定详细信息
    $scope.queryAppraisalDetailInfoService({
      serialNo: $stateParams.serialNo
    }).success(function (result) {
      if (result.code == AppraisalConfig.commonConstant.SUCCESS) {
        console.log(result)
        $scope.appraisalDetail = result.result;
        $scope.appraisalEvidenceList = result.result;
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
  $scope.collapseVar = '0';
  $scope.filterFeeType = function(id){
    if(id){
      //筛选
      $scope.appraisalEvidenceList = $scope.appraisalDetail.filter(function (x) {
        return x.evidenceType == parseInt(id) - 1;
      });
      //渲染底色的横线
      $scope.collapseVar = id;
    }else{ //全部
      $scope.appraisalEvidenceList =  $scope.appraisalDetail;
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
  };

  //下载文件
  //下载文件路径
  $scope.downloadFileUrl = SecondLitigantionConfig.lawCaseConStant.downLoadEvidenceUrl;
  $scope.downloadFile = function (evidence) {
    return $scope.downloadFileUrl+'?docId='+evidence.id;
  };

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

  //定义查询Service
  $scope.selectSecondIntanceInfoService = SecondLitigantionService.querySecondIntanceInfo;
  //根据ID查询主表数据
  $scope.initData = function(){
    $scope.selectSecondIntanceInfoService({
      id:$stateParams.id
    }).success(function (res) {
      if (res.code === SecondLitigantionConfig.commonConStant.SUCCESS) {
        $scope.secondIntanceInfo = res.result;
        $scope.secondApplicantArray = $scope.secondIntanceInfo.secondInstanceApplicantArray;
        console.log($scope.secondIntanceInfo)
        //格式化数据
        $scope.formatData($scope.secondIntanceInfo);
      } else {//请求失败
        $rootScope.toaster("error", "错误", res.message);
      }
    })
  };
  $scope.initData();

  //格式化数据
  $scope.formatData  = function (v) {
    if(v.checkDate) v.checkDate = v.checkDate.split(' ')[0];
    else v.checkDate = new Date();

    if(v.courtDate) v.courtDate = v.courtDate.split(' ')[0];
    else v.courtDate = new Date();
  };
});