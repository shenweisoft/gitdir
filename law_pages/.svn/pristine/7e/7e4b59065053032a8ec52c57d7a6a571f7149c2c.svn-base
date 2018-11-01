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
angular.module('sbAdminApp').controller('AppraisalQueryDetailCtrl', function($filter,$scope, LoginService,$stateParams, $state,$http, $log, AppraisalConfig,AppraisalService,DictionaryConfig,toaster,$modal,$rootScope) {
    $scope.historyUrl = $stateParams.url;
    //获取流水号
    $scope.serialNo = $stateParams.serialNo;
    //
    $scope.appraisalInfoId = $stateParams.appraisalInfoId;
    //获取人员类型
    $scope.personType = $stateParams.personType;
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
    //状态集合
    $scope.appraisalDetailStateValue = DictionaryConfig.appraisalDetailStateValue;
    //取得详细信息表的状态
    $scope.appraisalDetailState = DictionaryConfig.appraisalDetailState;
    //查询流程
    $scope.queryAppraisalWorkFlowService = AppraisalService.queryAppraisalWorkFlow;
    //证件类型集合
    $scope.certificateTypeList = DictionaryConfig.certificateTypeConstant;
    //查询申请人和被申请集合Service
    $scope.queryAppraisalApplyerListService = AppraisalService.queryAppraisalApplyerList;
    //根据流水号查询鉴定详细信息
    $scope.queryAppraisalInfoService = AppraisalService.queryAppraisalInfo;
    //保存信息
    $scope.saveAppraisalInfoService = AppraisalService.saveAppraisalInfo;
    //插入评价
    $scope.insertAppraisalEvaluateService = AppraisalService.insertAppraisalEvaluate;
    //更新主表状态
    $scope.updateAppraisalInfoService = AppraisalService.updateAppraisalInfo;
    //是否存在签字页
    $scope.isExistByAppraisalNoWordType = AppraisalService.isExistByAppraisalNoWordType;

    $scope.CONSTANT = {
        "appraisalFeeError":"请输入鉴定费用",
        "estimateDateError":"请选择预计完成日期",
        "isBelieveError":"请选择鉴定意见是否采信",
        "isFullyError":"请选择鉴定意见是否说明充分",
        "cooperateError":"请选择鉴定人员配合程度",
        "efficiencyError":"请选择鉴定效率"
    };

    //评价对象
    function EvaluateVO(serialNo,appraisalItems,jyAppraisalInfoId,orgId){
      this.isBelieve = '';
      this.isFully = '';
      this.cooperate = '';
      this.efficiency = '';
      this.remark = '';
      this.serialNo = serialNo || '';
      this.appraisalItems = appraisalItems || '';
      this.jyAppraisalInfoId = jyAppraisalInfoId || '';
      this.orgId = orgId || ''
    }
    //鉴定评价
    $scope.evaluateShow = $state.current.name == 'dashboard.appraisalEvaluateDetail' ? true : '';

    //得到组织并初始化集合数据
    function initData() {
        //获取部门信息
        $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
        $scope.sysUser = LoginService.user.sysUser;
    }

    //初始化获取组织
    $scope.initOrg = function () {
        //根据组织机构获取人员列表
        $scope.$on('user2Child', function(){
            initData();
        });
        if (LoginService.user.userPermissions) {
            initData();
        }
    };
    //初始化数据
    $scope.initOrg();
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
                    //处理日期以及被鉴定人详细信息
                    $scope.appraisalInfo.appraisalDetailList.forEach(function(val) {
                        //日期转格式
                        val.estimateDate = val.estimateDate && parseISO8601(val.estimateDate);
                        //处理被鉴定人详情信息
                        var obj = _.find($scope.applyerArray, {id: val.jyAppraisalApplyerInfoId});
                        val.jyAppraisalApplyerInfo = angular.copy(obj);
                        //查询流程
                        $scope.queryAppraisalWorkFlowService({
                            "appraisalNo": val.appraisalNo
                        }).success(function (data) {
                            if(result.code ==  AppraisalConfig.commonConstant.SUCCESS ){
                                val.jyWorkFlowVOList = data.result;
                            }else{
                                $rootScope.toaster("error", "错误", result.message);
                            }
                        });
                        //如果是评价详细页则要查询是否存在签字页和鉴定报告
                        if( $scope.appraisalInfo.state == DictionaryConfig.appraisalState.finishState){
                            //是否存在签字页
                            $scope.isExist('40',val);
                            //是否存在鉴定报告
                            $scope.isExist('12',val)
                        }


                    });
                    $log.info($scope.appraisalInfo);
                  //创建评价对象
                  $scope.evaluateVO = new EvaluateVO($scope.appraisalInfo.serialNo,$scope.appraisalInfo.appraisalItems,$scope.appraisalInfo.id,$scope.appraisalInfo.appraisalOrgId);
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
    //查询是否存在签字页或者鉴定报告
    $scope.isExist = function (type,appraisalDetail) {
        $scope.isExistByAppraisalNoWordType({
            appraisalNo:appraisalDetail.appraisalNo,
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

    //取消鉴定
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

            appraisalDetail.state = data.state;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    //下载鉴定报告
    $scope.downloadReportFile = function (appraisalDetail) {
        return AppraisalConfig.appraisalConstant.dowAppraisalDocByNoWordTypeUrl + "?appraisalNo="+appraisalDetail.appraisalNo +'&wordType=12';
    }
    //下载签字页
    $scope.downloadSignFile = function (appraisalDetail) {
        var url = $state.href("downloadSign",{appraisalNo:appraisalDetail.appraisalNo});
        window.open(url,'_blank');
    }
    
    //补充证据
    $scope.supplementEvidence = function (appraisalDetail) {
        var url = $state.href("view_evidence",{serialNo:$scope.serialNo,id:appraisalDetail.id,supplement:"supplement"});
        window.open(url,'_blank');
    }
    
    //提交插入评价
    $scope.insertAppraisalEvaluate = function () {
        if(validateEvaluate()){
            $scope.insertAppraisalEvaluateService($scope.evaluateVO).success(function (result) {

                if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                    $scope.updateAppraisalInfoService({
                        "isEvaluate": true,
                        "id":$scope.appraisalInfoId
                    }).success(function (result) {
                        if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                            var sendInfo = angular.toJson({state: $scope.appraisalInfo.state,isEvaluate: $scope.appraisalInfo.isEvaluate});
                            $state.go("dashboard.pending_complete",{pageInfo:sendInfo});
                        }else{
                            $rootScope.toaster("error", "错误", result.message);
                        }
                    });
                }else{
                    $rootScope.toaster("error", "错误", result.message);
                }
            });
        }
    }
    //验证鉴定评价
    function validateEvaluate() {
        if(!$scope.evaluateVO.isBelieve){
            $rootScope.toaster("error", "错误",  $scope.CONSTANT.isBelieveError);
            return false;
        }
        if(!$scope.evaluateVO.isFully){
            $rootScope.toaster("error", "错误", $scope.CONSTANT.isFullyError);
            return false;
        }
        if(!$scope.evaluateVO.cooperate){
            $rootScope.toaster("error", "错误", $scope.CONSTANT.cooperateError);
            return false;
        }
        if(!$scope.evaluateVO.efficiency){
            $rootScope.toaster("error", "错误",$scope.CONSTANT.efficiencyError);
            return false;
        }
        return true;
    }
    //历史评价
    $scope.historyComment = function (appraisalDetailInfo) {
        var modalInstance = $modal.open({
            templateUrl: 'views/pages/appraisal/appraisal_comment.html',
            controller: 'appraisalCommentCtrl',
            size: 'lg',
            resolve: {
                loadMyFile: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['scripts/controllers/appraisal/appraisal_comment.js']
                    })
                },
                orgId:function(){
                    return  $scope.evaluateVO.orgId;
                }
            }
        });
        //返回值
        modalInstance.result.then(function (res) {
            console.log(res);
        }, function () {
        });
    }
});