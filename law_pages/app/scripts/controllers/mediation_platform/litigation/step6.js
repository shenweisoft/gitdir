'use strict';

angular.module('sbAdminApp').controller('step6Ctrl', function($sce,$scope,$log,LawConfig,$timeout,DictionaryConfig,toaster,Upload,$state,$rootScope,LoginService) {
		$scope.co.step = 6;
		$timeout(function(){
			$scope.currentSerialNo = $scope.adjust.serialNo;
		},1000);
		//下载文件
		$scope.downloadFileWord = function(){
			return LawConfig.fileConstant.downloadInstrumentByWorkNoUrl + "?serialNo="+$scope.currentSerialNo+ "&wordType=0";
		};

		//上传文件
		$scope.uploadFile = function(fileName,file, wordType, name){
			Upload.upload({
				url: LawConfig.fileConstant.uploadUrlByWordType,
				data: {
					file: file,
					type:DictionaryConfig.lawType.adjustInfo,
					name:name,
					wordType: 0,
					serialNo:$scope.currentSerialNo
				}
			}).success(function(res){
				if(res.code ==  LawConfig.commonConstant.SUCCESS){
          $rootScope.toaster(DictionaryConfig.toaster.level.success, DictionaryConfig.toaster.title.success, "文件上传成功!");
					$scope.isFileExist = true;
				}
			})
		}
		//上传文件
		$scope.uploadFileWord = function(file){
			if(!file) return;
			if (file && file) {
				var fileName = file.name.substring(0,file.name.lastIndexOf('.'));
				$scope.uploadFile(fileName, file, '0', '调解协议书');
			}
		};

	//ie9一下检查flash版本
	function hasflash() {
		if(navigator.appName == "Microsoft Internet Explorer"&&parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""))<10){
			if (!FileAPI.hasFlash) {
				$scope.haveNoFlash = true;
				$rootScope.toaster("warn", '提示',"请先安装或者升级flash！");
			}
		}
	}

	hasflash();
	$scope.checkflash = function () {
		if($scope.haveNoFlash ){
			$rootScope.toaster("warn", '提示',"请先安装或者升级flash！");
		}
	}
	//签字页
	$scope.signPage = function () {

		var url = $state.href('signDetail',{serialNo:$scope.adjust.serialNo,isSelf:$scope.trafficPolice});
		window.open(url);
	}

	$scope.info = function() {
        $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
        console.log($scope.userDepart);
	}

    $scope.$on('user2Child', function(){
        $scope.info()
    });
    if (LoginService.user.userPermissions) {
        $scope.info()
    }
    
    
	
	  
    
});