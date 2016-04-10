// ==UserScript==
// @name jomashop Script
// @namespace jomashop
// @include http://www.jomashop.com/*
// @include https://www.jomashop.com/*
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require jomashop_Xcontent.js
// @require util.js
// ==/UserScript==

$("body").ready(function(){
  startMainWindow("jomashop");
});