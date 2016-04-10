// ==UserScript==
// @name nordstrom Script
// @namespace nordstrom
// @include http://shop.nordstrom.com/
// @all-frames true
// @require jquery-1.11.0.min.js
// @require config.js
// @require plugin_content.js
// @require nordstrom_Xcontent.js
// @require util.js
// ==/UserScript==


$("body").ready(function(){
  startMainWindow("nordstrom");
});
