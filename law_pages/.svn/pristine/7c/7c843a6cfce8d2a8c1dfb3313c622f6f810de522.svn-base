/**
 * Created by shenwei on 2017/5/10.
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
angular.module('sbAdminApp').controller('AppraisalInfoDetailCtrl', function($filter,$scope, LoginService,$stateParams, $state,$http, $log, AppraisalConfig,AppraisalService,DictionaryConfig,toaster,$modal,$rootScope) {

    //鉴定主表ID
    $scope.appraisalInfoId = $stateParams.appraisalInfoId;
    //获取流水号
    $scope.serialNo = $stateParams.serialNo;
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
    //根据流水号查询鉴定详细信息
    $scope.queryAppraisalInfoService = AppraisalService.queryAppraisalInfo;
    //保存信息
    $scope.saveAppraisalInfoService = AppraisalService.saveAppraisalInfo;
    //查询流程
    $scope.queryAppraisalWorkFlowService = AppraisalService.queryAppraisalWorkFlow;

    $scope.CONSTANT = {
        "appraisalFeeError":"请输入鉴定费用",
        "estimateDateError":"请选择预计完成日期",
        "appraisalFeeTypeError":"鉴定费用必须输入数字"
    };
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
                    //将组织中的扩展字段转换成json
                    if($scope.appraisalInfo) $scope.appraisalInfo.extPro = JSON.parse($scope.appraisalInfo.extPro);
                    //只取状态为1001的鉴定任务
                    var newAppraisalDetailList = $scope.appraisalInfo.appraisalDetailList.filter(function(val) {
                        //处理被鉴定人详情信息
                        var obj = _.find($scope.applyerArray, {id: val.jyAppraisalApplyerInfoId});
                        val.jyAppraisalApplyerInfo = angular.copy(obj);
                        //日期转格式
                        val.estimateDate = val.estimateDate && parseISO8601(val.estimateDate);
                        //查询流程
                        $scope.queryAppraisalWorkFlowService({
                            "appraisalNo": val.appraisalNo
                        }).success(function (data) {
                            if(data.code ==  AppraisalConfig.commonConstant.SUCCESS ){
                                val.jyWorkFlowVOList = data.result;
                            }else{
                                $rootScope.toaster("error", "错误", result.message);
                            }
                        });
                        return val.state == DictionaryConfig.appraisalDetailState.launchState && val.isAdminicle != true;
                    });
                    $scope.appraisalInfo.appraisalDetailList = newAppraisalDetailList;
                    $log.info($scope.appraisalInfo);
                }else{
                    $rootScope.toaster("error", "错误", result.message);
                }
            });

        }else{
            $rootScope.toaster("error", "错误", result.message);
        }
    });

    function parseISO8601(dateStringInRange,flag) {
        var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d) (\d{2}):(\d{2}):(\d{2})\s*$/,
          date = new Date(NaN), month,
          parts = isoExp.exec(dateStringInRange);
        if(parts) {
            month = +parts[2];
            date.setFullYear(parts[1], month - 1, parts[3]);
            if(flag){
                date.setHours(parts[4], parts[5], parts[6]);
                return date;
            }
            if(month != date.getMonth() + 1) {
                date.setTime(NaN);
            }
        }
        return date;
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

    $scope.validateForm = function(){

        for(var i = 0; i < $scope.appraisalInfo.appraisalDetailList.length; i++){
            var appraisalDetail = $scope.appraisalInfo.appraisalDetailList[i];
            appraisalDetail.appraisalFeeError = "";
            appraisalDetail.estimateDateError = "";
            //鉴定费用
            if(!appraisalDetail.appraisalFee){
                appraisalDetail.appraisalFeeError = $scope.CONSTANT.appraisalFeeError;
                $rootScope.toaster("error", "错误", appraisalDetail.appraisalFeeError);
                return false;
            }else{
                if(/\D/.test(appraisalDetail.appraisalFee)){
                    appraisalDetail.appraisalFeeError = $scope.CONSTANT.appraisalFeeTypeError;
                    $rootScope.toaster("error", "错误",appraisalDetail.appraisalFeeError);
                    return false;
                }

            }
            //鉴定完成事件
            if(!appraisalDetail.estimateDate){
                appraisalDetail.estimateDateError = $scope.CONSTANT.estimateDateError;
                $rootScope.toaster("error", "错误", appraisalDetail.estimateDateError);
                return false;
            }
        }
        return true;
    };

    //补充材料或者退回任务
    $scope.handleAppraisal = function(appraisalDetail,state){

        var popupModal = $modal.open({
            templateUrl: 'views/pages/appraisal/cancelAppraisal.html',
            controller: 'CancelAppraisalCtrl',
            size: 'lg',
            resolve: {
                items: function(){
                    return {
                        appraisalDetail: appraisalDetail,
                        state:state,
                        appraisalInfo:$scope.appraisalInfo
                    }
                }
            }
        });
        //处理返回值
        popupModal.result.then(function(data) {
            var tempIndex;
            $scope.appraisalInfo.appraisalDetailList.filter(function(val, index) {
                if (val.id == data.id) {
                    tempIndex = index;
                    return true;
                }
                return false;
            });
            $scope.appraisalInfo.appraisalDetailList.splice(tempIndex, 1);
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    //接收鉴定信息
    $scope.receiveAppraisal = function(){

        if($scope.validateForm()){
            //处理日期
            $scope.appraisalInfo.appraisalDetailList.forEach(function(v) {
                if (v.estimateDate) v.estimateDate = $filter('date')(v.estimateDate, 'yyyy-MM-dd HH:mm:ss');
                v.state = DictionaryConfig.appraisalDetailState.receiveState;
                v.receiveDate = $filter('date')(new Date(),"yyyy-MM-dd HH:mm:ss"); //接收日期
            });
            $scope.oldState =  $scope.appraisalInfo.state;
            $scope.appraisalInfo.state = DictionaryConfig.appraisalState.receiveState;
            $scope.appraisalInfo.extPro = JSON.stringify($scope.appraisalInfo.extPro);
            //接收
            $scope.saveAppraisalInfoService($scope.appraisalInfo).success(function (result) {
                if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                    $scope.appraisalInfo.extPro = JSON.parse($scope.appraisalInfo.extPro);
                    var sendInfo = angular.toJson({state: $scope.oldState});
                    $state.go("dashboard.pending_complete",{pageInfo:sendInfo});
                }else{
                    $rootScope.toaster("error", "错误", result.message);
                }
            });
        }
    };

    //查询证据
    $scope.queryEvidence = function(appraisalDetail){
        var url = $state.href("view_evidence",{serialNo:$scope.serialNo,id:appraisalDetail.id});
        window.open(url,'_blank');
    };
});


