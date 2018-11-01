'use strict';
var app = angular.module('sbAdminApp');
app.filter('id2Text', function() {
    return function(id,data) {
        var result = _.find(data, {
            id: id+""
        });
        return result? result.value:""
    }
});
angular.module('sbAdminApp').controller('EvidenceDetailCtrl', function($scope, $stateParams, $state, $location, $timeout, $http, $log,$modal,AdjustService,AdjustConfig,LawService, toaster, DictionaryConfig,Upload,LoginService,$rootScope) {
    //法庭类型
    $scope.courtType = $stateParams.courtType;
    //初始化用户刷新
    function initOrg(){
        $scope.sysUser = LoginService.user.sysUser;
    }
    //根据组织机构获取人员列表
    $scope.$on('user2Child', function(){
        initOrg();
    });
    if (LoginService.user.userPermissions) {
        initOrg();
    }
    //查询费用类型集合
    $scope.feeTypeList = DictionaryConfig.feeTypeList;
    //定义查询证据Service
    $scope.queryJyEvidenceBySerialNoService = AdjustService.queryJyEvidenceBySerialNo;
    //保存证据信息
    $scope.saveEvidenceService = AdjustService.saveEvidence;
    //修改证据
    $scope.saveOrUpdateEvidenceService = AdjustService.saveOrUpdateEvidence;
    //查询置证状态集合
    $scope.evidenceStateList = DictionaryConfig.evidenceStateList;
    //流程表
    $scope.insertJyWorkFlowService = AdjustService.insertJyWorkFlow;
    //小图路径
    $scope.smallPictureUrl = AdjustConfig.pictureConstant.smallPictureUrl;


    $scope.isSelf = $stateParams.isSelf;

    //将标签类型进行转换
    $scope.changeTagKeyToContent = function(){
        var feeTypeArray = [];
        $scope.evidenceArray.forEach(function(v) {
            var newFeeTypeArray = angular.copy(feeTypeArray);

            if(v.classify){
                if(v.classify.indexOf(',') != -1){
                    v.classify.split(",").forEach(function(m){
                        var feeType = _.find(DictionaryConfig.feeTypeList, function(item) {
                            return item.id == m;
                        });
                        if(feeType){
                            newFeeTypeArray.push(feeType);
                        }
                    });
                }else{
                    var feeType = _.find(DictionaryConfig.feeTypeList, function(item) {
                        return item.id == v.classify;
                    });
                    if(feeType){
                        newFeeTypeArray.push(feeType);
                    }
                }
            }
            //赋值属性
            v.newFeeTypeArray = newFeeTypeArray;
        });
        //调用刷新视图方法
        flashView();
    };

    //根据案件流水号查询证件数据
    $scope.queryJyEvidenceBySerialNoService({
        "serialNo":$stateParams.serialNo,
        "id":$stateParams.id,
        "lawPersonType":$stateParams.lawPersonType
    }).success(function(result){
        //获取对象
        if(result.code == AdjustConfig.commonConStant.SUCCESS){
            $scope.lawInfo = result.result.jyLawInfoVO;
            //供头部使用
            $scope.law = result.result.jyLawInfoVO;
            $scope.showFlag = true;
            $scope.evidenceArray = result.result.jyAdjustEvidenceInfoVOList;
            //当前用户查询类型 0:按原告查询  1：按被告查询
            $scope.queryType = result.result.queryType;
            // 调解员  法官 的时候显示 原告证据  被告证据
            $scope.querySubType = result.result.querySubType;
            //是否为法官角色
            $scope.isLawType = result.result.isLawType;
            //将标签类型进行转换
            $scope.changeTagKeyToContent();
        }else{
          $rootScope.toaster("error", "错误", result.message);
        }
    });

    $scope.mainFlow = true;
    //默认为证据信息
    $scope.menuType = 0;
    if($stateParams.menuType){
        $scope.menuType = $stateParams.menuType;
    }
    //默认我的举证为0
    $scope.evidenceType = 0;
    if($stateParams.evidenceType){
        $scope.evidenceType = $stateParams.evidenceType;
    }
    //点击切换证据信息和我要举证菜单
    $scope.changeMenu = function(val){
        $scope.menuType = val;
    };
    //点击切换我的举证我的质证
    $scope.changeEvidenceType = function(val){
        $scope.evidenceType = val;
    };
    //根据类型筛选集合内容
     $scope.collapseVar = 0;
    $scope.filterFeeType = function(feeType,id){
        flashView(feeType);
        //渲染底色的横线
        $scope.collapseVar = id || 0;
    };
    $scope.filterFeeType();
    //刷新视图
    function flashView(feeType){
        //选择费用分类触发的事件
        if(feeType){
            $log.info($scope.evidenceArray);
            $scope.jyAdjustEvidenceInfoViewList = $scope.evidenceArray.filter(function(val) {
                return val.classify.indexOf(feeType.id) >= 0;
            });
        }else{
            //选择全部时触发的事件
            $scope.jyAdjustEvidenceInfoViewList = $scope.evidenceArray;
        }
    }
    //定义证据对象
    var Evidence = function(picture,name){
      this.id = "";
      this.name = name;
      this.description = "";
      this.classify = "";
      this.picture = picture;
      this.tagClose=false;
      this.selected = false;
      this.personType = $scope.queryType;
      this.newFeeTypeArray = [];
      //只有办案阶段可以进行举证 原因：调解完成进行司法确认不需要举证，因为举证时当事人或者代理人才能举证，诉讼环节在诉讼的编辑页面举证，提交诉讼已经到待审批页面被告才能举证和置证
      this.operateState = DictionaryConfig.evidenceStateList[2].id;
      this.serialNo = $scope.lawInfo.serialNo;
      this.progressPercentage = 0;
    };
    //点击添加证据触发的事件
    $scope.newEvidenceArray = [];
    $scope.addEvidence = function (files) {
        if(!files) return;
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                imageSize(files[i]);    // 图片大小大于10M
                var fileName = files[i].name.substring(0,files[i].name.lastIndexOf('.'));
                $scope.uploadPicture(fileName,files[i]);
            }
        }
    };
    //上传图片
    $scope.uploadPicture = function (fileName,file){
      var evidence = new Evidence("");
      $scope.newEvidenceArray.unshift(evidence);
      Upload.upload({
        url: AdjustConfig.pictureConstant.uploadImageUrl,
        data: {
            file: file,
            type: 'evidence'
        }
      }).progress(function (evt) {
        evidence.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      }).success(function(result) {
        //获取文件名字
        var fileName = file.name.substring(0,file.name.lastIndexOf('.'));
        if(result.code == AdjustConfig.commonConStant.SUCCESS){
          evidence.picture = result.result,fileName;
          evidence.name = fileName
          countSelectEvidence();
        }else{
            $rootScope.toaster("error", "错误", result.message);
        }
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
    //计算选中的证据个数
    $scope.evidenceSelectedLength = 0;
    function countSelectEvidence(){
        //如果全部选择则控制全选按钮
        var allSelect = true;
        $scope.evidenceSelectedLength = 0;
        $scope.newEvidenceArray.forEach(function(v){
            if(v.selected){
                $scope.evidenceSelectedLength++
            }else{
                allSelect = false;
            }
        });

        //如果全部选择则控制全选按钮
        if(allSelect){
            $scope.selectAllItems = true;
        }else{
            $scope.selectAllItems = false;
        }
    }
    //新增证据标签
    $scope.addTag = function(evidence, id){
        var feeType = $scope.feeTypeList.filter(function(item){
            return item.id == id;
        })
        if(!evidence.classify){
            evidence.newFeeTypeArray = [];
            evidence.newFeeTypeArray.push(feeType[0]);
            evidence.classify+=id;
        }else if(evidence.classify.indexOf(id)==-1){
            evidence.newFeeTypeArray.push(feeType[0]);
            evidence.classify += ","+id;
        }
    }

    //编辑证据标签
    $scope.editTag = function(evidence){
        evidence.tagClose = !evidence.tagClose;
        //如果evidence.tagClose为false,表示点击保存按钮
        if(!evidence.tagClose){
            //更新证据标签存入数据库
            if(evidence.id){
                $scope.saveOrUpdateEvidenceService({
                    "classify":evidence.classify,
                    "id":evidence.id
                }).success(function (result) {
                    if(result.code == AdjustConfig.commonConStant.SUCCESS){
                        //toaster.pop("success", "成功", "恭喜保存成功！");
                    }else{
                      $rootScope.toaster("error", "错误", result.message);
                    }
                });
            }
        }
    };

    //关闭证据标签
    $scope.closeTag = function(evidence, id){
        var feeType = evidence.newFeeTypeArray.filter(function(item){
            return item.id == id;
        })
        var tagIndex = evidence.newFeeTypeArray.indexOf(feeType[0]);
        evidence.newFeeTypeArray.splice(tagIndex,1);

        evidence.classify = "";
        evidence.newFeeTypeArray.forEach(function(v){
            if(!evidence.classify){
                evidence.classify += v.id
            }else{
                evidence.classify += ","+v.id;
            }
        })
    }

    //选择证据
    $scope.chooseSelect = function(evidence){
        evidence.selected = !evidence.selected;
        //查询证据数量
        countSelectEvidence();
    }

    //证据全选
    $scope.selectAllItems = false;
    $scope.selectAll = function(){
        $scope.selectAllItems = !$scope.selectAllItems;
        $scope.newEvidenceArray.forEach(function(v, i){
            if($scope.selectAllItems){
                v.selected = true;
            }else{
                v.selected = false;
            }
        })
        countSelectEvidence();
    }

    //证据删除(batch)
    $scope.batchRemoveEvidences = function(index){
        //如果evidence存在则表示是单个删除
        if(index >= 0 ){
            $scope.newEvidenceArray.splice(index, 1);
        }else{

            //表示批量删除 新数组倒着放索引
            var newSelectArray = [];
            $scope.newEvidenceArray.forEach(function(v,i){
                if(v.selected){
                    newSelectArray.unshift(i)
                }
            });

            if(newSelectArray.length == 0){
                $rootScope.toaster("error", "错误", "请选择被删除的证据");
            }else{
                //删除
                newSelectArray.forEach(function(v) {
                    $scope.newEvidenceArray.splice(v, 1);
                });
                //刷新已选中的数量
                countSelectEvidence();
            }
        }
    };

    //定义错误信息常量
    $scope.CONSTANT = {
        "nameErrorMessage": "请您填写证据名称",
        "classifyErrorMessage": "请您选择证据分类",
        "evidenceErrorMessage":"请您上传证据"
    };
    //验证证据
    function validateEvidence(){
        //上传证据验证
        if($scope.newEvidenceArray.length == 0){
            $rootScope.toaster("error", "错误", $scope.CONSTANT.evidenceErrorMessage);
            return false;
        }
        for(var i = 0 ; i < $scope.newEvidenceArray.length; i ++){
            var evidence = $scope.newEvidenceArray[i];
            if(!evidence.name){
                evidence.nameErrorMessage = $scope.CONSTANT.nameErrorMessage;
                toaster.pop("error", "错误", evidence.nameErrorMessage);
                return false;
            }else{
                evidence.nameErrorMessage = "";
            }
       /*     //证据分类
            if(!evidence.classify){
                evidence.classifyErrorMessage = $scope.CONSTANT.classifyErrorMessage;
                toaster.pop("error", "错误", evidence.classifyErrorMessage);
                return false;
            }else{
                evidence.nameErrorMessage = "";
            }*/
        }
        return true;
    }

    //定义流程主表信息
    var WorkFlow = function() {
        this.type = DictionaryConfig.lawType.evidence;
        this.serialNo = $scope.law.serialNo;
        this.operatorId = $scope.sysUser.id;
        this.operatorName = $scope.sysUser.text;
        this.tempData = "";
        this.result = '0';
        this.resultName = "已补充证据";
    };
    //封装流程信息
    $scope.packageWorkFlowData = function(){
        //主表
        $scope.workFlow = new WorkFlow();
        //业务表
        var tempData = new DictionaryConfig.workFlowData();
        tempData.evidenceNum = $scope.evidenceNum;
        tempData.currentEvidenceArray = $scope.currentEvidenceArray;
        $scope.workFlow.tempData = JSON.stringify(tempData);
    }
    //插入流程表
    $scope.insertWorkFlow = function(){
        //封装流程表
        $scope.packageWorkFlowData();
        $log.info($scope.workFlow);
        //插入流程表信息
        $scope.insertJyWorkFlowService($scope.workFlow).success(function(result) {
            console.log(result);
            //插入成功
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
            } else {
                $rootScope.toaster("error", "错误", result.message);
            }
        })
    };
    //确认举证操作
    $scope.saveEvidence = function(){
        //验证举证信息是否通过
        if(validateEvidence()){
            //封装参数
            var param = {"serialNo":$scope.lawInfo.serialNo, "evidenceArray":$scope.newEvidenceArray};
            //证据数量
            $scope.evidenceNum = $scope.newEvidenceArray.length;
            //举证集合
            $scope.currentEvidenceArray = angular.copy($scope.newEvidenceArray);
            //插入操作
            $scope.saveEvidenceService(param).success(function (result) {
                if(result.code == AdjustConfig.commonConStant.SUCCESS){
                    $scope.newEvidenceArray = [];
                    result.result.jyEvidenceInfoVOList.forEach(function(v){
                        v.createDate = result.result.currentDate;
                        $scope.evidenceArray.push(v);
                    });
                    //处理标签KEY转换成内容
                    $scope.changeTagKeyToContent();
                    //根据session获取组织后更新流程
                    $scope.insertWorkFlow();
                    $scope.evidenceSelectedLength = 0;
                    $rootScope.toaster("success", "成功", "恭喜您举证成功！");
                }else{
                    $rootScope.toaster("error", "错误", result.message);
                }
            });
        }
    };
    //点击选中证据
    $scope.selectEvidence = function(evidence){
        evidence.selected = !evidence.selected
        //刷新已选中的数量
        countSelectEvidence();
    };
    //置疑
    $scope.question_popup = function (evidence) {
        var question_popup = $modal.open({
            templateUrl: 'views/pages/case_detail/question_popup.html',
            controller: 'QuestionPopupCtrl',
            size: "lg",
            resolve: {
                items: function(){
                    return {
                        evidence: evidence
                    }
                }
            }
        });
        //获取弹出窗口传回的值
        question_popup.result.then(function (data) {
            $scope.name = data.name;
            $scope.regionId = data.regionId;
            $scope.regionName = data.regionName;
        }, function () {
        });
    }

    //法官回复
    $scope.reply = function (evidence) {
        $modal.open({
            templateUrl: 'views/pages/case_detail/replay_popup.html',
            controller: 'ReplayPopupCtrl',
            size: "lg",
            resolve: {
                items: function(){
                    return {
                        evidence: evidence
                    }
                }
            }
        });
    }
    
    //发送证据到视频开庭
    $scope.sendEvidenceToVideo = function(evidence){
      var data = new Array();
      data[0] = evidence.id
      LawService.sendEvidenceToVideo({
        idList: data
      }).success(function (result) {
        if(JSON.parse(result)){
          $rootScope.toaster("success", "成功", "证据发送成功");
          evidence.isSended = true;
        }else{
          $rootScope.toaster("error", "错误", "证据发送失败");
        }
      });
    }
  
  $scope.co = {}
  //显示隐藏
  $scope.batchSetting = false;
  $scope.batchSettingTag = function(){
    if($scope.newEvidenceArray.length <= 0){
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageEvidenceNull);
      return;
    }
    $scope.selectedTagList = [];
    $scope.selectedTagStr = "";
    $scope.batchSetting = !$scope.batchSetting;
  }
  
  //批量设置标签
  $scope.selectedTagList = [];
  $scope.selectedTagStr = "";
  $scope.batchSelectTag = function(tag){
    if($scope.selectedTagList.map(function(v){
        return v.id
      }).indexOf(tag.id) == -1){
      $scope.selectedTagList.push(tag);
      $scope.selectedTagStr += ","+tag.id;
    }
  }
  
  //删除标签
  $scope.removeTag = function(tag){
    var tagIndex = $scope.selectedTagList.indexOf(tag);
    $scope.selectedTagList.splice(tagIndex, 1)
    $scope.evidenceTagChanged();
  }
  
  //批量保存证据标签
  $scope.batchSaveEvidenceTag = function(){
    $scope.newEvidenceArray.filter(function(v){
      return v.selected == true;
    }).forEach(function(evidence){
      evidence.newFeeTypeArray = [];
      evidence.classify = "";
      $scope.selectedTagList.forEach(function(tag){
        evidence.newFeeTypeArray.push(tag);
        evidence.classify += "," + tag.id;
      })
    })
    
    $scope.batchSetting = false;
    $scope.evidenceTagChanged();
  }
  
  $scope.co.filterTag = [];
  $scope.co.existNoTag = false;
  $scope.evidenceTagChanged = function(){
    $scope.co.filterTag =[];
    $scope.newEvidenceArray.forEach(function(v){
      if(v.newFeeTypeArray.length==0){
        $scope.co.existNoTag = true;
      }
      v.newFeeTypeArray.forEach(function(tag){
        if($scope.co.filterTag.map(function(m){return m.id}).indexOf(tag.id) == -1){
          $scope.co.filterTag.push(tag);
        }
      })
    })
  }

  //证据批量下载
  $scope.batchDownLoadEvidenceUrl = AdjustConfig.adjustConStant.batchDownLoadEvidenceUrl;
  $scope.co.batchDownLoadEvidences = function(personType) {
    var indices = [];
    var picturePath = [];
    var serialNo = $stateParams.serialNo;
    if($scope.jyAdjustEvidenceInfoViewList) {
      $scope.jyAdjustEvidenceInfoViewList.forEach(function(v, i) {
        if (v.personType == personType) {
          indices.unshift(i);
          picturePath.push(v.picture);
          if(v.personType == '0') $scope.uploadEvidence0 = true;
          if(v.personType == '1') $scope.uploadEvidence1 = true;
        }
      });
      if (picturePath.length) {
        picturePath.join(",");
        return $scope.batchDownLoadEvidenceUrl+'?picturePath='+picturePath+"&serialNo="+serialNo;
      }
      $scope.evidenceTagChanged();
    }
  }
});

