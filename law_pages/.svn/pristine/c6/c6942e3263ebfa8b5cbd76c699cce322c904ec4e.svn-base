'use strict';

angular.module('sbAdminApp').controller('iehighMeterCtrl', function($sce,$scope,$log,LawConfig,$timeout,$http,$stateParams,$modalInstance,$modal,DictionaryConfig,AdjustConfig,toaster,Upload,$state,$rootScope,LoginService,CameraService,datamsg) {
	var   num = 0;
    var phi = 0;
	var camidx = 0; 
	var uuid = "";
	var filepath = "";
	var filelist = "";
	$scope.show = "1";

	//单文件上传service
	$scope.cameraService=CameraService;
	
	//多文件上传service
	//$scope.cameraMultUpload=CameraService.cameraMultUpload;
	
	$scope.cameraorder=$stateParams.cameraorderid;
	$scope.idtype=$stateParams.idtype;
	
	//alert("cameralorder:"+$scope.cameraorder+"===idType.id:"+$scope.idtype);
	$scope.rotate = function () {
	  // 图片旋转
	    num==4?num=1:num+=1;
	    var browser=navigator.appName ,
	        b_version=navigator.appVersion ,
	        version=b_version.split(";");
	    if(browser=="Microsoft Internet Explorer" ){ 
	    // alert("IE 8.0"); 
	        var img = document.getElementById("highMeterBigImg");
	        // alert(num);
	        img.style.filter="progid:DXImageTransform.Microsoft.BasicImage(rotation="+num+");";
	    }else { 
	         imgtransform();
	    }

	}
	// 动画
	function imgtransform(){
	  var img = document.getElementById("highMeterBigImg");
	      img.style.transform="rotate("+num*90+"deg)";
	      img.style.webkitTransform = "rotate("+num*90+"deg)";
	      img.style.mozTransform = "rotate("+num*90+"deg)";
	      img.style.msTransform = "rotate("+num*90+"deg)";
	      img.style.oTransform = "rotate("+num*90+"deg)";
	      phi=num*90;
	}
	
	
	// 关闭
	$scope.closeTheWindow = function(){
		StopDevice();
		$modalInstance.close({tesd:4}); 
		//$modalInstance.dismiss('cancel');
	};
	
	
	//预览图片
     function openwindow(param) {  
     	$scope.show = '2';
	//alert(param+"===============");
	        var modalInstance = $modal.open({  
	        	template :"<div class='highMeter_img'><iconfont class='iconfont icon--shanchu' ng-click='closeTheWindow()'></iconfont> <img  style='width:99%;height:auto;' src='"+param+"'/></div>",
	        	controller: 'highMeterBigImgController'	  
	        		}); 
	        modalInstance.result.then(function(data){
	        	$scope.show ='1';
	        	//alert(data)
	        	//$scope.show =
	        })
	       // alert(param+"===============2");
	 }
	
	//拍摄照片
	$scope.takecareof=function(){
		
		
		//alert($stateParams.imageAddress+"====");
		var cutpage =1;  
		var params = "{\"filepath\":\"base64\",\"rotate\":\"" + phi.toString() + "\",\"camidx\":\"" + camidx.toString() + "\",\"cutpage\":\"" +cutpage+ "\"}";//
		//alert(params);
		var url = AdjustConfig.pictureConstant.carmeraserveurl;  
		
	$http({
		//$.ajax({  
			method: "POST",  
			url: AdjustConfig.pictureConstant.carmeraserveurl,  
			dataType:'JSONP',
			 headers: {
	                'Content-Type' : 'text/plain'
	            },
			data:params
			}).success(function(data)
			{	var num=0;	
				var subbok=$(".cont_img_list_box_c").children().size();
					num=subbok+1;		
				
				
				var src="data:image/jpg;base64," + data.photoBase64;
				var cars="<dl class='cont_img_list_box_e'>";
				   cars=cars+"<dd>";
				   cars=cars+"<img class='snapshotimg' src='"+src+"'>";
				   cars=cars+"<div class='cont_img_list_box_e_btn'>";
				   cars=cars+"<span class='left_btn'>删除 </span>";
				   cars=cars+"<span>&nbsp; | &nbsp; </span>";	
				   cars=cars+"<span class='right_btn' > 查看</span>";
				   cars=cars+"</div>";
				   cars=cars+"</dd>";	
				   cars=cars+"<dt>"+(num)+"</dt>";
				   cars=cars+"</dl>";
				   
					document.getElementById("result").innerHTML = "";
					
					var cutpage ='cutpage';  
					var params = "{\"filepath\":\"\",\"rotate\":\"" + phi.toString() + "\",\"camidx\":\"" + camidx.toString() + "\",\"cutpage\":\"" + (cutpage[0].checked ? "1" : "0") + "\"}";//
					var url = "http://127.0.0.1:38088/video=grabimage";  	
			
					
					//alert("--------------"+data.photoBase64 );
					if(data.code != 0)
					{
						document.getElementById("result").innerHTML = "GrabImage 失败<br />返回代码 = " + data.code + "<br />  返回信息 = " + data.message; 	
					
					}else{
						//AppendLink(dataimg.filepath, 0);
						//$(".cont_img_list_box_c").html("");
					
						var newtake=$(".cont_img_list_box_c").html()+cars;
						//alert(newtake);
						$(".cont_img_list_box_c").html("");
						$(".cont_img_list_box_c").prepend(newtake);
					cars="";
					//删除图片
				
					$(".left_btn").click(function(){
								$(this).parent().parent().parent().remove();
								var takecarenum=$(".cont_img_list_box_c").children().size();
								$(".cont_img_list_box_bt_text").text("已拍摄("+takecarenum+")");
							});
					
					var takecarenum=$(".cont_img_list_box_c").children().size();
						$(".cont_img_list_box_bt_text").text("已拍摄("+takecarenum+")");
					}
					
					//图片预览查看
					 $(".right_btn").unbind();
					$(".right_btn").click(function(){
					var srcd=$(this).parent().parent().children("img").attr("src");
					//alert(srcd);
					openwindow(srcd);
					});
					
					
					
					
					}); 		   
				   
			}  
			 
	
	
	
	 
	//生成本地图片
	function AppendLink(filePath, type) {
		var div = document.getElementById("fileLink");
		var linkTmp = document.createElement("a");
		linkTmp.href = "file:\/\/\/" + filePath.toString();
		if(type == 0)
			linkTmp.innerText = "图像 "; 
		else
			linkTmp.innerText = "PDF "; 
		linkTmp.target = "_blank"
		div.appendChild(linkTmp);
	}	
	
	
//图片上传
$scope.uploadbase64img=function(){

    var blob = dataURItoBlob(); // 上一步中的函数
    var canvas = document.createElement('canvas');
    var dataURL = canvas.toDataURL('image/jpeg', 0.5);
     //通过FormData序列化blob
    var fd = new FormData();
    fd.append("file", blob, 'image.jpg');

    $http({
    //$.ajax({
    	url: '/lawProject/common/base64UpLoad',
    	method: 'POST',
    	//processData: false, // 必须
    //	contentType: false, // 必须
    	//dataType: 'json',
    	data: fd
    	}).success(function(data) {
    		$modalInstance.close({imgurl:data.result}); 
    	})
    

}; 

	
//获取高拍图片Base64
function toBase64(){
    //#target是目标图标,我们需要将其转换为base64格式
    var c=document.createElement("canvas");
    //设置canvas宽高为图片宽高
    c.width=$('#snapshot').width;
    c.height=$('#snapshot').width;
    //将图片绘制到canvas
    var cxt=c.getContext("2d");
    var img=new Image();
    img.src=$('#snapshot').attr('src');
    var imgsrc=$('#snapshot');
   
    if($('#snapshot').attr('src')==undefined){
    	 alert("请先拍照！");
    	 return;
    	
    }
    cxt.drawImage(img,0,0);
    //得到图片的base64编码数据
    var dd=img.src;
    //log出图片base64数据
    return dd;
}

//Base64转Blob
function dataURItoBlob() {
	var byteString;
	var base64Data= toBase64();
	if (base64Data.split(',')[0].indexOf('base64') >= 0)
	byteString = atob(base64Data.split(',')[1]);
	else
	byteString = unescape(base64Data.split(',')[1]);
	var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
	var ia = new Uint8Array(byteString.length);
	for (var i = 0; i < byteString.length; i++) {
	ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ia], {type:mimeString});
	}


//多Base64转Blob
function dataURItoBlobbb(base64param) {
	var byteString;
	var base64Data=base64param;
	if (base64Data.split(',')[0].indexOf('base64') >= 0)
	byteString = atob(base64Data.split(',')[1]);
	else
	byteString = unescape(base64Data.split(',')[1]);
	var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
	var ia = new Uint8Array(byteString.length);
	for (var i = 0; i < byteString.length; i++) {
	ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ia], {type:mimeString});
	}





