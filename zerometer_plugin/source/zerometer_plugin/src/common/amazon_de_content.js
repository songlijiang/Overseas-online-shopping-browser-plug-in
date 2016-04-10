// ==UserScript==
// @name amazon_jp Script
// @namespace amazon_de
// @include http://www.amazon.de
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require amazon_de_Xcontent.js
// @require util.js
// ==/UserScript==

$("body").ready(function(){
    startMainWindow("amazon_de");
});