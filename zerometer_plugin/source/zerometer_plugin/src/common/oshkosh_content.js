
// ==UserScript==
// @name oshkosh Script
// @namespace oshkosh
// @include http://www.oshkosh.com/
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require oshkosh_Xcontent.js
// @require util.js
// ==/UserScript==
$("body").ready(function(){
  startMainWindow("oshkosh");
});