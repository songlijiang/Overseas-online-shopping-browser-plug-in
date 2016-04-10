// ==UserScript==
// @name saks Script
// @namespace saks
// @include http://www.saksfifthavenue.com/*
// @include https://www.saksfifthavenue.com/*
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require saks_Xcontent.js
// @require util.js
// ==/UserScript==

$("body").ready(function(){
  startMainWindow("saks");
});