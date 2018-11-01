angular.module('sbAdminApp').controller('chatSocketCtrl', function( $scope, $state,$log,$rootScope,socketConfig) {


    function Chat() {

        this.name = "";
        this.message = "";

    }

    $scope.chat = new Chat();

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

    console.info('zhangsan');
    console.info(socket);


    socket.on('advert_info', function(data){
        console.info(data);

    });




    $scope.sendSocket = function(){

        socket.emit('advert_info', $scope.chat.name + $scope.chat.message);
    };
});