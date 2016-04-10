// ==UserScript==
// @name packershoes Script
// @namespace packershoes
// @include http://www.packershoes.com/*
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require packershoes_Xcontent.js
// @require util.js
// ==/UserScript==
$("body").ready(function(){
  startMainWindow("packershoes");
});