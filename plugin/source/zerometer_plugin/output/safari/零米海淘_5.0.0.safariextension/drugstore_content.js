// ==UserScript==
// @name drugstore Script
// @namespace drugstore
// @include http://www.drugstore.com/
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require drugstore_Xcontent.js
// @require util.js
// ==/UserScript==

$("body").ready(function(){
	startMainWindow("drugstore");
});
