// ==UserScript==
// @name Amazon Script
// @namespace amazon
// @include http://www.amazon.com/
// @all-frames true
// @require jquery-1.11.0.min.js
// @require config.js
// @require plugin_content.js
// @require amazon_Xcontent.js
// @require util.js
// ==/UserScript==



$("body").ready(function(){
  startMainWindow("amazon");
});