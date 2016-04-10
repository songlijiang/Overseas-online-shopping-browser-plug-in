
// ==UserScript==
// @name shopbop Script
// @namespace shopbop
// @include https://cn.shopbop.com/*
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require shopbop_Xcontent.js
// @require util.js
// ==/UserScript==
$("body").ready(function(){
  startMainWindow("shopbop");
});