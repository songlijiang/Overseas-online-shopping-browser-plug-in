// ==UserScript==
// @name backcountry Script
// @namespace backcountry
// @include http://www.backcountry.com/
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require backcountry_Xcontent.js
// @require util.js
// ==/UserScript==

$("body").ready(function(){
	startMainWindow("backcountry");
});
