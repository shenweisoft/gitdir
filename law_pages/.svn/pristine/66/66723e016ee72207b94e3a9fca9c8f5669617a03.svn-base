'use strict';


app.filter('agentIdentityFilter', function () {
	return function (arr,id) {
		var text = "";
		text = arr.filter(function (val) {
			return val.id == id
		})[0].value
		return text || '';
	}
});


angular.module('sbAdminApp').controller('step12Ctrl', function($scope, $stateParams, $state, $location, $timeout, $http, $log, $filter, $modal, toaster, AdjustService, AdjustConfig, DictionaryConfig, Upload, IdentityService, AnchorSmoothScroll,$rootScope,LoginService) {
	//身份类型
	$scope.idTypeList = DictionaryConfig.idTypeConstant;
	//证件类型
	$scope.certificatesTypeList = DictionaryConfig.certificateTypeConstant;
	//公司类型
	$scope.companyTypeList = DictionaryConfig.companyTypeList;
	//保险公司
	$scope.insuranceList = DictionaryConfig.insuranceList;
	//法人类型
	$scope.legalTypeArray = DictionaryConfig.legalTypeList;
	//代理人类型
	$scope.agentTypeList = DictionaryConfig.agentTypeConstant;
	//代理人类型
	$scope.proxyTypeConstantList = DictionaryConfig.proxyTypeConstant;
	//与申请人的关系
	$scope.relation2Applicant = DictionaryConfig.relation2Applicant;
	//委托授权
	$scope.proxyPermissionConstantList = DictionaryConfig.proxyPermissionConstant;
	//代理权限详情
	$scope.agentPowerList = DictionaryConfig.agentPowerList;
	//常用保险公司
	$scope.commonInsuranceList = [];
	//查询人伤信息service
	$scope.queryPeopleInjuredService = $scope.adjustService.queryPeopleInjured;

	//常用代理人
	$scope.commonAgentList =[];


	$scope.CONSTANT = {
		"messagePictrueTypeError":"请上传图片格式文件",
		"messageIdentityFormatError": "身份证号格式不正确",
		"messageIdentityRecognizeError": "身份证解析失败",
		"messageApplicantRemoveError": "申请人删除出错了",
		"messageAtleastOneApplicant": "至少有一个申请人",
		"messageCommonInsuranceInitError": "初始化常用保险公司失败",
		"messageAgentRemoveError": "代理人删除错误",
		"messageAgentMaxError": "每个申请人最多可以拥有两个代理人",
    	"messageSaveInsuranceSuccess":"常用保险公司保存成功",
		"messageSaveCommonAgentSuccess":"常用代理人保存成功",
		"messageDeleteCommonAgentSuccess":"常用代理人删除成功",
		"messageCommonAgentError":"初始化常用代理人失败"
	}

	var level = "error";
	var title = "错误";

	if ($stateParams.step) {
		$scope.co.step = parseInt($stateParams.step);
	}

	$scope.isNavHashOpened = false;
	//初始化常用保险公司
	(function() {
		$scope.sysUser =LoginService.user.sysUser;
		$scope.adjustService.getCommonInsurance({}).success(function(result) {
			if (result.code == AdjustConfig.commonConStant.SUCCESS) {
				$scope.commonInsuranceList = result.result;
			} else if (result.code == AdjustConfig.commonConStant.FAILURE) {
        $rootScope.toaster(level, title, $scope.CONSTANT.messageCommonInsuranceInitError);
			}
		})
	})();

	//获取常用代理人信息
	$scope.adjustService.selectCommonAgentList({}).success(function(result){
		if (result.code == AdjustConfig.commonConStant.SUCCESS){
			$scope.commonAgentList = result.result;
		}else if (result.code == AdjustConfig.commonConStant.FAILURE) {
			$rootScope.toaster(level, title, $scope.CONSTANT.messageCommonAgentError);
		}
	});

	//保存常用代理人
	//根据代理人姓名 手机号判断是否新增还是修改
	$scope.saveCommonAgent = function(agent) {
		if(validateAnent(agent)){
			if(	agent.birthDay){
				agent.birthDay = $filter('date')(agent.birthDay, 'yyyy-MM-dd HH:mm:ss');
			}
			$scope.adjustService.saveJyAgentCommonInfo(agent).success(function(result) {
				if (result.code == AdjustConfig.commonConStant.SUCCESS) {
					var obj = _.find($scope.commonAgentList, {agentName: result.result.agentName});
					if (obj) {
						for (var i =0 ;i<$scope.commonAgentList.length;i++ ){
							 if ($scope.commonAgentList[i].id == result.result.id){
									$scope.commonAgentList[i] = result.result;
							 }
						}
					} else {
						$scope.commonAgentList.push(result.result);
					}
					$rootScope.toaster(DictionaryConfig.levelConstant.success, DictionaryConfig.titleConstant.success, $scope.CONSTANT.messageSaveCommonAgentSuccess);
				}else{
					$rootScope.toaster(level, title, $scope.CONSTANT.messageCommonAgentError);
				}
				if(	agent.birthDay){
					//保存常用代理人返回后，格式化出生日期
					agent.birthDay = parseISO8601(agent.birthDay);
				}
			})
		}
	};
	function validateAnent(agent){
		if(!agent.agentName){
			$rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, "请填写代理人名称");
			return false;
		}
		if(!agent.telephone){
			$rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, "请填写电话号码");
			return false;
		}
		return true;
	}

	function parseISO8601(dateStringInRange) {
		var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d) (\d{2}):(\d{2}):(\d{2})\s*$/,
			date = new Date(NaN), month,
			parts = isoExp.exec(dateStringInRange);

		if(parts) {
			month = +parts[2];
			date.setFullYear(parts[1], month - 1, parts[3]);
			if(month != date.getMonth() + 1) {
				date.setTime(NaN);
			}
		}
		return date;
	}

	//选择常用代理人
	$scope.selectCommonAgent = function(agent) {
		//保险公司单击事件
		var id = agent.commonAgent;
		var insurance = $scope.commonAgentList.filter(function(v){
			return v.id == id
		})[0]
		if(insurance){
			agent.id = insurance.id;
			agent.agentType = insurance.agentType ;
			agent.agentIdentity = insurance.agentIdentity  ;
			agent.certificatesType = insurance.certificatesType;
			agent.agentIdentityItem = insurance.agentIdentityItem && insurance.agentIdentityItem.toString() ;
			agent.idNo = insurance.idNo;
			agent.entrustPower = insurance.entrustPower;
			agent.entrustPowerDetail = insurance.entrustPowerDetail;
			agent.agentName = insurance.agentName;
			agent.telephone = insurance.telephone;
			agent.companyName = insurance.companyName;
			agent.sendAddress = insurance.sendAddress;
			agent.relation = insurance.relation;
			agent.domicile = insurance.domicile;
			agent.residence = insurance.residence;
			agent.idFront =insurance.idFront;
			agent.idBack = insurance.idBack;
			agent.relationSupport = insurance.relationSupport;
			agent.feeCertificate = insurance.feeCertificate;
			agent.entrustFile = insurance.entrustFile;
			agent.letterFile = insurance.letterFile;
			agent.lawyerCard = insurance.lawyerCard;
			if(insurance.birthDay) agent.birthDay =parseISO8601(insurance.birthDay);
			if(insurance.nation) agent.nation =insurance.nation;
			if(insurance.sex) agent.sex =insurance.sex;
		}
	};

	//删除常用代理人
	$scope.deletCommonAgent = function(agent){

		$scope.adjustService.deleteJyAgentCommonInfoById(agent).success(function(result) {
			if (result.code == AdjustConfig.commonConStant.SUCCESS) {
				var commonAgentList = $scope.commonAgentList;
				var commonAgentId = result.result;
				for(var i=0; i<commonAgentList.length; i++) {
					if(commonAgentList[i].id === commonAgentId) {
						commonAgentList.splice(i, 1);
						break;
					}
				}
				$rootScope.toaster(DictionaryConfig.levelConstant.success, DictionaryConfig.titleConstant.success, $scope.CONSTANT.messageDeleteCommonAgentSuccess);
			}
		})
	};
	//获取登录用户信息
	$scope.$on('user2Child', function () {
		$scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
   })
	if(LoginService.user.userPermissions) {
    $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
	}

	//申请人增加
	$scope.addApplicant = function() {
		var applicant;
		if ($scope.co.step == 1) {
			applicant = new $scope.co.Applicant(0);
		} else if ($scope.co.step == 2) {
			applicant = new $scope.co.Applicant(1);
		}
		$scope.adjust.applicantArray.push(applicant);
		$scope.locate(applicant.hashIndex);
	};
	
	$scope.locate = function(id) {
		var hash = 'name'+id;
		$location.hash(hash);
		$timeout(function() {
			AnchorSmoothScroll.scrollTo(hash);
		});
	};
	//验证身份证
	$scope.checkIdentity = function(applicant, isAgent) {
		var wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
		var valideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
		function isTrueValidateCodeBy18IdCard(idCard) {

			var idCardArray = [];
			for (var i = 0; i <= 17; i++) {
				var char = idCard.charAt(i);
				if(idCard.charAt(i).toUpperCase() == 'X'){
					char = 10;// 将最后位为x的验证码替换为10方便后续操作
				}
				idCardArray.push(parseInt(char));
			}

			var sum = 0; // 声明加权求和变量
			for (var i = 0; i < 17; i++) {
				sum += wi[i] * idCardArray[i]; // 加权求和
			}
			var valCodePosition = sum % 11; // 得到验证码所位置
			return idCardArray[17] == valideCode[valCodePosition];
		}
		if (applicant.certificatesType == 0 && applicant.idNo) {
			applicant.idNo = applicant.idNo.replace(/ /g, "");
			if (applicant.idNo.length == 15) {
				var year = applicant.idNo.substring(6, 8);
				var month = applicant.idNo.substring(8, 10);
				var day = applicant.idNo.substring(10, 12);
				var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
				if (tempDate.getYear() == parseFloat(year) && tempDate.getMonth() == parseFloat(month) - 1 && tempDate.getDate() == parseFloat(day)) {
					applicant.birthDay = tempDate;
					applicant.sex = applicant.idNo.substring(14, 15) % 2 == 0 ? '1' : '0';
					applicant.idNoError = false;
				} else {
					applicant.idNoError = true;
					$rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIdentityFormatError);
				}
			} else if (applicant.idNo.length == 18 && isTrueValidateCodeBy18IdCard(applicant.idNo)) {
				var year = applicant.idNo.substring(6, 10);
				var month = applicant.idNo.substring(10, 12);
				var day = applicant.idNo.substring(12, 14);
				var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
				if (tempDate.getFullYear() == parseFloat(year) && tempDate.getMonth() == parseFloat(month) - 1 && tempDate.getDate() == parseFloat(day)) {
					applicant.birthDay = tempDate;
					applicant.sex = applicant.idNo.substring(16, 17) % 2 == 0 ? '1' : '0';
					applicant.idNoError = false;
				} else {
					applicant.idNoError = true;
					$rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIdentityFormatError);
				}
			} else {
				//校验香港身份证规则
				var taiwanreg = /^[A-Z][0-9]{9}$/;
				//校验台湾身份证规则
				var xianggangreg = /^[A-Z][0-9]{6}\([0-9A-Z]\)$/;
				var xianggangreg1 = /^[A-Z][0-9]{6}\（[0-9A-Z]\）$/;
				//校验澳门身份证规则
				var aomenreg = /^[157][0-9]{6}\([0-9]\)$/;
				var aomenreg1 = /^[157][0-9]{6}\（[0-9]\）$/;
				if (!(taiwanreg.test(applicant.idNo) || xianggangreg.test(applicant.idNo) || xianggangreg1.test(applicant.idNo) || aomenreg.test(applicant.idNo) || aomenreg1.test(applicant.idNo))) {
					//TODO
					applicant.idNoError = true;
					$rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIdentityFormatError);
				} else applicant.idNoError = false;
			}

			if (isAgent && applicant.certificatesType!=0) {
				applicant.birthDay = applicant.sex = undefined;
			}
		}
	};
  $scope.minDate = new Date();
	
	$scope.openCalendar = function($event, applicant) {
		$event.preventDefault();
		$event.stopPropagation();
		applicant.calendarIsOpen = true;
	};
	//上传申请人图片功能
	$scope.imageAddress = AdjustConfig.pictureConstant.smallPictureUrl;
	$scope.uploadImage = function(file, applicant, type) {
    imageSize(file);
    if(!file){
      $rootScope.toaster(level.warn, title.warn, $scope.CONSTANT.messagePictrueTypeError);
        return;
	}
    Upload.upload({
			url: AdjustConfig.pictureConstant.uploadImageUrl,
			data: {
				type: 'applicant'
			},
      file: file
    }).success(function(resp) {
			switch (type.trim()) {
				case 'face': applicant.idFacePicture = resp.result; break;
				case 'back': applicant.idBackPicture = resp.result; break;
				case 'business': applicant.businessLicensePicture = resp.result; break;
				case 'legal': applicant.legalPersonPicture = resp.result; break;
			}
			if (type == 'face') { //身份证正面照，解析
				$http({
					method: 'post',
					url: '/lawProject/common/cardDisc',
					data: {
						"path": resp.result,
						"type": "applicant"
					}
				}).success(function(res) {
					if (res.code == AdjustConfig.commonConStant.SUCCESS && res.result) {
						applicant.personName = res.result.name;
						applicant.idNo = res.result.code;
						applicant.nation = res.result.nation;
						if(applicant.nation.indexOf("族") < 0){
							applicant.nation += "族";
						}
						applicant.sex = res.result.sex == '男' ? 0 : 1;
						applicant.birthDay = res.result.birthday;
						applicant.residence = res.result.addr;
						applicant.domicile = res.result.addr;
						applicant.sendAddress = res.result.addr;
					} else if (res.code == AdjustConfig.commonConStant.FAILURE) {
            $rootScope.toaster(level, title, "身份证识别失败!");
					}
				})
			}
    }).error(function(resp, status, headers, config){
      
    });
	};

	//删除(被)申请人的图片
	$scope.removeApplicantImage = function(applicant, attr){
	  switch (attr){
      case 'face': applicant.idFacePicture = $scope.co.defaultImg;break;
      case 'back': applicant.idBackPicture = $scope.co.defaultImg;break;
      case 'business': applicant.businessLicensePicture = $scope.co.defaultImg;break;
      case 'legal': applicant.legalPersonPicture = $scope.co.defaultImg;break;
    }
  }
  
	//选择系统保险公司
	$scope.insuranceShow = false;
	$scope.insuranceFocus = function() {
    if (!$scope.insuranceShow) $scope.insuranceShow = true;
  }
  
  $scope.blurInsurance = function(){
    if($scope.insuranceShow){
      $timeout(function(){
        $scope.insuranceShow = false;
      }, 200);
    }
  };
  //保险公司单击事件
	$scope.selectItems = function(applicant, insurance) {
		applicant.companyName = insurance.text;
		applicant.orgCode = insurance.id;
    applicant.companyCode = insurance.code;
		$scope.insuranceShow = false;
	};
	$scope.selectCompanyPopup = false;
	var CommonInsurance = function(type, applicant) {
		//1:表示保险公司 2：表示其它组织
		this.type = type;
	  this.orgCode = applicant.orgCode||"";
		this.headOffice = applicant.companyName||"";
		this.companyName = applicant.orgName||"";
		this.legalType = applicant.legalType||"";
		this.legalName = applicant.legalName||"";
		this.job = applicant.job||"";
		this.registerCode = applicant.registerCode||"";
		this.telephone = applicant.telephone||"";
		this.email = applicant.email||"";
		this.residence = applicant.residence||"";
		this.sendAddress = applicant.sendAddress||"";
    this.businessLicensePicture = applicant.businessLicensePicture||"";
    this.legalPersonPicture = applicant.legalPersonPicture||"";
    this.companyCode = applicant.companyCode||"";
	};
	
	function validateInsurance(applicant, type){
	  if(!applicant.orgName){
      $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, "请填写企业名称");
      return false;
    }
    if(type == '1' && !applicant.companyName){
      $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, "请填写保险公司名称");
      return false;
    }
    return true;
  }

	//保存常用保险公司
	//根据当前用户ID、总公司信息、企业名称、电话、类型判断
	$scope.saveInsurance = function(applicant, type) {
	  if(validateInsurance(applicant, type)){
      var commonInsurance = new CommonInsurance(type, applicant);
      $scope.adjustService.saveCommonInsurance(commonInsurance).success(function(result) {
        if (result.result) {
          commonInsurance.id = result.result
          $scope.commonInsuranceList.push(commonInsurance);
        }
        var message = type=='1'?"常用保险公司保存成功":'常用公司保存成功';
        $rootScope.toaster(DictionaryConfig.levelConstant.success, DictionaryConfig.titleConstant.success, message);
      })
    }
	};
  $scope.selectCommonInsurance = function(applicant, type) {
    //保险公司单击事件
    var id = applicant.commonInsurance
    if(type == 2){
      id = applicant.commonCompany
    }
		var insurance = $scope.commonInsuranceList.filter(function(v){
		  return v.id == id && v.type == type
    })
		if(insurance[0]){
      if(!insurance[0].companyCode){
        insurance[0].companyCode = _.find($scope.insuranceList, {text: applicant.companyName}).code;
      }
      applicant.orgCode = insurance[0].orgCode;
      applicant.companyCode = insurance[0].companyCode;
      applicant.companyName = insurance[0].headOffice;
      applicant.orgName = insurance[0].companyName;
      applicant.legalType = insurance[0].legalType;
      applicant.legalName = insurance[0].legalName;
      applicant.job = insurance[0].job;
      applicant.registerCode = insurance[0].registerCode;
      applicant.telephone = insurance[0].telephone;
      applicant.email = insurance[0].email;
      applicant.residence = insurance[0].residence;
      applicant.sendAddress = insurance[0].sendAddress;
      applicant.businessLicensePicture = insurance[0].businessLicensePicture;
      applicant.legalPersonPicture = insurance[0].legalPersonPicture;
    }
	};
  $scope.openAgentCalendar = function($event, agent) {
    $event.preventDefault();
    $event.stopPropagation();
    agent.calendarIsOpen = true;
  };
  $scope.changeIsLive = function($event, object){
    if($event.target.checked)  object.isLive = 1;
    else object.isLive = 0;
  }
	//改变代理人类型 
	$scope.changeAgentType = function($event, agent) {
		if ($event.target.value == '0') { //委托
			agent.certificatesType = "5";
		} else if ($event.target.value == '1') { //法人
			agent.certificatesType = "0";
		}
	};
	//改变代理人身份
	$scope.changeIdentity = function(agent) {
		if (agent.agentIdentity == 0) { //证件类型
			agent.certificatesType = "5";
		} else {
			agent.certificatesType = "0";
		}
		if (agent.agentIdentity == 1) { //与被申请人关系
			agent.agentIdentityItem = '1'
		} else {
			agent.agentIdentityItem = ''
		}
	};
	//改变代理权限
	$scope.changePower = function(agent) {
		if (agent.entrustPower == 1) { //特别授权代理
			agent.entrustPowerDetail = "1,2,3,4,5";
			//五项禁止选择
			$scope.agentPowerList.forEach(function (v) {
				if( ['1','2','3','4','5'].indexOf(v.id) != -1)  v.powerDisabled = true;
			})
		} else {
			agent.entrustPowerDetail = "";
			//清空禁止选择
			$scope.agentPowerList.forEach(function (v) {
				 v.powerDisabled = false;
			})
		}
	};
	//代理人权限详情选择
	$scope.updateSelection = function($event, id, agent) {
		var checkbox = $event.target;
		var checked = checkbox.checked;
		var powerSelected = [];
		if (agent.entrustPowerDetail) powerSelected = agent.entrustPowerDetail.split(',');
		if (checked) {
			powerSelected.push(id);
		} else {
			var idx = powerSelected.indexOf(id);
			powerSelected.splice(idx, 1);
		}
		agent.entrustPowerDetail = powerSelected.length == 0 ? "" : powerSelected.join(',');
	};
	//上传代理人图片功能
	$scope.uploadAgentImage = function(file, agent, type) {
		imageSize(file);
        if(!file){
          $rootScope.toaster(level.warn, title.warn, $scope.CONSTANT.messagePictrueTypeError);
            return;
        }
		Upload.upload({
			url: AdjustConfig.pictureConstant.uploadImageUrl,
			data: {
				file: file,
				type: 'agent'
			}
		}).success(function(resp) {
			switch (type) {
				case 'front':
					agent.idFront = resp.result;
					break;
				case 'back':
					agent.idBack = resp.result;
					break;
				case 'lawyer':
					agent.lawyerCard = resp.result;
					break;
				case 'relation':
					agent.relationSupport = resp.result;
					break;
				case 'entrust':
					agent.entrustFile = resp.result;
					break;
        case 'letter':
          agent.letterFile = resp.result;
          break;
				case 'fee':
					agent.feeCertificate = resp.result;
					break;
			}
		});
	};
  
  //删除(被)申请人的图片
  $scope.removeAgentImage = function(agent, attr){
    switch (attr){
      case 'front': agent.idFront = $scope.co.defaultImg;break;
      case 'back': agent.idBack = $scope.co.defaultImg;break;
      case 'lawyer': agent.lawyerCard = $scope.co.defaultImg;break;
      case 'relation': agent.relationSupport = $scope.co.defaultImg;break;
      case 'entrust': agent.entrustFile = $scope.co.defaultImg;break;
      case 'letter': agent.letterFile = $scope.co.defaultImg;break;
      case 'fee': agent.feeCertificate = $scope.co.defaultImg;break;
    }
  }
	
	//代理人增加 [每个申请人最多增加两个代理人]
	$scope.addAgent = function(applicant) {
		var agentArray = applicant.agentArray;
		if (agentArray.length < 2) {
			var agentIndex = applicant.hashIndex + "." + agentArray.length;
			agentArray.push(new $scope.co.Agent(agentIndex, agentArray.length + 1));
		} else {
			$rootScope.toaster(level, title, $scope.CONSTANT.messageAgentMaxError);
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
	//限制图片大小
	function imageSize(file) {
		if(file){
			if(parseInt(file.size/(1024*1024))>= 10 ){
				$rootScope.toaster(level.warn, title.warn,"请上传小于10M大小的图片");
			}
		}
	}

	//人伤对象
	function PeopleInjured(){
		this.requestType = "001";
		this.accidentCode = "";
		this.code = "";
		this.serialNo = "";
	}
  $scope.queryPeopleInjuredAchieve = function(applicant){
    if(validatePeopleInjured(applicant)){
      var peopleInjured = new PeopleInjured();
      peopleInjured.accidentCode = applicant.lossNo;
      var insurance = _.find($scope.insuranceList, {text: applicant.companyName});
      peopleInjured.code = insurance.code;
      peopleInjured.serialNo = $scope.adjust.serialNo;
      //通过接口查询信息
      $scope.queryPeopleInjuredService(peopleInjured).success(function(result){
        //数据库保存的人伤关联信息
        $log.info(result);
        //如果成功则弹出接口返回信息
        if (result.code == AdjustConfig.commonConStant.SUCCESS) {
          $scope.injureList = result.result.injureList;
          if($scope.injureList){
            $scope.injureList.forEach(function(val){
              var obj = $scope.injureApplyerInfoList.filter(function(v){
                return v.accidentCode == result.result.claiminfo.accidentCode && v.flowNo == val.flowNo && v.jyApplyerInfoId == applicant.id;
              });
              if(obj.length > 0){
                val.showFlag = "1";
              }
            });
          }
          interfacePopupModal(result.result,applicant);
        }else{
          $rootScope.toaster("warn", "提示","当前赔案下没有匹配的人伤任务，请联系保险公司进行处理!");
        }
      });
    }
  }
	//查询人伤信息
	$scope.queryPeopleInjured = function(applicant){
    if(applicant.id){
        $scope.queryPeopleInjuredAchieve(applicant);
    }else{
        $scope.save(null, function(){$scope.queryPeopleInjuredAchieve(applicant)},null);
    }
	};

	//接口返回信息
	function interfacePopupModal(people,applicant){

		//保险公司理赔信息
		$scope.claiminfoInfoNew.sumBusiness = people.claiminfo.sumBusiness;
		$scope.claiminfoInfoNew.franchise = people.claiminfo.franchise;
		//车牌号
		if(people.claiminfo.plateNo){
			$scope.adjust.applicantArray.forEach(function(v){
				if(v.personType == 1){
					v.plateNo = people.claiminfo.plateNo;
				}
			});
		}
		var popupModal = $modal.open({
			templateUrl: 'views/pages/mediation_platform/litigation_mediation/interfacePopup.html',
			controller: 'InterfacePopupCtrl',
			size: 'lg',
			resolve: {
				items: function(){
					return {
						people: people,
						applicant:applicant,
						accidentCode:applicant.lossNo,
						serialNo:$scope.adjust.serialNo,
						injureApplyerInfoList:$scope.injureApplyerInfoList
					}
				}
			}
		});
	};

	//验证请求信息
	function validatePeopleInjured(applicant){
		if(!applicant.companyName){
			$rootScope.toaster(level.error, title.error,"请您选择总公司！");
			return false;
		}
		if(!applicant.lossNo){
			$rootScope.toaster(level.error, title.error,"请您输入报案号！");
			return false;
		}
		return true;
	}

})


