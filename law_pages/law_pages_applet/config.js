/**
 * 小程序配置文件
 */

/**
 * 数据服务接口详情
 */


// var host = 'http://192.168.223.118/lawProject';
// var shouxinHost = 'http://192.168.223.118/lawProject'
// var host = 'https://demo.jtspt.com/lawProject';
// var baiduSocketUrl = 'ws://192.168.223.118/lawProject/websocket';
var host = 'https://www.jtspt.com/lawProject';
var shouxinHost = 'https://jttj.court.gov.cn/lawProject';
var baiduSocketUrl = 'wss://www.jtspt.com/lawProject/websocket';
var shouxinSocketUrl = 'wss://jttj.court.gov.cn/lawProject/websocket';


var config = {
  //百度云数据服务地址
  host,

  //首信云数据服务地址
  shouxinHost,

  //百度云websocket连接
  baiduSocketUrl,

  //首信云socket
  shouxinSocketUrl,
  
  //视频服务地址
  url:'https://wy.jtspt.com',
  
  //登录地址
  loginUrl: '${host}/login/appLogin',

  // 用code换取openId
  openIdUrl: `${host}/adjust/getWeChatOpenId`,

  // 上传文件接口
  uploadFileUrl: `${host}/common/uploadImage`,

  //地图设置
  mapKey: 'VZNBZ-JAUK3-PDZ3O-YDTIM-WINR3-DIBEF',
  version: "develop"
}

module.exports = config