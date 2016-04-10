// ==UserScript==
// @name wwstereo Script
// @namespace wwstereo
// @include https://www.worldwidestereo.com/*
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require wwstereo_Xcontent.js
// @require util.js
// ==/UserScript==


$("body").ready(function(){
  startMainWindow("wwstereo");
});
