// ==UserScript==
// @name gymboree Script
// @namespace gymboree
// @include http://www.gymboree.com/*
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require gymboree_Xcontent.js
// @require util.js
// ==/UserScript==

$("body").ready(function(){
  startMainWindow("gymboree");
});