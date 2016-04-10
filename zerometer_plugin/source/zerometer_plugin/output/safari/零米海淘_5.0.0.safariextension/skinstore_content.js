// ==UserScript==
// @name skinstore Script
// @namespace skinstore
// @include http://www.skinstore.com/
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require skinstore_Xcontent.js
// @require util.js
// ==/UserScript==
$("body").ready(function(){
  startMainWindow("skinstore");
});