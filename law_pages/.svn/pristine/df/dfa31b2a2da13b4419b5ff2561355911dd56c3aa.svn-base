/**
 * Created by shenwei on 2017/4/24.
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

app.filter('date2Text', function() {
    return function(dataStr) {
        var result = "";
        if(dataStr && dataStr.length >= 10){
            var dateArray = dataStr.substr(0,10).split("-");
            result = dateArray[0]+"年"+dateArray[1]+"月"+dateArray[2]+"日";
        }
        return result;
    }
});

app.filter('date2ChinaText', function() {
    return function(dataStr) {
        var result = "";
        if(dataStr && dataStr.length >= 10){
            var dateArray = dataStr.substr(0,10).split("-");
            var days = ['〇','一','二','三','四','五','六','七','八','九','十'];
            var newArray = [];
            for(var i=0;i<dateArray.length;i++){
                var dateStr = dateArray[i];
                var str = "";
                for(var j = 0 ; j < dateStr.length; j ++){
                    if((i == 1 || i ==2) && dateStr.charAt(j) == '0'){
                        continue;
                    }
                    //日期
                    if(i == 2 && dateStr.length > 1 && j== 0){
                        str +=days[dateStr.charAt(j)]+days[10];
                    }else{
                        str +=days[dateStr.charAt(j)];
                    }
                }
                newArray.push(str);
            }
            result = newArray[0]+"年"+newArray[1]+"月"+newArray[2]+"日";
        }
        return result;
    }
});

angular.module('sbAdminApp').controller('JudicialConfirmationWordCtrl', function ($timeout,$scope, $stateParams, $state,toaster, $log, DictionaryConfig,AdjustService,AdjustConfig,LoginService,$rootScope) {

    //性别集合
    $scope.sexList = DictionaryConfig.sexList;
    //证件类型
    $scope.certificateTypeList = DictionaryConfig.certificateTypeConstant;
    //代表人类型
    $scope.legalTypeList = DictionaryConfig.legalTypeList;
    //关系
    $scope.relationList = DictionaryConfig.relation2Applicant;
    //岗位类型集合
    $scope.postTypeList = DictionaryConfig.postTypeList;
    //详细查询调节Service
    $scope.queryAdjustBySerialNoService = AdjustService.queryAdjustBySerialNo;
    //查询用户信息Service
    $scope.querySysUserByIdsService = LoginService.querySysUserByIds;

    //根据用户ID查询用户信息
    $scope.querySysUer = function(idList){

        $scope.querySysUserByIdsService({
            "idList": idList
        }).success(function (result) {
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                $log.info(result.result);
                $scope.chiefJudge = _.find(result.result, {id: $scope.adjustInfo.chiefJudgeId});
                $scope.clerk = _.find(result.result, {id: $scope.adjustInfo.clerkId});
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        });
    };


    //根据流水号查询数据
    $scope.queryAdjustDetailList = function(){
        //查询数据
        $scope.queryAdjustBySerialNoService({
            "serialNo": $stateParams.serialNo
        }).success(function (result) {
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                $scope.adjustInfo = result.result;
                $log.info($scope.adjustInfo);
                //用户集合ID
                var idList = [];
                idList.push($scope.adjustInfo.chiefJudgeId);
                idList.push($scope.adjustInfo.clerkId);
                $scope.querySysUer(idList);
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        });
    };
    //初始化数据
    $scope.queryAdjustDetailList();
});