'use strict';
var app = angular.module('sbAdminApp');

app.filter('result2Text', function() {
	return function(result) {
		var text = "";
		if (result.payType == "1" || result.payType == "2") {
			text += result.companyName + "(车牌号:" + result.plateNo + ")";
		} else if (result.payType == "3") {
			if (result.personType == 1) {
				text += result.personName + " 自行承担"
			} else if (result.personType == 0) {
				text += result.personName+" 自行承担"
			}
		}
		return text
	}
});

app.filter('respondents2Company', function() {
	return function(result) {
		var arr = [];
		result.forEach(function(v) {
			if (v.personType == "1" && v.idType == "1" && v.enterpriseType == "1") {
				if (arr.indexOf(v.orgName) == -1) arr.push(v.orgName);
			}
		});
		return arr;
	}
});

app.directive('intOnly', function($filter) {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, modelCtrl) {
			element.bind('keyup', function(inputValue, e) {
				var strinput = modelCtrl.$modelValue + "";
				strinput = strinput ? strinput.replace(/[^\d.]/g, '') : '0'
				modelCtrl.$setViewValue(parseInt(strinput));
				modelCtrl.$render();
			});
		}
	}
});

app.directive('floatOnly', function($filter, $timeout) {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      var checkTimeout;
      element.bind('keyup', function(inputValue, e) {
        if(checkTimeout){
          $timeout.cancel(checkTimeout)
          checkTimeout = null;
        }
        
        var strinput = modelCtrl.$modelValue;
				checkTimeout = $timeout(function() {
					if(strinput && !isNaN(strinput)){
						strinput = strinput ? strinput.toString().replace(/[^\d.]/g, '') : "";
						if(strinput.indexOf(".") > 0 && strinput.length - 1 != strinput.indexOf(".")){
							var floatLength = strinput.length - strinput.indexOf(".") - 1;
							floatLength = floatLength > 2 ? 2:floatLength;
							strinput = parseFloat(strinput).toFixed(floatLength);
						}
					}else{
						strinput = "";
					}
					modelCtrl.$setViewValue(strinput);
					modelCtrl.$render();
				}, 1500);
      });
    }
  }
})

