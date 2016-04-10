// ==UserScript==
// @name gnc Script
// @namespace gnc
// @include http://www.gnc.com/
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require gnc_Xcontent.js
// @require util.js
// ==/UserScript==

$("body").ready(function(){
	startMainWindow("gnc");
});
