
// ==UserScript==
// @name origins Script
// @namespace origins
// @include http://www.origins.com/
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require origins_Xcontent.js
// @require util.js
// ==/UserScript==

$("body").ready(function(){
  startMainWindow("origins");
});