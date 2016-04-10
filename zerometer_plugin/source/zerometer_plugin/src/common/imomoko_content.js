// ==UserScript==
// @name imomoko Script
// @namespace imomoko
// @include http://www.imomoko.com/*
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require imomoko_Xcontent.js
// @require util.js
// ==/UserScript==
$("body").ready(function(){
  startMainWindow("imomoko");
});