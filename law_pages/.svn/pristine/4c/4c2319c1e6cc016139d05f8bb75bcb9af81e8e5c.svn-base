/**
 * Created by Administrator on 2017/3/24 0024.
 */
'use strict';

angular.module('sbAdminApp').factory('IdentityService', function() {
  return {
    //身份证
    identityCodeValid : function(identityCode, obj, isAgent) {
      var wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
      var validCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
      function isTrueValidateCodeBy18IdCard(idCard) {
        var sum = 0; // 声明加权求和变量
        var idCardArray = [];
        for (var i = 0; i <= 17; i++) {
          var char = idCard.charAt(i);
          if(idCard.charAt(i).toUpperCase() == 'X'){
            char = 10;// 将最后位为x的验证码替换为10方便后续操作
          }
          idCardArray.push(parseInt(char));
        }
        for (var i = 0; i < 17; i++) {
          sum += wi[i] * idCardArray[i]; // 加权求和
        }
        var valCodePosition = sum % 11; // 得到验证码所位置
        return idCardArray[17] == validCode[valCodePosition];
      }
      identityCode = identityCode.replace(/ /g, "");
      if (identityCode.length == 15) {
        var year = identityCode.substring(6, 8);
        var month = identityCode.substring(8, 10);
        var day = identityCode.substring(10, 12);
        var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
        if (tempDate.getYear() == parseFloat(year) && tempDate.getMonth() == parseFloat(month) - 1 && tempDate.getDate() == parseFloat(day)) {
          if(obj){
            isAgent? obj.birthDay = tempDate: obj.birthday = tempDate;
            obj.sex = obj.idNo.substring(14, 15) % 2 == 0 ? '1' : '0';
          }
        } else {
          return false;
        }
      } else if (identityCode.length == 18 && isTrueValidateCodeBy18IdCard(identityCode)) {
        var year = identityCode.substring(6, 10);
        var month = identityCode.substring(10, 12);
        var day = identityCode.substring(12, 14);
        var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
        if (tempDate.getFullYear() == parseFloat(year) && tempDate.getMonth() == parseFloat(month) - 1 && tempDate.getDate() == parseFloat(day)) {
          if(obj){
            isAgent? obj.birthDay = tempDate: obj.birthday = tempDate;
            obj.sex = ((obj.idNo && obj.idNo.substring(16, 17) % 2 == 0) || (obj.certificatesNo && obj.certificatesNo.substring(16, 17) % 2 == 0)) ? '1' : '0';
          }
        } else {
          return false;
        }
      } else {
        //校验香港身份证规则
        var taiwanreg = /^[A-Z][0-9]{9}$/;
        //校验台湾身份证规则
        var xianggangreg = /^[A-Z][0-9]{6}\([0-9A-Z]\)$/;
        var xianggangreg1 = /^[A-Z][0-9]{6}\（[0-9A-Z]\）$/;
        //校验澳门身份证规则
        var aomenreg = /^[157][0-9]{6}\([0-9]\)$/;
        var aomenreg1 = /^[157][0-9]{6}\（[0-9]\）$/;
        if (!(taiwanreg.test(identityCode) || xianggangreg.test(identityCode) || xianggangreg1.test(identityCode) || aomenreg.test(identityCode) || aomenreg1.test(identityCode))) {
          return false;
        }
      }
    return true;
  }
  };
})

