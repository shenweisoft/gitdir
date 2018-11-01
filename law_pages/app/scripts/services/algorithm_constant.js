'use strict';
angular.module('sbAdminApp').constant('AlgorithmConfig', {
    //公用常量
    commonConstant: {
        SUCCESS: 0,
        FAILURE: -1
    },
    algorithmConstant: {
        //保存算法模型信息
        saveJyAlgorithmInfoUrl:'/lawProject/algorithm/saveJyAlgorithmInfo',
        //查询算法模型信息
        queryJyAlgorithmInfoUrl:'/lawProject/algorithm/queryJyAlgorithmInfo',
        //删除申请人信息
        deleteJyAlgorithmApplyerInfoUrl:'/lawProject/algorithm/deleteJyAlgorithmApplyerInfo',
        //身份证件解析
        idCardAnalysisUrl:'/lawProject/common/cardDisc',
        //图片上传
        uploadImageUrl:"/lawProject/common/uploadImage",
        //小图
        smallPictureUrl:"/lawProject/common/image/getThumbnail/",
        //查询集合
        queryJyAlgorithmInfoListUrl:"/lawProject/algorithm/queryJyAlgorithmInfoList",
        //查询分页
        queryJyAlgorithmInfoSumUrl:"/lawProject/algorithm/queryJyAlgorithmInfoSum",
        //保存责任人信息
        saveJyAlgorithmDutyInfoUrl:"/lawProject/algorithm/saveJyAlgorithmDutyInfo",
        //删除责任人信息
        deleteJyAlgorithmDutyInfoUrl:"/lawProject/algorithm/deleteJyAlgorithmDutyInfo"
    }
});