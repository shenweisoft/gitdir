'use strict';

var app = angular.module('sbAdminApp');

app.controller('SueStep4Ctrl', function($scope, $stateParams, $state, $location, $timeout, $http, $log, $filter, $modal, toaster, LawService, LawConfig, AdjustService, DictionaryConfig, Upload,$rootScope) {
	$scope.co.step = 4;
	$scope.evidenceStateList = DictionaryConfig.evidenceStateList;

	var level = {
		"warn": "warn",
		"error": "error",
		"success": "success"
	}
	var title = {
		"error": "错误",
		"success": "成功"
	}

	$scope.CONSTANT = {
		"messageEvidenceRemoveError": "删除证据时出现问题"
	}

	$scope.feeTypeClick = function(v) {
		if (v) {
		  $scope.collapseVar = v.id;
		  $scope.feeType = v.id;
		} else{
      delete $scope.feeType;
      delete $scope.collapseVar;
    }
	}

	var Evidence = function(picture) {
		this.classify = "";
		this.picture = picture;
		this.tagClose = false;
		this.selected = false;
		this.personType = '0';
		this.chooseTagArray = [];
		this.operateState = DictionaryConfig.evidenceStateList[1].id;
		this.delFlag = 2;
    this.progressPercentage = 0;
	}

	$scope.filterFeeType = function(e) {
		if (!$scope.feeType) return e.id && e.delFlag == 0 && e.personType != 1;
		else return e.id && e.delFlag == 0 && e.personType != 1 && e.classify.indexOf($scope.feeType) >= 0;
	}

	$scope.showTempEvidence = function(e) {
		if (e.delFlag == 2 && e.personType == 0) return e;
	}

	//证据增加
	$scope.imageAddress = LawConfig.pictureConstant.smallPictureUrl;
	$scope.addEvidence = function(files) {
    if(!files) return;
		if (files && files.length) {
			for (var i = 0; i < files.length; i++) {
				 (files[i]);    // 图片大小大于10M
				var fileName = files[i].name.substring(0,files[i].name.lastIndexOf('.'));
				$scope.uploadPicture(fileName,files[i]);
			}
		}
	};

  //遮罩层 - 图片上传期间出现
  $scope.fileUploading = false;
	//上传图片
	$scope.uploadPicture = function(fileName,file){
    var type = file.name.split('.')[1];
    //if(type == 'jpg'|| type == 'png'){
      var evidence = new Evidence("");
      $scope.adjust.evidenceArray.unshift(evidence);
    //}
    $scope.fileUploading = true;
		Upload.upload({
			url: LawConfig.pictureConstant.uploadImageUrl,
			data: {
				file: file,
				type: 'evidence'
			}
		}).progress(function (evt) {
      //if(type == 'jpg'|| type == 'png'){
        evidence.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      //}
    }).success(function(resp) {
      evidence.picture = resp.result;
      evidence.name = fileName;
			$scope.co.startShow = true;
      $scope.fileUploading = false;
		}).error(function (data, status, headers, config) {
      console.log('error status: ' + data);
      $scope.fileUploading = false;
    });
	};



	//证据删除(batch)
	$scope.co.removeEvidence = function(evidence) {
		var indices = []
		var idArray = [];
		if(evidence){
      if(evidence.id) idArray.push(evidence.id);
      indices.push($scope.adjust.evidenceArray.indexOf(evidence));
    }else{
      $scope.adjust.evidenceArray.forEach(function(v, i) {
        if (v.delFlag==2 && v.selected) indices.unshift(i);
        if (v.delFlag==2 && v.selected && v.id) idArray.push(v.id);
      })
    }
		function deleteSelected(arr, indiz) {
			indiz.forEach(function(v) {
				arr.splice(v, 1);
			})
		}
		if (idArray.length) {
      AdjustService.removeEvidence({
				idArray: idArray
			}).success(function(result) {
				if (result.code == LawConfig.commonConstant.SUCCESS) {
					//删除所有ID对应的对象
					deleteSelected($scope.adjust.evidenceArray, indices);
				} else if (result.code == LawConfig.commonConstant.FAILURE) {
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageEvidenceRemoveError);
				}
			});
		} else {
			deleteSelected($scope.adjust.evidenceArray, indices);
		}
	}

	//新增证据标签
	$scope.addTag = function(evidence, id) {
		var feeType = $scope.feeTypeList.filter(function(item) {
			return item.id == id;
		})
		if (!evidence.classify) {
			evidence.chooseTagArray = [];
			evidence.chooseTagArray.push(feeType[0]);
			evidence.classify += id;
		} else if (evidence.classify.indexOf(id) == -1) {
			evidence.chooseTagArray.push(feeType[0]);
			evidence.classify += "," + id;
		}
	}

	//关闭证据标签
	$scope.closeTag = function(evidence, id) {
		var feeType = evidence.chooseTagArray.filter(function(item) {
			return item.id == id;
		})
		var tagIndex = evidence.chooseTagArray.indexOf(feeType[0]);
		evidence.chooseTagArray.splice(tagIndex, 1);

		evidence.classify = "";
		evidence.chooseTagArray.forEach(function(v) {
			if (!evidence.classify) {
				evidence.classify += v.id
			} else {
				evidence.classify += "," + v.id;
			}
		})
	}

	//证据全选
	$scope.co.selectAllItems = false;
	$scope.co.selectAllEvidence = function() {
		$scope.co.selectAllItems = !$scope.co.selectAllItems;
		$scope.adjust.evidenceArray.filter(function(v){
		  return v.delFlag=='2' || !v.id
    }).forEach(function(v) {
			if ($scope.co.selectAllItems)  v.selected = true;
			else v.selected = false;
		})
	}

	//已有证据
	$scope.hadEvidenceShow = true;
	$scope.goHadEvidence = function() {
		$scope.startShow = false;
		$scope.hadEvidenceShow = true;
		$scope.co.addEvidenceShow = false;
		$scope.addEvidenceBtnShow = false;
	};

	//添加证据
	$scope.goAddEvidence = function() {
		$scope.startShow = true;
		$scope.hadEvidenceShow = false;
		$scope.co.addEvidenceShow = true;
		$scope.addEvidenceBtnShow = true;
	};

	//显示大图
	$scope.show_big_img=function(bigPicture){

		$scope.show=true;
		$scope.bigPicture = LawConfig.pictureConstant.bigPictureUrl + bigPicture;
	}
	//隐藏大图
	$scope.hide=function(){
		$scope.show=false;
	}

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

	//限制图片大小
	function imageSize(file) {
		if(file){
			if(parseInt(file.size/(1024*1024))>= 10 ){
				$rootScope.toaster("warn", '提示',"请上传小于10M大小的图片");
			}
		}
	}
})