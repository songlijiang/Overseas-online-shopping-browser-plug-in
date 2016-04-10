// ==UserScript==
// @name amazon_jp Script
// @namespace amazon_jp
// @include http://www.amazon.co.jp
// @all-frames true
// @require jquery-1.11.0.min.js
// @require config.js
// @require plugin_content.js
// @require amazon_jp_Xcontent.js
// @require util.js
// ==/UserScript==


$("body").ready(function(){
  startMainWindow("amazon_jp");
});
