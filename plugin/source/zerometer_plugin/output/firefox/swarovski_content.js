// ==UserScript==
// @name swarovski Script
// @namespace swarovski
// @include http://www.swarovski.com/*
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require swarovski_Xcontent.js
// @require util.js
// ==/UserScript==

$("body").ready(function(){
	startMainWindow("swarovski");
});