angular.module('sbAdminApp').controller('policeDistinguishCtrl', function ($timeout,AdminConstant,$location,$scope, $stateParams, $state, $http, $log, PoliceConfig, PoliceService, DictionaryConfig, toaster,LawConfig) {

    var g_iPort = 1001;//端口号；USB = 1001 ~ 1016 ，COM端口 = 1~16
    function hxgc_ReadIDCard(){
        $scope.readTimeout = $timeout(function() {
            var iResult = 0;
            iResult = objActiveX.hxgc_ReadIDCard(g_iPort);//读二代证
            if(iResult == 0) {
                $scope.idNo = objActiveX.hxgc_GetIDCode();
                $log.info($scope.idNo);
            }else{
                hxgc_ReadIDCard();
                $log.info( "读二代证信息失败，错误代码：" + iResult + ".");
            }
        }, 1000);
    }

    function hxgc_OpenReader() {
        var iResult = 0;
        iResult = objActiveX.hxgc_OpenReader(g_iPort);//打开设备
        if(iResult == 0) {
            var strSAMID = objActiveX.hxgc_GetSamIdToStr(g_iPort);//获取SAMID
            $log.info("打开设备成功.\r\nSAMID = " + strSAMID + ".");

            hxgc_ReadIDCard();
        }else{
            $log.info("打开设备失败，错误代码：" + iResult + ".");
        }
    }

    hxgc_OpenReader();


});