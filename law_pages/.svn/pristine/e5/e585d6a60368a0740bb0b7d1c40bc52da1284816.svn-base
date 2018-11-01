/**
 * Created by shenwei on 2017/5/5.
 */
'use strict';
var app = angular.module('sbAdminApp');
app.filter('id2TextApplyer', function() {
    return function(id,data) {
        var result = _.find(data, {
            id: id
        });
        return result? result.personName:""
    }
});
app.filter('id2AppraisalItem', function() {
    return function(idStr,data) {
        var str = "";
        var isFirst = true;
        // if(idStr && (idStr.indexOf(',') !== -1)){
        if(idStr && idStr != '' && idStr.split(',').length > 0){
            idStr.split(",").forEach(function(val){
                if(!isFirst){
                    str += ",";
                }
                var result = _.find(data, {id: val});
                str += result.value;
                isFirst = false;
            });
        }
        return str? str:""
    }
});
app.filter('selectedCount', function() {
    return function(arr) {
        return arr.filter(function(v) {
            return v.selected;
        }).length;
    }
});
angular.module('sbAdminApp').controller('AppraisalStep2Ctrl', function($scope, $stateParams, $state,$http, $log, AppraisalConfig,AppraisalService,AdjustConfig,AdjustService,DictionaryConfig,$modal,Upload,toaster,LawConfig,$rootScope) {

    $scope.co.step = 2;
    //鉴定项目集合
    $scope.appraisalItemList = DictionaryConfig.appraisalItemList;
    //证据分类
    $scope.appraisalClassifyList = DictionaryConfig.appraisalClassifyList;

    $scope.adjustService = AdjustService;

    //定义证据构造器
    function AppraisalEvidence(picture,name,description,operateState){
        this.jyAppraisalDetailInfoId = "";
        this.classify = "";
        this.picture = picture;
        this.state = "2";
        this.name = name || "";
        this.description = description || "";
        this.tagClose = false;
        this.selected = false;
        this.operateState = operateState || '1003';
        this.progressPercentage = 0;
    }
    $scope.imageAddress = AdjustConfig.pictureConstant.smallPictureUrl;
    //添加证据
    $scope.addAppraisalEvidence = function(files,info){
        if(!files) return;
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                imageSize(files[i]);    // 图片大小大于10M
                var fileName = files[i].name.substring(0,files[i].name.lastIndexOf('.'));
                $scope.uploadPicture(fileName,files[i],info);
            }
        }
    };
    //遮罩层 - 图片上传期间出现
    $scope.fileUploading = false;
    //上传图片
    $scope.uploadPicture = function(fileName,file,appraisalDetailInfo){
        $scope.fileUploading = true;
        //新建证据对象
        var appraisalEvidence = new AppraisalEvidence("");
        Upload.upload({
            url: LawConfig.pictureConstant.uploadImageUrl,
            data: {
                file: file,
                type: 'appraisal'
            }
        }).progress(function (evt) {
          //进度条
          appraisalEvidence.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function(res) {
            if (res.code == AppraisalConfig.commonConstant.SUCCESS) {
                appraisalEvidence.picture = res.result;
                appraisalEvidence.jyAppraisalDetailInfoId = appraisalDetailInfo.id;
                appraisalEvidence.name = fileName;
                //数据添加对象
                appraisalDetailInfo.appraisalEvidenceList.push(appraisalEvidence);
            } else if (res.code == AppraisalConfig.commonConStant.FAILURE) {
                $rootScope.toaster("error", "错误", result.message);
            }
            $scope.fileUploading = false;
        }).error(function (data, status, headers, config) {
          console.log('error status: ' + data);
          $scope.fileUploading = false;
        });
    };

    //证据删除
    $scope.removeEvidences = function(appraisalDetailInfo,appraisalEvidence) {
        var indices = [];
        var idArray = [];
        if(appraisalEvidence){
            if(appraisalEvidence.id) idArray.push(appraisalEvidence.id);
            indices.push(appraisalDetailInfo.appraisalEvidenceList.indexOf(appraisalEvidence));
        }else{
            appraisalDetailInfo.appraisalEvidenceList.forEach(function(v, i) {
                if (v.selected) indices.unshift(i);
                if (v.selected && v.id) idArray.push(v.id);
            })
        }

        function deleteSelected(arr, indiz) {
            indiz.forEach(function(v) {
                arr.splice(v, 1);
            })
        }

        if (idArray.length) {
            $scope.adjustService.removeAppraisalEvidence({
                idArray: idArray
            }).success(function(result) {
                if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                    //删除所有ID对应的对象
                    deleteSelected(appraisalDetailInfo.appraisalEvidenceList, indices);
                } else if (result.code == AdjustConfig.commonConStant.FAILURE) {
                    $rootScope.toaster("error", "错误", result.message);
                }
            });
        } else {
            deleteSelected(appraisalDetailInfo.appraisalEvidenceList, indices);
        }
    }
    //编辑证据标签
    $scope.addTag = function (appraisalEvidence, appraisalClassifyId){

        var feeType = $scope.appraisalClassifyList.filter(function(item) {
            return item.id == appraisalClassifyId;
        });
        console.log(appraisalEvidence)
        if (!appraisalEvidence.classify) {
            appraisalEvidence.chooseTagArray = [];
            appraisalEvidence.chooseTagArray.push(feeType[0]);
            appraisalEvidence.classify += appraisalClassifyId;
        } else if (appraisalEvidence.classify.indexOf(appraisalClassifyId) == -1) {
            appraisalEvidence.chooseTagArray.push(feeType[0]);
            appraisalEvidence.classify += "," + appraisalClassifyId;
        }
    };
    //关闭证据标签
    $scope.closeTag = function (appraisalEvidence,id) {
        var feeType = appraisalEvidence.chooseTagArray.filter(function(item) {
            return item.id == id;
        });
        var tagIndex = appraisalEvidence.chooseTagArray.indexOf(feeType[0]);
        appraisalEvidence.chooseTagArray.splice(tagIndex, 1);

        appraisalEvidence.classify = "";
        appraisalEvidence.chooseTagArray.forEach(function(v) {
            if (!appraisalEvidence.classify) {
                appraisalEvidence.classify += v.id
            } else {
                appraisalEvidence.classify += "," + v.id;
            }
        })
    }

    //证据全选
    $scope.selectAllItems = false;
    $scope.selectAllappraisal = function(appraisalDetailInfo) {
        $scope.selectAllItems = !$scope.selectAllItems;
        appraisalDetailInfo.appraisalEvidenceList.forEach(function(v, i) {
            if ($scope.selectAllItems) {
                v.selected = true;
            } else {
                v.selected = false;
            }
        })
    }
    //选择证据
    $scope.selectEvidence = function (appraisalEvidence,appraisalDetailInfo) {
        appraisalEvidence.selected = !appraisalEvidence.selected;
        $scope.selectAllItems = true;
        appraisalDetailInfo.appraisalEvidenceList.forEach(function(v, i) {
            if(!v.selected) {
                $scope.selectAllItems = false;
            }
        })
    }
    //选择已有证据
    $scope.chooseEvidence = function (appraisalDetailInfo) {
        var modalInstance = $modal.open({
            templateUrl: 'views/pages/appraisal/choose_evidence.html',
            controller: 'chooseEvidenceCtrl',
            size: 'lg',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['scripts/controllers/appraisal/choose_evidence.js']
                    })
                }
            }
        });
        //返回值
        modalInstance.result.then(function (res) {
            console.log(res);
            res.forEach(function (v) {
                //新建证据对象
                var appraisalEvidence = new AppraisalEvidence(v.picture,v.name,v.description,v.operateState);
                appraisalEvidence.operateName = v.operateName;
                appraisalEvidence.jyAppraisalDetailInfoId = appraisalDetailInfo.id;
                //数据添加对象
                appraisalDetailInfo.appraisalEvidenceList.push(appraisalEvidence);
            })

        }, function () {
        });
    };

  //ie9一下检查flash版本
    function hasflash() {
        if(navigator.appName == "Microsoft Internet Explorer"&&parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""))<10){
            if (!FileAPI.hasFlash) {
                $scope.haveNoFlash = true;
                $rootScope.toaster("warn", '提示',"请先安装或者升级flash！");
            }
        }
    }

    hasflash();
    $scope.checkflash = function () {
      if($scope.haveNoFlash ){
          $rootScope.toaster("warn", '提示',"请先安装或者升级flash！");
      }
    }
    //限制图片大小
    function imageSize(file) {
        if(file){
            if(parseInt(file.size/(1024*1024))>= 10 ){
              $rootScope.toaster("warn", '提示',"请上传小于10M大小的图片");
            }
        }
    }
});