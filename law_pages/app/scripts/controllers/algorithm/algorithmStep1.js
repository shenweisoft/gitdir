angular.module('sbAdminApp').controller('AlgorithmStep1Ctrl', function ($scope, $stateParams, $state, $http, $log, AlgorithmConfig, AlgorithmService, DictionaryConfig, toaster, Upload,$filter,$rootScope) {

    $scope.headInfo.step = 1;
    //身份类型
    $scope.idTypeList = DictionaryConfig.idTypeConstant;
    //证件类型
    $scope.certificatesTypeList = DictionaryConfig.certificateTypeConstant;
    //人员角色
    $scope.rolelist=DictionaryConfig.personRoleConstant;
    //组织类型
    $scope.orgTypeList = DictionaryConfig.orgTypeList;
    //保险公司
    $scope.insuranceList = DictionaryConfig.insuranceList;
    //法人类型
    $scope.legalTypeArray = DictionaryConfig.legalTypeList;
    //删除申请人信息service
    $scope.deleteJyAlgorithmApplyerInfoService = AlgorithmService.deleteJyAlgorithmApplyerInfo;
    //身份证号解析
    $scope.idCardAnalysisService = AlgorithmService.idCardAnalysis;

    //删除申请人信息
    $scope.removeAlgorithmApplyerInfo = function (algorithmApplyerInfo){
        if(confirm('您确认删除吗？')) {
            //当数据库中存在数据时，调用后台
            if(algorithmApplyerInfo.id) {
                $scope.deleteJyAlgorithmApplyerInfoService ({
                    id: algorithmApplyerInfo.id
                }).success(function (res) {
                    if (res.code === AlgorithmConfig.commonConstant.SUCCESS) {
                        var index = _.findIndex($scope.algorithmInfo.jyAlgorithmApplyerInfoVOList,{id:algorithmApplyerInfo.id});
                        //从数组中删除该项
                        $scope.algorithmInfo.jyAlgorithmApplyerInfoVOList.splice(index, 1);
                    } else {
                        $rootScope.toaster("error", "错误", res.message);
                    }
                });
            } else {
                //获取所删除的对象在数组中的索引值
                var index = $scope.algorithmInfo.jyAlgorithmApplyerInfoVOList.indexOf(algorithmApplyerInfo);
                //从数组中删除该项
                $scope.algorithmInfo.jyAlgorithmApplyerInfoVOList.splice(index, 1);
            }
        }
    }

    //最小日期
    $scope.minDate = new Date();
    //出生日期查询点击方法
    $scope.openCalendar = function($event, algorithmApplyerInfo) {
        $event.preventDefault();
        $event.stopPropagation();
        algorithmApplyerInfo.calendarIsOpen = true;
    };

    //限制图片大小
    function imageSize(file) {
        if(file){
            if(parseInt(file.size/(1024*1024))>= 10 ){
                $rootScope.toaster(level.warn, title.warn,"请上传小于10M大小的图片");
            }
        }
    }

    $scope.imageAddress = AlgorithmConfig.algorithmConstant.smallPictureUrl;
    //上传图片
    $scope.uploadImage = function(file, algorithmApplyerInfo, type){
        //验证图片大小
        imageSize(file);
        if(!file){
            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messagePictureTypeError);
            return;
        }
        Upload.upload({
            url: AlgorithmConfig.algorithmConstant.uploadImageUrl,
            data: {
                type: 'algorithmApplyerInfo'
            },
            file: file
        }).success(function(resp) {
            switch (type.trim()) {
                case 'face': algorithmApplyerInfo.idFacePicture = $scope.imageAddress + resp.result; break;
                case 'back': algorithmApplyerInfo.idBackPicture = $scope.imageAddress + resp.result; break;
            }
            if (type == 'face') { //身份证正面照，解析
                $scope.idCardAnalysisService({
                    "path": resp.result,
                    "type": "algorithmApplyerInfo"
                }).success(function(res) {
                    if (res.code == AlgorithmConfig.commonConstant.SUCCESS) {
                        algorithmApplyerInfo.personName = res.result.name;
                        algorithmApplyerInfo.idNo = res.result.code;
                        algorithmApplyerInfo.sex = res.result.sex == '男' ? 0 : 1;
                        algorithmApplyerInfo.birthday = res.result.birthday;
                    }
                })
            }
        });
    }

    //删除照片
    $scope.removeAlgorithmApplyerInfoImage = function(algorithmApplyerInfo,type){
        if(type == 'face'){
            algorithmApplyerInfo.idFacePicture = $scope.headInfo.defaultImg2;
        }else{
            algorithmApplyerInfo.idFacePicture = $scope.headInfo.defaultImg3;
        }
    }

    //选择系统保险公司
    $scope.insuranceShow = false;
    $scope.insuranceFocus = function() {
        if (!$scope.insuranceShow) $scope.insuranceShow = true;
    };
    $scope.blurInsurance = function(){
        if($scope.insuranceShow){
            $timeout(function(){
                $scope.insuranceShow = false;
            }, 200);
        }
    };
    //保险公司单击事件
    $scope.selectItems = function(algorithmApplyerInfo, insurance) {
        algorithmApplyerInfo.headCompanyName = insurance.text;
        $scope.insuranceShow = false;
    };
});;