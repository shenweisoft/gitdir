function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatTime2(date) {
  if (typeof date == 'string' && date.indexOf('-') != -1) {
    date = date.replace(/-/g, '/')
    date = new Date(date)
  }
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDate(date) {
  if (typeof date == 'string' && date.indexOf('-') != -1) {
    date = date.replace(/-/g, '/')
    date = new Date(date)
  }
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var dictionaryUrl = function(){
  console.log("初始化url");
  this.getAdjustUrl = '/adjust/queryAdjustDetail';
}

function getDays(date1, date2) {
  var date1Str = date1.split("-");//将日期字符串分隔为数组,数组元素分别为年.月.日  
  //根据年 . 月 . 日的值创建Date对象  
  var date1Obj = new Date(date1Str[0], (date1Str[1] - 1), date1Str[2]);
  var date2Str = date2.split("-");
  var date2Obj = new Date(date2Str[0], (date2Str[1] - 1), date2Str[2]);
  var t1 = date1Obj.getTime();
  var t2 = date2Obj.getTime();
  var dateTime = 1000 * 60 * 60 * 24; //每一天的毫秒数  
  var minusDays = Math.floor(((t2 - t1) / dateTime));//计算出两个日期的天数差  
  var days = Math.abs(minusDays);//取绝对值  
  return days;
}  

var checkIdentity = function (applicant) {
  var wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
  var valideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
  function isTrueValidateCodeBy18IdCard(idCard) {
    var idCardArray = [];
    for (var i = 0; i <= 17; i++) {
      var char = idCard.charAt(i);
      if (idCard.charAt(i).toUpperCase() == 'X') {
        char = 10;// 将最后位为x的验证码替换为10方便后续操作
      }
      idCardArray.push(parseInt(char));
    }

    var sum = 0; // 声明加权求和变量
    for (var i = 0; i < 17; i++) {
      sum += wi[i] * idCardArray[i]; // 加权求和
    }
    var valCodePosition = sum % 11; // 得到验证码所位置
    return idCardArray[17] == valideCode[valCodePosition];
  }
  if (applicant.idNo) {
    applicant.idNo = applicant.idNo.replace(/ /g, "");
    if (applicant.idNo.length == 15) {
      var year = applicant.idNo.substring(6, 8);
      var month = applicant.idNo.substring(8, 10);
      var day = applicant.idNo.substring(10, 12);
      var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
      if (tempDate.getYear() == parseFloat(year) && tempDate.getMonth() == parseFloat(month) - 1 && tempDate.getDate() == parseFloat(day)) {
        applicant.birthDay = tempDate;
        applicant.sex = applicant.idNo.substring(14, 15) % 2 == 0 ? '1' : '0';
      } else {
        return false
      }
    } else if (applicant.idNo.length == 18 && isTrueValidateCodeBy18IdCard(applicant.idNo)) {
      var year = applicant.idNo.substring(6, 10);
      var month = applicant.idNo.substring(10, 12);
      var day = applicant.idNo.substring(12, 14);
      var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
      if (tempDate.getFullYear() == parseFloat(year) && tempDate.getMonth() == parseFloat(month) - 1 && tempDate.getDate() == parseFloat(day)) {
        applicant.birthDay = tempDate;
        applicant.sex = applicant.idNo.substring(16, 17) % 2 == 0 ? '1' : '0';
      } else {
        return false
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
      if (!(taiwanreg.test(applicant.idNo) || xianggangreg.test(applicant.idNo) || xianggangreg1.test(applicant.idNo) || aomenreg.test(applicant.idNo) || aomenreg1.test(applicant.idNo))) {
        return false
      };
    }
  }
  return true
}

/**
 * 获取定位地址
 */
var QQMapWX = require('./qqmap-wx-jssdk.js');
var config = require('../config.js');

var getLocation = function (callback){
  // 实例化API核心类
  var qqmapsdk = new QQMapWX({
    key: config.mapKey
  });

  //获取地址
  wx.getLocation({
    success: function (res) {
      // 调用接口
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude
        },
        success: function (res) {
          var data = res.result.address_component;
          callback(data);
        },
        fail: function (res) {
          console.log(res);
        }
      });
    },
  })
}


function recordTime(date) {

  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()

  return [month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
}

/**
 * 获取年龄(周岁)
 */
function getAge(strBirthday, endDate) {
  var returnAge;
  var strBirthdayArr = strBirthday.split("-");
  var birthYear = strBirthdayArr[0];
  var birthMonth = strBirthdayArr[1];
  var birthDay = strBirthdayArr[2];

  var d = endDate.split("-");
  var nowYear = d[0];
  var nowMonth = d[1];
  var nowDay = d[2];

  if (nowYear == birthYear) {
    returnAge = 0;//同年 则为0岁  
  }
  else {
    var ageDiff = nowYear - birthYear; //年之差  
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        var dayDiff = nowDay - birthDay;//日之差  
        if (dayDiff < 0) {
          returnAge = ageDiff - 1;
        }
        else {
          returnAge = ageDiff;
        }
      }
      else {
        var monthDiff = nowMonth - birthMonth;//月之差  
        if (monthDiff < 0) {
          returnAge = ageDiff - 1;
        }
        else {
          returnAge = ageDiff;
        }
      }
    }
    else {
      returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天  
    }
  }

  return returnAge;//返回周岁年龄
}


  function CNDateString(date) {
    var cn = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var arr = [];
    var YY = date.getFullYear().toString();
    for (var i = 0; i < YY.length; i++) {
      if (cn[YY.charAt(i)]) {
        arr.push(cn[YY.charAt(i)]);
      }
    }
    arr.push("年");
    var MM = date.getMonth() + 1;
    if (MM < 10) {
      arr.push(cn[MM]);
    }
    else if (MM < 20) {
      arr.push("十" + cn[MM % 10]);
    }
    arr.push("月");
    var DD = date.getDate();
    if (DD < 10) {
      arr.push(cn[DD]);
    }
    else if (DD < 20) {
      arr.push("十" + cn[DD % 10]);
    }
    else {
      arr.push("二十" + cn[DD % 10]);
    }
    arr.push("日");
    return arr.join('');
  }


module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
  formatDate: formatDate,
  checkIdentity: checkIdentity,
  dictionaryUrl: new dictionaryUrl(),
  getDays: getDays,
  getAge: getAge,
  getLocation: getLocation,
  recordTime: recordTime,
  CNDateString: CNDateString
}
