// ==UserScript==
// @name couture_zappos Script
// @namespace couture_zappos
// @include http://couture.zappos.com/*
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require couture_zappos_Xcontent.js
// @require util.js
// ==/UserScript==
$("body").ready(function(){
  startMainWindow("couture_zappos");
});