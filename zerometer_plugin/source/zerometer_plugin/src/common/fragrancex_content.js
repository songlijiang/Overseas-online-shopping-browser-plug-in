// ==UserScript==
// @name fragrancex Script
// @namespace fragrancex
// @include http://www.fragrancex.com/*
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require fragrancex_Xcontent.js
// @require util.js
// ==/UserScript==
$("body").ready(function(){
  startMainWindow("fragrancex");
});