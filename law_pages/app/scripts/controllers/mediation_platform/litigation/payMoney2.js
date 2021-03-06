/**
 * Created by shenwei on 2017/12/13.
 */
var app = angular.module('sbAdminApp');
app.controller('PayMoneyCtrl', function($scope, DictionaryConfig, $state, $modal, items, $modalInstance, toaster,$log) {
    $scope.adjust = items.adjust;
    $scope.claimFlag = items.claimFlag;
    $scope.secondFlag = items.secondFlag;

    if($scope.claimFlag){
        $scope.applicantArray = $scope.adjust.compensationApplyerInfoList;
    }else{
        $scope.applicantArray = $scope.adjust.applicantArray;
    }

    if(items.secondFlag){
        $scope.applicantArray = $scope.adjust.secondInstanceApplicantArray;
    }
    //被申请人集合
/*    $scope.respondentList = $scope.applicantArray.filter(function(v){
        console.log(v.personType)
        return v.personType == '1'
    });*/
    if( $scope.adjust.respondentList==undefined||$scope.adjust.respondentList.length==0){
     $scope.adjust.respondentList = angular.copy($scope.applicantArray.filter(function(v){
        // return ((v.responsibleRate == undefined && v.idType == '0' && v.personType != '1' ) || (v.responsibleRate && v.responsibleRate>0 && v.idType == '0' && v.personType == '1'));
     	return v;
     }));
    }
    //获取赔偿数据 payType:1 交强险 2：商业险 3：个人  personType:1 为被告
    //计算拆分总金额
    $scope.calculatePayTotalMoney = function(respondent){
        //计算当前赔偿的金额
        var payMoney = 0;
        $scope.adjust.respondentList.forEach(function(val){
            if(val.payMoney){
                payMoney += parseFloat(val.payMoney);
            }
          
        });
        //当赔偿金额大于总金额时
        if(payMoney > $scope.adjust.lawMoney) {
            var moreMoney = payMoney - $scope.adjust.lawMoney; //计算超出的金额
            respondent.payMoney = respondent.payMoney - moreMoney; //将超出的金额减去
            payMoney = payMoney - moreMoney;
        }
        $scope.payTotalMoney = payMoney;
        $scope.adjust.paidTotal = payMoney;
        //剩余金额
        $scope.adjust.willPayTotal = $scope.adjust.lawMoney - payMoney;
        $scope.adjust.residueTotal = $scope.adjust.lawMoney - payMoney;
    };
    //初始化
    $scope.calculatePayTotalMoney();
    //取消
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});