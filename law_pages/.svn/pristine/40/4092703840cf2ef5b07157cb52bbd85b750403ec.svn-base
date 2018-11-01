angular.module('sbAdminApp').controller('AIOCourtSetp3Ctrl', function ($location, $scope, $stateParams, $state, $http, $log, DictionaryConfig, $rootScope, $filter, PrejudgeService, PrejudgeConfig) {
	//数据接口服务
  $scope.prejudgeService = PrejudgeService;
  $scope.step.stepId = 3; 
  console.log($scope.lawCase,"&&&&&&&&&&&&&&");
  $scope.incomeEvidenceArray = [{id: 1, value:'按行业'}, {id:2, value: '按本地标准'}];
  $scope.nursingTypeArray = [{id: 1, value:'短期医嘱护理'}, {id:2, value:'长期康复护理'}, {id:3, value:'短期医嘱护理加长期康复护理'}]
  $scope.dependentRateArray = [{id: 100, value:'100 %（完全护理依赖）'}, {id: 80, value:'80%（大部分护理依赖）'},{id: 50, value:'50%（部分护理依赖）'}]
  $scope.minDate = new Date();
  
    //提示框
    $scope.isIndex = null
    $scope.dynamicPopoverFn = function ($event,index) {
      $scope.stopprevent($event)
      index == 'leave'? $scope.isIndex = 'leave': $scope.isIndex = index
    }
    //点击关闭提示
    $scope.allClose = function ($event) {
      $scope.stopprevent($event)
      $scope.isIndex = null
      }
  /**
   * 初始化费用标准(根据地区收入支出以及其他配置标准)
   */
  $scope.initStandardFee = function(fee){
    $scope.lawCase.feeDetail.forEach(function(v) {
      if ($scope.lawCase.caseType == '0') {//普通受伤(无伤残)
				if ($scope.lawCase.treatmentType != '1') {//除了门诊治疗, 均有营养费
					if (v.id == '07') {//营养费
						v.applyPerUnit = $scope.lawCase.compensateStandard.thesePayments || '0';
						v.applyUnit = $scope.lawCase.hospitalDays
						v.applyAmount = (parseFloat(v.applyPerUnit) * parseFloat(v.applyUnit)).toFixed(2)
					}
				}
				
				if (v.id == '06') {//住院伙食补助费
					v.applyPerUnit = $scope.lawCase.compensateStandard.hospitalFoodSubsidies || '0';
					v.applyUnit = $scope.lawCase.hospitalDays
					v.applyAmount = (parseFloat(v.applyPerUnit) * parseFloat(v.applyUnit)).toFixed(2)
				} else if (v.id == '08') {//误工费
					v.isFixedIncome = v.isFixedIncome || false
					v.incomeEvidence = v.incomeEvidence || 2
					v.applyPerUnit = v.applyPerUnit || $scope.lawCase.compensateStandard.lostIncome;
					v.applyUnit = parseInt($scope.lawCase.compensateDays || 0) + parseInt($scope.lawCase.applicantArray[0].outPatientTimes||0)
					v.applyAmount = (parseFloat(v.applyPerUnit||0) * parseFloat(v.applyUnit)).toFixed(2)
				}
			} else if ($scope.lawCase.caseType == '1') {//伤残
				if (v.id == '06') {//住院伙食补助费
					v.applyPerUnit = $scope.lawCase.compensateStandard.hospitalFoodSubsidies || '0';
					v.applyUnit = $scope.lawCase.hospitalDays
					v.applyAmount = (parseFloat(v.applyPerUnit) * parseFloat(v.applyUnit)).toFixed(2)
				} else if (v.id == '07') {//营养费
					v.applyPerUnit = $scope.lawCase.compensateStandard.thesePayments || '0';
					v.applyUnit = $scope.lawCase.hospitalDays
					v.applyAmount = (parseFloat(v.applyPerUnit) * parseFloat(v.applyUnit)).toFixed(2)
				} else if (v.id == '08') {//误工费
					v.isFixedIncome = v.isFixedIncome || false
					v.incomeEvidence = v.incomeEvidence || 2
					v.applyPerUnit = v.applyPerUnit || $scope.lawCase.compensateStandard.lostIncome;
					v.applyUnit = parseInt($scope.lawCase.compensateDays || 0) + parseInt($scope.lawCase.applicantArray[0].outPatientTimes || 0)
					v.applyAmount = (parseFloat(v.applyPerUnit || 0) * parseFloat(v.applyUnit)).toFixed(2)
				} else if (v.id == '12') {//残疾赔偿金
					v.applyPerUnit = $scope.lawCase.compensateStandard ? $scope.lawCase.compensateStandard[$scope.lawCase.household].income : 0;
					v.applyUnit = calculateYearOfDisabled();
					v.applyAmount = (parseFloat(v.applyPerUnit) * parseFloat(v.applyUnit) * (parseFloat($scope.lawCase.compensateRate) / 100)).toFixed(2);
				} else if (v.id == '17'){//精神损害抚慰金
					v.applyPerUnit = $scope.lawCase.compensateStandard ? $scope.lawCase.compensateStandard.spiritualConsolationFee : 0;
					v.applyAmount = (parseFloat(v.applyPerUnit) * 10 * (parseFloat($scope.lawCase.compensateRate) / 100)).toFixed(2);
				}else if (v.id == '14'){//被扶养人生活费
					v.dependents.apply.forEach(function(m){
            m.household = $scope.lawCase.household
          })
				}
      } else if ($scope.lawCase.caseType == '2') {//死亡
        if (v.id == '14'){//被扶养人生活费
					v.dependents.apply.forEach(function(m){
            m.household = $scope.lawCase.household
          })
				}
				if ($scope.lawCase.isDeadAtTheScene) {//当场死亡
					if (v.id == '08') {//误工费
						v.isFixedIncome = v.isFixedIncome || false
						v.incomeEvidence = v.incomeEvidence || 2
						v.applyPerUnit = v.applyPerUnit || $scope.lawCase.compensateStandard.lostIncome;
						v.applyUnit = parseInt($scope.lawCase.compensateDays || 0) + parseInt($scope.lawCase.applicantArray[0].outPatientTimes || 0)
						v.applyAmount = (parseFloat(v.applyPerUnit||0) * parseFloat(v.applyUnit)).toFixed(2)
					} else if (v.id == '15') {//死亡赔偿金
						v.applyPerUnit = $scope.lawCase.compensateStandard ? $scope.lawCase.compensateStandard[$scope.lawCase.household].income : 0;
						v.applyUnit = calculateYearOfDisabled();
						v.applyAmount = (parseFloat(v.applyPerUnit) * parseFloat(v.applyUnit) * (parseFloat($scope.lawCase.compensateRate) / 100)).toFixed(2);
					} else if (v.id == '16') {//丧葬费
						v.applyPerUnit = (($scope.lawCase.compensateStandard.funeralFeeStandard || '0') / 12).toFixed(2);
						v.applyUnit = 6
						v.applyAmount = (parseFloat(v.applyPerUnit) * parseFloat(v.applyUnit)).toFixed(2)
					} else if (v.id == '17') {//精神损害抚慰金
						v.applyPerUnit = $scope.lawCase.compensateStandard ? $scope.lawCase.compensateStandard.spiritualConsolationFee : 0;
						v.applyAmount = (parseFloat(v.applyPerUnit) * 10 * (parseFloat($scope.lawCase.compensateRate) / 100)).toFixed(2);
					} else if (v.id == '19') {//处理事故人员误工费
						var applyAmount = 0
            if(v.personArray){
              v.personArray.forEach(function(m) {
                m.isFixedIncome = m.isFixedIncome || false
                m.incomeEvidence = m.incomeEvidence || 2
                m.applyPerUnit = m.applyPerUnit || $scope.lawCase.compensateStandard.lostIncome;
                m.applyUnit = m.applyUnit || $scope.lawCase.compensateDays
                m.applyAmount = parseFloat(m.applyPerUnit||0) * parseFloat(m.applyUnit||0)
                applyAmount += m.applyAmount
              })
            }
						
						v.applyAmount = applyAmount.toFixed(2)
					}
				} else {//非当场死亡
					if (v.id == '06') {//住院伙食补助费
						v.applyPerUnit = $scope.lawCase.compensateStandard.hospitalFoodSubsidies || '0';
						v.applyUnit = $scope.lawCase.hospitalDays
						v.applyAmount = (parseFloat(v.applyPerUnit) * parseFloat(v.applyUnit)).toFixed(2)
					} else if (v.id == '07') {//营养费
						v.applyPerUnit = $scope.lawCase.compensateStandard.thesePayments || '0';
						v.applyUnit = $scope.lawCase.hospitalDays
						v.applyAmount = (parseFloat(v.applyPerUnit) * parseFloat(v.applyUnit)).toFixed(2)
					} else if (v.id == '08') {//误工费
						v.isFixedIncome = v.isFixedIncome || false
						v.incomeEvidence = v.incomeEvidence || 2
						v.applyPerUnit = v.applyPerUnit || $scope.lawCase.compensateStandard.lostIncome;
						v.applyUnit = parseInt($scope.lawCase.compensateDays || 0) + parseInt($scope.lawCase.applicantArray[0].outPatientTimes || 0)
						v.applyAmount = (parseFloat(v.applyPerUnit||0) * parseFloat(v.applyUnit)).toFixed(2)
					} else if (v.id == '15') {//死亡赔偿金
						v.applyPerUnit = $scope.lawCase.compensateStandard ? $scope.lawCase.compensateStandard[$scope.lawCase.household].income : 0;
						v.applyUnit = calculateYearOfDisabled();
						v.applyAmount = (parseFloat(v.applyPerUnit)*parseFloat(v.applyUnit)*(parseFloat($scope.lawCase.compensateRate) / 100)).toFixed(2);
					} else if (v.id == '16') {//丧葬费
						v.applyPerUnit = (($scope.lawCase.compensateStandard.funeralFeeStandard || '0') / 12).toFixed(2);
            v.applyUnit = 6
						v.applyAmount = (parseFloat(v.applyPerUnit) * parseFloat(v.applyUnit)).toFixed(2)
					} else if (v.id == '17') {//精神损害抚慰金
						v.applyPerUnit = $scope.lawCase.compensateStandard ? $scope.lawCase.compensateStandard.spiritualConsolationFee : 0;
						v.applyAmount = (parseFloat(v.applyPerUnit) * 10 * (parseFloat($scope.lawCase.compensateRate) / 100)).toFixed(2);
					} else if (v.id == '19') {//处理事故人员误工费
						var applyAmount = 0
						v.personArray.forEach(function(m) {
							m.isFixedIncome = m.isFixedIncome || false
							m.incomeEvidence = m.incomeEvidence || 2
							m.applyPerUnit = m.applyPerUnit || $scope.lawCase.compensateStandard.lostIncome;
							m.applyUnit = m.applyUnit || $scope.lawCase.compensateDays
							m.applyAmount = parseFloat(m.applyPerUnit||0) * parseFloat(m.applyUnit||0)
							applyAmount += m.applyAmount
						})
						
						v.applyAmount = applyAmount.toFixed(2)
					}
				}
			}
    
    	if (v.id == '09') {//护理费
        if(v.nursingArray){
          v.nursingArray.forEach(function(nurse) {
            calculateNurseFee(nurse)
          })
        }

				//计算护理费
				function calculateNurseFee(nurse) {
					var standardNurseFee = $scope.lawCase.compensateStandard.standardNurseFee || 0//费用标准
					nurse.applyPerUnit = parseFloat(nurse.applyPerUnit ? nurse.applyPerUnit:standardNurseFee).toFixed(2)
					nurse.applyUnit = $scope.lawCase.compensateDays*1-$scope.lawCase.hospitalDays*1
					nurse.nursingNum = nurse.nursingNum || 1
					if (nurse.nursingType == '1') {//短期医嘱护理 = 医嘱护理天数*护理人数*标准
						nurse.applyAmount = (parseFloat(nurse.applyUnit || 0) * parseFloat(nurse.nursingNum || 1) * parseFloat(nurse.applyPerUnit)).toFixed(2)
					} else if (nurse.nursingType == '2') {//长期康复护理 = 标准 * 护理依赖系数* 护理年限 *365
						if (!nurse.isNurseIdentification) {//没有护理鉴定
							nurse.nursingYear = calculateNuringYear(nurse) || 0
						}
						nurse.applyAmount = (parseFloat(applyPerUnit) * parseFloat(nurse.dependentRate || 0) / 100 * parseFloat(nurse.nursingYear) * 365).toFixed(2)
					} else if (nurse.nursingType == '3') {//短期医嘱护理 + 长期康复护理 = 医嘱护理天数 * 护理人数 * 标准 + 标准 * 护理依赖系数 * 护理年限 * 365
						if (!nurse.isNurseIdentification) //没有护理鉴定
							nurse.nursingYear = calculateNuringYear(nurse) || 0
						var shortNurseFee = parseFloat(nurse.applyUnit || 0) * parseFloat(nurse.nursingNum || 1) * parseFloat(nurse.applyPerUnit)
						var longNurseFee = parseFloat(nurse.applyPerUnit) * parseFloat(nurse.dependentRate || 0) / 100 * parseFloat(nurse.nursingYear || 0) * 365
						nurse.applyAmount = (shortNurseFee + longNurseFee).toFixed(2)
					} else {//住院护理费
						nurse.applyUnit = $scope.lawCase.hospitalDays
						var fee = parseFloat(nurse.applyUnit || 0) * parseFloat(nurse.nursingNum || 1) * parseFloat(nurse.applyPerUnit)
						nurse.applyAmount = fee.toFixed(2)
					}
          
          function calculateNuringYear(nurse){
            var applicant = $scope.lawCase.applicantArray[0]
            if (!nurse.isNurseIdentification){//没有护理鉴定
              if (nurse.dependentRate == '100') {//护理依赖系数  100%  完全依赖
                return 5
              } else if (nurse.dependentRate == '80') {//护理依赖系数  80%  大部分依赖
                if (DictionaryConfig.getAge(applicant.birthDay, DictionaryConfig.formatDate(new Date())) > 75) {//年龄在75周岁以上的，固定为5年
                  return 5
                } else
                  return 10
              } else if (nurse.dependentRate == '50') {//护理依赖系数  50%  部分依赖
                return 10
              }
            }
          }
				}
    	}
    
			switch(v.template){
				case '2': v.perUnitName = "元/天"; v.unitName = "天"; break;
				case '3': v.perUnitName = "元/年"; v.unitName = "年"; break;
				case '4': v.perUnitName = "元/月"; v.unitName = "月"; break;
			}
  	})
  }()
  
  /**
   * 查询行业类型
   */
  $scope.initIndustryType = function(){
    $scope.prejudgeService.queryIndustryType({}).success(function(res){
    	if(res.code == PrejudgeConfig.commonConstant.SUCCESS){//数据获取成功
        $scope.industryArray = res.result//行业数据（包含行业对应的收入）
        $scope.industryTypeArray = res.result.map(function(v) {//行业类型(名称)
					return v.dictName
				})
			}else{//后台异常代码
        $rootScope.toaster("error", "错误：" + result.code, result.message);
			}
		})
  }()
	
  /**
	 * 处理展示的费用项
	 */
	$scope.filterFeeList = function () {
		$scope.feeArray = $scope.lawCase.feeDetail.filter(function(v) {
			if ($scope.lawCase.caseType == '0') { //普通受伤(无伤残)
				if ($scope.lawCase.treatmentType == '1') { //门诊治疗,没有营养费
					return (v.group == '1' || v.group == '2') && v.id != '07' && v.id != '05' && v.id != '20' && v.id != '19'
				} else
					return (v.group == '1' || v.group == '2') && v.id != '05' && v.id != '20' && v.id != '19'
			} else if ($scope.lawCase.caseType == '1') { //伤残
				return v.group == '1' || v.group == '2' || v.group == '3' || v.group == '4' || v.group == '6'
			} else if ($scope.lawCase.caseType == '2') { //死亡
				if ($scope.lawCase.isDeadAtTheScene) { //当场死亡
					return v.group == '1' || (v.group == '3' && v.id != '06') || v.group == '5' || v.group == '6'
				} else { //非当场死亡
					return v.group == '1' || v.group == '2' || v.group == '3' || v.group == '5' || v.group == '6'
				}
			}
		})
	}()
  
  // /**
  //  * 过滤处理事故人员务工费
  //  */
  // $scope.filterLostIncome = function () {
  //   if ($scope.lawCase.caseType == '2') {//死亡
  //     $scope.handlePersonArray = $scope.lawCase.feeDetail.filter(function(v) {
  //         return v.id == '19'
  //     })[0].personArray
  //   }
  // }();
    
  /**
   * 计算残疾/死亡赔偿年限
   */
  function calculateYearOfDisabled(){
    var applicant = $scope.lawCase.applicantArray[0];
    
    if ($scope.lawCase.caseType == '0'){//普通(无伤残)
      return 0
    } else if ($scope.lawCase.caseType == '2'){//死亡
      if ($scope.lawCase.isDeadAtTheScene){//当场死亡
        $scope.lawCase.deathDate = $scope.lawCase.createDate
      }
    }
    
    if (applicant.birthDay) applicant.birthDay =  DictionaryConfig.formatDate(applicant.birthDay);
    if ($scope.lawCase.deathDate) $scope.lawCase.deathDate =  DictionaryConfig.formatDate($scope.lawCase.deathDate)
    var age = Math.abs(new Date($scope.lawCase.deathDate.replace(/-/g, '/')).getFullYear() - new Date(applicant.birthDay.replace(/-/g, '/')).getFullYear());
    if(age <= 60){
      return 20
    } else if (age > 60 && age < 75){
      return 20 - (age - 60)
    }else{
      return 5
    }
  }
  
  /**
   * 获取行业数据标准
   */
  $scope.initIndustryStandardFee = function(id, callback){
    var industryCode = $scope.industryArray.filter(function(v, index) {
      return index == id
    })[0].dictCode
    var param = {
      regionName: $scope.lawCase.regionName,
      searchStartDate: $scope.lawCase.standardYear,
      industryTypeCode: industryCode
    }
    
    $scope.prejudgeService.queryIndustryIncomeNormByNameAndDateAndTypeCode(param).success(function(res){
      if(res.code == PrejudgeConfig.commonConstant.SUCCESS){//获取成功
        callback(res.result)
      }else{
        $rootScope.toaster("error", "错误：" + res.code, res.message);
      }
    })
  }
  
  /**
   * 计算护理年限
   */
  $scope.calculateNuringYear = function(nurse){
    var applicant = $scope.lawCase.applicantArray[0]
    if (!nurse.isNurseIdentification){//没有护理鉴定
      if (nurse.dependentRate == '100') {//护理依赖系数  100%  完全依赖
        return 5
      } else if (nurse.dependentRate == '80') {//护理依赖系数  80%  大部分依赖
        if (DictionaryConfig.getAge(applicant.birthDay, DictionaryConfig.formatDate(new Date())) > 75) {//年龄在75周岁以上的，固定为5年
          return 5
        } else
          return 10
      } else if (nurse.dependentRate == '50') {//护理依赖系数  50%  部分依赖
        return 10
      }
    }
  }
  
  /**
   * 费用数据变化事件
   * @param fee
   * @param attribute
   */
  $scope.onfeeChange = function(fee, attribute) {
    if(attribute == 'isFixedIncome'){//是否有固定收入
      fee.isFixedIncome = !fee.isFixedIncome
      if(!fee.isFixedIncome){//无工资收入，按照标准计算
        var standardFee = (fee.id == '08' || fee.id == '19')?$scope.lawCase.compensateStandard.lostIncome:$scope.lawCase.compensateStandard.standardNurseFee
        fee.incomeEvidence = 2;//按本地标准
        fee.applyPerUnit = parseFloat(standardFee||0).toFixed(2)
        fee.applyAmount = (parseFloat(fee.applyPerUnit || 0) * parseFloat(fee.applyUnit || 0)).toFixed(2)
      } else {
        fee.incomeEvidence = '';
      }
    } else if(attribute == 'applyPerUnit'){//工资收入
      fee.applyAmount = ((fee.applyPerUnit || 0) * (fee.applyUnit || 0)).toFixed(2);
      if(fee.type && fee.type == '2'){//出院护理费
        calculateNurseFee(fee);
      }
    } else if(attribute == 'applyUnit'){//工资收入
      fee.applyAmount = ((fee.applyPerUnit || 0) * (fee.applyUnit || 0)).toFixed(2);
      if(fee.type && fee.type == '2'){//出院护理费
        calculateNurseFee(fee);
      }
    } else if(attribute == 'incomeEvidence'){//证明类型
      if(fee.incomeEvidence == 1){//按照行业标准
        fee.industryType = 0
        //查询行业对应的收入
        $scope.initIndustryStandardFee(fee.industryType, function(data){
          fee.applyPerUnit = parseFloat(data.yearIncome / 365).toFixed(2)
          fee.applyAmount = (parseFloat(fee.applyPerUnit || 0) * parseFloat(fee.applyUnit || 0)).toFixed(2)
        })
      } else{
        fee.applyPerUnit = parseFloat($scope.lawCase.compensateStandard.lostIncome||0).toFixed(2)
        fee.applyAmount = (parseFloat(fee.applyPerUnit) * parseFloat(fee.applyUnit||0)).toFixed(2)
      }
    } else if(attribute == 'industryType'){//行业类型
      //查询行业对应的收入
      $scope.initIndustryStandardFee(fee.industryType, function(data){
        fee.applyPerUnit = parseFloat(data.yearIncome / 365).toFixed(2)
        fee.applyAmount = (parseFloat(fee.applyPerUnit || 0) * parseFloat(fee.applyUnit || 0)).toFixed(2)
        if(fee.type && fee.type == '2'){//出院护理费
          calculateNurseFee(fee);
        }
      })
    } else if(attribute == 'nurseEvidence'){//护理证明类型
      if(fee.incomeEvidence == 1){//按照行业标准
        fee.industryType = 0
        //查询行业对应的收入
        $scope.initIndustryStandardFee(fee.industryType, function(data){
          fee.applyPerUnit = parseFloat(data.yearIncome / 365).toFixed(2)
          fee.applyAmount = (parseFloat(fee.applyPerUnit || 0) * parseFloat(fee.applyUnit || 0) * parseInt(fee.nursingNum || 0)).toFixed(2)
        })
      } else{
        fee.applyPerUnit = parseFloat($scope.lawCase.compensateStandard.standardNurseFee||0).toFixed(2)
        fee.applyAmount = (parseFloat(fee.applyPerUnit || 0) * parseFloat(fee.applyUnit || 0) * parseInt(fee.nursingNum || 0)).toFixed(2)
      }
      if(fee.type && fee.type == '2'){//出院护理费
        calculateNurseFee(fee);
      }
    } else if(attribute == 'nursingNum'){//护理人数
      fee.applyAmount = (parseFloat(fee.applyPerUnit || 0) * parseFloat(fee.applyUnit || 0) * parseInt(fee.nursingNum || 0)).toFixed(2)
      calculateNurseFee(fee);
    } else if(attribute == "isNurseIdentification"){//有无护理鉴定
      fee.isNurseIdentification = !fee.isNurseIdentification
      calculateNurseFee(fee);
    } else if(attribute == 'dependentRate'){//护理依赖系数
      fee.nuringYear = $scope.calculateNuringYear(fee);
      calculateNurseFee(fee);
    } else if(attribute == 'nursingYear'){//护理年限
      calculateNurseFee(fee);
    }
  }
  
  /**
   * 计算抚养年限
   */
  var calculateFyAge = function (deathDate, birthDate){
    var age = DictionaryConfig.getAge(deathDate, birthDate)
    if (age <= 18)
      return 18 - age;
    else if (age > 18 && age <= 60)
      return 20;
    else if (age > 60 && age< 75)
      return 80 -age;
    else if (age >= 75)
      return 5;
  }

    /**
   * 被扶养人生活费
   */
  var Dependent = function(){
    this.birthDate = "";
    this.fyAge = "";
    this.count = 1;
    this.household = $scope.lawCase.household;
    this.isOpen = false;
  }
  /**
   * 增加被扶养人生活费
   */
  $scope.addDepenDent = function(fee){
  
    fee.dependents.apply.push(new Dependent());
  },
  
  /**
   * 删除被扶养人生活费
   */
  $scope.removeDependent = function(fee, dependent){
    var index = fee.dependents.apply.indexOf(dependent);
    fee.dependents.apply.splice(index, 1)
    
    //计算
    fee.applyAmount = countDependentFee(fee.dependents.apply);
  }
  
  /**
   * 出生日期绑定事件
   */
  $scope.openBirthDate = function($event,dependent){
    $event.preventDefault();
		$event.stopPropagation();
    dependent.isOpen = !dependent.isOpen
  }
  
  /**
   * 被抚养人生活费绑定事件
   */
  $scope.onDependentChange = function(fee, dependent, attribute, val){
    if(attribute == 'birthDate'){//出生日期
      var birthDate = DictionaryConfig.formatDate(dependent.birthDate)
      dependent.fyAge = calculateFyAge(birthDate, $scope.lawCase.deathDate)//计算抚养年限
    } else if(attribute == 'household'){
      dependent.household = val
    }
    
    //计算整体被抚养人生活费
    calculateWholeDependentFee(fee, dependent)
  }
  
  /**
   * 计算整体的被扶养人生活费
   * @param fee
   * @param dependent
   */
  var calculateWholeDependentFee = function(fee, dependent){
    if (fee.dependents.apply.length == 1) {//单个抚养人
      var standardFee = $scope.lawCase.compensateStandard[$scope.lawCase.household].expense
      //抚养年限x上一年度城镇居民人均年消费性支出额或者农村居民人均年生活消费支出额/共同抚养人数×伤残系数
      var countFee = parseFloat(dependent.fyAge || 0) * parseFloat(standardFee || 0) / parseFloat(dependent.count || 1) * (parseFloat($scope.lawCase.compensateRate) / 100)
    
      fee.applyAmount = countFee.toFixed(2)
      dependent.applyAmount = fee.applyAmount;
    } else {//多个被扶养人
      var dependentStandard = $scope.lawCase.compensateStandard[$scope.lawCase.household].expense
      fee.dependents.apply.forEach(function (m, i, arr) {
        var tmpFee = 0;
        var preYear = 0;
    
        if (i != 0) {
          preYear = arr[i - 1].fyAge;
        }
        arr.forEach(function(j) {
        tmpFee += (dependentStandard * $scope.lawCase.compensateRate / 100 / j.count);
        })
    
        //取标准和计算值中小的
        tmpFee = Math.min(tmpFee, dependentStandard);
        m.applyAmount = (tmpFee * (m.fyAge - preYear)).toFixed(2)
      })
      
      var countFee = countDependentFee(fee.dependents.apply);
      fee.applyAmount = countFee
    }
  }
  
  /**
   * 计算被扶养人生活费
   */
  var countDependentFee = function(applyArray){
    var countFee = 0
    var dependentStandard = $scope.lawCase.compensateStandard[$scope.lawCase.household].expense
    
    var tempClaimArray = []
    tempClaimArray = Object.assign(tempClaimArray, applyArray)
    tempClaimArray.sort(function (a, b) {//根据抚养年限排序，由大到小
      return a.fyAge - b.fyAge;
    }).forEach(function(m, i, arr) {
      var tmpFee = 0;
      var preYear = 0;
      if (i != 0) {
        preYear = arr[i - 1].fyAge;
      }
      
      arr.forEach(function(j) {
        tmpFee += (dependentStandard * $scope.lawCase.compensateRate / 100 / j.count);
    })
      
      //取标准和计算值中小的
      tmpFee = Math.min(tmpFee, dependentStandard);
      m.applyAmount = (tmpFee * (m.fyAge - preYear)).toFixed(2)
      countFee += (tmpFee * (m.fyAge - preYear));
    })
    
    return countFee.toFixed(2);
  }
  
  //计算护理费
  function calculateNurseFee(nurse) {
    var standardNurseFee = $scope.lawCase.compensateStandard.standardNurseFee || 0//费用标准
    if (nurse.nursingType == '1') {//短期医嘱护理 = 医嘱护理天数*护理人数*标准
      nurse.applyAmount = (parseFloat(nurse.applyUnit || 0) * parseFloat(nurse.nursingNum || 1) * parseFloat(nurse.applyPerUnit ? nurse.applyPerUnit : standardNurseFee)).toFixed(2)
    } else if (nurse.nursingType == '2') {//长期康复护理 = 标准 * 护理依赖系数* 护理年限 *365
      if (!nurse.isNurseIdentification){//没有护理鉴定
        nurse.nursingYear = $scope.calculateNuringYear(nurse) || 0
      }
      nurse.applyAmount = (parseFloat(nurse.applyPerUnit ? nurse.applyPerUnit:standardNurseFee) * parseFloat(nurse.dependentRate || 0) / 100 * parseFloat(nurse.nursingYear) * 365).toFixed(2)
    } else if (nurse.nursingType == '3') {//短期医嘱护理 + 长期康复护理 = 医嘱护理天数 * 护理人数 * 标准 + 标准 * 护理依赖系数 * 护理年限 * 365
      if (!nurse.isNurseIdentification) {//没有护理鉴定
        nurse.nursingYear = $scope.calculateNuringYear(nurse) || 0
      }
      var shortNurseFee = parseFloat(nurse.applyUnit || 0) * parseFloat(nurse.nursingNum || 1) * parseFloat(standardNurseFee)
      var longNurseFee = parseFloat(nurse.applyPerUnit ? nurse.applyPerUnit : standardNurseFee) * parseFloat(nurse.dependentRate || 0) / 100 * parseFloat(nurse.nursingYear || 0) * 365
      nurse.applyAmount = (shortNurseFee + longNurseFee).toFixed(2)
    } else {//住院护理费
      nurse.applyUnit = $scope.lawCase.hospitalDays
      var fee = parseFloat(nurse.applyUnit || 0) * parseFloat(nurse.nursingNum || 1) * parseFloat(nurse.applyPerUnit ? nurse.applyPerUnit:standardNurseFee)
      nurse.applyAmount = fee.toFixed(2)
    }

    // fee.applyAmount = 0;
    // fee.nursingArray.forEach(function(m) { 
    //   fee.applyAmount += parseFloat(m.applyAmount || 0)
    // })
  }
  
  /**
   * 误工费
   */
  var LostIncome = function () {
    this.isFixedIncome = false
    this.incomeEvidence = 2
    this.industryType = ""
    this.applyPerUnit = $scope.lawCase.compensateStandard.lostIncome
    this.applyAmount = ""
  }
  
  /**
   * 增加处理事故人员误工费
   */
  $scope.addPersonArray = function(){
    var lostIncome = new LostIncome()
    lostIncome.id = '19'
    lostIncome.applyUnit = $scope.lawCase.compensateDays
    $scope.lawCase.feeDetail.filter(function(v){
      return v.id == '19'
    })[0].personArray.push(lostIncome)
  }
  
  /**
   * 删除处理事故人员误工费
   */
  $scope.delPersonArray = function(fee){
    var index = $scope.lawCase.feeDetail.filter(function(v){
      return v.id == '19'
    })[0].personArray.indexOf(fee);
    $scope.lawCase.feeDetail.filter(function(v){
      return v.id == '19'
    })[0].personArray.splice(index, 1)
  }
  
  /**
   * 下一步
   */
	$scope.nextStep = function () {
		$state.go("home_page.prejudge_new.AIOCourtSetp4")
	}
  
  /**
   * 上一步
   */
	$scope.preveStep = function () {
		$state.go("home_page.prejudge_new.AIOCourtSetp2")
	}
});