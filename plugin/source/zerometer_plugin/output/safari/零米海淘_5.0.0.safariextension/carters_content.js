// ==UserScript==
// @name carters Script
// @namespace carters
// @include http://www.carters.com/*
// @include https://www.carters.com/*
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require carters_Xcontent.js
// @require util.js
// ==/UserScript==

$("body").ready(function(){
  startMainWindow("carters");
});