// ==UserScript==
// @name clinique Script
// @namespace clinique
// @include http://www.clinique.com/*
// @include https://www.clinique.com/*
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require clinique_Xcontent.js
// @require util.js
// ==/UserScript==

$("body").ready(function(){
  startMainWindow("clinique");
});