//多base64图片上传
$scope.uploadbase64imgmult=function(){
	  //创建file的FormData 通过FormData序列化blob
     var fd = new FormData();
	 
	 //#target是目标图标,我们需要将其转换为base64格式
	   if($(".snapshotimg").size()==0){
	    	 alert("请先拍照！");
	    	 return;
	    }
		$(".snapshotimg").each(function(){
		    //alert($(this).attr('src'));
		    
			 var c=document.createElement("canvas");
			    //设置canvas宽高为图片宽高
			    c.width=$(this).width;
			    c.height=$(this).width;
			    //将图片绘制到canvas
			    var cxt=c.getContext("2d");
			    var img=new Image();
			    img.src=$(this).attr('src');
			    //alert("img.src======"+$(this).attr('src'));
			    var imgsrc=$(this);
			    cxt.drawImage(img,0,0);
			    //得到图片的base64编码数据
			    var base64Data=img.src;
			    //alert("base64Data:"+base64Data);
			    //调用blob方法创建blob
			    var blob = dataURItoBlobbb(base64Data)
			    //alert("blob:"+blob);
			    fd.append("files", blob, 'image.jpg');
			//循环结束
		  });
		if(datamsg.flage!=4){
			//多扫描页上传
			$scope.cameraService.cameraMultUpload({
				"files":fd
			}).success(function (result) {
				$modalInstance.close({imgurl:result.result}); 
			});	
			
		}else{
			 fd.append("type",datamsg.type);
			 fd.append("wordType",datamsg.wordType);
			 fd.append("serialNo",datamsg.serialNo);
			 fd.append("name","randoms");
			//多扫描页上传
			$scope.cameraService.cameraMultUploadIntodb({
				"files":fd
			}).success(function (result) {
				StopDevice();
				$modalInstance.close({imgurl:result.result}); 
			});		
			
			
			
			
			
			
		}
		

}; 









