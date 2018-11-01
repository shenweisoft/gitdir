angular.module('sbAdminApp').controller('domainMaintainCtrl', function($scope,$state,$modal,LoginService,LoginConfig,DictionaryConfig,toaster,$rootScope) {
    // 赔偿标准数据
    $scope.domainList = LoginService.selectDomainMaintainList;
    //删除
    $scope.DomainMaintain = LoginService.deleteDomainMaintainById;
    //获取总条数
    $scope.domainCount = LoginService.selectDomainMaintainSum;
    //删除
    $scope.deleteDomain = function (jyDomainDictionary) {
        if(confirm("您确认删除吗？")){
            $scope.DomainMaintain({
                "id": jyDomainDictionary.id
            }).success(function(result) {
                //请求成功
                if (result.code == LoginConfig.commonConStant.SUCCESS) {
                    var index =  _.findIndex($scope.deleteIndexList,{id:jyDomainDictionary.id});
                    $scope.deleteIndexList.splice(index, 1);
                }else{
                    //TODO
                    $rootScope.toaster(level.error, title.error, $scope.CONSTANT.errormessag);
                }
            });
        }
    }


    $scope.pageData={
        currentPage:'1',
        itemNum:DictionaryConfig.pageNum,
        listTitle: ''
    }
    $scope.jyDomainDictionary={
        pageSize:DictionaryConfig.pageNum
    }
    //toaster类型
    var level = {
        "warn": "warn",
        "error": "error",
        "success": "success"
    }
    //toaster 标题
    var title = {
        "error": "错误",
        "success": "成功"
    }
    //toaster 提示
    $scope.CONSTANT={
        "messageBackend":"查询后台数据失败！请联系管理员",
        "errormessag":"请联系系统管理员"
    }
    //获取数据
    $scope.getDataInfo = function(pageNo) {
        $scope.jyDomainDictionary.pageNo = pageNo;

        $scope.domainList($scope.jyDomainDictionary).success(function (result) {
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                $scope.deleteIndexList = result.result;
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
        //获取总条数
        $scope.domainCount($scope.jyDomainDictionary).success(function(result) {
            var data = result.result;
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                $scope.pageData.totalItems = data;
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
    }

    $scope.getDataInfo($scope.pageData.currentPage, DictionaryConfig.pageNum);
    $scope.pageChanged = function () {
        $scope.getDataInfo($scope.pageData.currentPage, DictionaryConfig.pageNum);
    }

    // 新增弹出框
    $scope.addDomain = function(jyDomainDictionary) {
        var popupModal = $modal.open({
            templateUrl: 'views/pages/domainMaintain/addDomain.html',
            controller: 'addDomainCtrl',
            size: 'lg',
            resolve: {
                items: function(){
                    return {
                        jyDomainDictionaryList:$scope.deleteIndexList,
                        jyDomainDictionary:jyDomainDictionary
                    }
                }
            }
        });
    };

})

angular.module('sbAdminApp').controller('addDomainCtrl', function($scope,$state,$modal,items,$modalInstance,LoginService,LoginConfig,DictionaryConfig,$log,toaster,$rootScope) {

    //定义新增flag
    $scope.addFlag = false;

    //取得修改对象
    $scope.jyDomainDictionary = items.jyDomainDictionary;

    $scope.jyDomainDictionaryList = items.jyDomainDictionaryList;

    //定义错误信息常量
    $scope.constant = {
        "domainNameErr": "请您输入域名名称",
        "contentErr": "请您输入对应内容",
        "checkErr":"域名已存在",
    };
    //定义赔偿标准对象
    function jyDomainDictionary(){

        //this.id = "";
        this.domainName = "";
        this.content = "";
        this.remark = "";
        this.state = "0";
        //删除标志
        this.delFlag = "0";
        //创建人名称
        this.operName = "admin";
        //修改时间
        this.updateDate = getTime();
        //创建时间
        this.createDate = getTime();
    }
    var level = {
        "warn": "warn",
        "error": "error",
        "success": "success"
    }
    var title = {
        "error": "错误",
        "success": "成功"
    }
    $scope.CONSTANT={
        "messageBackend":"查询后台数据失败！请联系管理员",
        "errormessag":"请联系系统管理员"
    }
    //获取时间格式是 yyyy-mm-dd hh:mm:ss
    function getTime(){

        var date = new Date();
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.date = date.getDate();
        return this.year +"-"+this.month + "-" + this.date + " 00:00:00";
    }

    //初始化对象 如果对象不存在 undefined  需要new对象
    if(!$scope.jyDomainDictionary){
        $scope.jyDomainDictionary = new jyDomainDictionary();
        $scope.addFlag = true;
    }

    $scope.addDomainMaintainInfo = LoginService.addDomainMaintain;

    //增加域名
    $scope.addDomain =function () {

        var messge = "您确认修改吗？";
        if($scope.addFlag){
            messge = "您确认新增么吗？";
        }
        if(validateForm()){
            if(confirm(messge)){
                if($scope.addFlag){
                    console.log($scope.jyDomainDictionary)
                    $scope.addDomainMaintainInfo($scope.jyDomainDictionary).success(function(result){
                        //请求成功
                        if (result.code == LoginConfig.commonConStant.SUCCESS) {
                            $scope.jyDomainDictionary.id = result.result.id;
                            //向集合中添加一条记录
                            $scope.jyDomainDictionaryList.unshift($scope.jyDomainDictionary);
                            //关闭
                            $modalInstance.dismiss('cancel');
                        }else{
                            //TODO
                            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.errormessag);
                        }
                    });
                }else{//表示修改
                    console.log($scope.jyDomainDictionary)
                    $scope.addDomainMaintainInfo($scope.jyDomainDictionary).success(function(result){
                        console.log(result);
                        if (result.code == LoginConfig.commonConStant.SUCCESS) {
                            $modalInstance.dismiss('cancel');
                        }else{
                            //TODO
                            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.errormessag);
                        }
                    })

                }
            }
        }
    }
    //验证
    function validateForm(){
        $scope.domainNameErr="";
        //验证名称
        if(!$scope.jyDomainDictionary.domainName){
            $("[name='domainName']").focus();
            $scope.domainNameErr = $scope.constant.domainNameErr;
            return false;
        }
        //验证内容
        $scope.contentErr="";
        if(!$scope.jyDomainDictionary.content){
            $("[name='content']").focus();
            $scope.contentErr = $scope.constant.contentErr;
            return false;
        }
        return true;
    };
    //取消
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.checkName =function  checkDomainName(){
        for (var  i=0;i< $scope.jyDomainDictionaryList.length; i++){
            if ($scope.jyDomainDictionary.domainName ==$scope.jyDomainDictionaryList[i].domainName){
                $("[name='domainName']").focus();
                $scope.checkErr = $scope.constant.checkErr;
                return false
            }
        }
        return true;
    };


    $scope.openY = function($event, mtCompensateStandard) {
        $event.preventDefault();
        $event.stopPropagation();
        mtCompensateStandard.calendarYear = true;
    };

})