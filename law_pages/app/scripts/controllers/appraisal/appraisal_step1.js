/**
 * Created by shenwei on 2017/5/5.
 */
'use strict';
angular.module('sbAdminApp').controller('AppraisalStep1Ctrl', function($scope, $stateParams, $state,$http, $log, AppraisalConfig,AppraisalService,DictionaryConfig,toaster,$rootScope) {
    $scope.co.step = 1;
    //删除任务信息
    $scope.deleteAppraisalDetailService = AppraisalService.deleteAppraisalDetail;

    //鉴定详细信息表
    function AppraisalDetailInfo(){
        this.id = "";
        this.applyName = "";
        this.appraisalNo = "";
        this.appraisalType = "1";
        this.appraisalItem = "";
        this.appraisalItemList = angular.copy(DictionaryConfig.appraisalItemList.filter(function(val) {
            return val.type == 1;
        }));
        this.state = "";
        this.appraisalFee = "";
        this.principalAgent = "";
        this.identificationPurpose = "";
        this.estimateDate = "";
        this.jyAppraisalApplyerInfoId = "";
        this.jyAppraisalApplyerId = "";
        this.appraisalEvidenceList = [];
    }

    $scope.changeApplyerId = function(appraisalDetailInfo){
        if(appraisalDetailInfo.jyAppraisalApplyerId){
            appraisalDetailInfo.applyName = _.find($scope.applyerArray, {id: appraisalDetailInfo.jyAppraisalApplyerId}).personName;
        }else{
            appraisalDetailInfo.applyName = "";
        }
    };

    //添加鉴定
    $scope.addAppraisal = function(){
        $scope.appraisalInfo.appraisalDetailList.push(new AppraisalDetailInfo());
        //更新鉴定项目disabled
        $scope.updateItem();
    };

    //切换鉴定类型
    $scope.changeAppraisalType = function(appraisalDetailInfo){

        var detailInfo  = angular.copy(appraisalDetailInfo);
        appraisalDetailInfo.appraisalItemList = angular.copy(DictionaryConfig.appraisalItemList.filter(function(val) {
            return val.type == appraisalDetailInfo.appraisalType;
        }));
        // appraisalDetailInfo.appraisalItem = "";
        //更新鉴定项目disabled
        $scope.changeItem(detailInfo);
    };

    //选中被鉴定人
    $scope.selectAppraisalApplyerInfo = function(appraisalDetailInfo,appraisalApplyerInfo){
        var  appraisalDetail = angular.copy(appraisalDetailInfo);
        appraisalDetailInfo.jyAppraisalApplyerInfoId = appraisalApplyerInfo.id;
        appraisalDetailInfo.appraisalItemList.forEach(function (v,i) {
            v.selected = false;
        })
        //更新鉴定项目disabled
        $scope.changeSItem(appraisalDetail);
    };

    //处理点击chekbox事件
    $scope.handleAppraisalItem = function(appraisalDetailInfo){
        //处理AppraisalItem的值
        appraisalDetailInfo.appraisalItem = '';
        var appraisalItem = "";
        var appraisalItemFlag = true;
        appraisalDetailInfo.appraisalItemList.forEach(function(val,index){
            if(val.selected){
                if(!appraisalDetailInfo.jyAppraisalApplyerInfoId){
                    $rootScope.toaster("warm", "提示", "请先选择被鉴定人");
                    val.selected = false;
                    return false ;
                }
                if(!appraisalItemFlag){
                    appraisalDetailInfo.appraisalItem += ",";
                }
                appraisalDetailInfo.appraisalItem += val.id;
                appraisalItemFlag = false;
            }
            if(!val.selected){
                $scope.cancelItem(appraisalDetailInfo,appraisalDetailInfo.appraisalType,index);
            }

        });
        // appraisalDetailInfo.appraisalItem = appraisalItem;
        //更新鉴定项目disabled
        $scope.updateItem(appraisalDetailInfo);
    };

    //取消disable
    //单个取消，循环找对应的type和位置就行
    $scope.cancelItem = function (appraisalDetailInfo,type,index) {
         $scope.appraisalInfo.appraisalDetailList.forEach(function(val) {
           //是同一个被鉴定人
           if(appraisalDetailInfo.jyAppraisalApplyerInfoId && val.jyAppraisalApplyerInfoId && appraisalDetailInfo.jyAppraisalApplyerInfoId == val.jyAppraisalApplyerInfoId){
             if(val.appraisalType == type){
               val.appraisalItemList[index].disabled  = false;
             }
           }else{//不是同一个被鉴定人
             val.appraisalItemList[index].disabled  = false;
           }
        });
    }
    //切换时的disabled
    //如果本身有disabled,先去取消页面上此列有的鉴定项目，再添加新鉴定类型的鉴定项目的disabled
    $scope.changeItem = function (appraisalDetailInfo) {
        appraisalDetailInfo.appraisalItemList.forEach(function (v,i) {
            if(v.selected){
                $scope.cancelItem(appraisalDetailInfo,appraisalDetailInfo.appraisalItemList[0].type,i);
            }
        })
        appraisalDetailInfo.appraisalItem = "";
        $scope.updateItem(appraisalDetailInfo);
    }

    //切换被鉴定人就所有的项目都取消一遍再选择有的disabled
    $scope.changeSItem = function (appraisalDetailInfo) {
        appraisalDetailInfo.appraisalItemList.forEach(function (v,i) {
            $scope.cancelItem(appraisalDetailInfo,appraisalDetailInfo.appraisalItemList[0].type,i);
        })
        appraisalDetailInfo.appraisalItem = "";
        $scope.updateItem(appraisalDetailInfo);
    }

    //删除json数组中的数据
    $scope.removeAppraisalDetailInfoArray = function(appraisalDetailInfo){
        var tempIndex;
        $scope.appraisalInfo.appraisalDetailList.filter(function(val, index) {
            if (val.id == appraisalDetailInfo.id) {
                tempIndex = index;
                return true;
            }
            return false;
        });
        $scope.appraisalInfo.appraisalDetailList.splice(tempIndex, 1);
    };

    //删除任务
    $scope.deleteAppraisalDetailInfo = function(appraisalDetailInfo){
        //删除
        if(confirm("确定删除吗？")){
            //如果ID存在，首先删除数据库
            if(appraisalDetailInfo.id){
                $scope.deleteAppraisalDetailService({
                    id:appraisalDetailInfo.id
                }).success(function (result) {
                    if(result.code == AppraisalConfig.commonConstant.SUCCESS){
                        $log.info(result.result);
                        $scope.removeAppraisalDetailInfoArray(appraisalDetailInfo);
                        $rootScope.toaster("success", "成功", "操作成功！");
                    }else{
                        $rootScope.toaster("error", "错误", result.message);
                    }
                });
            }else{
                $scope.removeAppraisalDetailInfoArray(appraisalDetailInfo);
            }
        }
    };

});