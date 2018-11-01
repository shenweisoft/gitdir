/**
 * Created by Administrator on 2018/5/24.
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

app.filter('orgType2Const', function(DictionaryConfig) {
    return function(id) {
        var result = _.find(DictionaryConfig.orgTypeConstant, {
            id: id
        });
        return result && result.text || ""
    }
});
app.controller('policeSysOrgRelationCtrl', function($scope, LoginService,LoginConfig,$log,toaster,$stateParams,DictionaryConfig,$modal,$state,$rootScope) {

    //组织名称
    $scope.orgName = $stateParams.orgName;
    //组织ID
    $scope.id = $stateParams.orgId;
    //组织类型
    $scope.type = $stateParams.type;

    //删除对应表
    $scope.deletePolcieSysOrgRelation = LoginService.deletePolcieSysOrgRelation;

    //查询绑定关联机构
    $scope.queryRelationOrgList = LoginService.querySysOrgRelationList;
    //根据名称和类型查询机构
    $scope.queryOrgAppraisalByNameService = LoginService.querySysOrgByName;

    //定义查询接口对象
    function search(){
        this.id = $scope.id;
        this.category =$scope.type;
    }
    //保存信息
    $scope.queryRelationOrgList(new search()).success(function (result) {
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

    //查询关联机构
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

    //删除关联机构
    $scope.deletePoliceSysOrg = function(sysOrg){

        if(confirm("您确认删除吗？")){
            $scope.deletePolcieSysOrgRelation({
                id:sysOrg.sysOrgRelationId
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
    // 添加弹出框
    $scope.addMechanism = function(sysOrg) {
        $modal.open({
            templateUrl: 'views/pages/organize_manage/addPoliceSysOrg.html',
            controller: 'addPoliceSysOrg',
            size: 'lg',
            resolve: {
                items: function(){
                    return {
                        id:$scope.id,
                        category:$scope.type,
                        orgName:$scope.orgName,
                        sysOrgList:$scope.sysOrgList
                    }
                }
            }
        });
    }
});



// 添加弹出框
app.controller('addPoliceSysOrg', function($scope, LoginService,LoginConfig,$log,toaster,$stateParams,DictionaryConfig,$modal,$state,items,$modalInstance,$rootScope) {

    //法院ID
    $scope.id = items.id;

    $scope.orgName = items.orgName;

    $scope.category =items.category;
    //机构集合
    $scope.sysOrgList = items.sysOrgList;
    //根据名称和类型查询机构
    $scope.querySysOrgByName = LoginService.querySysOrgByName;
    //添加机构的对应关系
    $scope.insertPoliceOrgRelation = LoginService.insertPoliceOrgRelation;
    //机构
    $scope.querySysOrg = function(){

        if(!$scope.sysOrgName){
            $rootScope.toaster("warn", "提示", "请您输入机构名称");
            return false;
        }
        $scope.querySysOrgByName({
            orgName:$scope.sysOrgName,
            categroy:$scope.category
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
    function SysOrgRelation() {
        this.policeOrgId = $scope.id;
        this.policeOrgName =$scope.orgName;
        this.relationOrgId = "";
        this.relationOrgName="";
        this.category="";
    }

    //添加
    $scope.addAppraisal = function(appraisalOrg){
        //新建对象
        var sysOrgRelation = new SysOrgRelation();
        sysOrgRelation.relationOrgId = appraisalOrg.id;
        sysOrgRelation.relationOrgName = appraisalOrg.text;
        sysOrgRelation.category = appraisalOrg.category;
        //插入操作
        $scope.insertPoliceOrgRelation(sysOrgRelation).success(function (result) {
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