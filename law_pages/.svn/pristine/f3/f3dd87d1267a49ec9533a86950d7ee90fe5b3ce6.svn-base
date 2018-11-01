/**
 * Created by shenwei on 2017/5/9.
 */

var app = angular.module('sbAdminApp');
app.filter('id2AppraisalType', function() {
    return function(idStr,data) {
        var str = "";
        var isFirst = true;
        if(idStr && (idStr.indexOf(',') !== -1)){
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
app.filter('id2Text', function() {
    return function(id,data) {
        var result = _.find(data, {
            id: id+""
        });
        return result? result.value:""
    }
});
app.controller('AppraisalListCtrl', function($scope, LoginService,LoginConfig,$log,toaster,$stateParams,DictionaryConfig,$modal,$state,$rootScope) {

    //组织名称
    $scope.orgName = $stateParams.orgName;
    //组织ID
    $scope.id = $stateParams.orgId;
    //鉴定类型集合
    $scope.appraisalTypeList = DictionaryConfig.appraisalTypeList;
    //查询鉴定机构Service
    $scope.querySysOrgAppraisalListService = LoginService.querySysOrgAppraisalList;
    //根据名称查询鉴定机构
    $scope.queryOrgAppraisalByNameService = LoginService.queryOrgAppraisalByName;
    //插入对应表
    $scope.insertSysOrgAppraisalService = LoginService.insertSysOrgAppraisal;
    //删除对应表
    $scope.deleteSysOrgAppraisalService = LoginService.deleteSysOrgAppraisal;
    //定义查询接口对象
    function search(){
        this.courtOrgId = $scope.id;
    }
    //保存信息
    $scope.querySysOrgAppraisalListService(new search()).success(function (result) {
        if(result.code == LoginConfig.commonConStant.SUCCESS){
            $scope.sysOrgList = result.result;
            $scope.sysOrgList.forEach(function(val){
                val.extPro = JSON.parse(val.extPro);
            });
            $log.info(result.result);
        }else{
            $rootScope.toaster("error", "错误", result.message);
        }
    });

    //查询鉴定机构
    $scope.queryAppraisal = function(){
        $scope.queryOrgAppraisalByNameService(new search()).success(function (result) {
            if(result.code == LoginConfig.commonConStant.SUCCESS){
                $scope.sysOrgList = result.result;
                $scope.sysOrgList.forEach(function(val){
                    val.extPro = JSON.parse(val.extPro);
                });
                $log.info(result.result);
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        });
    };

    //删除鉴定机构
    $scope.deleteSysOrgAppraisal = function(sysOrg){

        if(confirm("您确认删除吗？")){
            $scope.deleteSysOrgAppraisalService({
                id:sysOrg.sysOrgAppraisalId
            }).success(function (result) {
                if(result.code == LoginConfig.commonConStant.SUCCESS){
                    var tempIndex;
                    $scope.sysOrgList.filter(function(val, index) {
                        if (val.id == sysOrg.id) {
                            tempIndex = index;
                            return true;
                        }
                        return false;
                    });
                    $scope.sysOrgList.splice(tempIndex, 1);
                }else{
                    $rootScope.toaster("error", "错误", result.message);
                }
            });
        }
    }

    //查询详细
    $scope.queryDetail = function(sysOrg){
        $modal.open({
            templateUrl: 'views/pages/organize_manage/appraisalDetail.html',
            controller: 'AppraisalDetailPopupCtrl',
            size: 'lg',
            resolve: {
                items: function(){
                    return {
                        sysOrg: sysOrg
                    }
                }
            }
        });
    }
    // 添加弹出框
     $scope.addMechanism = function(sysOrg) {
        $modal.open({
            templateUrl: 'views/pages/organize_manage/addMechanismPopup.html',
            controller: 'addMechanismPopupCtrl',
            size: 'lg',
            resolve: {
                items: function(){
                    return {
                       id:$scope.id,
                       sysOrgList:$scope.sysOrgList
                    }
                }
            }
        });
    }
});

app.controller('AppraisalDetailPopupCtrl', function($scope, LoginService,LoginConfig,$log,toaster,$stateParams,DictionaryConfig,$modal,$state,items,$modalInstance) {

    //鉴定类型集合
    $scope.appraisalTypeList = DictionaryConfig.appraisalTypeList;
    //机构类型
    $scope.orgTypeConstant = DictionaryConfig.orgTypeConstant;
    //组织
    $scope.sysOrg = items.sysOrg;
    //取消
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

});


// 添加弹出框
app.controller('addMechanismPopupCtrl', function($scope, LoginService,LoginConfig,$log,toaster,$stateParams,DictionaryConfig,$modal,$state,items,$modalInstance,$rootScope) {

    //鉴定类型集合
    $scope.appraisalTypeList = DictionaryConfig.appraisalTypeList;
    //法院ID
    $scope.id = items.id;
    //鉴定机构集合
    $scope.sysOrgList = items.sysOrgList;
    //查询鉴定机构
    $scope.queryOrgAppraisalByNameService = LoginService.queryOrgAppraisalByName;
    //添加鉴定机构的对应关系
    $scope.insertSysOrgAppraisalService = LoginService.insertSysOrgAppraisal;
    //搜索鉴定机构
    $scope.queryAppraisal = function(){

        if(!$scope.appraisalName){
            $rootScope.toaster("warn", "提示", "请您输入鉴定机构名称");
            return false;
        }
        $scope.queryOrgAppraisalByNameService({
            appraisalName:$scope.appraisalName
        }).success(function (result) {
            if(result.code == LoginConfig.commonConStant.SUCCESS){
                $scope.appraisalOrgList = result.result;
                $scope.appraisalOrgList.forEach(function(val){
                    val.extPro = JSON.parse(val.extPro);
                });
                //如果已经选择的鉴定机构不让其显示
                var deleteIndexArray = [];
                $scope.appraisalOrgList.forEach(function(val,index){
                    var result = _.find($scope.sysOrgList, {id: val.id});
                    if(result){
                        deleteIndexArray.unshift(index);
                    }
                });
                //删除已经选中的集合
                if(deleteIndexArray && deleteIndexArray.length > 0){
                    deleteIndexArray.forEach(function(val){
                        $scope.appraisalOrgList.splice(val,1);
                    });
                }
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        });
    };

    //定义查询对象
    function SysOrgAppraisal() {
        this.courtOrgId = $scope.id;
        this.appraisalOrgId = "";
        this.appraisalName = "";
    }

    //添加
    $scope.addAppraisal = function(appraisalOrg){
        //新建对象
        var sysOrgAppraisal = new SysOrgAppraisal();
        sysOrgAppraisal.appraisalOrgId = appraisalOrg.id;
        sysOrgAppraisal.appraisalName = appraisalOrg.text;
        //插入操作
        $scope.insertSysOrgAppraisalService(sysOrgAppraisal).success(function (result) {
            if(result.code == LoginConfig.commonConStant.SUCCESS){
                appraisalOrg.sysOrgAppraisalId = result.result;
                $scope.sysOrgList.push(appraisalOrg);
                //删除
                var tempIndex;
                $scope.appraisalOrgList.filter(function(val, index) {
                    if (val.id == appraisalOrg.id) {
                        tempIndex = index;
                        return true;
                    }
                    return false;
                });
                $scope.appraisalOrgList.splice(tempIndex, 1);
                $rootScope.toaster("success", "成功", "添加成功");
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        });

    };

    //取消
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});