
// ==UserScript==
// @name sierratradingpost Script
// @namespace sierratradingpost
// @include http://www.sierratradingpost.com/*
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require sierratradingpost_Xcontent.js
// @require util.js
// ==/UserScript==
$("body").ready(function(){
  startMainWindow("sierratradingpost");
});