﻿// ==UserScript==
// @name bergdorfgoodman Script
// @namespace bergdorfgoodman
// @include http://www.bergdorfgoodman.com/
// @all-frames true
// @require jquery-1.11.3.min.js
// @require config.js
// @require plugin_content.js
// @require bergdorfgoodman_Xcontent.js
// @require util.js
// ==/UserScript==
$("body").ready(function(){
  startMainWindow("bergdorfgoodman");
});