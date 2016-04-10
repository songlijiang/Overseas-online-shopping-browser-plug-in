

function getExplorer(){
  return chrome;
}

function _testExternal(reg, type) {
  var external = window.external || {};
  for (var i in external) {
    if (reg.test(type ? external[i] : i)) {
        return true;
    }
  }
  return false;
}

function _getIeVersion() {
  var v = 3,
      p = document.createElement('p'),
      all = p.getElementsByTagName('i');

  while (
      p.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
          all[0]);

  return v > 4 ? v : 0;
}

function _getChromiumType() {
  var win = window;
  var nav = win.navigator;
  var appVersion = nav.appVersion;
  var doc = win.document;
  var ieAX = win.ActiveXObject;
  var ieMode = doc.documentMode;
  var REG_APPLE = /^Apple/;
  var ieVer = _getIeVersion() || ieMode || 0;
  var isIe = ieAX || ieMode;
  
  if(win.scrollMaxX !== undefined){
    return 'FF';
  }
  
  if(!!ieVer){
    return 'IE';
  }
  
  if(ieVer && /\bqqbrowser\b/i.test(appVersion)){
    return 'QQ';
  }
  
  if(ieVer && /\bmaxthon\b/i.test(appVersion)){
    return 'Maxthon';
  }
  
  if (isIe || typeof win.scrollMaxX !== 'undefined' || REG_APPLE.test(nav.vendor || '')) {
      return 'unsured';
  }
  var _track = 'track' in document.createElement('track');
  var webstoreKeysLength = win.chrome && win.chrome.webstore ? Object.keys(win.chrome.webstore).length : 0;

  // 搜狗浏览器
  if (_testExternal(/^sogou/i, 0)) {
      return '搜狗';
  }

  // 猎豹浏览器
  if (_testExternal(/^liebao/i, 0)) {
      return '猎豹';
  }

  // chrome
  if (win.clientInformation && win.clientInformation.permissions) {
      return '谷歌';
  }

  if (_track) {
      // 360极速浏览器
      // 360安全浏览器
      return webstoreKeysLength > 1 ? '360极速' : '360安全';
  }

  return '';
}

function isSougou(){
  return _testExternal(/^sogou/i, 0);
}

function getOSSDomain(){
  return window.location.protocol + "//lingmi.oss-cn-hangzhou.aliyuncs.com";
}

function getCurrentVersion(){
  /*
  //搜狗目前不支持getManifest【runtime(5.0新增)】
  var currentVersion = getExplorer().runtime.getManifest().version;
  */
  var currentVersion = "";
  if(!isSougouExplorer){
    currentVersion = getExplorer().runtime.getManifest().version;
  }
  else{
    var manifestUrl = getExplorer().extension.getURL('manifest.json');
    $.ajax({
      url: manifestUrl,
      type: "GET",
      cache: false,
      data: null,
      async : false,
      dataType:'text',
      contentType:'application/json'
    }).done(function(msg) {
      //var obj = $.parseJSON(msg);
      var manifestJSON = JSON.parse(msg);
      if(typeof manifestJSON != "undefined"){
        currentVersion = manifestJSON.version;
      }
    }).fail(function(jqXHR, textStatus) {
      //TODO
    });
  }

  return currentVersion;
}


function startMainWindow(webName) {
  localStartX();
  /*if(!window.localStorage){
    //如果不支持localStorage，则直接使用插件.extension里面的JS
    localStartX();
    alert("本浏览器不支持localStorage，请联系客服咨询!");
    return;
  }

  var targetUrl = getOSSDomain() + "/extension/parameters/";
  if(exploreVersion == "360安全"){
    targetUrl += "360SeParameters.json";
  }
  else if(exploreVersion == "360极速"){
    targetUrl += "360EeParameters.json";
  }
  else if(exploreVersion == "猎豹"){
    targetUrl += "LiebaoParameters.json";
  }
  else if(exploreVersion == "搜狗"){
    targetUrl += "SougouParameters.json";
  }
  else if(exploreVersion == "谷歌"){
    targetUrl += "ChromeParameters.json";
  }
  else{
    alert("您当前使用的浏览器暂不支持！请换谷歌、搜狗、猎豹或者360的浏览器。");
    return;
  }

  $.ajax({
    url: targetUrl,
    type: "GET",
    cache: false,
    data: null,
    async : false,
    dataType:'text',
    contentType:'application/text'
  }).done(function(msg) {
    var extVersion = "";
    var backdoorVersion = "";
    var newestVersionJSON = JSON.parse(msg);
    if(typeof newestVersionJSON != "undefined"){
      extVersion = newestVersionJSON.extVersion;
      backdoorVersion = newestVersionJSON.backdoorVersion;
    }
    
    var prefixWebName = "LM_" + webName;
    var storage = window.localStorage;
    var targetItem = storage.getItem(prefixWebName);
    var webJsUrl = getOSSDomain() + "/extension/js";
    webJsUrl += "/" + webName + "/" + webName;
    webJsUrl += "_Xcontent.js";

    var currentBackdoorVersion = storage.getItem("currentBackdoorVersion");
    var needUpdated = false;
    if(!currentBackdoorVersion){
      needUpdated = true;
    }
    else{
      if(currentBackdoorVersion != backdoorVersion){
        needUpdated = true;
      }
    }
    if(currentVersion < extVersion || !targetItem || needUpdated){
      $.ajax({
        url: webJsUrl,
        type: "GET",
        cache: false,
        data: null,
        async : false,
        dataType:'text',
        contentType:'application/text'
      }).done(function(msg) {
        // obj = $.parseJSON(msg);
        if(!currentBackdoorVersion){
          storage.setItem("currentBackdoorVersion", backdoorVersion);
        }
        else{
          if(currentBackdoorVersion != backdoorVersion){
            storage.removeItem("currentBackdoorVersion");
            storage.setItem("currentBackdoorVersion", backdoorVersion);
          }
        }

        if (!storage.getItem(prefixWebName)){
          storage.setItem(prefixWebName, msg);
        }
        else{
          storage.removeItem(prefixWebName);
          storage.setItem(prefixWebName, msg);
        }

        //启动popup
        startX(webName);
      }).fail(function(jqXHR, textStatus) {
        //启动popup
        startX(webName);
      });
    }
    else{
      //启动popup
      startX(webName);
    }
  }).fail(function(jqXHR, textStatus) {
    //启动popup
    startX(webName);
  });*/
}

function startX(webName){ 
  var prefixWebName = "LM_" + webName;
  var storage = window.localStorage;
  var webNameJS = storage.getItem(prefixWebName);
  
  if(!webNameJS){
    // alert("Error：请联系零米客服！");
    //如果localStorage中没有，则直接使用插件.extension里面的JS
    localStartX();
  }else{
    //alert(webNameJS);
    webNameJS = trimWebNameJS(webNameJS);
    eval(webNameJS);
  }
}

/**
过滤掉：
function localStartX(){
  ...
}
*/
function trimWebNameJS(webNameJS){
  var targetWebNameJS = "";
  if(webNameJS && (webNameJS.indexOf("localStartX()") != -1)){
    var beginIndex = webNameJS.indexOf("{");
    if(beginIndex != -1){
      targetWebNameJS = webNameJS.substring(beginIndex+1);
      var endIndex = targetWebNameJS.lastIndexOf("}");
      targetWebNameJS = targetWebNameJS.substring(0, endIndex);
    }
  }
  return targetWebNameJS;
}

//全局变量
var exploreVersion = _getChromiumType();
var isSougouExplorer = isSougou();
var currentVersion = getCurrentVersion();