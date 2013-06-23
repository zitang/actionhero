#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var argv = require('optimist').argv;
var bin = require(__dirname + "/include/bin.js").bin;

  if(argv.name == null){ bin.hardError("name is a required input"); }

  var templateLines = [];
  templateLines.push('var ' + argv['name'] + ' = function(api, options, next){');
  templateLines.push('');
  templateLines.push('  //////////');
  templateLines.push('  // INIT //');
  templateLines.push('  //////////');
  templateLines.push('');
  templateLines.push('  var type = "' + argv['name'] + '"');
  templateLines.push('  var attributes = {');
  templateLines.push('    canChat: true');
  templateLines.push('    logConnections: true,');
  templateLines.push('    logExits: true,');
  templateLines.push('    sendWelcomeMessage: true,');
  templateLines.push('    verbs: [],');
  templateLines.push('  }');
  templateLines.push('');
  templateLines.push('  var server = new api.genericServer(type, options, attributes);');
  templateLines.push('');
  templateLines.push('  //////////////////////');
  templateLines.push('  // REQUIRED METHODS //');
  templateLines.push('  //////////////////////');
  templateLines.push('');
  templateLines.push('  server._start = function(next){}');
  templateLines.push('');
  templateLines.push('  server._teardown = function(next){}');
  templateLines.push('');
  templateLines.push('  server.sendMessage = function(connection, message, messageCount){}');
  templateLines.push('');
  templateLines.push('  server.sendFile = function(connection, error, fileStream, mime, length){};');
  templateLines.push('');
  templateLines.push('  server.goodbye = function(connection, reason){};');
  templateLines.push('');
  templateLines.push('  ////////////');
  templateLines.push('  // EVENTS //');
  templateLines.push('  ////////////');
  templateLines.push('');
  templateLines.push('  server.on("connection", function(connection){});');
  templateLines.push('');
  templateLines.push('  server.on("actionComplete", function(connection, toRender, messageCount){});');
  templateLines.push('');
  templateLines.push('  /////////////');
  templateLines.push('  // HELPERS //');
  templateLines.push('  /////////////');
  templateLines.push('');
  templateLines.push('  next(server);');
  templateLines.push('}');
  templateLines.push('');
  templateLines.push('/////////////////////////////////////////////////////////////////////');
  templateLines.push('// exports');
  templateLines.push('exports.' + argv['name'] + ' = ' + argv['name'] + ';');


  var data = "";
  for(var i in templateLines){
    data += templateLines[i] + "\n";
  }
  var partialPath = "/servers/" + argv['name'] + ".js";
  bin.utils.create_file_safely(binary.projectRoot + partialPath, data);