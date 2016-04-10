// ==UserScript==
// @name zappos Script
// @namespace zappos
// @include http://www.zappos.com/*
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require zappos_Xcontent.js
// @require util.js
// ==/UserScript==

$("body").ready(function(){
  startMainWindow("zappos");
});