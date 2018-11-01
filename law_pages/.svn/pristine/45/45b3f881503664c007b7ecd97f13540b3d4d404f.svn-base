angular.module('sbAdminApp').controller('HarmGradePopup', function($scope, $modalInstance, items, LoginService, LawConfig, toaster,$rootScope) {

    //service常量
    $scope.commonConstant = LawConfig.commonConstant;

    //定义伤残等级常量
    $scope.HARMGRADE = [
        {
            code: "01",
            name: "一级",
            value: "100%"
        },{
            code: "02",
            name: "二级",
            value: "90%"
        },{
            code: "03",
            name: "三级",
            value: "80%"
        },{
            code: "04",
            name: "四级",
            value: "70%"
        },{
            code: "05",
            name: "五级",
            value: "60%"
        },{
            code: "06",
            name: "六级",
            value: "50%"
        },{
            code: "07",
            name: "七级",
            value: "40%"
        },{
            code: "08",
            name: "八级",
            value: "30%"
        },{
            code: "09",
            name: "九级",
            value: "20%"
        },{
            code: "10",
            name: "十级",
            value: "10%"
        }
    ];

    //定义伤残等级表对象
    var HarmGradeObj = function () {
        this.modalTitle = "";   //模态框标题
        this.isUpdate = false;  //判断模态框是否是修改的标识
    };
    //实例化伤残等级表对象
    $scope.harmGradeObj = new HarmGradeObj();

    //定义伤残等级表表单对象
    var HarmGradeFormObj = function () {
        this.createUserId = LoginService.user.sysUser.id;
        this.updateUserId = LoginService.user.sysUser.id;
        this.categoryCode = "";    //所属分类编码
        this.gradeName = "";    //等级名称
        this.gradeCode = "";    //等级代码
        this.gradeValue = "";    //等级值
        this.compensationIndex = "";    //赔偿指数
        this.divisionBasis = "";    //划分依据
        this.disabilityCode = "";    //伤残代码
        this.disabilityDescr = "";   //伤残特征描述
    };
    //实例化伤残等级表表单对象
    $scope.harmGradeFormObj = new HarmGradeFormObj();

    //获取打开模态框时传来的对象
    $scope.myModalData = items;

    if(!$scope.myModalData.updateData){
        $scope.harmGradeObj.modalTitle = '新增伤残等级';
        $scope.harmGradeObj.isUpdate = false;
    } else {
        $scope.harmGradeFormObj = $scope.myModalData.updateData
        $scope.harmGradeObj.modalTitle = '修改伤残等级';
        $scope.harmGradeObj.isUpdate = true;
    }

    //保存模态框
    $scope.save = function () {
        //获取等级相关参数
        var grade = $scope.HARMGRADE[parseInt($scope.harmGradeFormObj.gradeCode) - 1];
        $scope.harmGradeFormObj.gradeName = grade.name;
        $scope.harmGradeFormObj.gradeCode = grade.code;
        $scope.harmGradeFormObj.gradeValue = grade.value;

        //判断是修改还是新增
        if($scope.harmGradeObj.isUpdate) {   //修改
            LoginService.updateMtDisabilityGradeInfo($scope.harmGradeFormObj).success(function (res) {
                if(res.code === $scope.commonConstant.SUCCESS) {
                    $rootScope.toaster("success", "成功", "修改成功");
                    //关闭弹出框并返回一个对象，提示页面重新获取列表数据
                    $modalInstance.close({
                        getList: true
                    });
                } else {
                    $rootScope.toaster("error", "错误", res.message);
                }
            })
        } else {
            LoginService.saveMtDisabilityGradeInfo($scope.harmGradeFormObj).success(function (res) {
                if(res.code === $scope.commonConstant.SUCCESS) {
                    $rootScope.toaster("success", "成功", "新增成功");
                    //关闭弹出框并返回一个对象，提示页面重新获取列表数据
                    $modalInstance.close({
                        getList: true
                    });
                } else {
                    $rootScope.toaster("error", "错误", res.message);
                }
            });
        }
    };

    //选择等级名称时，自动带出伤残系数
    $scope.chooseGrade = function () {
        $scope.harmGradeFormObj.compensationIndex = $scope.HARMGRADE[parseInt($scope.harmGradeFormObj.gradeCode) - 1].value
    };

    //关闭模态框
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});

