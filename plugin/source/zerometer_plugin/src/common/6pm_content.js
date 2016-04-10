// ==UserScript==
// @name 6pm Script
// @namespace 6pm
// @include http://www.6pm.com/*
// @include https://www.6pm.com/*
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require 6pm_Xcontent.js
// @require util.js
// ==/UserScript==

$("body").ready(function(){
	startMainWindow("6pm");
});