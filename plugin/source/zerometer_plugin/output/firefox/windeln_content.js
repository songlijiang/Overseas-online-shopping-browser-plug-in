// ==UserScript==
// @name windeln Script
// @namespace windeln
// @include http://www.windeln.de/
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require windeln_Xcontent.js
// @require util.js
// ==/UserScript==
$("body").ready(function(){
  startMainWindow("windeln");
});