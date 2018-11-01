// $(function() {
//     $('#side-menu').metisMenu();
// });

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $(window).bind("load resize", function() {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function() {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }


    //上一张
    $('#prev').on('click',function(){
        if(activeIndex > 0) activeIndex--;
        toggleImage();
    }).on("mouseover",function(e){
        if(activeIndex > 0)
            $(this).addClass("active");
    }).on("mouseout",function(e){
        $(this).removeClass("active");
    });

//下一张
    $('#next').on('click',function(){
        if(activeIndex < imgLen -1) activeIndex++;
        toggleImage();
    }).on("mouseover",function(e){
        if(activeIndex < imgLen -1)
            $(this).addClass("active");
    }).on("mouseout",function(e){
        $(this).removeClass("active");
    });
});



function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7;
        } else if (fIEVersion == 8) {
            return 8;
        } else if (fIEVersion == 9) {
            return 9;
        } else if (fIEVersion == 10) {
            return 10;
        } else {
            return 6;//IE版本<=7
        }
    } else if(isEdge) {
        return 'edge';//edge
    } else if(isIE11) {
        return 11; //IE11
    }else{
        return -1;//不是ie浏览器
    }
}

/*
 计算图片应该是多大的大小
 先计算窗口大小的81%
 获取图片的真是宽高
 比较真实宽高和81%的高度大小应该是哪个更大
 */
var activeIndex = 0;
var imgLen = 0;

function computeTop(src) {

    var mask = document.getElementsByClassName('zoomImageMask')[0];
    var imgs = document.getElementsByClassName('gallery-pic');
    var img = imgs[0];
    imgLen = imgs.length;
    
    $('.gallery-pic').each(function (index,obj) {
        console.log(obj)
        obj.style.display = 'none';
        if(obj.href.indexOf(src) != -1){
            img = imgs[index];
            activeIndex = index
        }
    })
    mask.style.display = 'none';
    var h = windowSize('h')*0.81; // 浏览器高
    var w = windowSize('w')*0.81;  //浏览器宽
    var i = new Image();
    i.src = img.src;
    var rw = i.width;//图片真实宽
    var rh = i.height;//图片真实高
    var rRate = rw/rh;
    var mRate = w/h;
    var iH,iW;
    //
    if(rRate > mRate){  //说明真实的比例更宽，横向发展
        if(rw>w){ //真实大小比浏览器的大，取小的
            iW = w;
            iH = w*rh/rw  ;
        }else{
            iW = rw;
            iH = rh;
        }
    }else{//说明真实的比例更高，纵向发展
        if(rh>h){ //真实大小比浏览器的大，取小的
            iH = h ;
            iW = h*rw/rh ;
        }else{
            iW = rw;
            iH = rh;
        }
    }
    img.style.height = iH + 'px';
    img.style.width = iW + 'px';
    img.style.display = 'block';

    var t = (windowSize('h') -  parseInt(iH) -60)/2;
    var l = (windowSize('w') -  parseInt(iW) -60)/2;
    mask.style.top = t + 'px';
    mask.style.left = l + 'px';
    mask.style.display = 'block';
}
//切换图片
function toggleImage() {
    $('.gallery-pic').each(function (index,obj) {
        if(activeIndex == index){
            computeTop(obj.href)
        }
    })

}


//ie不兼容classname的问题
if(!document.getElementsByClassName){
    document.getElementsByClassName = function(className, element){
        var children = (element || document).getElementsByTagName('*');
        var elements = new Array();
        for (var i=0; i<children.length; i++){
            var child = children[i];
            var classNames = child.className.split(' ');
            for (var j=0; j<classNames.length; j++){
                if (classNames[j] == className){
                    elements.push(child);
                    break;
                }
            }
        }
        return elements;
    };
}
//计算窗口大小
function windowSize(widthOrheight) {
    if(widthOrheight == 'w'){
        // 获取窗口宽度
        if (window.innerWidth)
            winWidth = window.innerWidth;
        else if ((document.body) && (document.body.clientWidth))
            winWidth = document.body.clientWidth
        // 通过深入 Document 内部对 body 进行检测，获取窗口大小
        if (document.documentElement && document.documentElement.clientWidth)
        {
            winWidth = document.documentElement.clientWidth;
        }
        return winWidth
    }
    if(widthOrheight == 'h'){
        // 获取窗口高度
        if (window.innerHeight)
            winHeight = window.innerHeight;
        else if ((document.body) && (document.body.clientHeight))
            winHeight = document.body.clientHeight;

        // 通过深入 Document 内部对 body 进行检测，获取窗口大小
        if (document.documentElement && document.documentElement.clientHeight)
        {
            winHeight = document.documentElement.clientHeight;
        }
        return winHeight
    }

}
//调整窗口的高度
function   windowHeight() {
    var loginImg = document.getElementById('login-img');
    var loin = document.getElementById('login-bg');
    var centerBox =document.getElementById('login-center');
    var w = windowSize('w');  //浏览器宽
    var i = new Image();
    i.src = 'views/images/backgroud.jpg';
    var rw = i.width;//图片真实宽
    var rh = i.height;//图片真实高
    loin.style.height =  windowSize('h')
    centerBox.style.height = w*rh/rw + 'px';
    // w*rh/rw + 'px' ;
}

//阻止冒泡
function pop(e) {
    var event = e || window.event;
    if (event && event.stopPropagation) {
        //W3C取消冒泡事件
        event.stopPropagation();
    } else {
        //IE取消冒泡事件
        event.cancelBubble = true;
    }
}

