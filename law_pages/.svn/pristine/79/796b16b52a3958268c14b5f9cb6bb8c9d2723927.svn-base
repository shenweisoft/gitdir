angular.module('sbAdminApp').controller('regionalNameRemarkForm', function($scope, $modal,$log,toaster,$state,LoginService,LoginConfig,LawConfig,DictionaryConfig,$rootScope) {

    //service常量
    $scope.commonConstant = LawConfig.commonConstant;
    //请求后台获取区域名称备注数据
    $scope.queryRegionalNameRemarkData = LoginService.queryRegionalNameRemarkData;
    //删除区域名称备注数据
    $scope.deleteQueryRegionalNameRemarkData = LoginService.deleteQueryRegionalNameRemarkData;
    //新增后的区域名称备注数据
    $scope.AddQueryRegionalNameRemarkData = LoginService.AddQueryRegionalNameRemarkData;
    //修改后的区域名称备注数据
    $scope.updateQueryRegionalNameRemarkData = LoginService.updateQueryRegionalNameRemarkData;
    //区域名称备注数据分页
    $scope.pagingQueryRegionalNameRemarkData = LoginService.pagingQueryRegionalNameRemarkData;


    //定义输入对象
    function RegionalNameRemark(){
        this.regionName = "";
        //默认从第一页开始查询
        this.pageNo = 1;
        //每页显示条数
        this.pageSize = DictionaryConfig.pageNum;
    }

    $scope.regionalNameRemark = new RegionalNameRemark();
    //请求后台
    $scope.dataInfo = function () {
        //获取数据列表
        $scope.queryRegionalNameRemarkData($scope.regionalNameRemark).success(function (res) {
            if(res.code === $scope.commonConstant.SUCCESS) {
                // 页面数据列表
                $scope.dataList = res.result;
            } else {
                $rootScope.toaster("error", "错误", res.message);
            }
        });

        //获取总条数
        $scope.pagingQueryRegionalNameRemarkData($scope.regionalNameRemark).success(function (res) {
            
            if(res.code === $scope.commonConstant.SUCCESS) {
             
             

                $scope.regionalNameRemark.totalPage = res.result;
            } else {
                $rootScope.toaster("error", "错误", res.message);
            }
        })
    };
    $scope.dataInfo();

    //新增/修改按钮点击，打开弹出框
    $scope.handleModalShow = function (updateData) {
        var harmModal = $modal.open({//打开弹窗页
            templateUrl:'views/pages/regionalNameRemarkForm/regionalNameRemarkFormPopup.html',
            controller:'regionalNameRemarkFormPopup',
            size:'lg',
            resolve:{
                items:function(){
                    return {
                        regionalNameRemarkObj:updateData,//单个数据
                    }
                }
            }
        });
        //弹出框返回值
        harmModal.result.then(function(data){
            var addFlag = data.addFlag;
            // console.log("1221");
            // console.log(addFlag);
            if(data.regionalNameRemarkObj && !data.addFlag){
                updateData.id = data.regionalNameRemarkObj.id;
                updateData.startDate = data.regionalNameRemarkObj.startDate;                 //起始时间
                updateData.endDate = data.regionalNameRemarkObj.endDate;                     //终止时间
                updateData.regionName = data.regionalNameRemarkObj.regionName;               //区域名称
                updateData.medicalFee = data.regionalNameRemarkObj.medicalFee;               //医疗费备注
                updateData.followUpFee = data.regionalNameRemarkObj.followUpFee;             //后续治疗费备注
                updateData.foodSubsidy = data.regionalNameRemarkObj.foodSubsidy;             //住院伙食补助费备注 
                updateData.nutritionFee = data.regionalNameRemarkObj.nutritionFee;           //营养费备注
                updateData.lossOfWorking = data.regionalNameRemarkObj.lossOfWorking;         //误工费备注
                updateData.nursingFee = data.regionalNameRemarkObj.nursingFee;               //护理费备注
                updateData.disabilityFee = data.regionalNameRemarkObj.disabilityFee;         //残疾赔偿金备注
                updateData.disabilityAids = data.regionalNameRemarkObj.disabilityAids;       //残疾辅助器具费备注
                updateData.dependentsFee = data.regionalNameRemarkObj.dependentsFee;         //被抚养人生活费备注
                updateData.mentalDamage = data.regionalNameRemarkObj.mentalDamage;           //精神损害抚慰金备注
                updateData.deathFee = data.regionalNameRemarkObj.deathFee;                   //死亡赔偿金备注
                updateData.funeralExpenses = data.regionalNameRemarkObj.funeralExpenses;     //丧葬费备注
                updateData.accidentPersonnel = data.regionalNameRemarkObj.accidentPersonnel; //处理事故人员误工费备注
                updateData.trafficExpense = data.regionalNameRemarkObj.trafficExpense;       //交通费备注
                updateData.hotelExpense = data.regionalNameRemarkObj.hotelExpense;           //住宿费备注
                updateData.propertyLoss = data.regionalNameRemarkObj.propertyLoss;           //财产损失备注
                updateData.vehicleLoss = data.regionalNameRemarkObj.vehicleLoss;             //车辆损失备注
                updateData.trailerFee = data.regionalNameRemarkObj.trailerFee;               //拖车费备注
                updateData.rescueFee = data.regionalNameRemarkObj.rescueFee;                 //施救费备注
                updateData.parkingRate = data.regionalNameRemarkObj.parkingRate;             //停车费备注
                updateData.appraisalFee = data.regionalNameRemarkObj.appraisalFee;           //鉴定费备注
                updateData.otherExpenses = data.regionalNameRemarkObj.otherExpenses;         //其它费用备注
                updateData.delFlag = data.regionalNameRemarkObj.delFlag;                     //后台标记

            }else if(data.regionalNameRemarkObj && data.addFlag){
                //将数据添加到数组的开始位置
                $scope.dataList.unshift(data.regionalNameRemarkObj);
            }
            
        })
        
    };

    //分页按钮点击
    $scope.pageChanged = function () {
        $scope.dataInfo();
    };

    //搜索按钮点击
    $scope.handleSearchBtn = function () {
        $scope.regionalNameRemark.pageNo = 1;
        $scope.dataInfo();
    };

    //删除按钮点击
    $scope.handleDelete = function (data) {
        if(confirm('确认删除该项？')) {
           $scope.deleteQueryRegionalNameRemarkData(data).success(function(res) {
                if(res.code === $scope.commonConstant.SUCCESS) {
                    $scope.dataInfo();
                    $rootScope.toaster("success", "成功", '删除成功');
                } else {
                    $rootScope.toaster("error", "错误", res.message);
                }
            })
        }
    };
});

