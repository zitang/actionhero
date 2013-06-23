#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var argv = require('optimist').argv;
var bin = require(__dirname + "/include/bin.js").bin;

if(argv.name == null){ bin.hardError("name is a required input"); }

var templateLines = [];
templateLines.push('exports.'+argv['name']+' = function(api, next){');
templateLines.push('');
templateLines.push('  // modify / append the api global variable');
templateLines.push('  // I will be run as part of actionHero\'s boot process');
templateLines.push('');
templateLines.push('  next();');
templateLines.push('}');

var data = "";
for(var i in templateLines){
  data += templateLines[i] + "\n";
}
var partialPath = "/initializers/" + argv['name'] + ".js";
bin.utils.create_file_safely(bin.projectRoot + partialPath, data);