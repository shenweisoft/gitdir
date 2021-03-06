/**
 * Created by shenwei on 2017/12/13.
 */
var app = angular.module('sbAdminApp');
app.controller('ExtraAmountCtrl', function($scope, DictionaryConfig, $state, $modal, items, $modalInstance) {

    //计算拆分总金额
    $scope.calculatePayTotalMoney = function(){
        var extraMoney = 0;
        $scope.fee.respondentList.forEach(function(val){
            if(val.extraMoney){
                extraMoney += parseFloat(val.extraMoney);
            }
        });
        $scope.fee.extraAmount = extraMoney;

        //保险外金额总和
        var extraTotalLawMoney = 0;
        $scope.adjust.feeDetail.forEach(function (val){
            if(val.extraAmount){
                extraTotalLawMoney += parseFloat(val.extraAmount);
            }
        });
        $scope.adjust.extraTotalLawMoney = extraTotalLawMoney;
    };

    $scope.fee = items.fee;
    $scope.adjust = items.adjust;
    $scope.claimFlag = items.claimFlag;
    $scope.secondInstanceFlag = items.secondInstanceFlag;
    //标题显示
    $scope.title = $scope.fee.value + "保险外金额";
    if($scope.claimFlag){
        $scope.applicantArray = $scope.adjust.compensationApplyerInfoList;
    }else{
        $scope.applicantArray = $scope.adjust.applicantArray;
    }
    if(items.secondInstanceFlag){
        $scope.applicantArray = $scope.adjust.secondInstanceApplicantArray;
    }

    //申请人和被申请人集合 不存在集合的情况 ，新建集合
    if($scope.fee.respondentLis==undefined ){
        //二审显示保险外金额
        if(items.secondInstanceFlag){
            //原审原告 + 原审被告有责任比例（并且不是保险公司）
            $scope.fee.respondentList = angular.copy($scope.applicantArray.filter(function(v){
                var temp = false;
                if(v.responsibleRate && v.responsibleRate > 0){
                    temp = true;
                }
                return v.lawType == '1' || (((v.idType == '0' || v.idType == '2')  ||  (v.idType == '1' &&  v.companyType != '1')) && v.lawType == '2' && temp)  ;
            }));
        }else{
            $scope.fee.respondentList = angular.copy($scope.applicantArray.filter(function(v){
               // return ((v.responsibleRate == undefined && v.idType == '0' && v.personType != '1' ) || (v.responsibleRate && v.responsibleRate>0 && v.idType == '0' && v.personType == '1'));
            	return v;
            }));
        }
    }else{//如果存在集合的情况

        var chooseArr = [];
        if(items.secondInstanceFlag){
            chooseArr = $scope.applicantArray.filter(function(v){
                var temp = false;
                if(v.responsibleRate && v.responsibleRate > 0){
                    temp = true;
                }
                return v.lawType == '1' || (((v.idType == '0' || v.idType == '2')  ||  (v.idType == '1' &&  v.companyType != '1')) && v.lawType == '2' && temp)  ;
            });
        }else{
            //循环申请人与被申请人数据，当其数据在费用详细中不存在时则自动添加一条申请人或者被申请人记录
            //同时过滤出被申请人中，无责任比的用户
            chooseArr = $scope.applicantArray.filter(function (v) {
               // console.log(v)
               // return ((v.responsibleRate == undefined && v.idType == '0' && v.personType != '1' ) || (v.responsibleRate && v.responsibleRate>0 && v.idType == '0' && v.personType == '1'));
            return v;
            });
        }
        chooseArr.forEach(function(m){
            //与新数据对比，当新数据中有当前数据没有的项时，存入数据
            var respondent = _.find($scope.fee.respondentList,{payName: m.payName});
            if(!respondent){
                $scope.fee.respondentList.push(angular.copy(m));
            }
        });
        //检索当前数据，当存在新数据中没有的项时，删除数据
        $scope.fee.respondentList.forEach(function (m) {
            var respondent = _.find(chooseArr,{payName: m.payName});
            if(!respondent){
                //采用delete 为了不改变数组长度，防止影响循环索引
                delete $scope.fee.respondentList[$scope.fee.respondentList.indexOf(m)];
            }
        });
        //将数组中的undefined去除
        $scope.fee.respondentList = _.filter($scope.fee.respondentList, function (v) {
            return v != undefined;
        });

        $scope.calculatePayTotalMoney();
    }

    //取消
    $scope.cancel = function() {
        $modalInstance.close({});
    };
});