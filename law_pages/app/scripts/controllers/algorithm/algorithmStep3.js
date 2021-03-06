
app.filter('stringDate', function () {
    return function (dt) {
        if (typeof (dt) == "string") {
            dt = dt.replace(/\-/gi, "\/");
            dt = Date.parse(dt);
        }
        return dt && dt;
    }
});
angular.module('sbAdminApp').controller('AlgorithmStep3Ctrl', function (AdminConstant,$scope, $stateParams, $state, $http, $log, AlgorithmConfig, AlgorithmService, DictionaryConfig, toaster, $filter) {

    //填充区域信息
    $scope.adminRegion = AdminConstant.administrationRegions;
    //初始化步骤
    $scope.headInfo.step = 3;
    //事故地点树的定义
    $scope.treeConfig = {
        core: {
            multiple: false,
            animation: true,
            error: function(error) {
                $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
            },
            check_callback: true,
            worker: true
        },
        types: {
            "default": {
                icon: 'iconfont icon-dizhi'
            },
            folder: {
                icon: 'iconfont icon-wenjian1'
            }
        },
        version: 1,
        plugins: ['types']
    };
    //默认树为收起状态
    $scope.isShowTree = false;
    //控制树阻止冒泡
    angular.element("#regNameInput").click(function(e){
        angular.element("#regNamebox").show();
        stopBubble(e);
    });
    angular.element("#regNamebox").click(function(e){
        stopBubble(e);
    });
    angular.element("body").click(function(){
        angular.element("#regNamebox").hide();
    });
    function stopBubble(e) {
        // 如果提供了事件对象，则这是一个非IE浏览器
        if ( e && e.stopPropagation ) {
            // 因此它支持W3C的stopPropagation()方法
            e.stopPropagation();
        } else {
            // 否则，我们需要使用IE的方式来取消事件冒泡
            window.event.cancelBubble = true;
        }
    };
    //选择赔偿地树节点信息
    $scope.selectAdmin = function(node, selected, event) {
        var selectedNodes = selected.selected;
        if (selectedNodes.length > 0 && selected.node.type=='default') {
            var selectedRegion = $scope.adminRegion[selectedNodes[0]];
            if ($scope.algorithmInfo.accidentPlace != selectedRegion.fullName) {
                $scope.algorithmInfo.accidentPlace = selectedRegion.fullName;
                $scope.algorithmInfo.regionCode = selectedRegion.regionCode;
                $scope.algorithmInfo.regionNameError = undefined;
                angular.element("#regNamebox").hide();
                $scope.isShowTree = false;
            }
        }
    };

    //选择当事人身份证信息
    $scope.selectAlgorithmApplyerInfo = function(algorithmApplyerInfo){
         $scope.algorithmInfo.identityId = algorithmApplyerInfo.id;
    };


    //交警接口查询
    $scope.policeSubmit = function(){

    }


});