app.controller('MediationPlanCtrl', function($scope, $stateParams, $interpolate, toaster, $state, $location, $timeout, $http, $log, $filter, $modal, AdjustService, AdjustConfig, LawService, LawConfig, DictionaryConfig, CompensateStandardConstant, Upload, IncomeNormConstant, AdminConstant, $rootScope) {
  $scope.lawService = LawService;
  //调解结果
	$scope.ajustResultArray = DictionaryConfig.adjustResultList;
	//取得户口类型字典
	$scope.accountTypeList = DictionaryConfig.accountTypeList;
	//填充区域信息
	$scope.adminRegion = AdminConstant.administrationRegions;
	$scope.incomeNorm = IncomeNormConstant.incomeNorm;
	$scope.compensateStandard = CompensateStandardConstant.compensateStandard;
  $scope.factTypeList = DictionaryConfig.factTypeList;
	//获取赔偿年度
	$scope.yearList = DictionaryConfig.getYearList();
	//后台查询计算器的相关标准
	$scope.queryCalculateStandardService = AdjustService.queryCalculateStandard;
  var level = DictionaryConfig.toaster.level;
  var title = DictionaryConfig.toaster.title;
  $scope.CONSTANT = {
    "messageBackend": "后台忙,请稍候再试"
  };
  //用户类型：0:原告 1：被告 2：法官
  $scope.userType = $stateParams.personType;
  
  //查询详细案件
  $scope.adjust = {};
  $scope.queryFilingDetails = function () {
    $scope.lawService.queryLawInfo({
      "serialNo": $stateParams.serialNo
    }).success(function (result) {
      if(result.code ==  LawConfig.commonConstant.SUCCESS ){
        $scope.adjust = result.result;
        if ($scope.adjust.feeDetail){
					$scope.adjust.feeDetail = JSON.parse($scope.adjust.feeDetail);
					$scope.adjust.feeDetail = $scope.adjust.feeDetail.filter(function(v){
						return v.isChecked == true;
					});
				}
				$scope.adjust.applicantArray.filter(function(m){
					return m.personType == 1
				}).forEach(function(n){
					if (n.riskTypes) n.riskTypes = JSON.parse(n.riskTypes);
				});

        if ($scope.adjust.compensateTable) $scope.adjust.compensateTable = JSON.parse($scope.adjust.compensateTable)
        if ($scope.adjust.deathDate) $scope.adjust.deathDate = parseISO8601($scope.adjust.deathDate);
        if ($scope.adjust.adjustDate) $scope.adjust.adjustDate = parseISO8601($scope.adjust.adjustDate);
        if ($scope.adjust.compensateStandard) $scope.adjust.compensateStandard = JSON.parse($scope.adjust.compensateStandard);
				//计算数据
				$scope.calculate();
      }else{
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.lawInitError);
      }
    })
  };
  $scope.queryFilingDetails();
  
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
  
  //保存操作
  $scope.save = function() {
    $scope.calculate();
    var adjust = angular.copy($scope.adjust);
    filterParam(adjust);
    $scope.lawService.saveLawCase(adjust).success(function(result) {
      if (result.code == AdjustConfig.commonConStant.SUCCESS) {
        $rootScope.toaster(level.success, title.success, "保存成功!");
      } else {
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
      }
    })
  };
  
  function filterParam(adjust) {
    if(adjust.applicantArray){
      adjust.applicantArray.forEach(function(v) {
        if (v.birthDay) v.birthDay = $filter('date')(v.birthDay, 'yyyy-MM-dd HH:mm:ss');
        if(v.agentArray){
          v.agentArray.forEach(function(m) {
            if (m.birthDay) m.birthDay = $filter('date')(m.birthDay, 'yyyy-MM-dd HH:mm:ss');
          })
        }
      });
    }
    if (adjust.compensateStandard) adjust.compensateStandard = JSON.stringify(adjust.compensateStandard);
    if (adjust.compensateTable) adjust.compensateTable = JSON.stringify(adjust.compensateTable);
    if (adjust.feeDetail) adjust.feeDetail = JSON.stringify(adjust.feeDetail);
    if (adjust.deathDate) adjust.deathDate = $filter('date')(adjust.deathDate, 'yyyy-MM-dd HH:mm:ss');
    if (adjust.payDate) adjust.payDate = $filter('date')(adjust.payDate, 'yyyy-MM-dd HH:mm:ss');
    if (adjust.adjustDate) adjust.adjustDate = $filter('date')(adjust.adjustDate, 'yyyy-MM-dd HH:mm:ss');
		adjust.applicantArray.filter(function(m){
			return m.personType == 1
		}).forEach(function(n){
			if (n.riskTypes) n.riskTypes = JSON.stringify(n.riskTypes);
		});
  }

	$scope.$watch('adjust.deathDate', function(newV, oldV, scope) {
		if (newV == oldV) return;
		if (newV > new Date()) scope.adjust.deathDate = new Date();
	});

	$scope.treeConfig = {
		core: {
			multiple: false,
			animation: true,
			error: function(error) {
				$log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
			},
			check_callback: true,
			worker: true
		},
		types: {
			"default": {
				icon: 'iconfont icon-dizhi'
			},
			folder: {
				icon: 'iconfont icon-wenjian1'
			}
		},
		version: 1,
		plugins: ['types']
	};
	//默认数为收起状态
	$scope.isShowTree = false;

	$scope.findIncomeAndCompensate = function() {
		if ($scope.adjust.regionName && $scope.adjust.standardYear) {
			queryCalculateStandard();
		}
	};

	//默认系统初始化居民收支标准以及赔偿标准(延时一秒钟处理)
	setTimeout($scope.findIncomeAndCompensate,1000);

	//计算器传输对象
	function CalculateVO(){
		this.regionName = $scope.adjust.regionName;
		this.standardYear = $scope.adjust.standardYear;
		this.household = $scope.adjust.household;
	};

	//根据参数查询后端标准
	function queryCalculateStandard(){
		$scope.calculateVO = new CalculateVO();
		$scope.queryCalculateStandardService($scope.calculateVO).success(function(result) {
			//请求成功
			if (result.code == AdjustConfig.commonConStant.SUCCESS) {
				var calculateResultVO = result.result;
				$log.info(result.result);
				//计算费用标准
				//误工费
				if(calculateResultVO.lostIncome){
					$scope.adjust.compensateStandard.lostIncome = calculateResultVO.lostIncome;
				}else{
					$scope.adjust.compensateStandard.lostIncome = "";
				}
				//护理费
				if(calculateResultVO.standardNurseFee){
					$scope.adjust.compensateStandard.standardNurseFee = calculateResultVO.standardNurseFee;
				}else{
					$scope.adjust.compensateStandard.standardNurseFee = "";
				}
				//住院伙食补助费
				if(calculateResultVO.hospitalFoodSubsidies){
					$scope.adjust.compensateStandard.hospitalFoodSubsidies = calculateResultVO.hospitalFoodSubsidies;
				}else{
					$scope.adjust.compensateStandard.hospitalFoodSubsidies = "";
				}
				//营养费
				if(calculateResultVO.thesePayments){
					$scope.adjust.compensateStandard.thesePayments = calculateResultVO.thesePayments;
				}else{
					$scope.adjust.compensateStandard.thesePayments = "";
				}
				//交通费
				if(calculateResultVO.transportationFee){
					$scope.adjust.compensateStandard.transportationFee = calculateResultVO.transportationFee;
				}
				//住宿费
				if(calculateResultVO.accommodationFee){
					$scope.adjust.compensateStandard.accommodationFee = calculateResultVO.accommodationFee;
				}else{
					$scope.adjust.compensateStandard.accommodationFee = "";
				}
				//丧葬费
				if(calculateResultVO.funeralFeeStandard){
					$scope.adjust.compensateStandard.funeralFeeStandard = calculateResultVO.funeralFeeStandard;
				}else{
					$scope.adjust.compensateStandard.funeralFeeStandard = "";
				}
				//精神抚慰金标准
				if(calculateResultVO.spiritualConsolationFee){
					$scope.adjust.compensateStandard.spiritualConsolationFee = calculateResultVO.spiritualConsolationFee;
				}else{
					$scope.adjust.compensateStandard.spiritualConsolationFee = "";
				}
				//计算居民收入支出标准
				//农村赔偿标准
				//城镇在岗职工收入标准
				if(calculateResultVO.urbanSalary){
					$scope.adjust.compensateStandard.wageIncome = calculateResultVO.urbanSalary;
				}else{
					$scope.adjust.compensateStandard.wageIncome = "";
				}

				if(!calculateResultVO.ruralNetIncome){
					calculateResultVO.ruralNetIncome = "";
				}
				if(!calculateResultVO.ruralAverageOutlay){
					calculateResultVO.ruralAverageOutlay = "";
				}
				if(!calculateResultVO.urbanDisposableIncome){
					calculateResultVO.urbanDisposableIncome = "";
				}
				if(!calculateResultVO.urbanAverageOutlay){
					calculateResultVO.urbanAverageOutlay = "";
				}

				$scope.adjust.compensateStandard["1"] = {
					"income": calculateResultVO.ruralNetIncome,
					"expense": calculateResultVO.ruralAverageOutlay
				};
				//城镇赔偿标准
				$scope.adjust.compensateStandard["2"] = {
					"income": calculateResultVO.urbanDisposableIncome,
					"expense": calculateResultVO.urbanAverageOutlay
				};
				//循环计算器详细表
				var householdStr =  $scope.adjust.household == '1'?"农村":"城镇";
				$scope.adjust.feeDetail.forEach(function(v) {
					var cityStr = v.value +"："+$scope.adjust.regionName+$scope.adjust.standardYear+"年"+householdStr+"标准：";
					//住院伙食补助费
					if(v.id == '06'){
						if(calculateResultVO.hospitalFoodSubsidies){
							v.isClaimWarning = true;
							v.warningText = cityStr+calculateResultVO.hospitalFoodSubsidies+"元/天";
						}else{
							v.isClaimWarning = undefined;
							v.warningText = undefined;
						}
					}else if(v.id == '07'){//营养费
						if(calculateResultVO.thesePayments){
							v.isClaimWarning = true;
							v.warningText = cityStr+calculateResultVO.thesePayments+"元/天";
						}else{
							v.isClaimWarning = undefined;
							v.warningText = undefined;
						}
					}else if(v.id == '08' || v.id == '80'){//误工费与处理人误工费
						if(calculateResultVO.lostIncome){
							v.isClaimWarning = true;
							v.warningText = cityStr+calculateResultVO.lostIncome+"元/天";
						}else{
							v.isClaimWarning = undefined;
							v.warningText = undefined;
						}
					}else if(v.id == '09'){//护理费
						if(calculateResultVO.standardNurseFee){
							v.isClaimWarning = true;
							v.warningText = cityStr+calculateResultVO.standardNurseFee+"元/天";
						}else{
							v.isClaimWarning = undefined;
							v.warningText = undefined;
						}
					}else if(v.id == '11'){//住宿费
						if(calculateResultVO.accommodationFee){
							v.isClaimWarning = true;
							v.warningText = cityStr+calculateResultVO.accommodationFee+"元/天";
						}else{
							v.isClaimWarning = undefined;
							v.warningText = undefined;
						}
					}else if(v.id == '14'){//被抚养人生活费
						if($scope.adjust.household == '1'){
							if(calculateResultVO.ruralAverageOutlay){
								v.isClaimWarning = true;
								v.warningText = cityStr+calculateResultVO.ruralAverageOutlay+"元/年";
							}else{
								v.isClaimWarning = undefined;
								v.warningText = undefined;
							}
						}else{
							if(calculateResultVO.urbanAverageOutlay){
								v.isClaimWarning = true;
								v.warningText = cityStr+calculateResultVO.urbanAverageOutlay+"元/年";
							}else{
								v.isClaimWarning = undefined;
								v.warningText = undefined;
							}
						}
					}else if (v.id == "12" || v.id == "15") {
						//农村或者城镇赔偿标准
						var ruleMoney = $scope.adjust.compensateStandard[$scope.adjust.household];
						if( ruleMoney && parseFloat(ruleMoney.income) > 0){
							//显示标准
							v.isClaimWarning = true;
							v.warningText = cityStr+ruleMoney.income+"元/年";
						}else{
							v.isClaimWarning = undefined;
							v.warningText = undefined;
						}
					}else if(v.id == '16'){//丧葬费
						if(calculateResultVO.funeralFeeStandard){
							v.isClaimWarning = true;
							v.warningText = cityStr+parseFloat(calculateResultVO.funeralFeeStandard/12).toFixed(2)+"元/月";
						}else{
							v.isClaimWarning = undefined;
							v.warningText = undefined;
						}
					}else if (v.id == '17'){//精神抚慰金
						if(calculateResultVO.spiritualConsolationFee){
							v.isClaimWarning = true;
							v.warningText = cityStr+parseFloat(calculateResultVO.spiritualConsolationFee).toFixed(2)+"元";
						}else{
							v.isClaimWarning = undefined;
							v.warningText = undefined;
						}
					}
				});
			}else{
				//请求失败
        $rootScope.toaster("error", "错误", result.message);
			}
		});
	}
	$scope.deathDateOpened = false;
	$scope.adjustDateOpened = false;
	$scope.payDateOpened = false;
	$scope.openDeathDate = function($event, index) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.deathDateOpened = true;
	};
	$scope.openAdjustDate = function($event, index) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.adjustDateOpened = true;
	};
	$scope.openPayDate = function($event, index) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.payDateOpened = true;
	};

	$scope.riskTypes = [{
		id: "0",
		value: "交强险"
	}, {
		id: "1",
		value: "三者险"
	}, {
		id: "2",
		value: "不计免赔"
	}];

	$scope.addRespondentFilter = function(e) {
		var temp = e.responsibleRate ? e.responsibleRate == -1 : e.responsibleRate == 0 ? false : true;
		return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1')) && temp;
	}

	$scope.showRespondentFilter = function(e) {
		var temp = e.responsibleRate ? e.responsibleRate != -1 : e.responsibleRate == 0 ? true : false;
		return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1')) && temp;
	}

	$scope.addRespondent = function(applicant) {
		applicant.responsibleRate = 0;
		applicant.isVehicle = applicant.plateNo ? "1" : "0";
		applicant.riskTypes = {
			"0": false,
			"1": false,
			"2": false
		};
	};

	$scope.deleteRespondent = function(respondent) {
		respondent.responsibleRate = -1;
	}

	$scope.riskTypeChanged = function(respondent, riskType) {
		if (riskType == "0") {
			if (!respondent.riskTypes['0'])
				respondent.riskTypes['1'] = respondent.riskTypes['2'] = false;
		} else if (riskType == "1") {
			if (!respondent.riskTypes['1'])
				respondent.riskTypes['2'] = false;
			else
				respondent.riskTypes['0'] = true;
		} else {
			if (respondent.riskTypes['2']) {
				respondent.riskTypes['0'] = respondent.riskTypes['1'] = true;
				respondent.thirdPartyFranchise = 0;
				respondent.thirdPartyRate = 100;
			}
		}
	}

	$scope.compensateRateChanged = function(adjust) {
		if (adjust.compensateRate > 100) adjust.compensateRate = 100;
		if (adjust.compensateRate < 0) adjust.compensateRate = 0;
	}

	$scope.responsibleRateChanged = function(respondent) {
		if (respondent.responsibleRate > 100) respondent.responsibleRate = 100;
		if (respondent.responsibleRate < 0) respondent.responsibleRate = 0;
	}

	$scope.thirdPartyFranchiseChanged = function(respondent) {
		if (respondent.thirdPartyFranchise > 100) respondent.thirdPartyFranchise = 100;
		if (respondent.thirdPartyFranchise < 0) respondent.thirdPartyFranchise = 0;
		if (respondent.thirdPartyFranchise <= 100 && respondent.thirdPartyFranchise >= 0)
			respondent.thirdPartyRate = 100 - respondent.thirdPartyFranchise;
    $scope.calculate();
	}

	$scope.thirdPartyRateChanged = function(respondent) {
		if (respondent.thirdPartyRate > 100) respondent.thirdPartyRate = 100;
		if (respondent.thirdPartyRate < 0) respondent.thirdPartyRate = 0;
		if (respondent.thirdPartyRate <= 100 && respondent.thirdPartyRate >= 0)
			respondent.thirdPartyFranchise = 100 - respondent.thirdPartyRate;
	}

	$scope.feeCheckChanged = function(fee, id) {
		if (fee.isChecked) {
			if (!($scope.adjust.regionName && $scope.adjust.standardYear)) {
				$rootScope.toaster("warn", "错误", "请输入赔偿地和赔偿年度!");
				fee.isChecked = false
				return;
			}
		}
		if (["12", "13", "14", "15", "16"].indexOf(id) != -1 && fee.isChecked) {
      if (!$scope.adjust.deathDate) {
        $rootScope.toaster("error", "错误", "定残/死亡日期有误!");
        fee.isChecked = false
        return;
      }
			if (id == "12" || id == "13")
				$scope.adjust.feeDetail.forEach(function(v) {
					if (v.id == "15" || v.id == "16") v.isChecked = false;
				});
			else if (id == "15" || id == "16") {
				$scope.adjust.feeDetail.forEach(function(v) {
					if (v.id == "12" || v.id == "13") v.isChecked = false;
				});
				$scope.adjust.compensateRate = 100;
			}
		}
		$scope.refreshTotal();
	}

	$scope.refreshTotal = function() {
		$scope.adjust.applyTotal = 0;
    $scope.adjust.replyTotal = 0;
		$scope.adjust.lawMoney = 0;
		var checkedList = $scope.adjust.feeDetail.filter(function(v) {
			return v.isChecked;
		});
		checkedList.forEach(function(v) {
			//残疾赔偿金或者死亡赔偿金
			if(v.id == "12" || v.id == "15"){
				//用户类型：0:原告 1：被告 2：法官
				if($scope.userType == "1"){
					if(v.replyPerUnit && v.replyUnit && $scope.adjust.compensateRate){
						v.replyAmount = v.replyPerUnit * v.replyUnit * $scope.adjust.compensateRate / 100;
						v.replyAmount = parseFloat(v.replyAmount).toFixed(2);
					}
				}
				if($scope.userType == "2"){
					if(v.claimPerUnit && v.claimUnit && $scope.adjust.compensateRate){
						v.claimAmount = v.claimPerUnit * v.claimUnit * $scope.adjust.compensateRate / 100;
						v.claimAmount = parseFloat(v.claimAmount).toFixed(2);
					}
				}
			}
			if (v.applyAmount && parseFloat(v.applyAmount))
				$scope.adjust.applyTotal += parseFloat(v.applyAmount)
			if (v.replyAmount && parseFloat(v.replyAmount))
				$scope.adjust.replyTotal += parseFloat(v.replyAmount)
      if (v.claimAmount && parseFloat(v.claimAmount))
        $scope.adjust.lawMoney += parseFloat(v.claimAmount)
		})

		if($scope.adjust.applyTotal) $scope.adjust.applyTotal = $scope.adjust.applyTotal.toFixed(2);
    if($scope.adjust.replyTotal) $scope.adjust.replyTotal = $scope.adjust.replyTotal.toFixed(2);
		if($scope.adjust.extraTotalLawMoney){
			$scope.adjust.lawMoney = parseFloat($scope.adjust.lawMoney) + parseFloat($scope.adjust.extraTotalLawMoney);
		}
		if($scope.adjust.lawMoney) $scope.adjust.lawMoney = $scope.adjust.lawMoney.toFixed(2);
		$scope.adjust.willPayTotal = $scope.adjust.lawMoney - $scope.adjust.paidTotal;

	};

	$scope.computeChange = function(fee, isForward) {
		if (isForward) {
			if (fee.applyPerUnit && fee.applyUnit) {
				fee.applyAmount = fee.applyUnit * fee.applyPerUnit;
				if (fee.template == "3")
					fee.applyAmount *= ($scope.adjust.compensateRate / 100);
				$scope.calculate();
			}
			if (fee.replyPerUnit && fee.replyUnit) {
				fee.replyAmount = fee.replyUnit * fee.replyPerUnit;
				if (fee.template == "3")
					fee.replyAmount *= ($scope.adjust.compensateRate / 100);
        $scope.calculate();
			}
      if (fee.claimPerUnit && fee.claimUnit) {
        fee.claimAmount = fee.claimUnit * fee.claimPerUnit;
        if (fee.template == "3")
          fee.claimAmount *= ($scope.adjust.compensateRate / 100);
        $scope.calculate();
      }
		} else {
			if (fee.applyPerUnit && fee.applyAmount) {
				fee.applyPerUnit = (fee.applyAmount / fee.applyUnit).toFixed(2);
        $scope.calculate();
			}
			if (fee.replyPerUnit && fee.replyAmount) {
				fee.replyPerUnit = (fee.replyAmount / fee.replyUnit).toFixed(2);
        $scope.calculate();
			}
      if (fee.claimPerUnit && fee.claimAmount) {
        fee.claimPerUnit = (fee.claimAmount / fee.claimUnit).toFixed(2);
        $scope.calculate();
      }
		}

		function showOrHideWarning(id, warningText, feeAmount) {
			if (fee.id == id && fee.isChecked && feeAmount) {
				if(id == '17'){
					if (fee.claimAmount && fee.claimAmount > feeAmount) {
						fee.isClaimWarningFlag = true;
						fee.warningText = warningText + feeAmount + "元";
					} else {
						fee.isClaimWarningFlag = undefined;
						fee.warningText = undefined;
					}
				}else{
					if (fee.claimPerUnit > feeAmount) {
						fee.isClaimWarningFlag = true;
						fee.warningText = warningText + feeAmount + "元";
					} else {
						fee.isClaimWarningFlag = undefined;
						fee.warningText = undefined;
					}
				}
			} else if (fee.id == id && !fee.isChecked) {
				fee.isClaimWarning = undefined;
				fee.warningText = undefined;
			}
		}

		showOrHideWarning("06", "住院伙食补助费超过标准", $scope.adjust.compensateStandard.hospitalFoodSubsidies);
		showOrHideWarning("07", "营养费超过标准", $scope.adjust.compensateStandard.thesePayments);
		showOrHideWarning("11", "住宿费超过标准", $scope.adjust.compensateStandard.accommodationFee);
		showOrHideWarning("12", "残疾赔偿金超过标准", $scope.adjust.compensateStandard[$scope.adjust.household].income);
		showOrHideWarning("15", "死亡赔偿金超过标准", $scope.adjust.compensateStandard[$scope.adjust.household].income);
		showOrHideWarning("16", "丧葬费超过标准", $scope.adjust.compensateStandard.wageIncome/12);
		showOrHideWarning("17", "精神抚慰金超过标准",$scope.adjust.compensateStandard.spiritualConsolationFee);
	};

	//切换停车费、鉴定费、其它费用
	$scope.selectBxShow = function(fee){
		fee.selectShow = !fee.selectShow;
		$scope.calculate();
	};
  //计算两个日期的年限差
  function getDateYearSub(startDate, endDate) {
    var day = 24 * 60 * 60 *1000;
    //得到前一天(算头不算尾)
    var sDate = new Date(startDate.getTime() - day);
    var eDate = typeof(endDate)==Date?endDate:new Date(Date.parse(endDate.replace(/-/g, "/")));
    
    //获得各自的年、月、日
    var sY  = sDate.getFullYear();
    var eY  = eDate.getFullYear();
    var betweenYear = sY - eY;
    if(betweenYear > 0) {
      return betweenYear
    } else {
      return 0;
    }
  }
  
  $scope.calculate = function() {
    if (!$scope.adjust.compensateTable) $scope.adjust.compensateTable = [];
    if ($scope.adjust.compensateTable.length)
      $scope.adjust.compensateTable.splice(0, $scope.adjust.compensateTable.length);
    var medicalLimits = 0;
    var deathLimits = 0;
    var propertyLimits = 0;
    // 一、计算侵权方交强险总保额
    var respondents = $scope.adjust.applicantArray.filter(function(e) {
      return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1')) && e.riskTypes;
    });
    if (!respondents.length) {
      $rootScope.toaster("error", "错误", "请选择责任人!");
      return;
    }
    if(!$scope.adjust.feeDetail){
      $rootScope.toaster("error", "错误", "请填写具体损失金额!");
      return;
    }
    respondents.forEach(function(v) {
      if (v.isVehicle == "1") {
        if(!v.plateNo){
          $rootScope.toaster("error", "错误", "请填写责任人车牌号!");
          $("#plateNo").focus();
          return;
        }
        if(!v.insuranceForceCompany){
          $rootScope.toaster("error", "错误", "请选择责任人交强险投保保险公司!");
          return;
        }
        if((v.riskTypes['1'] || v.riskTypes['2']) && !v.insuranceBusinessCompany){
          $rootScope.toaster("error", "错误", "请选择责任人商业险投保保险公司!");
          return;
        }
        v.responsibleRate = v.responsibleRate ? parseInt(v.responsibleRate) : 0;
        v.thirdParty = v.thirdParty ? parseInt(v.thirdParty) : 0;
        v.thirdPartyRate = v.thirdPartyRate ? parseInt(v.thirdPartyRate) : 0;
        if (v.responsibleRate == 0) {
          v.medical = 1000;
          v.death = 11000;
          v.property = 100;
        } else {
          v.medical = 10000;
          v.death = 110000;
          v.property = 2000;
        }
        medicalLimits += v.medical;
        deathLimits += v.death;
        propertyLimits += v.property;
      }
    });
		//将调解金额保留两位小数
    $scope.adjust.feeDetail.forEach(function(v) {
      if (v.isChecked) {
        if (v.replyAmount){
					v.replyAmount = parseFloat(v.replyAmount);
				}else{
					v.replyAmount = 0;
				}
        if (v.id == "03" && v.replyNonMed){
					v.replyNonMed = parseFloat(v.replyNonMed);
				}else{
					v.replyNonMed = 0;
				}
        if (v.cliamAmount){
					v.cliamAmount = parseFloat(v.cliamAmount);
				}else{
					v.cliamAmount = 0;
				}
      }
    });

		//计算器总金额
		var amount = 0.00;
		//计算器医疗费总金额
		var medicalAmount = 0.00;
		//计算器财产损失总金额
		var propertyAmount = 0.00;
		//计算器死亡伤残总金额
		var deathAmount = 0.00;
		//保险公司全部承担的费用(停车费、鉴定费、其它费用)
		var bxSumAmount = 0.00;
		//非保险公司承担的费用(停车费、鉴定费、其它费用)
		var noBxSumAmount = 0.00;
		//计算器精神损害抚慰金金额
		var spiritAmount = 0.00;
		//欠账的精神抚慰金总和
		var leftSpiritAmount = 0.00;

    // 二、计算被侵权方损失金额，按交强险三大类分医疗、死亡伤残、财产。其中余杭法院需要单独计算医疗费中非医保费用
    $scope.adjust.feeDetail.forEach(function(v) {
      if (v.isChecked) {
				//1、累加总损失 claimAmount 调解总金额，claimNonMed：非医保金额
				if (v.claimAmount) amount += parseFloat(v.claimAmount);
				//2、累加医疗损失   医疗费、后续治疗费、住院伙食补助费、营养费
				if (["03", "04", "06", "07"].indexOf(v.id) != -1) {
					//医保金额
					if (v.claimAmount) medicalAmount += parseFloat(v.claimAmount);
				} else if (["30", "40", "50", "70"].indexOf(v.id) != -1) {
					//3、累加财产损失  财产损失、车辆损失、拖车费、施救费
					if (v.claimAmount) propertyAmount += parseFloat(v.claimAmount);
				} else if (v.id == "18" || v.id == '60' || v.id == '71') {
					// （鉴定费用、停车费、其它费用）表示保险公司全赔总金额
					if (v.claimAmount) {
						if (v.selectShow) {
							bxSumAmount += parseFloat(v.claimAmount);
						} else {//个人全赔总金额
							noBxSumAmount += parseFloat(v.claimAmount);
						}
					}
				} else if (v.id == '17') {
					//精神抚慰金
					if (v.claimAmount) spiritAmount += parseFloat(v.claimAmount);
				} else {
					if (v.claimAmount) deathAmount += parseFloat(v.claimAmount);
				}
			}
    });

		//保险外金额计算(按申请人计算总和)
		var extraMoneyList = [];
		$scope.adjust.extraTotalLawMoney = 0.00;
		$scope.adjust.feeDetail.forEach(function (val){
			if(val.respondentList){
				val.respondentList.forEach(function(k){
					if(k.extraMoney && k.extraMoney > 0){
						$scope.adjust.extraTotalLawMoney = parseFloat($scope.adjust.extraTotalLawMoney) + parseFloat(k.extraMoney);
						var obj = _.find(extraMoneyList,{personName: k.personName});
						if(obj){
							obj.extraMoney = parseFloat(obj.extraMoney) + parseFloat(k.extraMoney);
						}else{
							extraMoneyList.push({
								id: k.id,
								extraMoney: parseFloat(k.extraMoney).toFixed(2),
								personName: k.idType=='0'?k.personName:k.orgName,
								personType: k.personType
							});
						}
					}
				});
			}
		});
		//计算器计算规则
		//一、计算交强险
		//交强险赔付总金额
		var compulsoryInsuranceSum = 0.0;
		respondents.forEach(function(v) {
			if ("1" == v.isVehicle) {
				//1、先计算交强险赔付金额，从交强险中优先赔付精神损害抚慰金，如果超出保险公司的死亡伤残上线，商业险不予赔付，由双方按责任比例承担
				//每个人赔付死亡赔偿金的总金额
				v.personPayDeathSum = 0.0;
				v.personPaySpiritSum = 0.0;
				//初始化富于的伤残死亡金
				v.surplusPersonDeathSum = 0.0;
				//首先个人赔付精神抚慰金的金额
				var personPaySpiritAmount = spiritAmount * v.death / deathLimits;
				//个人赔偿精神抚慰金金额大于或者等于死亡伤残上线，按死亡线上赔付
				if(personPaySpiritAmount >= v.death){
					v.personPaySpiritSum += v.death;
					//所有人欠的精神抚慰金总和
					leftSpiritAmount += (personPaySpiritAmount - v.death);
				}else{
					//如果小于死亡赔偿日期，按计算的精神抚慰金金额赔付
					v.personPaySpiritSum += personPaySpiritAmount;
					//富于的个人死亡伤残金
					v.surplusPersonDeathSum = v.death - personPaySpiritAmount;
				}
				//2、如果仍然有剩余的个人死亡伤残金额，则继续赔付死亡伤残其它项目
				if(v.surplusPersonDeathSum && v.surplusPersonDeathSum > 0){
					//如果计算死亡伤残金额大于富于的死亡伤残金额，按剩下的来
					if(deathAmount * v.death / deathLimits >= v.surplusPersonDeathSum){
						v.personPayDeathSum += v.surplusPersonDeathSum;
					}else{
						v.personPayDeathSum += deathAmount * v.death / deathLimits;
					}
				}
				//3、赔付医疗费
				var personPayMedicalAmount = medicalAmount * v.medical / medicalLimits;
				//个人赔付医疗费大于个人赔付上线
				if(personPayMedicalAmount > v.medical){
					//个人付款医疗费金额
					v.personPayMedicalSum = v.medical;
					//个人欠医疗费金额
					v.leftPersonMedicalSum = personPayMedicalAmount - v.medical;
				}else{
					v.personPayMedicalSum = personPayMedicalAmount;
				}
				//4、赔付财产损失
				var personPayPropertyAmount = propertyAmount * v.property / propertyLimits;
				//个人赔付财产损失大于个人赔付上线
				if(personPayPropertyAmount > v.property){
					//个人付款财产损失费金额
					v.personPayPropertySum = v.property;
					//个人欠财产损失费金额
					v.leftPersonPropertySum = personPayPropertyAmount - v.property;
				}else{
					v.personPayPropertySum = personPayPropertyAmount;
				}
				//5、保存数据 1.交强 2.商业 3.自付
				$scope.adjust.compensateTable.push({
					payType: "1",
					calcFormula: "",
					calcIndemnitySum: (v.personPayDeathSum + v.personPayMedicalSum + v.personPayPropertySum + v.personPaySpiritSum) .toFixed(2),
					companyName: v.insuranceForceCompany,
					plateNo: v.plateNo,
					idType: v.idType
				});
				//累加被告支付交强险计算总金额
				compulsoryInsuranceSum +=  v.personPayDeathSum + v.personPayMedicalSum +v.personPayPropertySum;
			}else{
				leftSpiritAmount = spiritAmount;
			}
		});

		//二、计算商业险
		//医疗费+死亡伤残+财产损失 - 总共支付交强险的费用= 剩余的资金由商业险按责任比例承担
		var leftPartSum = parseFloat(medicalAmount) + parseFloat(propertyAmount) + parseFloat(deathAmount) - parseFloat(compulsoryInsuranceSum);
		//保险公司支付商业险和被告支付的总金额
		var commercialInsuranceAndDefendantSum = 0.00;
		//剩余的交强险金额 +  剩余的精神抚慰金 + 保险公司全部承担的费用(停车费、鉴定费、其它费用)
		var noPaySum = leftPartSum  + leftSpiritAmount + bxSumAmount + noBxSumAmount;
		if(noPaySum > 0){
			//循环侵权人，计算每个侵权人商业险应该赔付的费用
			respondents.forEach(function(v) {
				//个人商业险赔付金额
				v.personBusinessIndemnitySum = 0.00;
				//剩余的保险公司赔付不了的金额 默认时所有
				v.leftCarAndAppraiseAndOtherSum = bxSumAmount;
				//表示为机动车并且有商业险
				if ("1" == v.isVehicle && v.riskTypes['1']) {
					//如果交强险赔付完仍需要交强险进行赔付 或者保险公司有赔付（停车、鉴定、其它费用）
					if(leftPartSum > 0 || bxSumAmount > 0){
						if(leftPartSum > 0){
							//如果被告的三者险金额 > 除交强险以外剩余应该赔付的金额 *  责任比例 *  三者险赔偿比例，则取后面的值
							if (v.thirdParty > leftPartSum * v.responsibleRate / 100 * v.thirdPartyRate / 100) {
								v.personBusinessIndemnitySum = leftPartSum * v.responsibleRate / 100 * v.thirdPartyRate / 100;
							} else {
								//直接取三者险的金额
								v.personBusinessIndemnitySum = v.thirdParty;
							}
						}
						//保险公司应该赔付停车费、鉴定费以及其它费用的金额
						v.carAndAppraiseAndOtherSum = 0;
						//保险公司全部赔付
						if(bxSumAmount > 0){
							//剩余三者险金额
							var leftPersonBusinessIndemnitySum = v.thirdParty - v.personBusinessIndemnitySum;
							//如果剩余三者险金额大于0，并且保险公司有全部承担停车费 + 鉴定费 + 其它费用 > 0,由保险公司全部承担其费用
							if(leftPersonBusinessIndemnitySum > 0 && bxSumAmount > 0){
								//再进行判断，当保险公司承担的费用小于剩余的商业险的费用时，则取保险公司承担总费用
								if( bxSumAmount < leftPersonBusinessIndemnitySum ){
									v.carAndAppraiseAndOtherSum = bxSumAmount;
									v.leftCarAndAppraiseAndOtherSum = 0.00;
								}else{
									//反之则取剩余的商业险的费用
									v.carAndAppraiseAndOtherSum = leftPersonBusinessIndemnitySum;
									v.leftCarAndAppraiseAndOtherSum = bxSumAmount - leftPersonBusinessIndemnitySum;
								}
							}
						}

						//保存商业险赔付金额 赔偿方式 1.交强 2.商业 3.自付
						$scope.adjust.compensateTable.push({
							payType: "2",
							calcFormula: "",
							calcIndemnitySum: (v.personBusinessIndemnitySum + parseFloat(v.carAndAppraiseAndOtherSum)).toFixed(2),
							companyName: v.insuranceBusinessCompany,
							plateNo: v.plateNo,
							idType: v.idType
						});
						//保险公司支付商业险总金额
						commercialInsuranceAndDefendantSum += v.personBusinessIndemnitySum + v.carAndAppraiseAndOtherSum;
					}
				}
				//责任比例内保险未赔完，由被告自行承担(个人按责任比例赔付、剩余的精神费用，剩余的保险公司赔付的金额)
				v.personPayAmount = (leftPartSum  + noBxSumAmount + leftSpiritAmount + v.leftCarAndAppraiseAndOtherSum)  * v.responsibleRate / 100 - v.personBusinessIndemnitySum;
				//保存被告自负担金额
				//被申请人自负保险范围外金额
				var claimantExtraMoneyObject = _.find(extraMoneyList,{personName: v.personName});
				var claimantExtraMoney = 0;
				if(claimantExtraMoneyObject){
					claimantExtraMoney = parseFloat(claimantExtraMoneyObject.extraMoney);
				}
				if ((v.personPayAmount + claimantExtraMoney) > 0) {
					$scope.adjust.compensateTable.push({
						payType: "3",
						calcFormula: "",
						calcIndemnitySum: (v.personPayAmount + claimantExtraMoney).toFixed(2),
						personName: v.idType=='0'?v.personName:v.orgName,
						personType: v.personType,
						idType: v.idType
					});
					//被告支付的总金额
					commercialInsuranceAndDefendantSum += v.personPayAmount;
				}
			});
		}else{//保险外金额被告赔付
			respondents.forEach(function(v) {
				//被申请人自负保险范围外金额
				var claimantExtraMoneyObject = _.find(extraMoneyList,{personName: v.personName});
				var claimantExtraMoney = 0;
				if(claimantExtraMoneyObject){
					claimantExtraMoney = claimantExtraMoneyObject.extraMoney;
				}
				if (claimantExtraMoney > 0) {
					$scope.adjust.compensateTable.push({
						payType: "3",
						calcFormula: "",
						calcIndemnitySum: parseFloat(claimantExtraMoney).toFixed(2),
						personName: v.idType=='0'?v.personName:v.orgName,
						personType: v.personType,
						idType: v.idType
					});
				}
			});
		}


		//循环保险外支付的金额
		var applicantExtraSumMoney = 0;//取得申请人金额总和
		//调解时计算，诉讼时不计算
		if(extraMoneyList != null){
			extraMoneyList.forEach(function(val){
				if(val.personType == '0'){
					applicantExtraSumMoney += parseFloat(val.extraMoney);
				}
			});
		}

		//原告自行承担金额
		var plaintiffPayMoney = leftPartSum  + leftSpiritAmount + noBxSumAmount + bxSumAmount - commercialInsuranceAndDefendantSum + applicantExtraSumMoney;
		if (plaintiffPayMoney > 0) {
			var applicants = $scope.selectApplicantInArray();
			//被侵权方信息
			$scope.adjust.compensateTable.push({
				payType: "3",
				calcFormula: "自已承担：" + plaintiffPayMoney,
				calcIndemnitySum: plaintiffPayMoney.toFixed(2),
				personName: applicants,
				personType: 0
			});
		}


    $scope.refreshTotal();
  };
  
  $scope.selectApplicantInArray = function(){
    var applicants="";
    $scope.adjust.applicantArray.filter(function(v){
      return v.personType=='0'
    }).forEach(function(v){
      if(v.idType==0){
        if(!applicants){
          applicants += v.personName
        }else{
          applicants += ","+v.personName
        }
      }else{
        if(!applicants){
          applicants += v.orgName
        }else{
          applicants += ","+v.orgName
        }
      }
    })
    return applicants;
  }
  
  //计算总合计
  $scope.calcTotal = function(compensateTable, type){
    var total = 0.00;
    if(compensateTable){
      compensateTable.filter(function(v){
        return v.payType==type;
      }).forEach(function(v){
        total += parseFloat(v.calcIndemnitySum);
      })
    }
    return total.toFixed(2)
  }
  
	$scope.paidTotalChange = function() {
		$scope.adjust.willPayTotal = $scope.adjust.lawMoney - $scope.adjust.paidTotal;
	}

	$scope.addDependent = function(val) {
		var dependents = _.find($scope.adjust.feeDetail, {
			id: "14"
		}).dependents
    if (val == 'claim') {
      if (dependents.claim.length == 0 && dependents.apply.length != 0) {
        dependents.claim = angular.copy(dependents.apply);
      }
    }
		var modalInstance = $modal.open({
			templateUrl: 'views/pages/mediation_platform/litigation_mediation/adjust_information_popup.html',
			controller: 'AdjustInformationPopupCtrl',
			size: 'lg',
			resolve: {
				items: function() {
					var depent = _.find($scope.adjust.feeDetail, {
						id: "14"
					}).dependents;
					return {
						dependents: depent[val],
						deathDate: $scope.adjust.deathDate,
						compensateRate: $scope.adjust.compensateRate,
						household: $scope.adjust.household,
						refData: $scope.adjust.compensateStandard
					}
				}
			}
		});
		//返回值
		modalInstance.result.then(function(data) {
			var target = _.find($scope.adjust.feeDetail, {
				id: "14" // fuyangren
			});
			if (val == 'apply') {
				target.applyAmount = data;
				if (!target.claimAmount)
					target.claimAmount = data;
			}else if(val == 'reply'){
        target.replyAmount = data;
      } else {
				target.claimAmount = data;
			}
			$scope.refreshTotal();
		}, null);
	};

	//保险外金额
	$scope.handleExtraAmount = function(fee){
		var handleExtraAmountModel = $modal.open({
			templateUrl: 'views/pages/mediation_platform/litigation_mediation/extraAmount.html',
			controller: 'ExtraAmountCtrl',
			backdrop:'static',
			size: 'md',
			resolve: {
				items: function() {
					return {
						fee: fee,
						adjust: $scope.adjust
					}
				}
			}
		});

		handleExtraAmountModel.result.then(function(){
			$scope.refreshTotal();
			$scope.calculate();
		})
	};

	//添加护理费、误工费、处理人误工费
	$scope.addNursingFee = function(val,fee){
		var addNursingFeeModel =  $modal.open({
			templateUrl: 'views/pages/mediation_platform/litigation_mediation/nursingFee_popup.html',
			controller: 'NursingFeePopupCtrl',
			backdrop:'static',
			size: 'lg',
			resolve: {
				items: function() {
					return {
						fee: fee,
						val:val,
						adjust: $scope.adjust
					}
				}
			}
		});

		addNursingFeeModel.result.then(function(){
			if(fee.claimAmount > 0){
				$scope.refreshTotal();
				$scope.calculate();
			}
		})
	};

	//选择依据
	$scope.openCriteria = function (lg, fee, hide) {
		var modalInstance = $modal.open({
			templateUrl: 'views/pages/lawsuit/criteria.html',
			controller: 'ModalLawItemsCtrl',
			size: lg,
			resolve: {
				items: function () {
					return {
						selectedItemArray:fee.selectedItemArray==undefined?angular.copy(DictionaryConfig.lawItemArray.filter(function(v){return v.feeType == fee.id})):fee.selectedItemArray,
						isShow:hide
					}

				}
			}
		});
		modalInstance.result.then(function (selectedItem) {
			fee.selectedItemArray = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	//处理已付金额
	$scope.queryPayMoney = function(){

		var payMoney = $modal.open({
			templateUrl: 'views/pages/mediation_platform/litigation_mediation/payMoney.html',
			controller: 'PayMoneyCtrl',
			size: 'md',
			resolve: {
				items: function() {
					return {
						adjust: $scope.adjust
					}
				}
			}
		});
	};

		//鉴定伤残等级
		$scope.showRankAppraisal = function () {
      //判断当前所属的状态（调解、起诉）
      if($location.url().split('/').indexOf('mediation') !== -1) {
        //调解
        $scope.isMediation = 0;
      } else {
        //起诉、庭前调解时
        $scope.isMediation = 1;
      }
			if($scope.adjust || $scope.law) {
				var id = $scope.adjust? $scope.adjust.id: $scope.law.id;
				var serialNo = $scope.adjust? $scope.adjust.serialNo: $scope.law.serialNo;
				//打开等级鉴定页面，并将单子id与流水号通过url传入
				var url = $state.href('rankAppraisal');
				window.open(url+'?id='+id+'&serialNo='+serialNo+'&isDisabled='+true+'&flag='+$scope.isMediation, '_blank');
			} else {
				//赔偿试算，不存在案件流水号
				var url = $state.href('rankAppraisal');
				window.open(url, '_blank');
			}
		};

});

//原生js调用angular中的scope参数  （伤残等级鉴定页面调用）
function saveRankAppraisal(count){
    //通过元素id来获取Angular应用
    var appElement = document.getElementById('MediationPlanCtrl');
    //获取$scope变量
    var $scope = angular.element(appElement).scope();
    //调用$scope中的方法与赋值
    $scope.adjust.compensateRate = count;
    $scope.compensateRateChanged($scope.adjust);
    //上一行改变了msg的值，如果想同步到Angular控制器中，则需要调用$apply()方法即可
    $scope.$apply();
}



app.controller('AdjustInformationPopupCtrl', function($scope, DictionaryConfig, $state, $modal, items, $modalInstance) {
	$scope.dependents = items.dependents;
	$scope.deathDate = items.deathDate;
	$scope.household = items.household;
	$scope.compensateStandard = items.refData;
	$scope.compensateRate = items.compensateRate;

	$scope.openBirthDate = function($event, dependent) {
		$event.preventDefault();
		$event.stopPropagation();
		dependent.birthDateOpened = true;
	};
	$scope.accountTypeList = DictionaryConfig.accountTypeList;

	$scope.add = function() {
		var dependent = {
			id: new Date().getTime(),
			birthDateOpened: false,
			household: "1"
		}
		$scope.dependents.push(dependent);
	}

	$scope.deleteDependent = function(index) {
		$scope.dependents.splice(index, 1);
	};

	$scope.computeFyAge = function(dependent) {
		dependent.age = Math.floor(($scope.deathDate.getTime() - dependent.birthDate.getTime()) / (24 * 365 * 3600000));
		if (dependent.age <= 18)
			dependent.fyAge = 18 - dependent.age;
		else if (dependent.age > 18 && dependent.age <= 60)
			dependent.fyAge = 20;
		else if (dependent.age > 60 && dependent.age < 75)
			dependent.fyAge = 80 - dependent.age;
		else if (dependent.age >= 75)
			dependent.fyAge = 5;
	}

	//点击确认
	$scope.ok = function() {
		var dependentStandard = $scope.compensateStandard[$scope.household].expense;
		$scope.dependents.forEach(function(v) {
			v.expense = $scope.compensateStandard[v.household].expense
		});
		$scope.dependents.sort(function(a, b) {
			return a.fyAge - b.fyAge;
		});

		var countFee = 0;
		$scope.dependents.forEach(function(v, i, arr) {
			var tmpFee = 0;
			var preYear = 0;
			var year = v.fyAge;
			for (var j = i; j < arr.length; j++) {
				tmpFee += (arr[j].expense * $scope.compensateRate / 100 / arr[j].count);
			}
			if (i != 0) {
				preYear = arr[i - 1].fyAge;
			}
			if (tmpFee > dependentStandard)
				tmpFee = dependentStandard;
			countFee += (tmpFee * (year - preYear));
		});

		$modalInstance.close(countFee.toFixed(2));
	};
	//点击取消
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
})