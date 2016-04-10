// ==UserScript==
// @name walgreens Script
// @namespace walgreens
// @include http://www.walgreens.com/*
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require walgreens_Xcontent.js
// @require util.js
// ==/UserScript==


$("body").ready(function(){
  startMainWindow("walgreens");
});
