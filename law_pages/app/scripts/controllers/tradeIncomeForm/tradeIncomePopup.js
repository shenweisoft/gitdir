angular.module('sbAdminApp').controller('TradeIncomePopup', function($scope, $modalInstance, items, LoginService, LawConfig, toaster) {
    //service常量
    $scope.commonConstant = LawConfig.commonConstant;

    //定义错误信息常量
    $scope.CONSTANT = {
        "nameErrorMessage": "请输入区域名称",
        "startDateErrorMessage": "请输入起始时间",
        "endDateErrorMessage": "请输入终止时间",
        "industryTypeNameErrorMessage": "请输入行业类别",
        "industryNameErrorMessage": "请输入具体行业名称",
        "yearIncomeErrorMessage": "请输入平均年收入",
        "avgIncomeErrorMessage": "请输入平均月收入"
    };

    //定义行业类别对象
    $scope.industryType = {
        tradeTitle: '新建伤残等级',   //模态框标题
        isUpdateModal: false,   //判断当前模态框是否是修改的标识
        industryTypeList: false,    //行业类别热搜索菜单显隐设置
        searchList: [],     //行业类别热搜索菜单数据
        searchText: "",      //行业类别热搜索文字
        searchNull: false,      //行业类别热搜索不到满足项时显示
        regionNameList: false,    //区域名称热搜索菜单显隐设置
        regionSearchList: [],   //区域热搜索菜单数据
        regionSearchText: "",   //区域热搜索文字
        searchRegionNull: false,    //区域热搜索不到满足项时显示
        calendarIsOpenStartDate: false,      //开始日期框显隐标识
        calendarIsOpenEndDate: false         //结束日期框显隐标识
    };

    //定义行业收入表表单对象
    function TradeIncomeFormObj() {
        this.createUserId = LoginService.user.sysUser.id;   //获取登录人id
        this.updateUserId = LoginService.user.sysUser.id;   //获取登录人id
        this.regionId = "";      //区域id
        this.regionCode = "";    //区域编码
        this.regionFullName = "";   //区域详细名称
        this.regionName = "";    //行业名称
        this.startDate = "";     //起始时间
        this.endDate = "";       //终止时间
        this.industryTypeCode = "";     //行业类别代码
        this.industryTypeName = "";     //行业类别名称
        this.industryName = "";     //具体行业名称
        this.yearIncome = "";    //年均收入
        this.avgIncome = "";     //月均收入
        this.remark = "";       //备注
    }

    //判断是否有传入的对象 有：修改  无：新增 -》 实例化行业收入表对象
    if(!items.tradeIncomeFormObj) {
        $scope.tradeIncomeFormObj = new TradeIncomeFormObj();
        //将模态框标题设置为新增
        $scope.industryType.tradeTitle = '新建行业收入';
        $scope.industryType.isUpdateModal = false;
    } else {
        $scope.tradeIncomeFormObj = items.tradeIncomeFormObj;
        //将模态框标题设置为修改
        $scope.industryType.tradeTitle = '修改行业收入';
        $scope.industryType.isUpdateModal = true;
    }

    //填充传递过来的后台数据
    $scope.serverObj = items.serverObj;

    //区域名称搜索
    $scope.regionNameSearch = function () {
        //获取区域热搜索文字
        $scope.industryType.regionSearchText = $scope.tradeIncomeFormObj.regionName;

        //如果不是回车或无搜索文字时，终止函数
        if(event.keyCode !== 13 || !$scope.industryType.regionSearchText) {
            return
        }

        $scope.industryType.regionSearchList = _.filter($scope.serverObj.regionNameList, function(item) {
            if(item.regionFullName.indexOf($scope.tradeIncomeFormObj.regionName) !== -1) {
                return item
            }
        });
        //当无数据时显示不存在文字
        if($scope.industryType.regionSearchList.length === 0) {
            $scope.industryType.searchRegionNull = true;
        } else {
            $scope.industryType.searchRegionNull = false;
        }
        //显示区域名称热搜索菜单
        $scope.industryType.regionNameList = true;
    };

    //区域名称热搜索菜单文字点击
    $scope.selectRegionName = function (data) {
        $scope.tradeIncomeFormObj.regionName = data.regionFullName;

        //为表达对象赋值
        $scope.tradeIncomeFormObj.regionCode = data.regionCode;
        $scope.tradeIncomeFormObj.regionId = data.id;
        $scope.tradeIncomeFormObj.regionFullName = data.regionFullName;

        //隐藏区域名称热搜索菜单
        $scope.industryType.regionNameList = false;
    };

    //行业类别下拉框
    $scope.getIndustryType = function() {
        $scope.industryType.searchText = $scope.tradeIncomeFormObj.industryTypeName;    //获取搜索文字
        //当存在搜索文字时，启动热搜索
        if($scope.industryType.searchText) {
            //根据搜索文字查询数据，将符合的存入数组
            $scope.industryType.searchList = _.filter($scope.serverObj.industryType, function(obj) {
                if(obj.dictName.indexOf($scope.industryType.searchText) !== -1) {
                    return obj;
                }
            })
        } else {
            //否则显示全部数据
            $scope.industryType.searchList = angular.copy($scope.serverObj.industryType);
        }
        //当无数据时显示不存在文字
        if($scope.industryType.searchList.length === 0) {
            $scope.industryType.searchNull = true;
        } else {
            $scope.industryType.searchNull = false;
        }
    };
    $scope.getIndustryType();

    //热搜索下拉框文字点击
    $scope.selectTradeName = function (data) {
        $scope.tradeIncomeFormObj.industryTypeName = data.dictName;
        //为表达对象赋值
        $scope.tradeIncomeFormObj.industryTypeCode = data.dictCode;
    };

    //定义验证输入信息函数
    var validateForm = function () {
        //验证区域名称
        $scope.nameErrorMessage="";
        if(!$scope.tradeIncomeFormObj.regionName){
            $("[name='region_code']").focus();
            $scope.nameErrorMessage = $scope.CONSTANT.nameErrorMessage;
            return false;
        }
        //验证起始时间
        $scope.startDateErrorMessage="";
        if(!$scope.tradeIncomeFormObj.startDate){
            $("[name='start_date']").focus();
            $scope.startDateErrorMessage = $scope.CONSTANT.startDateErrorMessage;
            return false;
        }
        //验证终止时间
        $scope.endDateErrorMessage="";
        if(!$scope.tradeIncomeFormObj.endDate){
            $("[name='start_date']").focus();
            $scope.endDateErrorMessage = $scope.CONSTANT.endDateErrorMessage;
            return false;
        }
        //验证行业类别
        $scope.industryTypeNameErrorMessage="";
        if(!$scope.tradeIncomeFormObj.industryTypeName){
            $("[name='industry_type_name']").focus();
            $scope.showSearchList();
            $scope.industryTypeNameErrorMessage = $scope.CONSTANT.industryTypeNameErrorMessage;
            return false;
        }
        /*//验证具体行业名称
        $scope.industryNameErrorMessage="";
        if(!$scope.tradeIncomeFormObj.industryName){
            $("[name='industry_name']").focus();
            $scope.industryNameErrorMessage = $scope.CONSTANT.industryNameErrorMessage;
            return false;
        }*/
        //验证年均收入
        $scope.yearIncomeErrorMessage="";
        if(!$scope.tradeIncomeFormObj.yearIncome){
            $("[name='year_income']").focus();
            $scope.yearIncomeErrorMessage = $scope.CONSTANT.yearIncomeErrorMessage;
            return false;
        }
        //验证月均收入
        $scope.avgIncomeErrorMessage="";
        if(!$scope.tradeIncomeFormObj.avgIncome){
            $("[name='avg_income']").focus();
            $scope.avgIncomeErrorMessage = $scope.CONSTANT.avgIncomeErrorMessage;
            return false;
        }
        return true;
    };

    //行业类别搜索列表显示
    $scope.showSearchList = function () {
        $scope.industryType.industryTypeList = true;
        $scope.getIndustryType();
    };
    //行业类别搜索列表隐藏
    $scope.hideSearchList = function () {
        setTimeout(function() {
            $scope.industryType.industryTypeList = false;
        }, 10)
    };

    //选择起始日期
    $scope.openStartDate = function($event, tradeIncomeFormObj) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.industryType.calendarIsOpenStartDate = true;
    };
    //选择终止日期
    $scope.openEndDate = function($event, tradeIncomeFormObj) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.industryType.calendarIsOpenEndDate = true;
    };

    //处理起始，终止日期 格式为：yyyy-mm-dd hh:mm:ss 用于传给后台
    function startDateAndEndDate(times){
        var date = new Date(times);
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.date = date.getDate();
        return this.year +"-"+this.month + "-" + this.date + " 00:00:00";
    }

    //保存模态框
    $scope.save = function () {
        if(validateForm()) {
            //格式化日期
            $scope.tradeIncomeFormObj.startDate = startDateAndEndDate($scope.tradeIncomeFormObj.startDate);
            $scope.tradeIncomeFormObj.endDate = startDateAndEndDate($scope.tradeIncomeFormObj.endDate);

            //格式化数据
            var data = angular.copy($scope.tradeIncomeFormObj);
            data.industryName = data.industryTypeName;  //将行业名称与具体行业名称附上相同值
            delete data.regionFullName;

            //区分新增与修改
            if($scope.industryType.isUpdateModal) {  //修改
                LoginService.updateJyIndustryDataInfo(data).success(function(res) {
                    if(res.code === $scope.commonConstant.SUCCESS) {
                        toaster.pop("success", "成功", "修改成功");
                        //关闭弹出框并返回一个对象，提示页面重新获取列表数据
                        $modalInstance.close({
                            getList: true
                        });
                    } else {
                        toaster.pop("error", "错误", "修改失败");
                    }
                });
            } else {
                //微数据添加新增标识（后台需要）
                data.delFlag = 0;
                /*data.avgIncome = parseInt(data.avgIncome);
                data.yearIncome = parseInt(data.yearIncome);*/

                console.log(data);
                //提交数据到后台
                LoginService.insertIndustryIncomeNorm(data).success(function(res) {
                    if(res.code === -1) {
                        toaster.pop("error", "错误", "已存在相同项");
                        return
                    }
                    if(res.code === $scope.commonConstant.SUCCESS) {
                        toaster.pop("success", "成功", "新增成功");
                        //关闭弹出框并返回一个对象，提示页面重新获取列表数据
                        $modalInstance.close({
                            getList: true
                        });
                    } else {
                        toaster.pop("error", "错误", "新增失败");
                    }
                });
            }

        }
    };

    //关闭模态框
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});

