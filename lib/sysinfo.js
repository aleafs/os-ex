/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

"use strict";

var path = require('path');
var os = require('os');

module.exports = os;

(function Patch() {
  try {
    var $ = require(path.join(__dirname, os.platform(), 'info.js'));
    for (var i in $) {
      module.exports[i] = $[i];
    }
  } catch (ex) {
  }
})();

