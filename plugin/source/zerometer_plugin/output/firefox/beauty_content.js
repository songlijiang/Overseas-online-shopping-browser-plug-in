﻿// ==UserScript==
// @name beauty Script
// @namespace beauty
// @include http://www.beauty.com/
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require beauty_Xcontent.js
// @require util.js
// ==/UserScript==
$("body").ready(function(){
  startMainWindow("beauty");
});