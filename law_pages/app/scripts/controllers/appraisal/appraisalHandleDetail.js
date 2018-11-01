/**
 * Created by shenwei on 2017/5/11.
 */
var app = angular.module('sbAdminApp');
app.filter('id2Text', function() {
    return function(id,data) {
        var result = _.find(data, {
            id: id+""
        });
        return result? result.value:""
    }
});
app.filter('id2AppraisalItem', function() {
    return function(idStr,data) {
        var str = "";
        var isFirst = true;
        // if(idStr && (idStr.indexOf(',') !== -1)){
        if(idStr && idStr != '' && idStr.split(',').length > 0){
            idStr.split(",").forEach(function(val){
                if(!isFirst){
                    str += ",";
                }
                var result = _.find(data, {id: val});
                str += result.value;
                isFirst = false;
            });
        }
        return str? str:""
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
app.filter('orgNull', function() {
  return function(val) {
    return  val && val || "法院";
  }
});
angular.module('sbAdminApp').controller('AppraisalHandleDetailCtrl', function($scope, LoginService,$stateParams, $state,$http, $log, AppraisalConfig,AppraisalService,DictionaryConfig,toaster,$modal,LawService,$filter,Upload,$timeout,$rootScope) {

    $scope.serialNo = $stateParams.serialNo;
    $scope.appraisalInfoId = $stateParams.appraisalInfoId;
    $scope.appraisalDetailInfoId = $stateParams.appraisalDetailInfoId;
    $scope.appraisalNo = $stateParams.appraisalNo;
    //鉴定用途集合
    $scope.identificationPurposeList = DictionaryConfig.identificationPurposeList;
    //委托主体集合
    $scope.principalAgentList = DictionaryConfig.principalAgentList;
    //鉴定类型集合
    $scope.appraisalTypeList = DictionaryConfig.appraisalTypeList;
    //鉴定项目集合
    $scope.appraisalItemList = DictionaryConfig.appraisalItemList;
    //性别集合
    $scope.sexList = DictionaryConfig.sexList;
    //证件类型集合
    $scope.certificateTypeList = DictionaryConfig.certificateTypeConstant;
    //查询申请人和被申请集合Service
    $scope.queryAppraisalApplyerListService = AppraisalService.queryAppraisalApplyerList;
    //查询组织人员
    $scope.querySysUserByOrgIdService = LawService.querySysUserByOrgId;
    //根据流水号查询鉴定详细信息
    $scope.queryAppraisalInfoService = AppraisalService.queryAppraisalInfo;
    //更新任务
    $scope.updateAppraisalDetailInfoService = AppraisalService.updateAppraisalDetailInfo;
    //插入流程表
    $scope.insertAppraisalWorkFlowService = AppraisalService.insertAppraisalWorkFlow;
    //鉴定详细表状态
    $scope.state = DictionaryConfig.appraisalDetailState;
    //更新主表Service
    $scope.updateAppraisalInfoService = AppraisalService.updateAppraisalInfo;
    //是否存在签字页
    $scope.isExistByAppraisalNoWordType = AppraisalService.isExistByAppraisalNoWordType;
    //查询案号
    $scope.checkAppraisalDetailLawNoService = AppraisalService.checkAppraisalDetailLawNo;

    //定义常量
    $scope.CONSTANT = {
        lawNoError : "案号不能为空",
        lawNoRepeatError : "已经存在此案号,请重新输入",
        appraisalDateError : "请选择鉴定日期！",
        appraisalPlaceError : "鉴定地点不能为空",
        chiefAppraiserIdError : "请选择主鉴定人！",
        downloadSignError : "请上传签字页",
        downloadReportShowError : "请上传鉴定报告",
        resultError: "请选择审批意见",
        remarkError: "处理意见不能为空"
    }
    //申请人集合
    $scope.queryAppraisalApplyerListService({
        serialNo:$scope.serialNo,
        id:$scope.appraisalInfoId
    }).success(function (result) {
        if(result.code == AppraisalConfig.commonConstant.SUCCESS){
            $scope.applyerArray = result.result;
            //查询鉴定详细信息
            $scope.queryAppraisalInfoService({
                serialNo:$scope.serialNo,
                id:$scope.appraisalInfoId
            }).success(function (result) {
                if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                    //查收结果
                    $scope.appraisalInfo = result.result;
                    console.log($scope.appraisalInfo);
                    //将组织中的扩展字段转换成json
                    $scope.appraisalInfo.extPro = JSON.parse($scope.appraisalInfo.extPro);
                    //取得鉴定号为$scope.appraisalDetailInfoId 的数据
                    $scope.appraisalDetail = _.find($scope.appraisalInfo.appraisalDetailList, {id: parseInt($scope.appraisalDetailInfoId)});
                    //鉴定日期默认为今天,如果有日期，转格式
                    $scope.appraisalDetail.appraisalDate =  Date.parse($scope.appraisalDetail.appraisalDate) || new Date();
                    // console.log($scope.appraisalDetail);
                    //处理被鉴定人详情
                    var obj = _.find($scope.applyerArray, {id: $scope.appraisalDetail.jyAppraisalApplyerInfoId});
                    $scope.appraisalDetail.jyAppraisalApplyerInfo = angular.copy(obj);
                    //初始化鉴定人和流程表
                    $scope.getCurrentOrg();
                    //是否存在签字页
                    $scope.isExist('40',$scope.appraisalDetail);
                    //是否存在鉴定报告
                    $scope.isExist('12',$scope.appraisalDetail)
                }else{
                    $rootScope.toaster("error", "错误", result.message);
                }
            });
        }else{
            $rootScope.toaster("error", "错误", result.message);
        }
    });

    //查询是否存在签字页或者鉴定报告
    $scope.isExist = function (type,appraisalDetail) {
        $scope.isExistByAppraisalNoWordType({
            appraisalNo:$scope.appraisalNo,
            wordType:type
        }).success(function (res) {
          console.log(res)
            if(res.code ==  AppraisalConfig.commonConstant.SUCCESS ){
              if(type == '12'){
                appraisalDetail.downloadReportShow = true;
              }else{
                appraisalDetail.downloadSignShow = true;
              }

            }
        });
    }
    //从session中获取组织人员
    $scope.getCurrentOrg = function () {
        $scope.$on('user2Child', function(){
            initOrg();
        });
        if (LoginService.user.userPermissions) {
            initOrg();
        }
    }
    //或者组织
    function initOrg(){
        $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
        $scope.sysUser = LoginService.user.sysUser;
        //获取鉴定人
        $scope.querySysUser();
        //流程表初始化
        $scope.workFlow = new WorkFlow();
    }
    //获取鉴定人
    $scope.querySysUser = function () {
        $scope.querySysUserByOrgIdService({
            "orgId": $scope.userDepart.orgId
        }).success(function (res) {
            if(res.code ==  AppraisalConfig.commonConstant.SUCCESS ){
                //主鉴定人
                $scope.chiefAppraiserList = res.result;
            }else{
                $rootScope.toaster("error", "错误", res.message);
            }
        });
    }

    //查询当事人信息
    $scope.queryPersonDetail = function(){
        $modal.open({
            templateUrl: 'views/pages/appraisal/person_detail.html',
            controller: 'PersonDetailCtrl',
            size: 'lg',
            resolve: {
                items: function(){
                    return {
                        applyerArray: $scope.applyerArray
                    }
                }
            }
        });
    };

    //日历打开,预计完成日期
    $scope.open = function ($event, appraisalDetail) {
        $event.preventDefault();
        $event.stopPropagation();
        appraisalDetail.opened = true;
    };

    //查询证据
    $scope.queryEvidence = function(appraisalDetail){
        var url = $state.href("view_evidence",{serialNo:$scope.serialNo,id:appraisalDetail.id});
        window.open(url,'_blank');
    };

    //鉴定人更换
    $scope.changeAppraiser = function (id,appraisalDetail) {
        appraisalDetail.chiefAppraiserName = id && _.find($scope.chiefAppraiserList,{id:id}).text
    };

    //表单验证
    function validateForm() {
        var appraisalDetail = $scope.appraisalDetail;
        var workFlow = $scope.workFlow;

        appraisalDetail.lawNoError = "";
        appraisalDetail.appraisalDateError = "";
        appraisalDetail.appraisalPlaceError = "";
        appraisalDetail.chiefAppraiserIdError = "";
        //如果是同意
        if(workFlow.result == '0' ){
            //案号
            if (!appraisalDetail.lawNo) {
                appraisalDetail.lawNoError = $scope.CONSTANT.lawNoError;
                $rootScope.toaster("error", "错误", appraisalDetail.lawNoError);
                return false;
            }
            //鉴定地点
            if (!appraisalDetail.appraisalPlace) {
                appraisalDetail.appraisalPlaceError = $scope.CONSTANT.appraisalPlaceError;
                $rootScope.toaster("error", "错误", appraisalDetail.appraisalPlaceError);
                return false;
            }
            //主鉴定人
            if (!appraisalDetail.chiefAppraiserId) {
                appraisalDetail.chiefAppraiserIdError = $scope.CONSTANT.chiefAppraiserIdError;
                $rootScope.toaster("error", "错误", appraisalDetail.chiefAppraiserIdError);
                return false;
            }
            //签字页
            if (!appraisalDetail.downloadSignShow) {
                $rootScope.toaster("error", "错误", $scope.CONSTANT.downloadSignError);
                return false;
            }
            //鉴定报告
            if (!appraisalDetail.downloadReportShow) {
                $rootScope.toaster("error", "错误", $scope.CONSTANT.downloadReportShowError);
                return false;
            }


        }else{
            //审批意见
            if ($scope.workFlow.result == undefined) {
                $rootScope.toaster("error", "错误", $scope.CONSTANT.resultError);
                return false;
            }
            //处理意见
            if (!workFlow.remark && workFlow.result != '0') {
                workFlow.remarkError = $scope.CONSTANT.remarkError;
                $rootScope.toaster("error", "错误", workFlow.remarkError);
                return false;
            }

        }
        return true;
    }

    $scope.deal = function() {
        $scope.appraisalDetail.lawNoError = '';
        if($scope.appraisalDetail.lawNo){
            $scope.dealLawNo = true;
            $scope.checkAppraisalDetailLawNoService({"lawNo":$scope.appraisalDetail.lawNo}).success(function (res) {
                if(res.code ==  AppraisalConfig.commonConstant.FAILURE ){
                    $scope.appraisalDetail.lawNoError = $scope.CONSTANT.lawNoRepeatError;
                    $rootScope.toaster("error", "错误", $scope.appraisalDetail.lawNoError);
                    $scope.dealLawNo = true;
                }else{
                    $scope.dealLawNo = false;
                }
            }).error(function (res) {
                $rootScope.toaster("error", "错误", res.message);
            })

        }

    }
    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    };

    //处理主表状态
    $scope.handleAppraisalInfo = function(){
        //如果字表状态全部为完成状态，则更新主表信息
        var handleFlag = true;
        var appraisalInfo = angular.copy($scope.appraisalInfo);
        //循环判断是否都为完成状态
        appraisalInfo.appraisalDetailList.forEach(function(val){
            if(val.state != DictionaryConfig.appraisalDetailState.finishState && val.state != DictionaryConfig.appraisalDetailState.cancelState && val.state != DictionaryConfig.appraisalDetailState.confirmReturnState){
                handleFlag = false;
            }
        });
        //如果都是完成状态
        if(handleFlag){
            appraisalInfo.extPro = JSON.stringify(appraisalInfo.extPro);
            appraisalInfo.state = DictionaryConfig.appraisalState.finishState;
            $scope.updateAppraisalInfoService(appraisalInfo).success(function (data) {
                if(data.code == AppraisalConfig.commonConstant.SUCCESS){
                }else{
                    $rootScope.toaster("error", "错误", data.message);
                }
            });
        }
    };

    //提交鉴定任务
    $scope.submitAppraisalDetail = function(){
        //验证
        if(validateForm()){
            //日期处理
            $scope.appraisalDetail.appraisalDate = $filter('date')($scope.appraisalDetail.appraisalDate,'yyyy-MM-dd HH:mm:ss');
            //更新状态
            $scope.oldState = $scope.appraisalDetail.state;
            $scope.appraisalDetail.state = ($scope.workFlow.result == 0 && $scope.state.finishState) || ($scope.workFlow.result == 1 && $scope.state.returnState) || ($scope.workFlow.result == 2 && $scope.appraisalDetail.state);
            //表示补充证据
            if($scope.workFlow.result == 2){
                $scope.appraisalDetail.isAdminicle = true;
            }
            //获取当前退回时间
            var currentDateStr = new Date().format("yyyy-MM-dd hh:mm:ss");
            //赋值时间
            $scope.appraisalDetail.returnDate = currentDateStr;
            //更新主表
            $scope.updateAppraisalDetailInfoService($scope.appraisalDetail).success(function (result) {
                if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                    //处理主表是否已经完全处理完成
                    if($scope.workFlow.result == 0){
                        $scope.handleAppraisalInfo();
                    }
                    //插入流程表
                    $scope.insertWorkflow();
                }else{
                    $rootScope.toaster("error", "错误", result.message);
                }
            });
        }
    };

    //定义流程主表信息
    var WorkFlow = function() {
        this.appraisalNo = $scope.appraisalDetail.appraisalNo;
        this.operatorId = $scope.sysUser.id;
        this.operatorName = $scope.sysUser.text;
        this.orgCode = $scope.userDepart.orgId;
        this.orgName = $scope.userDepart.orgName;
        this.remark = '';
        this.tempData = "";
        this.result = undefined;
        this.resultName =  '';
    };
    //插入流程表
    $scope.insertWorkflow = function () {
        //审核通过
        if($scope.workFlow.result == 0){
            $scope.workFlow.result = DictionaryConfig.appraisalDetailState.finishState;

        }else if ($scope.workFlow.result == 1){//审核驳回
            $scope.workFlow.result = DictionaryConfig.appraisalDetailState.returnState;
        }else{//补充证据
            $scope.workFlow.result = DictionaryConfig.appraisalDetailState.supplementState;
        }
        $scope.workFlow.resultName =  _.find(DictionaryConfig.appraisalDetailStateValue, {id: $scope.workFlow.result}).value;
        $scope.insertAppraisalWorkFlowService($scope.workFlow).success(function (result) {
            if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                var sendInfo = angular.toJson({subState: $scope.oldState,result:$scope.workFlow.result});
                $state.go("dashboard.pending_complete",{pageInfo:sendInfo});
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        });
    }

    //上传签字页
    $scope.uploadSignFile = function (files) {
      if(!files) return;
        if(files && files.length) {
            for (var i = 0; i < files.length; i++) {
                $scope.uploadDocPicture(files[i]);
            }
        }
    }
    $scope.uploadDocPicture = function (file) {
        //上传签字页
        Upload.upload({
            url: AppraisalConfig.appraisalConstant.uploadAppraisalImageFileUrl,
            data: {
                file: file,
                serialNo:$scope.serialNo,
                appraisalNo: $scope.appraisalNo,
                wordType:'40'
            }
        }).success(function (res) {
            if(res.code ==  AppraisalConfig.commonConstant.SUCCESS ){
                $scope.appraisalDetail.downloadSignShow = true;
            }else{
                $rootScope.toaster("error", "错误", res.message);
            }
        });
    }
    //上传鉴定报告
    $scope.uploadReportFile = function (file) {
        if(!file) return;
        Upload.upload({
            url: AppraisalConfig.appraisalConstant.coverAppraisalFileByWordTypeUrl,
            data: {
                file: file,
                serialNo:$scope.serialNo,
                appraisalNo: $scope.appraisalNo,
                wordType: '12',
                name:'鉴定报告'
            }
        }).success(function (res) {
            if(res.code ==  AppraisalConfig.commonConstant.SUCCESS ){
                $scope.appraisalDetail.downloadReportShow = true;
            }else{
                $rootScope.toaster("error", "错误", res.message);
            }
        });

    }
    //下载签字页
    $scope.downloadSignFile = function () {
      var url = $state.href("downloadSign",{appraisalNo:$scope.appraisalNo});
      window.open(url,'_blank');
    }
    //下载鉴定报告
    $scope.downloadReportFile = function () {
        return AppraisalConfig.appraisalConstant.dowAppraisalDocByNoWordTypeUrl + "?appraisalNo="+$scope.appraisalNo +'&wordType=12';
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
});