// 旋转图片
var imgSrc,nowX,nowY,disX,disY;
var scalenum;
var num;
var bojSrc;
var index;
// 图片数组
var srcArr=[]; 
// 图片前半段地址
var imageAddress;
//标记
var tag;
// 上一页
function leftImg(){
  if(index==0){
    index=0;
    bigImgSrc(tag)
  }else{
    index=index-1;
    bigImgSrc(tag)
  }
};
// 下一页
function rightImg(){
  if(index==srcArr.length-1){
    index=srcArr.length-1;
    bigImgSrc(tag)
  }else{
    index=index+1;
    bigImgSrc(tag)
  }
};
// 图片显示
function showBigimg(obj,a){
  // console.log("11111")
  if(a=='1' || a== '2'){
    var arr2= JSON.parse(obj.getAttribute("arr"))  //图片数组
    var indexSrc = obj.getAttribute("name")  // 当前图片地址
    for (var i = 0; i < arr2.length; i++) {
      var src = a == '1'? arr2[i].picture : arr2[i].path;
      srcArr.push(src)
      if(src==indexSrc){
        index=i;
      }
    }
  }
  
  imageAddress = obj.getAttribute("imageAddress") // 图片前半段地址
  var target = document.getElementById("big_img_box_img_f");
  bojSrc=obj.src
  scalenum = 1;
  num = 0;
  nowX = 762;
  nowY = 239;
  disX = 0;
  disY = -1;
  params.currentX=0;
  params.currentY=0;
  params.left = 0;
  params.top = 0;
  target.style.left = parseInt(params.left) + disX + "px";
  target.style.top = parseInt(params.top) + disY + "px";
  imgtransform();
  tag = a;
  
  // 给大图地址赋值
  bigImgSrc(a);
 
}
// 给大图地址赋值
function bigImgSrc(a){
  if (a==1) {
    imgSrc = imageAddress.replace('getThumbnail','get')+ srcArr[index];
  } else if(a == 2) {
    imgSrc = imageAddress+ srcArr[index];
  }else{
    imgSrc = bojSrc.replace('getThumbnail','get') ;
  }
  document.getElementById("big_img_box_img").src=imgSrc;
  document.getElementById("big_img_box").style.display="block";
}
// 关闭相册
function hideImg(){
    document.getElementById("big_img_box").style.display="none";
    srcArr.splice(0,srcArr.length);
}
// 图片旋转
function rotateImg(){
    num==4?num=1:num+=1;
    var browser=navigator.appName ,
        b_version=navigator.appVersion ,
        version=b_version.split(";");
    if(browser=="Microsoft Internet Explorer" ){ 
    // alert("IE 8.0"); 
        var img = document.getElementById("big_img_box_img");
        // alert(num);
        img.style.filter="progid:DXImageTransform.Microsoft.BasicImage(rotation="+num+");";
    }else { 
         imgtransform();
    }
}
// 放大图片
function enlargeimg(){
    scalenum==2.2?scalenum=2.2:scalenum+=0.3;
    imgtransform();
}
// 缩小图片
function narrowimg(){
    scalenum==0.7?scalenum=0.7:scalenum-=0.3;
    imgtransform();
}
// 动画
function imgtransform(){
  var img = document.getElementById("big_img_box_img");
  var imgbar = document.getElementById("big_img_box_img_bar");
      img.style.transform="rotate("+num*90+"deg) scale("+scalenum+")";
      img.style.webkitTransform = "rotate("+num*90+"deg) scale("+scalenum+")";
      img.style.mozTransform = "rotate("+num*90+"deg) scale("+scalenum+")";
      img.style.msTransform = "rotate("+num*90+"deg) scale("+scalenum+")";
      img.style.oTransform = "rotate("+num*90+"deg) scale("+scalenum+")";
      imgbar.style.transform="rotate("+num*90+"deg) scale("+scalenum+")";
      imgbar.style.webkitTransform = "rotate("+num*90+"deg) scale("+scalenum+")";
      imgbar.style.mozTransform = "rotate("+num*90+"deg) scale("+scalenum+")";
      imgbar.style.msTransform = "rotate("+num*90+"deg) scale("+scalenum+")";
      imgbar.style.oTransform = "rotate("+num*90+"deg) scale("+scalenum+")";
}
// 拖拽
var params = {
  left: 0,
  top: 0,
  currentX: 0,
  currentY: 0,
  flag: false
};
// 获得样式
var getCss = function(o,key){
  return o.currentStyle? o.currentStyle[key] : document.defaultView.getComputedStyle(o,false)[key];   
};
var startDrag = function(bar, target, callback){
  if(getCss(target, "left") !== "auto"){
    params.left = getCss(target, "left");
  }
  if(getCss(target, "top") !== "auto"){
    params.top = getCss(target, "top");
  }

  bar.onmousedown = function(event){
    params.flag = true;
    if(!event){
      event = window.event;

      bar.onselectstart = function(){
        return false;
      }  
    }
    var e = event;
    params.currentX = e.clientX;
    params.currentY = e.clientY;
  };
  document.onmouseup = function(){
    params.flag = false;  
    if(getCss(target, "left") !== "auto"){
      params.left = getCss(target, "left");
    }
    if(getCss(target, "top") !== "auto"){
      params.top = getCss(target, "top");
    }
  };
  document.onmousemove = function(event){
    var e = event ? event: window.event;
    if(params.flag){
      nowX = e.clientX;
      nowY = e.clientY;
      disX = nowX - params.currentX;
      disY = nowY - params.currentY;
      target.style.left = parseInt(params.left) + disX + "px";
      target.style.top = parseInt(params.top) + disY + "px";
    }
    
    if (typeof callback == "function") {
      callback(parseInt(params.left) + disX, parseInt(params.top) + disY);

    }
  } 
};