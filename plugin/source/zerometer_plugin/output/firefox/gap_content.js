// ==UserScript==
// @name gap Script
// @namespace gap
// @include http://www.gap.com/*
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require gap_Xcontent.js
// @require util.js
// ==/UserScript==
$("body").ready(function(){
  startMainWindow("gap");
});