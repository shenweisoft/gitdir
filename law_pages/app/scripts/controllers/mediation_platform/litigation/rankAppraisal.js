angular.module('sbAdminApp').controller('rankAppraisalCtrl', function($scope, $stateParams, $state, toaster, LoginService, LawConfig, $location, $rootScope) {

    //service常量
    $scope.commonConstant = LawConfig.commonConstant;

    //接收父级传来的数据并拼接成对象
    function getparam(){
        //获取url
        var url = window.location.href;
        if(url.indexOf('&') !== -1) {
            var value = url.substr(url.indexOf('?')+1).split('&');
            var obj = {};
            for(var i = 0; i < value.length; i++) {
                var arr = value[i].split('=');
                obj[arr[0]] = arr[1];
            }
            return(obj);
        } else {
            return undefined;
        }
    }
    $scope.lawCase = getparam();




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

    //定义分页数据对象
    var PageObj = function () {
        this.pageNo = 1;
        this.totalPage = 0;
    };
    //实例化分页对象
    $scope.pageObj = new PageObj();

    //定义伤残等级表对象
    $scope.harmObj = {
        dataList: [],    //存储所有鉴定类型
        typeList: '',       //伤残类型列表
        bodyList: '',       //伤残部位列表
        bodyNameList : false,
        categoryName : '',
    };

    //定义查询对象构造函数
    var HarmSearchFun = function () {
        this.categoryCode = "05"; //所选的伤残类型编码，默认选中2017版本
        this.gradeName = "";  //伤残等级名称
        this.disabilityDescr = "";  //伤残描述
    };
    //实例化查询对象
    $scope.harmSearchObj = new HarmSearchFun();

    //存储被选择的项目
    $scope.chooseHarmArr = [];

    //请求后台，获取伤残类型
    LoginService.selectCategoryDisabilityInfo({}).success(function (res) {
        if(res.code === $scope.commonConstant.SUCCESS) {
            $scope.harmObj.typeList = res.result;
        } else {
            $rootScope.toaster("error", "错误", res.message);
        }
    });

    //请求后台，获取伤残部位信息
    LoginService.selectBodyCategoryService({}).success(function (res) {
        if(res.code === $scope.commonConstant.SUCCESS) {
            $scope.harmObj.bodyList = res.result;
        } else {
            $rootScope.toaster("error", "错误", res.message);
        }
    });

    //请求后台，获取数据列表
    $scope.ajaxData = {};  //表示传给后台的参数对象
    $scope.dataInit = function (getChooseArr) {   //getChooseArr  代表是否查询已选择数据
        $scope.ajaxData.pageNo = $scope.pageObj.pageNo;
        //获取数据函数
        var getData = function () {
            //获取当前页列表数据
            LoginService.queryMtDisabilityGradeDetailInfo($scope.ajaxData).success(function (res) {
                if(res.code === $scope.commonConstant.SUCCESS) {
                    $scope.harmObj.dataList = res.result;
                    console.log(res)
                    //用当前显示的列表与已选择的数据列表对比，将相同项的按钮设置成不可点击状态
                    if($scope.chooseHarmArr && $scope.chooseHarmArr.length !== 0) {
                        _.each($scope.chooseHarmArr, function (item) {
                            _.each($scope.harmObj.dataList, function (data) {
                                if(item.descrId == data.descrId) {
                                    data.isDisabled = true;
                                }
                            })
                        });
                    }
                } else {
                    $rootScope.toaster("error", "错误", res.message);
                }
            });

            //获取全部分页
            LoginService.queryMtDisabilityGradeTotalInfo($scope.ajaxData).success(function(res) {
                if(res.code === $scope.commonConstant.SUCCESS) {
                    $scope.pageObj.totalPage = res.result;
                } else {
                    $rootScope.toaster("error", "错误", res.message);
                }
            });
        };

        //删除和赔偿试算（无案件）时，不请求此项
        if(getChooseArr && ($scope.lawCase.serialNo != 'undefined')) {
            //根据当前接口，获取用户之前选中的项
            LoginService.queryCheckedMtDisabilityGradeInfo({adjustId: $scope.lawCase.id, flag: $scope.lawCase.flag}).success(function (res) {
                if(res.code === $scope.commonConstant.SUCCESS) {
                    console.log(res)
                    if(res.result && res.result.length > 0) {
                        $scope.chooseHarmArr = res.result.sort();
                    } else {
                        $scope.chooseHarmArr = [];
                    }
                    getData();  //调用获取数据函数
                } else {
                    $rootScope.toaster("error", "错误", res.message);
                }
            });
        } else if(getChooseArr && $scope.lawCase.serialNo == 'undefined') {
            //无案件id时（赔偿试算），获取本地数据
            $scope.chooseHarmArr = JSON.parse(localStorage.getItem('rank_appraisal')) || [];
            getData();
        } else {
            //调用获取数据函数
            getData();
        }
    };
    //页面初始化时，请求之前已选择的数据
    $scope.dataInit(true);

    //点击查询
    $scope.handleSearch = function () {
        //将查询对象赋给ajaxData，拷贝是为了避免在有查询条件时，没有点击查询按钮而对象中有值的问题

        if(!$scope.harmObj.categoryName){ //如果伤残部位为空，清空对象内这两字段。
            $scope.harmObj.categoryName = "";
            $scope.harmSearchObj.bobyCategoryCode = "";
        }

        $scope.ajaxData = angular.copy($scope.harmSearchObj);
        $scope.pageObj.pageNo = 1;      //将当前页设置成1
        $scope.dataInit();
    };

    //点击分页
    $scope.pageChanged = function () {
        $scope.dataInit();
    };

    //从伤残列表中选择某项
    $scope.addHarmData = function (data) {
        //将当前项按钮设置为不可点击状态
        event.target.disabled = true;

        //将被选择的数据添加到被选择数据数组中
        $scope.chooseHarmArr.push(data);
        console.log($scope.chooseHarmArr)
    };

    //从已选项目中删除某项
    $scope.handleDelete = function (data) {
        for(var i = 0; i < $scope.chooseHarmArr.length; i++) {
            if(data.descrId === $scope.chooseHarmArr[i].descrId) {
                $scope.chooseHarmArr.splice(i, 1);
                //此时，不重新请求已选数据列表
                $scope.dataInit();
                return;
            }
        }
    };

    //保存选择的数据，并将结果传给父页面
    $scope.handleSave = function () {
        //如果不存在选中项时
        /*if($scope.chooseHarmArr.length === 0) {
            //调用父元素方法，将计算结果返回
            window.opener.saveRankAppraisal(0);
            $rootScope.toaster("success", "成功", "保存成功");
            return;
        }*/

        //通过所选的项，计算总的伤残系数
        var harmCount = 0;  //存储最后的伤残系数
        var harmNumArr = [];  //存储每次的伤残系数
        _.each($scope.chooseHarmArr, function(item) {
            var currNum = 0;   //存储本次伤残系数
            //当存在伤残系数时，取伤残系数
            if(item.disabilityScale) {
                currNum = item.disabilityScale;
            } else {
                //如果没有伤残系数时，根据伤残等级计算
                var currData = _.find($scope.HARMGRADE, function(obj) {
                    return obj.name === item.gradeName
                });
                currNum = currData.value;
            }
            harmNumArr.push(parseInt(currNum));
        });
        harmNumArr = harmNumArr.sort(function(a, b) {return b - a;});
        //获取伤残系数十位数

        if(harmNumArr.length !== 0) {
            var harmCount1;
            console.log(harmNumArr)
            if(harmNumArr[0] >= 100) {
                harmCount = harmCount1 = 100;
            } else {
                harmCount1 = harmNumArr[0].toString().substr(0, 1);
            }
            if(harmCount1 < 100) {
                //获取伤残系数个位数
                var harmCount2 = 0;
                harmNumArr.shift();
                _.each(harmNumArr, function(item) {
                    item = item.toString().substr(0, 1);
                    harmCount2 += parseInt(item);
                });
                if(harmCount2 >= 10) {
                    harmCount2 = 9;
                }
                harmCount = parseInt(harmCount1+harmCount2);
            }
        }

        //获取伤残标准id
        $scope.getDescrId = function () {
          var descrIdArr = [];
          _.each($scope.chooseHarmArr, function (item) {
            descrIdArr.push(item.descrId);
          });
          return descrIdArr;
        };

        //请求后台，将本次选择的数据保存到数据库（不是法官赔偿计算时）
        if($scope.lawCase.serialNo != 'undefined') {
            //判断当前步骤状态
            if($scope.lawCase.flag == 0) {
                $scope.saveSelectedData = LoginService.updateAdjustdisabilityGradeIdInfo;
            } else if($scope.lawCase.flag == 1) {
                $scope.saveSelectedData = LoginService.updateLawdisabilityGradeIdInfo;
            } else {
                $scope.saveSelectedData = LoginService.updateSecondInstanceDisabilityGradeIdInfo;  //许昌二审主表保存接口
            }
            $scope.saveSelectedData({id: $scope.lawCase.id, disabilityGradeId: $scope.getDescrId().join(',')}).success(function (res) {
                if(res.code === $scope.commonConstant.SUCCESS) {
                    $rootScope.toaster("success", "成功", "保存成功");
                    //调用父元素方法，将计算结果返回
                    window.opener.saveRankAppraisal(harmCount, $scope.getDescrId());
                } else {
                    $rootScope.toaster("error", "错误", res.message);
                }
            });
        } else {
            //赔偿试算
            localStorage.setItem('rank_appraisal', JSON.stringify($scope.chooseHarmArr));
            //调用父元素方法，将计算结果返回
            window.opener.saveRankAppraisal(harmCount);
            $rootScope.toaster("success", "成功", "保存成功");
        }
    };

    //关闭伤残等级鉴定窗口
    $scope.handleClose = function () {
        if(confirm("您确定要关闭本页吗？")){
            window.opener = null;
            window.open('', '_self');
            window.close();
        }
    };

    //执行搜索，显示2017版本数据
    $scope.handleSearch();


    //区域名称搜索
    $scope.bodyNameSearch = function () {
        console.log($scope.harmObj.categoryName)
        //获取区域热搜索文字
        $scope.categoryNameSearch = $scope.harmObj.categoryName;

        if($scope.categoryNameSearch){
            /*//如果不是回车或无搜索文字时，终止函数
            if(event.keyCode !== 13 || !$scope.categoryNameSearch) {
                return
            }*/

            $scope.searchBodyList = _.filter($scope.harmObj.bodyList, function(item) {
                if(item.categoryName.indexOf($scope.categoryNameSearch) !== -1) {
                    return item
                }
            });
            console.log($scope.searchBodyList)
            //当无数据时显示不存在文字
            if($scope.searchBodyList.length == 0) {
                $scope.searchCategoryNameNull = true;
            } else {
                $scope.searchCategoryNameNull = false;
            }
            //显示区域名称热搜索菜单
            $scope.harmObj.bodyNameList = true;
        }else{
            //隐藏区域名称热搜索菜单
            $scope.harmObj.bodyNameList = false;
        }
    };


    //区域名称热搜索菜单文字点击
    $scope.selectCategoryName = function (data) {
        console.log(data)
        //为表达对象赋值
        $scope.harmObj.categoryName = data.categoryName;
        $scope.harmSearchObj.bobyCategoryCode = data.categoryCode;

        //隐藏区域名称热搜索菜单
        $scope.harmObj.bodyNameList = false;
    };
});