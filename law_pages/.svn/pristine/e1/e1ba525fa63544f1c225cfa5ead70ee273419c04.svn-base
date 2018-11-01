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
app.filter('id2AppraisalItem', function($log) {
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
angular.module('sbAdminApp').controller('AppraisalReturnDetailCtrl', function($scope, LoginService,$stateParams, $state,$http, $log, AppraisalConfig,AppraisalService,DictionaryConfig,toaster,$modal,LawService,$filter,$rootScope) {
    //查询流水号
    $scope.serialNo = $stateParams.serialNo;
    $scope.appraisalInfoId = $stateParams.appraisalInfoId;
    //鉴定详细表ID
    $scope.appraisalDetailInfoId = $stateParams.appraisalDetailInfoId;
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
    //更新任务
    $scope.updateAppraisalDetailInfoService = AppraisalService.updateAppraisalDetailInfo;
    //插入流程表
    $scope.insertAppraisalWorkFlowService = AppraisalService.insertAppraisalWorkFlow;
    //鉴定详细表状态
    $scope.state = DictionaryConfig.appraisalDetailState;
    //查询流程表
    $scope.queryAppraisalWorkFlowService = AppraisalService.queryAppraisalWorkFlow;
    //更新主表Service
    $scope.updateAppraisalInfoService = AppraisalService.updateAppraisalInfo;
    //定义常量
    $scope.CONSTANT = {
        isAgreeError: "请选择审批意见",
        remarkError: "处理意见不能为空"
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
                    $scope.appraisalInfo.extPro = JSON.parse($scope.appraisalInfo.extPro);
                    //取得鉴定号为$scope.appraisalDetailInfoId 的数据
                    $scope.appraisalDetail = _.find($scope.appraisalInfo.appraisalDetailList, {id: parseInt($scope.appraisalDetailInfoId)});
                    //处理被鉴定人详情
                    var obj = _.find($scope.applyerArray, {id: $scope.appraisalDetail.jyAppraisalApplyerInfoId});
                    $scope.appraisalDetail.jyAppraisalApplyerInfo = angular.copy(obj);
                    //查询流程
                    $scope.queryAppraisalWorkFlowService({
                        "appraisalNo": $scope.appraisalDetail.appraisalNo
                    }).success(function (data) {
                        if(result.code ==  AppraisalConfig.commonConstant.SUCCESS ){
                            $scope.appraisalDetail.jyWorkFlowVOList = data.result;
                        }else{
                            $rootScope.toaster("error", "错误", result.message);
                        }
                    });
                    $log.info(result.result);
                }else{
                    $rootScope.toaster("error", "错误", result.message);
                }
            });
        }else{
            $rootScope.toaster("error", "错误", result.message);
        }
    });
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

    //查询证据
    $scope.queryEvidence = function(appraisalDetail){
        var url = $state.href("view_evidence",{serialNo:$scope.serialNo,id:appraisalDetail.id});
        window.open(url,'_blank');
    };

    //表单验证
    function validateForm() {

        //审批意见
        if (!$scope.isAgree == undefined){
            $rootScope.toaster("error", "错误", $scope.CONSTANT.isAgreeError);
            return false;
        }
        //处理意见
        $scope.remarkError = "";
        if (!$scope.remark && $scope.isAgree != '0') {
            $scope.remarkError = $scope.CONSTANT.remarkError;
            $rootScope.toaster("error", "错误", $scope.remarkError);
            return false;
        }
        return true;
    }

    //定义流程主表信息
    var WorkFlow = function() {
        this.appraisalNo = $scope.appraisalDetail.appraisalNo;
        this.operatorId = "";
        this.operatorName = "";
        this.orgCode = "";
        this.orgName = "";
        this.remark = '';
        this.tempData = "";
        this.result = undefined;
        this.resultName =  '';
    };
    //插入流程表
    $scope.insertWorkflow = function () {
        //获取部门信息
        $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
        $scope.sysUser = LoginService.user.sysUser;
        //初始化对象
        var workFlow = new WorkFlow();
        workFlow.operatorId = $scope.sysUser.id;
        workFlow.operatorName = $scope.sysUser.text;
        workFlow.orgCode = $scope.userDepart.orgId;
        workFlow.orgName = $scope.userDepart.orgName;
        workFlow.remark = $scope.remark;
        //状态
        workFlow.result = $scope.appraisalDetail.state;
        //状态值
        if(workFlow.result == DictionaryConfig.appraisalDetailState.launchState){
            workFlow.resultName = "驳回退回";
        }else{
            workFlow.resultName =  _.find(DictionaryConfig.appraisalDetailStateValue, {id: workFlow.result}).value;
        }
        $scope.insertAppraisalWorkFlowService(workFlow).success(function (result) {
            if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                var sendInfo = angular.toJson({subState: $scope.oldState,result:workFlow.result});
                $state.go("dashboard.pending_complete",{pageInfo:sendInfo});
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        });
    };

    //初始化获取组织
    $scope.initOrg = function () {
        //根据组织机构获取人员列表
        $scope.$on('user2Child', function(){
            $scope.insertWorkflow();
        });
        if (LoginService.user.userPermissions) {
            $scope.insertWorkflow();
        }
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
            $scope.oldState = $scope.appraisalDetail.state;
            //同意退回
            if($scope.isAgree == 0){
                $scope.appraisalDetail.state = DictionaryConfig.appraisalDetailState.confirmReturnState;
            }else{//拒绝退回
                $scope.appraisalDetail.state = DictionaryConfig.appraisalDetailState.launchState;
            }

            //更新子表状态
            $scope.updateAppraisalDetailInfoService($scope.appraisalDetail).success(function (result) {
                if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                    if($scope.isAgree == 0){
                        $scope.handleAppraisalInfo();
                        //插入流程表
                        $scope.initOrg();
                    }else{
                        //更新主表状态
                        var appraisalInfo = {};
                        //接收和处理环节的驳回退回都去待接收环节
                        appraisalInfo.state = DictionaryConfig.appraisalState.launchState;
                        appraisalInfo.serialNo = $stateParams.serialNo;
                        appraisalInfo.id = $scope.appraisalDetail.jyAppraisalInfoId;

                        $scope.updateAppraisalInfoService(appraisalInfo).success(function (data) {
                            if(data.code == AppraisalConfig.commonConstant.SUCCESS){
                                //插入流程表
                                $scope.initOrg();
                            }else{
                                $rootScope.toaster("error", "错误", data.message);
                            }
                        });
                    }

                }else{
                    $rootScope.toaster("error", "错误", result.message);
                }
            });
        }
    };
});