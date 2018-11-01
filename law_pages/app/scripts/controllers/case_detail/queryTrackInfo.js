/**
 * Created by shenwei on 2017/4/18.
 */

angular.module('sbAdminApp').controller('QueryTrackInfoCtrl', function ($scope, $log, $state, DictionaryConfig, $stateParams, LawService,LawConfig,$modal,toaster,$filter,$rootScope) {
    //后台查询
    $scope.lawService = LawService;
    //获取流水号
    $scope.serialNo =  $stateParams.serialNo;
    //获取在线视频开关配置
    $scope.vidOpenPower = $stateParams.vidOpenPower;
    //头部箭头和查看卷宗等隐藏
    $scope.showFlag = true;
    $scope.id = $stateParams.id;
    //从后台获取数据(头部信息)
    $scope.lawService.queryLawDetail({
        "serialNo": $scope.serialNo,
        "id":$stateParams.id,
        "lawPersonType":$stateParams.lawPersonType
    }).success(function(result) {
        $log.info(result);
        if(result.code == LawConfig.commonConstant.SUCCESS){
            $scope.law = result.result;
            //是否能开庭标识,默认不能开庭
            var isShowFlag = false;
            //需要查看开庭时间，是否允许开庭
            var nowDate = new Date(new Date().getTime() + DictionaryConfig.courtBeforeHour);
            if($scope.law.nextCourtDate){
                if($scope.law.nextCourtDate <= $filter('date')(nowDate,"yyyy-MM-dd HH:mm:ss")){
                    isShowFlag = true;
                }
            }else{
                if($scope.law.courtDate){
                    if($scope.law.courtDate <= $filter('date')(nowDate,"yyyy-MM-dd HH:mm:ss")){
                        isShowFlag = true;
                    }
                }
            }
            //如果不是暂缓缴费并且又没有付款，则不能开庭
            if($scope.law.isDeferredCharges != '1' && $scope.law.payState != '1'){
                isShowFlag = false;
            }
            $scope.law.isShowFlag = isShowFlag;
        }else{
          $rootScope.toaster("error", "错误", result.message);
        }
    });
})