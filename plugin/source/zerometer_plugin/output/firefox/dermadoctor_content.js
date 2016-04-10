// ==UserScript==
// @name dermadoctor Script
// @namespace dermadoctor
// @include http://www.dermadoctor.com/*
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require dermadoctor_Xcontent.js
// @require util.js
// ==/UserScript==
$("body").ready(function(){
  startMainWindow("dermadoctor");
});