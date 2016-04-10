// ==UserScript==
// @name lids Script
// @namespace lids
// @include http://www.lids.com/*
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require lids_Xcontent.js
// @require util.js
// ==/UserScript==
$("body").ready(function(){
  startMainWindow("lids");
});