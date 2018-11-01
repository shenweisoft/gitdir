angular.module('sbAdminApp').controller('adjustSuccessCtrl', function($scope, $log, LoginConfig, LoginService, $state, $timeout) {
  var timer = $timeout(gotoList(), 1000);
  
  $scope.minusTimer =10;
  function gotoList (){
    try{
      $scope.minusTimer--;
      timer = $timeout(function (){gotoList();},1000)
      if($scope.minusTimer == 0){
        $state.go('dashboard.processing');
        $timeout.cancel(timer);
      }
    }catch (e){
    }
  }
  
  //直接跳转
  $scope.goto = function(){
    $state.go('dashboard.processing');
    $timeout.cancel(timer);
  }
})