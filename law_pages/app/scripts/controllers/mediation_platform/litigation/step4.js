'use strict';

var app = angular.module('sbAdminApp');
app.filter('evidenceFilter', function() {
    return function(evidenceList, id) {
      if(evidenceList && id){
        if(id == '-1'){
          evidenceList = evidenceList.filter(function(v){
            return !v.classify;
          })
        }else{
          evidenceList = evidenceList.filter(function(v){
            return v.classify? v.classify.indexOf(id) > -1:false;
          })
        }
      }
      return evidenceList;
    }
});

app.controller('step4Ctrl', function($scope, $stateParams, $state, $location, $timeout, $http, $log, $filter, $modal, AdjustService, AdjustConfig, toaster,DictionaryConfig, Upload,$rootScope) {
	$scope.co.step = 4;
	$scope.filterTag = "";

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

	var Evidence = function(picture) {
		this.classify = "";
		this.picture = picture;
		this.tagClose = false;
		this.selected = false;
		this.personType = '0';
		this.chooseTagArray = [];
		this.operateState = '1000';
		this.delFlag=0;
		this.progressPercentage = 0;
		this.source = $stateParams.isSelf ; //是1来自审判系统
	}
	//批量证据增加
	$scope.imageAddress = AdjustConfig.pictureConstant.smallPictureUrl;
	$scope.addEvidence = function(files) {
		if(!files) return;
		if (files && files.length) {
			$scope.co.doingShow = true;
			for (var i = 0; i < files.length; i++) {
				imageSize(files[i]);
				var fileName = files[i].name.substring(0,files[i].name.lastIndexOf('.'));
				$scope.uploadPicture(fileName,files[i],files.length);
			}
		}
	};
	
	$scope.chooseFilterTag = function(v){
	  $scope.filterTag = v? v:"";
  }

  //遮罩层 - 图片上传期间出现
  $scope.fileUploading = false;
	//上传图片
	$scope.uploadPicture = function(fileName,file,length){
        if(!file){
          $rootScope.toaster(level.warn, title.warn, $scope.CONSTANT.messagePictrueTypeError);
            return;
        }
		var type = file.name.split('.')[1];
		//if(type == 'jpg'|| type == 'png'){
		  var evidence = new Evidence("");
		  $scope.adjust.evidenceArray.unshift(evidence);
		//}
    $scope.fileUploading = true;
		Upload.upload({
			url: AdjustConfig.pictureConstant.uploadImageUrl,
			data: {
				file: file,
				type: 'evidence'
			}
		}).progress(function (evt) {
		  //进度条
			evidence.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		}).success(function(resp) {
		  evidence.picture = resp.result;
		  evidence.name = fileName;
      $scope.co.startShow = true;
		  $scope.co.doingShow = false;
      $scope.co.existNoTag = true;
      $scope.fileUploading = false;
		}).error(function (data, status, headers, config) {
      console.log('error status: ' + data);
      $scope.fileUploading = false;
    });
	};


  
	$scope.handleAllSelect = function(){

		var selectAllItems  = true;
		if($scope.adjust.evidenceArray && $scope.adjust.evidenceArray.length > 0){
			$scope.adjust.evidenceArray.forEach(function(v) {
				if(!v.selected){
					selectAllItems = false;
				}
			})
		}else{
			selectAllItems = false;
		}
		$scope.co.selectAllItems = selectAllItems;
	};

	
	
	/**
	 * 识别浏览器种类
	 */
	function myBrowser(){
	    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	    var isOpera = userAgent.indexOf("Opera") > -1;
	    if (isOpera) {
	        return "Opera"
	    }; //判断是否Opera浏览器
	    if (userAgent.indexOf("Firefox") > -1) {
	        return "FF";
	    } 
	    
	    //判断是否Firefox浏览器
	    if (userAgent.indexOf("Chrome") > -1){
		  return "Chrome";
		 }
	    
	    if (userAgent.indexOf("Safari") > -1) {
	        return "Safari";
	    }
	    //判断是否Safari浏览器
	    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
	        return "IE";
	    }; //判断是否IE浏览器
	}
	
	
	
	$scope.openScanner= function (adjust) {
		var mb = myBrowser();

		if ("Chrome" == mb) {  
        var modalInstance = $modal.open({
          params: {'cameraorderid': null,idtype:null,imageAddress:null},
          templateUrl: 'views/pages/mediation_platform/litigation_mediation/highMeter.html',
          controller: 'highMeterCtrl',
          size: 'lg',
          resolve: {
            loadMyFile: function($ocLazyLoad) {
              return $ocLazyLoad.load({
                name: 'sbAdminApp',
                files: ['scripts/controllers/mediation_platform/litigation/highMeter.js']
              })
            },
            datamsg: function() {
                return{
                	flage:3
                };
            }
          }
        });
        
        //返回值
        modalInstance.result.then(function (data) {
        	var obj = eval('(' + data.imgurl+ ')');
        	for(var i=0;i<obj.result.length;i++){
        		var evidence = new Evidence(obj.result[i]);
        		evidence.name=i+1;
      		  adjust.evidenceArray.push(evidence);
               
        	}
        	
        }, function () {
        });
        
		}else{
			// alert("我是IE");
		       var modalInstance = $modal.open({
		           params: {'cameraorderid': null,idtype:null,imageAddress:null},
		           templateUrl: 'views/pages/mediation_platform/litigation_mediation/iehighMeter.html',
		           controller: 'iehighMeterCtrl',
		           size: 'lg',
		           resolve: {
		             loadMyFile: function($ocLazyLoad) {
		               return $ocLazyLoad.load({
		                 name: 'sbAdminApp',
		                 files: ['scripts/controllers/mediation_platform/litigation/iehighMeter.js']
		               })
		             },
		             datamsg: function() {
		                 return{
		                 	flage:3
		                 };
		             }
		           }
		         });
		         
		         //返回值
		         modalInstance.result.then(function (data) {
		        	 if(data.tesd==4){
			        		return;
			        	}
		         	var obj = eval('(' + data.imgurl+ ')');
		         	for(var i=0;i<obj.result.length;i++){
		         		var evidence = new Evidence(obj.result[i]);
		         		evidence.name=i+1;
		       		  adjust.evidenceArray.push(evidence);
		                
		         	}
		         	
		         }, function () {
		         });	
			
		}
        
        
      };
	  
	
	
	//证据删除(single)
	$scope.removeEvidence = function(evidence) {
		if(confirm("确定要删除证据吗？")){
			var index = $scope.adjust.evidenceArray.indexOf(evidence);
			if (evidence.id) {
				$scope.adjustService.removeEvidence({
					idArray: [evidence.id]
				}).success(function(result) {
					if (result.code == AdjustConfig.commonConStant.SUCCESS) {
						$scope.adjust.evidenceArray.splice(index, 1);
						$scope.handleAllSelect();
					} else if (result.code == AdjustConfig.commonConStant.FAILURE) {
            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageEvidenceRemoveError);
					}
				});
			} else {
				$scope.adjust.evidenceArray.splice(index, 1);
				$scope.handleAllSelect();
			}
		}
	}

	//证据删除(batch)
	$scope.co.batchRemoveEvidences = function() {

		if(confirm("确定要删除证据吗？")){
			var indices = [];
			var idArray = [];
			$scope.adjust.evidenceArray.forEach(function(v, i) {
				if (v.selected) indices.unshift(i);
				if (v.selected && v.id) idArray.push(v.id);
			})

			if (idArray.length) {
				$scope.adjustService.removeEvidence({
					idArray: idArray
				}).success(function(result) {
					if (result.code == AdjustConfig.commonConStant.SUCCESS) {
						//删除所有ID对应的对象
						deleteSelected($scope.adjust.evidenceArray, indices);
						$scope.handleAllSelect();
					} else if (result.code == AdjustConfig.commonConStant.FAILURE) {
            $rootScope.toaster("error", "错误", result.message);
					}
				});
			} else {
				deleteSelected($scope.adjust.evidenceArray, indices);
				$scope.handleAllSelect();
			}
      $scope.evidenceTagChanged();
		}
		function deleteSelected(arr, indiz) {
			indiz.forEach(function(v) {
				arr.splice(v, 1);
			})
		}
	}
	//证据批量下载
	$scope.batchDownLoadEvidenceUrl = AdjustConfig.adjustConStant.batchDownLoadEvidenceUrl;
	$scope.co.batchDownLoadEvidences = function() {
			var indices = []
			var picturePath = [];
			var serialNo = $scope.adjust.serialNo;
			$scope.adjust.evidenceArray.forEach(function(v, i) {
				if (v.selected) indices.unshift(i);
				picturePath.push(v.picture);
			})
			if (picturePath.length) {
				picturePath.join(",");
				return $scope.batchDownLoadEvidenceUrl+'?picturePath='+picturePath+"&serialNo="+serialNo;
			}
			$scope.evidenceTagChanged();

	}
	//新增证据标签
	$scope.addTag = function(evidence, tag) {
		if(evidence.classify == undefined) evidence.classify = '';  //手机传来的案件无该属性，为其添加默认空字符串，否则出现undefined
		if (!evidence.classify) {
			evidence.chooseTagArray = [];
			evidence.chooseTagArray.push(tag);
			evidence.classify += tag.id;
		} else if (evidence.classify.indexOf(tag.id) == -1) {
			evidence.chooseTagArray.push(tag);
			evidence.classify += "," + tag.id;
		}
    $scope.evidenceTagChanged();
	}

	//关闭证据标签
	$scope.closeTag = function(evidence, tag) {
		var tagIndex = evidence.chooseTagArray.indexOf(tag);
		evidence.chooseTagArray.splice(tagIndex, 1);

		evidence.classify = "";
		evidence.chooseTagArray.forEach(function(v) {
			if (!evidence.classify) {
				evidence.classify += v.id
			} else {
				evidence.classify += "," + v.id;
			}
		})
    
    $scope.evidenceTagChanged();
	}

	//证据全选
	$scope.co.selectAllItems = false;
	$scope.co.selectAllEvidence = function() {
		$scope.co.selectAllItems = !$scope.co.selectAllItems;
		$scope.adjust.evidenceArray.forEach(function(v, i) {
			if ($scope.co.selectAllItems) {
				v.selected = true;
			} else {
				v.selected = false;
			}
		})
	}

	//选择证据
	$scope.handleEvidence = function(evidence){
		evidence.selected = !evidence.selected;
		$scope.handleAllSelect();
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

	//限制图片大小
	function imageSize(file) {
		if(file){
			if(parseInt(file.size/(1024*1024))>= 10 ){
				$rootScope.toaster(level.warn, "提示","请上传小于10M大小的图片");
			}
		}
	}

	//获取前两步证据资料(当父级请求完案件信息后执行)
	//businessLicensePicture-营业执照  legalPersonPicture-法人代表证明  idFacePicture-身份证正面  idBackPicture-身份证背面
	//entrustFile-委托书  feeCertificate-不收取费用证书  letterFile-公函   -----  idFront-身份正面  idBack-身份背面  lawyerCard-律师证  relationSupport-与申请人关系证明
  if($scope.adjust.applicantArray.length > 0) { //步骤间跳转时执行
    getEvidenceArray();
  }

	$scope.$on('queryAdjust', function () { //首次进入或页面刷新时执行
		getEvidenceArray();
  });

	function getEvidenceArray() {
    $scope.step12EvidenceArray.length = 0; //将父级证据数组清空，以免发生重复添加
    $scope.adjust.applicantArray.forEach(function (applicant) {
      pushPictureUrl(applicant.businessLicensePicture, '营业执照', '01');
      pushPictureUrl(applicant.idBackPicture, '身份证背面', '01');
      pushPictureUrl(applicant.idFacePicture, '身份证正面', '01');
      pushPictureUrl(applicant.legalPersonPicture, '法人代表证明', '01');
      applicant.agentArray.forEach(function (agent) {
        pushPictureUrl(agent.entrustFile, '委托书', '74');
        pushPictureUrl(agent.feeCertificate, '不收取费用证书', '74');
        pushPictureUrl(agent.idBack, '身份证正面', '01');
        pushPictureUrl(agent.idFront, '身份证正面', '01');
        pushPictureUrl(agent.lawyerCard, '律师证', '01');
        pushPictureUrl(agent.letterFile, '公函', '74');
        pushPictureUrl(agent.relationSupport, '与申请人关系证明', '01');
      })
    });
  }

	function pushPictureUrl(picture, name, id) {

		if(picture){
			if(picture != $scope.co.defaultImg && picture != $scope.co.defaultImg2 && picture != $scope.co.defaultImg3) {
				var evidence = {
					name: name,
					picture: picture,
					chooseTagArray: [],
					classify: ''
				};
				$scope.step12EvidenceArray.push(evidence);  //父级声明的数组
				//将默认标签添加进evidence中
				$scope.addTag(evidence, $scope.feeTypeList.filter(function (v) {
					if(v.id == id) return v;
				})[0]);
			}
		}

  }
});