function myBrowser(){
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } 
    
    //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1){
	  return "Chrome";
	 }
    
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    }
    //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }; //判断是否IE浏览器
}

//以下是调用上面的函数
$scope.displaycamrea=function(){
	

var mb = myBrowser();

if ("Chrome" == mb) {
    alert("我是 Chrome");

    
    
    
    
}else{
	 alert("我是IE");
	// var tarfm=document.getElementById("frm");
	 // tarfm.src="/test/iecamera/CaptureVideo.html";
}
}

/**
 * IE中拍照方法
 */
$scope.ietakecareof=function(){
	var newimge=GetBase64Ex();//调用高拍仪提供的Base64拍照方法
	var num=0;	
	var subbok=$(".cont_img_list_box_c").children().size();
		num=subbok+1;		
	
	
	var src="data:image/jpg;base64," + newimge;
	var cars="<dl class='cont_img_list_box_e'>";
	   cars=cars+"<dd>";
	   cars=cars+"<img class='snapshotimg' src='"+src+"'>";
	   cars=cars+"<div class='cont_img_list_box_e_btn'>";
	   cars=cars+"<span class='left_btn'>删除 </span>";
	   cars=cars+"<span>&nbsp; | &nbsp; </span>";	
	   cars=cars+"<span class='right_btn' ng-click='openwindow("+num+")'> 查看</span>";
	   cars=cars+"</div>";
	   cars=cars+"</dd>";	
	   cars=cars+"<dt>"+(num)+"</dt>";
	   cars=cars+"</dl>";
	   
		document.getElementById("result").innerHTML = "";
		
		var cutpage ='cutpage';  
		
			var newtake=$(".cont_img_list_box_c").html()+cars;
			$(".cont_img_list_box_c").html("");
			$(".cont_img_list_box_c").prepend(newtake);
		cars="";
		//删除图片
	
		$(".left_btn").click(function(){
					$(this).parent().parent().parent().remove();
					var takecarenum=$(".cont_img_list_box_c").children().size();
					$(".cont_img_list_box_bt_text").text("已拍摄("+takecarenum+")");
				});
		
		var takecarenum=$(".cont_img_list_box_c").children().size();
			$(".cont_img_list_box_bt_text").text("已拍摄("+takecarenum+")");
		
		
		//图片预览查看
		 $(".right_btn").unbind();
		$(".right_btn").click(function(){
		var srcd=$(this).parent().parent().children("img").attr("src");
		//alert(srcd);
		openwindow(srcd);
		});
	
	
}







})


angular.module('sbAdminApp').controller('highMeterBigImgController', function($sce,$scope,$log,LawConfig,$timeout,$http,$stateParams,$modalInstance,$modal,DictionaryConfig,toaster,Upload,$state,$rootScope,LoginService) {
	// 关闭
	$scope.closeTheWindow = function(){
	
		$modalInstance.close({tesd:4}); 
		//$modalInstance.dismiss('cancel');
	};
	
	
	
	
	
	
});