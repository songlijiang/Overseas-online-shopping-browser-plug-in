// ==UserScript==
// @name ashford Script
// @namespace ashford
// @include http://www.ashford.com/*
// @include http://zh.ashford.com/*
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require ashford_Xcontent.js
// @require util.js
// ==/UserScript==
$("body").ready(function(){
  startMainWindow("ashford");
});