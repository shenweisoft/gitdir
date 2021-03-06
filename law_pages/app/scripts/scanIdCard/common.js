var issOnlineUrl = "http://127.0.0.1:24010/ZKIDROnline";
var browserFlag = getBrowserType();
/*
$().ready(function(){
	$(document).off("DOMNodeInserted","#cert_message_type");
	$("#cert_message_type").on("DOMNodeInserted",function(e){
		openMessage($("#cert_message_type").text(), $("#cert_message").text());
	});
});
*/
//身份证
//includeScript("baseISSObject.js", function(){
//includeScript("baseISSOnline.js", function(){
	var setting = {
		Cert : {
			callBack : function(result, applicant){
				setCertificateData(result, applicant);
			},
			select : "#button_readID"
		},
		Methods : {
			showMessage : function(type,message){
        var appElement = document.getElementById('step12Ctrl');
        var $rootScope = angular.element(appElement).scope().$root;
				if(type == 'loading') {
          $rootScope.toaster('warm', "提示", message);
				} else if(type == 'success') {
          $rootScope.toaster("success", "成功", message);
				} else{
          $rootScope.toaster("error", "失败", message);
				}
			},
			downloadDrive : function(){
        var appElement = document.getElementById('step12Ctrl');
        var $rootScope = angular.element(appElement).scope().$root;
        $rootScope.toaster('warm', "提示", "缺少相关驱动，暂时无法使用该功能！");
				// $.jBox.closeTip();
				// messageBox({messageType: "confirm", text: "请安装相关硬件驱动！点击确定下载驱动。",
				// 	callback: function(result){
				// 		if(result)
				// 		{
				// 			window.location.href = "middleware/ZKIDROnline.exe";
				// 		}
				// 		closeMessage();
				// }});
			}
		}
	}
	setTimeout(function(){
    createISSonlineDevice(setting);
	},100);

//});
//});

function setCertificateData(result, applicant)
{
  var appElement = document.getElementById('step12Ctrl');
  var $scope = angular.element(appElement).scope();
  var $rootScope = angular.element(appElement).scope().$root;

	applicant.personName = result.Certificate.Name;
  applicant.certificatesType = '0';
  applicant.idNo = result.Certificate.IDNumber;
  applicant.sex = result.Certificate.Sex == '男'? '0':'1';
  applicant.birthDay = result.Certificate.Birthday.substring(0, 4)+'-'+result.Certificate.Birthday.substring(4, 6)+'-'+result.Certificate.Birthday.substring(6)
  applicant.nation = result.Certificate.Nation;
  applicant.domicile = applicant.domicile? applicant.domicile : result.Certificate.Address;
  applicant.residence = result.Certificate.Address;
  applicant.sendAddress = applicant.sendAddress? applicant.sendAddress : result.Certificate.Address;

  $scope.$apply();
}
	
function getRandomNum() 
{
    var random = parseInt(Math.random() * 10000);
    return random;
}

//消息控件的使用类型的类
var msgType = 
{
	info : "info",
	success : "success",
	warning : "warning",
	error : "error",
	loading : "loading"
};

function getBrowserType()
{
	var browserFlag = "";
	 //是否支持html5的cors跨域
    if (typeof(Worker) !== "undefined")
    {
        browserFlag = "html5";
    }
    //此处判断ie8、ie9
    else if(navigator.userAgent.indexOf("MSIE 7.0")>0||navigator.userAgent.indexOf("MSIE 8.0")>0 || navigator.userAgent.indexOf("MSIE 9.0")>0)
    {
        browserFlag = "simple";
    }
    else
	{
		browserFlag = "upgradeBrowser";//当前浏览器不支持该功能,请升级浏览器
	}
    return browserFlag;
}


function openMessage(type, text, ptimeout)
{ 
	text = (text == "" ? null : text);
	var timeout = 1000;
	if(type == msgType.warning || type == msgType.info)//警告
	{
		timeout = 3000;
	}
	else if(type == msgType.success)//成功 
	{
		
		text = (text && text != null ? text : "操作成功");//${common_op_succeed}:操作成功
		var num = strlen(text)/30;
		num = num > 8 ? 8 : num;
		timeout = Math.ceil(num) * timeout;//动态判断显示字符数的长度来延长显示时间
	}
	else if(type == msgType.error)//失败
	{
		text = (text && text != null) ? text : "操作失败";//${common_op_failed}:操作失败，程序出现异常
		timeout = 3000;
	}
	else if(type == msgType.loading)//处理中
	{
		timeout = 0;//当为'loading'时，timeout值会被设置为0，表示不会自动关闭。
		text = text && text != null ? text : "处理中";//${common_op_processing}:处理中
		console.log(111)
	}
	var width = strlen(text) * 6.1 + 45;//按字符计算宽度
	timeout = ptimeout ? ptimeout : timeout;
	//$.jBox.tip(text, type,{timeout: timeout, width: (width > 400 ? 400 : "auto")});//设定最大宽度为400
}


/*function closeMessage(timeout)
{
	timeout = timeout ? timeout : 1000;
	window.setTimeout("$.jBox.closeTip();", timeout);//设定最小等待时间
}*/

function strlen(str)
{  
    var len = 0;  
    if(str != null)
    {
   		for (var i=0; i<str.length; i++)
    	{   
			var c = str.charCodeAt(i);
			if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) 
			{
				len++;   
			}	
			else 
			{
				len+=2;   
			}
    	}
    }
    return len;
}  

/*function messageBox(paramsJson)
{ 

	this.messageType = paramsJson.messageType ? $.trim(paramsJson.messageType) : "confirm";
	this.types = "";
  	if(paramsJson.type)
  	{
  		this.typeArray = paramsJson.type.split(" ");
	  	for(var i=0; i<this.typeArray.length; i++)
	  	{
  			this.types += this.typeArray[i]+" ";
	  	}
  	}
  	switch(this.messageType)
	{
		case "confirm":
		  	$.jBox.confirm(paramsJson.text, "提示", function(v, h, f) {
	     		if (v == "ok") 
	     		{ 
	     	 		paramsJson.callback(true);
	     		}
			});
			break;
	}
}*/
