/**
 * Created by shenwei on 2017/5/17.
 */
angular.module('sbAdminApp').controller('CancelAppraisalCtrl', function($filter,$scope, $modal, items, $modalInstance,$log,DictionaryConfig,toaster,AppraisalConfig,AppraisalService,LoginService,$state,$rootScope) {

    $scope.appraisalDetail = items.appraisalDetail;
    $scope.appraisalInfo = items.appraisalInfo;
    $scope.state = items.state;
    //更新任务
    $scope.updateAppraisalDetailInfoService = AppraisalService.updateAppraisalDetailInfo;
    //插入流程信息
    $scope.insertAppraisalWorkFlowService = AppraisalService.insertAppraisalWorkFlow;
    //更新主表Service
    $scope.updateAppraisalInfoService = AppraisalService.updateAppraisalInfo;
    //定义常量
    $scope.CONSTANT = {
        "appraisalRemarkError":"请输入理由"
    };
    //验证表单
    $scope.validateForm = function(){

        $scope.appraisalRemarkError = "";
        if(!$scope.remark){
            $scope.appraisalRemarkError = $scope.CONSTANT.appraisalRemarkError;
            $rootScope.toaster("error", "错误", $scope.appraisalRemarkError);
            return false;
        }
        return true;
    };

    //定义流程主表信息
    var WorkFlow = function() {
        this.appraisalNo = $scope.appraisalDetail.appraisalNo;
        this.operatorId = "";
        this.operatorName = "";
        this.orgCode = "";
        this.orgName = "";
        this.remark = '';
        this.tempData = "";
        this.result = "";
        this.resultName =  '';
    };

    //初始化流程表
    $scope.insertWorkflow = function () {
        //获取部门信息
        $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
        $scope.sysUser = LoginService.user.sysUser;
        //初始化对象
        var workFlow = new WorkFlow();
        workFlow.operatorId = $scope.sysUser.id;
        workFlow.operatorName = $scope.sysUser.text;
        workFlow.orgCode = $scope.userDepart?$scope.userDepart.orgId:"";
        workFlow.orgName = $scope.userDepart?$scope.userDepart.orgName:"";
        workFlow.remark = $scope.remark;
        //补充材料
        if($scope.state == '1'){
            workFlow.result = DictionaryConfig.appraisalDetailState.supplementState;
        }else if($scope.state == '2'){//退回任务
            workFlow.result = DictionaryConfig.appraisalDetailState.returnState;
        }else{//取消鉴定
            workFlow.result = DictionaryConfig.appraisalDetailState.cancelState;
        }
        workFlow.resultName =  _.find(DictionaryConfig.appraisalDetailStateValue, {id: workFlow.result}).value;
        //插入流程信息
        $scope.insertAppraisalWorkFlowService(workFlow).success(function (result) {
            if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                workFlow.createDate = new Date().format("yyyy-MM-dd hh:mm:ss");
                $scope.appraisalDetail.jyWorkFlowVOList.unshift(workFlow);
            }else{
                $rootScope.toaster("error", "错误", data.message);
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
    //更新主表状态
    $scope.updateAppraisalInfo = function(){
        //如果只有这个鉴定任务了，就更新主表状态，1002，待处理
        if($scope.appraisalInfo.appraisalDetailList.length == 1){
          $state.go("dashboard.appraisalTaskList");
           /* var appraisalInfo = angular.copy($scope.appraisalInfo);
            appraisalInfo.extPro = JSON.stringify(appraisalInfo.extPro);
            appraisalInfo.state = DictionaryConfig.appraisalState.receiveState;
            $scope.updateAppraisalInfoService(appraisalInfo).success(function (data) {
                if(data.code == AppraisalConfig.commonConstant.SUCCESS){
                  $state.go("dashboard.appraisalTaskList");
                }else{
                    $rootScope.toaster("error", "错误", data.message);
                }
            });*/
        }

    }
    //提交鉴定任务
    $scope.submitAppraisalInfo = function(){
        //验证
        if($scope.validateForm()){
            //获取当前退回时间
            var currentDateStr = new Date().format("yyyy-MM-dd hh:mm:ss");
            //补充材料(isAdminicle 为true让其补充证据，详细表状态不变)
            if($scope.state == '1'){
                $scope.appraisalDetail.isAdminicle = true;
            }else if($scope.state == '2'){//退回任务
                $scope.appraisalDetail.state = DictionaryConfig.appraisalDetailState.returnState;
            }else if($scope.state == '3'){//取消鉴定
                $scope.appraisalDetail.state = DictionaryConfig.appraisalDetailState.cancelState;
            }
            //赋值退回或者补充材料时间
            $scope.appraisalDetail.returnDate = currentDateStr;
            $scope.appraisalDetail.estimateDate = $scope.appraisalDetail.estimateDate?$filter('date')($scope.appraisalDetail.estimateDate,'yyyy-MM-dd HH:mm:ss'):"";
            //处理数据
            $scope.updateAppraisalDetailInfoService($scope.appraisalDetail).success(function (result) {
                if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                    //取消鉴定时，如果全部取消，则将状态改为
                    if($scope.state == '3'){
                        $scope.handleAppraisalInfo();
                    }else{//如果是退回或者是补充，则要判断是否更新主表状态
                        $scope.updateAppraisalInfo();
                    }
                    //插入流程表
                    $scope.initOrg();
                    //关闭
                    $modalInstance.close($scope.appraisalDetail);
                }else{
                    $rootScope.toaster("error", "错误", result.message);
                }
            });
        }
    };

    //取消
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});