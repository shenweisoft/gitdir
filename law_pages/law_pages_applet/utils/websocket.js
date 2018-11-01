var url = 'ws://192.168.223.134:8080/civil_dispute/websocket';

/**
 * 建立连接
 */
function connect(func) {
  wx.connectSocket({
    url: url + '?roomid=001'
  });
  
  //打开连接事件
  wx.onSocketMessage(func);

  //打开失败
  wx.onSocketError(function (res) {
    console.log("创建连接失败" + res.errMsg)
  })
}

/**
 * 发送信息
 */
function send(msg) {
  wx.sendSocketMessage({ data: msg });
}

module.exports = {
  connect: connect,
  send: send
}
