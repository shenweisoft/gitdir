angular.module('sbAdminApp').controller('openMessageBoardCtrl', function ($scope, $modalInstance, items, $rootScope, LoginService, LoginConfig, AdjustConfig,socketConfig) {

    $scope.queryRedisListBySerialNo = LoginService.queryRedisListBySerialNoService;
    $scope.codeFilePath = AdjustConfig.adjustConStant.codeFileUrl;
    $scope.closeAlterFlagService = LoginService.closeAlterFlagService;

    $scope.items = items;
    var domain = window.location.href;
    var socketIP;
    if(domain){
        if(domain.indexOf("https") > -1){
            if(domain.indexOf("jtspt") > -1){
                socketIP = socketConfig.baiduHttpsSocketServer;
            }else if(domain.indexOf("court") > -1){
                socketIP = socketConfig.jttjHttpsSocketServer;
            }
        }else{
            if(domain.indexOf("jtspt") > -1){
                socketIP = socketConfig.baiduHttpSocketServer;
            }else if(domain.indexOf("court") > -1){
                socketIP = socketConfig.jttjHttpSocketServer;
            }
        }
    }
    if(domain && domain.indexOf('demo.jtspt.com') > -1){
        socketIP = socketConfig.demoSocketServer;
    }else if(domain && domain.indexOf('180.76.176.197') > -1){
        socketIP = socketConfig.testSocketServer;
    }else if(domain && domain.indexOf('192.168.130.26') > -1){
        socketIP = socketConfig.thisSocketServer;
    }
    var socket =  io.connect(socketIP);

    //初始化
    $scope.initPage = function () {
        $scope.scrollBottom()
        //初始化组织
        //根据组织机构获取人员列表
        $scope.$on('user2Child', function(){
            initData();
        });
        if (LoginService.user.userPermissions) {
            initData();
        }
    };
    //滚动至底部
    $scope.scrollBottom = function(){
        setTimeout(function(){
            var messageList_num=$scope.messageList.length;
            var scrollTopHeight=65*messageList_num;
            $('#info').scrollTop(scrollTopHeight)
        },200);
    }
    // 回车发送
    $scope.keyDown=function($event){
      if($event.keyCode==13){//回车
        $scope.submitMessage()
      }
    }

    function MessageInfo(){
      //用户id
      this.personId = "";
      //姓名
      this.personName = "";
      //日期
      this.createDate = "";
      //信息
      this.content = "";
    }


    $scope.messageInfo = new MessageInfo;

    //$scope.messageList = [{userId:168,userName:"Jerry",createDate:$scope.currentdate,message:"这个案件有问题，把材料补充完成。"},{userId:167,userName:"John",createDate:$scope.currentdate,message:"好的"}];
    $scope.messageList = [];
    //$scope.messageList = items.messageList
    console.log($scope.messageList);
    $scope.submitMessage = function () {

        //验证内容
        if(!$scope.message) {
            $scope.messageError = true;
            $rootScope.toaster('warn', '友情提示：', '请输入留言内容！');
            $scope.message = undefined;
            return;
        } else $scope.messageError = undefined;

        $scope.messageInfo.personId = $scope.sysUser.id;
        $scope.messageInfo.personName = $scope.sysUser.text;
        // $scope.messageInfo.createDate = $scope.currentdate;
        $scope.messageInfo.content = $scope.message;
        $scope.messageInfo.serialNo = $scope.items.serialNo;
        if($scope.sysUser.head){
            $scope.messageInfo.headPortrait = $scope.sysUser.head;
        }
        $scope.messageInfo.sysUserVO = $scope.sysUser;
        //点击发送信息
        // socket.emit('chat_info', JSON.stringify($scope.messageInfo));
        socket.emit('chat_info', $scope.messageInfo);
        $scope.scrollBottom();
        $scope.message = undefined;
    };

    socket.on('chat_info', function(data){
        var dataJson = JSON.parse(data);
        if(dataJson.serialNo == $scope.items.serialNo){
            $scope.$apply(function(){
                $scope.messageList.push(dataJson);
                $scope.scrollBottom();
            })
        }
    });

    //点击关闭modal
    $scope.closeModal = function () {
        $modalInstance.dismiss('cancel');
        socket.close();
        //关闭时，查看标识给置0
        $scope.closeAlterFlagService({
            serialNo:$scope.items.serialNo
        }).success(function (result) {
        });
    }

    //初始化数据
    function initData(){
        //查询用户以及部门
        $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
        $scope.sysUser = LoginService.user.sysUser;

        $scope.queryRedisListBySerialNo({
            serialNo:$scope.items.serialNo
        }).success(function (result) {
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                $scope.messageList = result.result;
            }
        });
    }

    //初始化数据
    $scope.initPage();



});
