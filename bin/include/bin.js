var path = require('path');
var fs = require('fs');
var winston = require('winston');
var argv = require('optimist').argv;

// var async = require('async');
// var spawn = require('child_process').spawn
// var fork = require('child_process').fork
// var readLine = require("readline");

/////////////
// LOGGING //
/////////////

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true, 
      level: 'debug'
    }),
  ] 
});
logger.setLevels(winston.config.syslog.levels);

var log = function(message, severity){
  if(argv['silent'] != 'true'){
    if(severity == null){ severity = "info" }
    logger.log(severity, message);
  }
}

var hardError = function(err){
  log(err, "error");
  process.exit(1);
}

///////////////
// utilities //
///////////////

var utils = {}

utils.stringifyInputList = function(list){
  var s = "";
  if(list == null){ return s; }
  arr = list.split(",");
  var used = 0;
  for(var i in arr){
    if(used > 0){ s+= ", ";}
    if(arr[i].length > 0){
      s += '"' + arr[i] + '"';
      used++;
    }
  }
  return s;
}

utils.dir_exists = function(dir){
  try{
    var stats = fs.lstatSync(dir);
    if(stats.isDirectory() || stats.isSymbolicLink()){
      return true;
    }else{
      return false;
    }
  }catch(e){
    return false;
  }
}

utils.file_exists = function(file){
  try{
    var stats = fs.lstatSync(file);
    if(stats.isFile() || stats.isSymbolicLink()){
      return true;
    }else{
      return false;
    }
  }catch(e){
    return false;
  }
}

utils.create_dir_safely = function(dir){
  if(utils.dir_exists(dir)){
    log(" - directory `"+path.normalize(dir)+"` already exists, skipping");
  }else{
    log(" - creating directory `"+path.normalize(dir)+"`");
    fs.mkdirSync(dir , 0766);
  }
}

utils.create_file_safely = function(file, data){
  if(utils.file_exists(file)){
    log(" - file `"+path.normalize(file)+"` already exists, skipping");
  }else{
    log(" - wrote file `"+path.normalize(file)+"`");
    fs.writeFileSync(file, data);
  }
}

utils.hashLength = function(obj) {
  var size = 0, key;
  for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

///////////
// PATHS //
///////////

var projectRoot;
var actionHeroRoot;

var path_parts = process.cwd().split("/");
if(path_parts[path_parts.length -2] == "node_modules"){
  projectRoot = process.cwd() + "/../..";
}else{
  projectRoot = process.cwd();
}

if(utils.file_exists(__dirname + "/../../actionHero.js")){
  // in the actionHero project itself
  actionHeroRoot = __dirname + "/../..";
}else if(utils.file_exists(__dirname + "/../../node_modules/actionHero/actionHero.js")){
  // running from a project's node_modules (bin or actionHero)
  actionHeroRoot = __dirname + "/../../node_modules/actionHero";
}else{
  // installed globally
  actionHeroRoot = __dirname + "/../..";
}

projectRoot = path.normalize(projectRoot);
actionHeroRoot = path.normalize(actionHeroRoot);

log("projectRoot >> " + projectRoot);
log("actionHeroRoot >> " + actionHeroRoot);

/////////////
// EXPORTS //
///////////// 

exports.bin = {
  log:            log,
  hardError:      hardError,
  utils:          utils,
  projectRoot:    projectRoot,
  actionHeroRoot: actionHeroRoot
}

//////////
// Load //
//////////


// binary.actions = {};

// binary.fs.readdirSync(binary.paths.actionHero_root + "/bin/include/").sort().forEach(function(file){
//   if(file.indexOf(".js") > 0){
//     var action = file.split(".")[0];
//     binary.actions[action] = require(binary.paths.actionHero_root + "/bin/include/" + file)[action];
//   }
// });

// binary.mainAction = binary.argv["_"][0];
// if(binary.mainAction == null){ binary.mainAction = "start"; }

// if(binary.argv['isDaemon'] == 'true'){
//   binary.isDaemon = true;
//   binary.logger.remove(winston.transports.Console);
// }else{
//   binary.isDaemon = false;
// }

// if(binary.actions[binary.mainAction] != null){
//   if(binary.argv['daemon'] != null){
//     var args = process.argv.splice(2);
//     for(var i in args){
//       if(args[i].indexOf("--daemon") >= 0){
//         args.splice(i,1);
//         break;
//       }
//     }
//     args.push('--isDaemon=true')
//     var command = binary.path.normalize(binary.paths.actionHero_root + "/bin/actionHero");
//     var child = binary.spawn(command, args, {detached: true, stdio: 'ignore'});
//     child.unref();
//     process.nextTick(function(){
//       binary.log("spawned child process with pid "+ child.pid);
//       setTimeout(process.exit, 2000); // TODO: why is this sleep needed?
//     });
//   }else{
//     binary.actions[binary.mainAction](binary, function(){});
//   }
// }else{
//   binary.actions['unknownInput'](binary, function(){});
//   process.exit(1);
// }
