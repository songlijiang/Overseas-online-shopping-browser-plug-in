// ==UserScript==
// @name oldnavy Script
// @namespace oldnavy
// @include http://oldnavy.gap.com/*
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require oldnavy_Xcontent.js
// @require util.js
// ==/UserScript==
$("body").ready(function(){
  startMainWindow("oldnavy");
});