//法官回复控制层
angular.module('sbAdminApp').controller('ReplayPopupCtrl', function($scope, $stateParams, $state,$modalInstance,AdjustService,AdjustConfig, $location, $timeout, $http, $log,$modal,toaster, items,$rootScope) {

    //定义保存法官备注Service
    $scope.insertAdjustJudgeInfoService = AdjustService.insertAdjustJudgeInfo;
    $scope.evidence = items.evidence;
    //保存
    $scope.save = function(){
        $scope.insertAdjustJudgeInfoService({
            gudgeDes:$scope.gudgeDes,
            jyAdjustEvidenceInfoId:$scope.evidence.id
        }).success(function(result){
            if(result.code == AdjustConfig.commonConStant.SUCCESS){
                $log.info(result);
                $scope.evidence.jyAdjustJudgeInfoVOList.unshift(result.result);
                $modalInstance.dismiss('cancel');
            }else{
              $rootScope.toaster.pop("error", "错误", result.message);
            }
        });
    };
    //取消
    $scope.cancel = function(){
        $modalInstance.dismiss('cancel');
    };
});

//置证
angular.module('sbAdminApp').controller('QuestionPopupCtrl', function($scope, $stateParams, $state,$modalInstance,AdjustService,AdjustConfig, $location, $timeout, $http, $log,$modal,toaster, items,$rootScope) {

    //更新证据信息
    $scope.updateJyAdjustEvidenceInfoService = AdjustService.updateJyAdjustEvidenceInfo;
    //插入证据信息
    $scope.insertJyAdjustEvidenceInfoService = AdjustService.insertJyAdjustEvidenceInfo;
    //赋值对象
    $scope.evidence = items.evidence;

    //定义错误信息常量
    $scope.CONSTANT = {
        "typeErrorMessage": "请您选择质证类型",
        "realErrorMessage": "请您填写质疑真实性描述",
        "legitimacyErrorMessage": "请您填写质疑合法性描述",
        "relationErrorMessage": "请您填写质疑关联性描述"
    };
    //点击checkbox 触发的事件
    $scope.isSelected = function($event, index){
        var checkbox = $event.target;
        if(index == 0){
            if(checkbox.checked){
                $scope.evidence.realState = 1;
            }else{
                $scope.evidence.realState = 0;
            }
        }else if (index == 1){
            if(checkbox.checked){
                $scope.evidence.legitimacyState = 1;
            }else{
                $scope.evidence.legitimacyState = 0;
            }
        }else if (index == 2){
            if(checkbox.checked){
                $scope.evidence.relationState = 1;
            }else{
                $scope.evidence.relationState = 0;
            }
        }
    };

    //表单验证
    function formValidate(){
        $scope.typeErrorMessage = "";
        $scope.realErrorMessage = "";
        $scope.legitimacyErrorMessage = "";
        $scope.relationErrorMessage = "";
        if($scope.evidence.realState != 1 && $scope.evidence.legitimacyState != 1 && $scope.evidence.relationState != 1){
            $scope.typeErrorMessage = $scope.CONSTANT.typeErrorMessage;
            $rootScope.toaster("error", "错误", $scope.typeErrorMessage);
            return false;
        }
        if($scope.evidence.realState == 1 && !$scope.evidence.realDes){
            $scope.realErrorMessage = $scope.CONSTANT.realErrorMessage;
            $rootScope.toaster("error", "错误", $scope.realErrorMessage);
            $("[name='realDesName']").focus();
            return false;
        }
        if($scope.evidence.legitimacyState == 1 && !$scope.evidence.legitimacyDes){
            $scope.legitimacyErrorMessage = $scope.CONSTANT.legitimacyErrorMessage;
            $("[name='legitimacyDesName']").focus();
            $rootScope.toaster("error", "错误", $scope.legitimacyErrorMessage);
            return false;
        }
        if($scope.evidence.relationState == 1 && !$scope.evidence.relationDes){
            $scope.relationErrorMessage = $scope.CONSTANT.relationErrorMessage;
            $("[name='relationDesName']").focus();
            $rootScope.toaster("error", "错误", $scope.relationErrorMessage);
            return false;
        }
        return true;
    }

    $scope.save = function(){
        //更新数据
        if(formValidate()){
            $scope.evidence.isDisagree = 1;
            $scope.updateJyAdjustEvidenceInfoService($scope.evidence).success(function(result){
                //获取对象
                $log.info(result.data);
                if(result.code == AdjustConfig.commonConStant.SUCCESS){
                    //成功之后赋值
                    $scope.evidence.evidenceName = result.result.evidenceName;
                    $scope.evidence.evidenceDate = result.result.evidenceDate;
                    $modalInstance.dismiss('cancel');
                }else{
                  $rootScope.toaster("error", "错误", result.message);
                }
            });
        }
    };

    //取消按钮
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
})
