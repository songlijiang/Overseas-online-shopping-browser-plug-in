// ==UserScript==
// @name vitacost Script
// @namespace vitacost
// @include http://www.vitacost.com/
// @require jquery-1.11.0.min.js
// @require config.js
// @require plugin_content.js
// @require vitacost_Xcontent.js
// @require util.js
// ==/UserScript==


$("body").ready(function(){
  startMainWindow("vitacost");
});