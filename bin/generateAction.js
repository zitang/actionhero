#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var argv = require('optimist').argv;
var bin = require(__dirname + "/include/bin.js").bin;

if(argv.name == null){ bin.hardError("name is a required input"); }
if(argv.description == null){ argv.description = argv.name; }

var req = bin.utils.stringifyInputList(argv['inputsRequired']);
var optional = bin.utils.stringifyInputList(argv['inputsOptional']);
var templateLines = [];

templateLines.push('exports.action = {');
templateLines.push('  name: "' + argv['name'] + '",');
templateLines.push('  description: "' + argv['description'] + '",');
templateLines.push('  inputs: {');
templateLines.push('    required: [' + req + '],');
templateLines.push('    optional: [' + optional + '],');
templateLines.push('  },');
templateLines.push('  blockedConnectionTypes: [],');
templateLines.push('  outputExample: {},');
templateLines.push('  version: 1.0,');
templateLines.push('  run: function(api, connection, next){');
templateLines.push('    // your logic here');
templateLines.push('    next(connection, true);');
templateLines.push('  }');
templateLines.push('};');

var data = "";
for(var i in templateLines){
  data += templateLines[i] + "\n";
}
var partialPath = "/actions/" + argv['name'] + ".js";
bin.utils.create_file_safely(bin.projectRoot + partialPath, data);
