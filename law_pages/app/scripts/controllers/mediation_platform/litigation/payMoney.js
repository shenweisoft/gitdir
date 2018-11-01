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
    console.log($scope.applicantArray)
    //被申请人集合
    $scope.respondentList = $scope.applicantArray.filter(function(v){
        console.log(v.personType)
        return v.personType == '1'
    });
    console.log($scope.respondentList)
    //获取赔偿数据 payType:1 交强险 2：商业险 3：个人  personType:1 为被告
    //计算拆分总金额
    $scope.calculatePayTotalMoney = function(respondent){
        //计算当前赔偿的金额
        var payMoney = 0;
        $scope.respondentList.forEach(function(val){
            if(val.payMoney){
                payMoney += parseFloat(val.payMoney);
            }
        });
        //当赔偿金额大于总金额时
        //if(payMoney > $scope.adjust.lawMoney) {
        if(payMoney > $scope.adjust.applyTotal) {
            var moreMoney = payMoney - $scope.adjust.applyTotal; //计算超出的金额
            respondent.payMoney = respondent.payMoney - moreMoney; //将超出的金额减去
            payMoney = payMoney - moreMoney;
        }
        $scope.payTotalMoney = payMoney;
        $scope.adjust.paidTotal = payMoney;
        //剩余金额
        $scope.adjust.willPayTotal = $scope.adjust.applyTotal - payMoney;
        $scope.adjust.residueTotal = $scope.adjust.applyTotal - payMoney;
    };
    //初始化
    $scope.calculatePayTotalMoney();
    //取消
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});