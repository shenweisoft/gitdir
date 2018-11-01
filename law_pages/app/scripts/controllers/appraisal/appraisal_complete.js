
angular.module('sbAdminApp').controller('appraisalComplete', function($scope, $state, $timeout, LoginService, LoginConfig,$stateParams,$interval,$location) {

    /*//设置初始时间
    var time = 10;
    $scope.codeTime = time + 's';
    var timmer = $timeout(function() {
        time--;
        $scope.codeTime = time + 's';
        if(time == 0) {
            $scope.goBackList()
        }
    }, 1000);*/

    //倒计时
    ($scope.countDown =function() {
        var times = 10;
        var stop = $interval(function () {
            $scope.codeTime = times + 's';
            times --;
            if( times == 0){
                $interval.cancel(stop);
                $scope.codeTime = null;
                $scope.goBackList();
            }
        },1000);
    })();



    //返回
    $scope.goBackList = function () {
        // clearInterval(timmer);
        //判断是否是法官鉴定
        if($stateParams.judge) {
            $state.go('dashboard.appraisalLaunchList');
        } else {
            $state.go('dashboard.appraisalProgressList');
        }
    };


})

