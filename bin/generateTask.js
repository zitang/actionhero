#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var argv = require('optimist').argv;
var bin = require(__dirname + "/include/bin.js").bin;

if(argv.name == null){ bin.hardError("name is a required input"); }
if(argv.description == null){ argv.description = binary.argv.name; }
if(argv.scope == null){ argv.scope = "any"; }
if(argv.frequency == null){ argv.frequency = 0; }
if(argv.toAnnounce == null){ argv.toAnnounce = 'true'; }

var templateLines = [];

templateLines.push('exports.task = {');
templateLines.push('  name: "' + argv['name'] + '",');
templateLines.push('  description: "' + argv['description'] + '",');
templateLines.push('  scope: "' + argv['scope'] + '",');
templateLines.push('  frequency: ' + argv['frequency'] + ',');
templateLines.push('  toAnnounce: ' + argv['toAnnounce'] + ',');
templateLines.push('  run: function(api, params, next){');
templateLines.push('    if(params == null){ prams = {}; }');
templateLines.push('    var error = null;');
templateLines.push('    // your logic here');
templateLines.push('    next(error, true);');
templateLines.push('  }');
templateLines.push('};');

var data = "";
for(var i in templateLines){
  data += templateLines[i] + "\n";
}
var partialPath = "/tasks/" + argv['name'] + ".js";
bin.utils.create_file_safely( bin.projectRoot + partialPath, data);