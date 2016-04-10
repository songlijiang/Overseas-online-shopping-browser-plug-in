// ==UserScript==
// @name jnbo Script
// @namespace jnbo
// @include http://www.joesnewbalanceoutlet.com/*
// @include https://www.joesnewbalanceoutlet.com/*
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require jnbo_Xcontent.js
// @require util.js
// ==/UserScript==

$("body").ready(function(){
  startMainWindow("jnbo");
});