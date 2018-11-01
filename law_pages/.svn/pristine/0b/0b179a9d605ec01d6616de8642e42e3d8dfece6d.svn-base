/**
 * Created by shenwei on 2017/5/11.
 */
angular.module('sbAdminApp').controller('shakingNumberCtrl', function($scope ,$stateParams,$log) {
	$scope.ballArr=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
	$scope.stopNum = 0;
	$scope.start = false;
	$scope.diaoluo = true;
	$scope.notSelect = true;
	$scope.select = false;
	$scope.frequency = 1;
	// 倒计时
	$scope.stopWatch = function (){
		$scope.manualButton_h= true;
		$scope.automaticButton_h= true;
		$scope.stopNum = 5;
		$scope.frequency = 2;
		var time = setInterval(function(){
			$scope.start = true;
			$scope.rollOut = false;
			if($scope.stopNum == 0){
				clearInterval(time);
				$scope.$apply(function(){
					$scope.rollOut = true;
					$scope.start = false;
					$scope.diaoluo = false;
				})
			}else{
				$scope.$apply(function(){
					$scope.stopNum -= 1
				})
			}
		},1000);
	}
	$scope.checkbox =function (){
		$scope.notSelect = !$scope.notSelect; 
		$scope.select = !$scope.select;
	}
	// 手动
	
	$scope.manualShakingNumber = function(){
		if ($scope.frequency==1) {
			$scope.automaticButton_h= true;
			$scope.stopNum =0;
			$scope.start = true;
			$scope.diaoluo = false;
			$scope.time = setInterval(function(){
				$scope.$apply(function(){
					$scope.stopNum += 1
				})
			},1000);
		}else if ($scope.frequency==2) {
			$scope.start = false;
			$scope.rollOut = true;
			window.clearInterval($scope.time);
		}
		$scope.frequency = 2
	}
});

