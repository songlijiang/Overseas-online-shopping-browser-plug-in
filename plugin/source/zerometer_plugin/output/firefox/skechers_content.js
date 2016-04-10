
// ==UserScript==
// @name skechers Script
// @namespace skechers
// @include https://www.skechers.com/*
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require skechers_Xcontent.js
// @require util.js
// ==/UserScript==
$("body").ready(function(){
  startMainWindow("skechers");
});