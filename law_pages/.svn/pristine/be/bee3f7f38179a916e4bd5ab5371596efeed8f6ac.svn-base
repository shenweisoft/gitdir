/**
 * Created by shenwei on 2017/5/11.
 */
'use strict';
var app = angular.module('sbAdminApp');
app.filter('stringDate', function() {
	return function(dt) {
		if(typeof (dt) == "string")
		{
			dt = dt.replace(/\-/gi,"\/");
			dt = Date.parse(dt);
		}
		return dt && dt;
	}
});
angular.module('sbAdminApp').controller('partyPageCtrl', function($scope,$state,AdjustConfig,AdjustService,toaster,$log,DictionaryConfig,LawService,LawConfig,LoginService,LoginConfig,$filter,$rootScope) {

	//定义菜单显示常量
	$scope.ORGANIZATION_CONSTANT = {
		"citizenHide": "1"//如果为公民或者管理员隐藏组织字段
	}
	//定义查询用户SessionService
	$scope.queryUserInfoService = LoginService.queryUserInfo;
	//查询案件集合Service
	$scope.queryPartyLawListService = AdjustService.queryPartyLawList;
	//状态
	$scope.lawState = DictionaryConfig.lawState;
	//查询历史记录
	$scope.queryJyWorkFlowService = LawService.queryJyWorkFlow;
	//默认查第一条记录
	$scope.caseNum=0;
	//获取用户信息
	$scope.queryUserInfoService().success(function(result) {
		if (result.result) {
			//用户赋值
			$scope.user  = result.result;
			$scope.head = $scope.user.sysUser.head?LoginConfig.pictureConstant.smallPictureUrl + $scope.user.sysUser.head:"views/images/img01.jpg";
		}
	});
	$scope.citizenHide = "1";
	//左侧切换
	$scope.prev = function(){
		$scope.caseNum == 0 ? $scope.caseNum = $scope.lawInfoList.length-1 : $scope.caseNum -= 1;
	};
	//右侧切换
	$scope.next = function(){
		$scope.caseNum == $scope.lawInfoList.length-1 ? $scope.caseNum = 0 : $scope.caseNum += 1;
	};
	//查询案件
	$scope.queryPartyLawListService({}).success(function (result) {
		if(result.code ==  AdjustConfig.commonConStant.SUCCESS){

			$scope.lawInfoList = result.result;

			$log.info($scope.lawInfoList );
			//查询流程
			$scope.lawInfoList.forEach(function(val){
				//是否能开庭标识,默认不能开庭
				var isShowFlag = false;
				//需要查看开庭时间，是否允许开庭
				var nowDate = new Date(new Date().getTime() + DictionaryConfig.courtBeforeHour);
				if(val.nextCourtDate){
					if(val.nextCourtDate <= $filter('date')(nowDate,"yyyy-MM-dd HH:mm:ss")){
						isShowFlag = true;
					}
				}else{
					if(val.courtDate){
						if(val.courtDate <= $filter('date')(nowDate,"yyyy-MM-dd HH:mm:ss")){
							isShowFlag = true;
						}
					}
				}

				//如果不是暂缓缴费并且又没有付款，则不能开庭
				if(val.isDeferredCharges != '1' && val.payState != '1'){
					isShowFlag = false;
				}
				val.isShowFlag = isShowFlag;
				//如果起诉中并且是驳回的案件
				if(val.state == $scope.lawState.prosecutionState && val.isReturn == '1'){
					//查询历史记录
					$scope.queryJyWorkFlowService({
						"serialNo": val.serialNo
					}).success(function (flowResult) {
						if(flowResult.code ==  LawConfig.commonConstant.SUCCESS){
							$scope.jyWorkFlowList = flowResult.result;
							for(var i = 0; i < $scope.jyWorkFlowList.length; i ++){
								var jyWorkFlow = $scope.jyWorkFlowList[i];
								if(jyWorkFlow.type == DictionaryConfig.lawType.approvalInfo && jyWorkFlow.result == '1'){
									val.returnRemark = jyWorkFlow.remark;
									val.returnDate = jyWorkFlow.createDate;
									break;
								}
							}
						}else{
              $rootScope.toaster("error", "错误", flowResult.message);
						}
					});
				}
			});
		}else{
      $rootScope.toaster("error", "错误", result.message);
		}
	});

	//我要起诉
	$scope.readingNotes = function(law){

			AdjustService.getForwardUrl({
				orgId:law.lawOrgId
			}).success(function(res){
				if(res.result && res.result.civilProcedureDoc){
					$state.go('dashboard.reading_notes', {"serialNo":law.serialNo, "name": res.result.civilProcedureDoc});
				}else{
					$state.go('dashboard.reading_notes', {"serialNo":law.serialNo, "name": "reading_notes"});
				}
			})
	};

	//个人中心
	$scope.queryPersonalCenter = function(){
		$state.go("dashboard.partyMediate");
	};
	//登陆邮箱
	$scope.loginMail = function(){
    LawService.getSingleLoginOnMail().success(function(res){
			window.open(res.result,'_blank');
		});
  };

	//跳转查询卷宗
	$scope.adjustInfoDetail = function(law){
		var url = $state.href("dossierDetail",{serialNo:law.serialNo,id:law.id});
		window.open(url,'_blank');
	};

	//查询证据
	$scope.queryEvidence = function(law){
		var url = $state.href("evidence_detail",{serialNo:law.serialNo,id:law.id});
		window.open(url,'_blank');
	};

	//查询流程
	$scope.queryDetail = function(law){
		var url = $state.href("dashboard.case_details",{serialNo:law.serialNo,id:law.id});
		window.open(url,'_blank');
	};

	//举证、置证
	$scope.certificate = function(law,evidenceType){
		//默认为我要置证
		var menuType = 0;
		var evidenceTypeNew= "";
		//我要举证
		if(evidenceType == '1'){
			menuType = 1;
		}else{//我要置证
			//被告
			if(law.personType == '1'){
				evidenceTypeNew = 0;
			}else{
				evidenceTypeNew = 1;
			}
		}
		var url = $state.href("evidence_detail",{serialNo:law.serialNo,menuType:menuType,evidenceType:evidenceTypeNew,id:law.id});
		window.open(url,'_blank');
	};

	//缴费
	$scope.payMoney = function(law){
		$state.go('dashboard.litigation_payment', {'serialNo':law.serialNo});
	};
	//庭前调解
	$scope.courtAdjust = function(law){
		$state.go("dashboard.courtMediation",{serialNo:law.serialNo})
	};

	//去庭前调解页面
	$scope.goOnlineSession = function (law) {
		LawService.onlineCourt({
			serialNo:law.serialNo,
			lawNo:law.lawNo
		}).success(function(res){
			window.open(res.result,'_blank');
		})
	}

});