var app = angular.module('sbAdminApp');
app.filter('id2Text', function() {
	return function(id,data) {
		var result = _.find(data, {
			id: id+""
		});
		return result? result.value:""
	}
});
//人伤接口弹出信息
angular.module('sbAdminApp').controller('InterfacePopupCtrl', function($scope, $stateParams, $state, $location, $timeout, $http, $log,items,$modalInstance,AdjustService, AdjustConfig,toaster) {
	$scope.injureCertificateNoList = [{
		"id": "01",
		"value": "身份证",
	}, {
		"id": "05",
		"value": "驾驶执照"
	}, {
		"id": "09",
		"value": "外籍在华驾驶证"
	}, {
		"id": "10",
		"value": "军队驾驶证"
	}, {
		"id": "11",
		"value": "暂未获取"
	}, {
		"id": "12",
		"value": "律师证"
	}];
	//人伤主信息
	$log.info(items.people);

	$scope.claiminfo = items.people.claiminfo;

	//伤者信息
	$scope.injureList = items.people.injureList;

  $scope.injureApplyerInfoList = items.injureApplyerInfoList;

  $scope.applicant = items.applicant;

  $scope.injureApplyerInfoList.forEach(function(v){  //第一次进入主页面打开弹出框时根据jyApplyerId将flowNo传给申请人
    if(v.jyApplyerInfoId == $scope.applicant.id){
        $scope.applicant.flowNo=v.flowNo;
    }
  })
  $scope.injureList.forEach(function(val){   //匹配flowNo,相同的显示已关联
    if(val.flowNo == $scope.applicant.flowNo){
      val.showFlag = '1';
    }else {
      val.showFlag = '0';
    }
  });


	//添加关联关系
	$scope.saveInjureApplyerInfoService = AdjustService.saveInjureApplyerInfo;
	//人伤关联对象
	function PeopleInjuredRelation(){
		this.serialNo = items.serialNo;
		this.accidentCode = items.accidentCode;
		this.flowNo = "";
		this.jyApplyerInfoId = items.applicant.id;
	}

	//添加关联
	$scope.addPeople = function(injure){
		var peopleInjuredRelation = new PeopleInjuredRelation();
		peopleInjuredRelation.flowNo = injure.flowNo;
		//添加关联操作
		$scope.saveInjureApplyerInfoService(peopleInjuredRelation).success(function(result) {
			//请求成功
			if (result.code == AdjustConfig.commonConStant.SUCCESS) {
				//将所有关联数据清除
				$scope.injureList.forEach(function(val){
					val.showFlag = '0';
				});
				injure.showFlag = '1';

        $scope.injureApplyerInfoList.forEach(function(v){ //更新injureApplyerInfoList中的申请人对应flowNo信息
          if(v.jyApplyerInfoId == $scope.applicant.id){
            v.flowNo=injure.flowNo;
          }
        })
        // $scope.injureApplyerInfoList[0].flowNo = injure.flowNo;
        $scope.applicant.flowNo = injure.flowNo;
				$rootScope.toaster("success", "成功", "恭喜您，关联成功！");
			}else{
				$rootScope.toaster("error", "错误", "操作失败，请联系统管理员！");
			}
		});

	};

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
});