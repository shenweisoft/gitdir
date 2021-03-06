//人员的信息Controller
app.controller('NewPersonCtrl', function ($scope, $log, $state, $modal, $timeout, LoginConfig, LoginService, items, $modalInstance, DictionaryConfig, IdentityService, AdminConstant) {
    //人员信息保存
    $scope.insertUser = LoginService.insertUser;
    $scope.editPerson = LoginService.editPerson;

    $scope.delOrgFlag = items.delOrgFlag;
    //初始化擅长领域
    $scope.person = {
        goodDomain: ""
    }
    //验证用户是否存在Service
    $scope.checkLoginAccountService = LoginService.checkLoginAccount;
    //身份证验证
    $scope.identityCode = IdentityService.identityCodeValid;
    //APP.js常量
    $scope.loginErrorCode = LoginConfig.loginConStant.loginErrorCode;
    $scope.items = items;
    $scope.originalData = items.originalData;

    if (items.person) {
        $scope.regionName = items.person.regionName;
        $scope.regionId = items.person.regionId;
    } else {
        var orgNewId = ($scope.items.selectedNode.id).split('.')[0];
        var orgNew = _.find($scope.originalData, {id: orgNewId});
        $scope.regionName = orgNew.extPro.regionName;
        $scope.regionId = orgNew.extPro.regionId;
    }

    $scope.selectedNode = items.selectedNode;
    $scope.title = "新建人员";
    $scope.certTypeConstant = DictionaryConfig.certTypeConstant;
    $scope.roleTypeData = items.roleTypeData;

    $scope.CONSTANT = {
        messageNameError: "姓名不能为空",
        loginAccountError: "账号不能为空",
        loginAccountExitError: "您输入的账号已经存在",
        mobileError: "您输入的手机号有误",
        certificateNumberError: "身份证号不正确",
        messageRoleError: "请选择角色",
        messageIsManagerError: "请选择是否为管理者",
        postTypeError: "请您选择岗位",
        personTypeError:"请选择调解员类型"
    };
    //填充区域信息
    $scope.adminRegion = AdminConstant.administrationRegions;
    //默认不显示树
    $scope.isShowTree = false;
    //区域树配置
    $scope.treeConfig = {
        core: {
            multiple: false,
            animation: true,
            error: function (error) {
                $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
            },
            check_callback: true,
            worker: true
        },
        types: {
            'default': {
                icon: 'iconfont icon-dizhi'
            },
            folder: {
                icon: 'iconfont icon-wenjian1'
            }
        },
        version: 1,
        plugins: ['types']
    };
    // 选择所属区域
    $scope.selectAdmin = function (node, selected, event) {
        var selectedNodes = selected.selected;
        if (selectedNodes.length > 0) {
            var selectedRegion = $scope.adminRegion[selectedNodes[0]];
            $scope.regionName = selectedRegion.fullName;
            $scope.regionId = selectedRegion.id;
            $scope.isShowTree = false;
        }
    };
    $scope.blurAdmin = function () {
        if ($scope.isShowTree) {
            $timeout(function () {
                $scope.isShowTree = false;
            }, 200);
        }
    };


    var orgId = $scope.items.selectedNode.id.substr(0, $scope.items.selectedNode.id.indexOf('.'));
    var category = _.find($scope.items.originalOrgList, {
        id: orgId
    })
    category = category && category.category;
    $scope.showGoodDomain = category
    //组织类型 #01表示法院
    $scope.orgType = category;
    //取得岗位类型
    $scope.postTypeList = DictionaryConfig.postTypeList;
    //鉴定机构岗位类型
    if ($scope.orgType == "#03") {
        $scope.postTypeList = DictionaryConfig.appraisalPostTypeList;
    }

    //调解员类型
    if ($scope.orgType == "#02") {
        $scope.adjustPersonTypeList = DictionaryConfig.adjustPersonTypeList;
    }

    //角色显示默认为true，修改不显示
    $scope.roleShow = true;
    if ($scope.items.person) {
        $scope.title = "修改人员";
        var person = $scope.items.person
        $scope.id = person.id;
        $scope.text = person.text;
        $scope.loginAccount = person.loginAccount;
        $scope.mobile = person.mobile;
        $scope.person.goodDomain = person.goodDomain;
        $scope.person.insuranceCompany = person.insuranceCompany;
        $scope.isLock = person.isLock;
        console.log($scope.goodDomain)
        //初始化证件类型
        $scope.certificateType = _.find($scope.certTypeConstant, {
            id: person.certificateType
        });

        //初始化岗位
        $scope.postType = _.find($scope.postTypeList, {
            id: person.postType
        });

        //调解员类型
        if ($scope.orgType == "#02") {
            //初始化调解员类型
            $scope.personType = _.find($scope.adjustPersonTypeList, {
                id: person.personType
            });
        }

        $scope.certificateNumber = person.certificateNumber;
        $scope.roleid = _.find($scope.roleTypeData, {
            id: person.roleid
        });
        $scope.isSelf = person.isSelf;
        $scope.roleShow = false;
    } else {
        $scope.certificateType = $scope.certTypeConstant[0];
        $scope.isSelf = "0";
        $scope.isLock = "0";
        //调解员类型
        if ($scope.orgType == "#02") {
            $scope.personType = $scope.adjustPersonTypeList[0];
        }
    }


    $scope.roleTypeFilteredData = $scope.roleTypeData.filter(function (v) {
        return v.parentId == category;
    });

    //光标移除触发的时间
    $scope.validateLoginAccount = function (flag) {
        //如果账户存在
        $scope.loginAccountError = "";
        if ($scope.loginAccount) {
            //如果用户ID为空的情况下验证
            if (!$scope.id) {
                $scope.checkLoginAccountService({
                    "loginAccount": $scope.loginAccount
                }).success(function (result) {
                    if (result.code == $scope.loginErrorCode.LOGIN_EXIST) {
                        $scope.loginAccountError = $scope.CONSTANT.loginAccountExitError;
                        $scope.formFlag = false;
                    } else if (result.code == LoginConfig.commonConStant.SUCCESS) {
                        //表示点击保存的时候验证
                        if (flag) {
                            validateOtherForm();
                        }
                    } else {
                        //TODO
                        alert("请联系系统管理员");
                    }
                })
            } else {
                validateOtherForm();
            }
        } else {
            $scope.loginAccountError = $scope.CONSTANT.loginAccountError;
        }
    }

    //验证手机号/身份证/角色
    function validateOtherForm() {

        //验证手机号
        if ($scope.mobile && $scope.formFlag) {
            var phoneValidate = /^1(3|4|5|7|8)\d{9}$/;
            if (!phoneValidate.test($scope.mobile)) {
                $scope.mobileError = $scope.CONSTANT.mobileError;
                $scope.formFlag = false;
            }
        }
        //如果为身份证进行验证
        if ($scope.certificateType.id == '0' && $scope.certificateNumber && $scope.formFlag) {
            if (!$scope.identityCode($scope.certificateNumber)) {
                $scope.certificateNumberError = $scope.CONSTANT.certificateNumberError;
                $scope.formFlag = false;
            }
        }
        //验证角色
        if (!$scope.roleid && $scope.formFlag) {
            $scope.messageRoleError = $scope.CONSTANT.messageRoleError;
            $scope.formFlag = false;
        }

        //验证岗位(表示法院的时候才验证)
        if (!$scope.postType && ($scope.orgType == "#01" || $scope.orgType == "#03") && $scope.formFlag) {
            $scope.postTypeError = $scope.CONSTANT.postTypeError;
            $scope.formFlag = false;
        }

        if(!$scope.personType && $scope.orgType == "#02"){
            $scope.personTypeError = $scope.CONSTANT.personTypeError;
            $scope.formFlag = false;
        }

        //验证表单是否成立 如果成立则保存信息
        if ($scope.formFlag) {
            $scope.savePerson();
        }

    }

    //验证人员姓名/登录名
    $scope.validateForm = function () {
        //默认formFlag为true
        $scope.formFlag = true;
        $scope.messageNameError = "";
        $scope.loginAccountError = "";
        $scope.mobileError = "";
        $scope.certificateNumberError = "";
        $scope.messageRoleError = "";
        $scope.postTypeError = "";
        $scope.personTypeError = "";
        //验证姓名
        if (!$scope.text) {
            $scope.messageNameError = $scope.CONSTANT.messageNameError;
            $scope.formFlag = false;
        }
        //如果成功验证登录名
        if ($scope.formFlag) {
            $scope.validateLoginAccount(true);
        }
    }

    //保存人员信息
    $scope.savePerson = function () {
        var id = null;
        var dept = null;
        if ($scope.id) {
            id = $scope.id.substr($scope.id.lastIndexOf('.') + 1);
            dept = $scope.id.substr(0, $scope.id.lastIndexOf('.'));
        } else {
            dept = $scope.items.selectedNode.id
        }
        //如果为法官默认用户类型为法官
        if (category == "#01") {//法院
            $scope.userType = "1";
        } else if (category == "#02") {//调解中心用户
            $scope.userType = "2";
        } else if (category == "#03") {//鉴定机构
            $scope.userType = "3";
        } else if (category == "#04") {//保险公司
            $scope.userType = "4";
        } else if (category =="#05"){ //公安交警
            $scope.userType = "5"
        }else if (category =="#06"){//医院
            $scope.userType ="6"
        }else if(category =="#07"){//工伤医保
            $scope.userType = "7"
        }
        var person = {
            id: id,
            text: $scope.text,
            loginAccount: $scope.loginAccount,
            mobile: $scope.mobile,
            certificateType: $scope.certificateType.id,
            certificateNumber: $scope.certificateNumber,
            userType: $scope.userType,
            roleid: $scope.roleid.id,
            isSelf: $scope.isSelf,
            deptId: dept,
            postType: $scope.postType ? $scope.postType.id : "",
            regionName: $scope.regionName,
            regionId: $scope.regionId,
            goodDomain: $scope.person.goodDomain,
            insuranceCompany: $scope.person.insuranceCompany,
            isLock: $scope.isLock,
            //调解员类型
            personType: $scope.orgType == "#02" ? $scope.personType.id : ""
        };
        if ($scope.id) {
            $scope.editPerson(person).success(function (result) {
                if (result.code == LoginConfig.commonConStant.SUCCESS) {
                    $modalInstance.close();
                } else {
                    //TODO
                    alert("请联系系统管理员");
                }
            });
        } else {
            $scope.insertUser(person).success(function (result) {
                $log.info(result);
                if (result.code == LoginConfig.commonConStant.SUCCESS) {
                    $modalInstance.close();
                } else {
                    //TODO
                    alert("请联系系统管理员");
                }
            });
        }
    };
    //点击取消
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
})
