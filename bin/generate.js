#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var bin = require(__dirname + "/include/bin.js").bin;

//////// DOCUMENTS ////////

var documents = {};

documents.projectMap = "/\n\
|- actions\n\
|-- (your actions)\n\
|\n\
|- certs\n\
|-- (your https certs for your domain)\n\
|\n\
|- initializers\n\
|-- (any additional initializers you want)\n\
|\n\
|- log\n\
|-- (default location for logs)\n\
|\n\
|- node_modules\n\
|-- (your modules, actionHero should be npm installed in here)\n\
|\n\
|- initializers\n\
|-- (your initializers, to be loaded in before the project boots)\n\
|\n\
|- pids\n\
|-- (pidfiles for your running servers)\n\
|\n\
|- public\n\
|-- (your static assets to be served by /file)\n\
|\n\
|- serervers\n\
|-- (custom servers & transports you might create)\n\
|\n\
|- tasks\n\
|-- (your tasks)\n\
|\n\
| readme.md\n\
| routes.js\n\
| config.js\n\
| package.json (be sure to include 'actionHero':'x')\n\
";

documents.config_js =                  fs.readFileSync(bin.actionHeroRoot + "/config.js");
documents.package_json =               fs.readFileSync(bin.actionHeroRoot + "/package.json");
documents.routes_js =                  fs.readFileSync(bin.actionHeroRoot + "/routes.js");
documents.action_actions_view =        fs.readFileSync(bin.actionHeroRoot + "/actions/actionsView.js");
documents.action_status =              fs.readFileSync(bin.actionHeroRoot + "/actions/status.js");
documents.action_chat =                fs.readFileSync(bin.actionHeroRoot + "/actions/chat.js");
documents.task_runAction =             fs.readFileSync(bin.actionHeroRoot + "/tasks/runAction.js");
documents.public_actionHeroWebSocket = fs.readFileSync(bin.actionHeroRoot + "/public/javascript/actionHeroWebSocket.js");

var AHversionNumber = JSON.parse(documents.package_json).version;

documents.package_json = "{\n\
  \"author\": \"YOU <YOU@example.com>\",\n\
  \"name\": \"my_actionHero_project\",\n\
  \"description\": \"\",\n\
  \"version\": \"0.0.1\",\n\
  \"homepage\": \"\",\n\
  \"repository\": {\n\
    \"type\": \"\",\n\
    \"url\": \"\"\n\
  },\n\
  \"main\": \"app.js\",\n\
  \"keywords\": \"\",\n\
  \"engines\": {\n\
    \"node\": \">=0.8.0\"\n\
  },\n\
  \"dependencies\": {\n\
    \"actionHero\": \""+AHversionNumber+"\"\n\
  },\n\
  \"devDependencies\": {},\n\
  \"scripts\": {\n\
    \"start\": \"node ./node_modules/.bin/actionHero start\",\n\
    \"startCluster\": \"node ./node_modules/.bin/actionHero startCluster\",\n\
    \"actionHero\": \"node ./node_modules/.bin/actionHero\",\n\
    \"help\": \"node ./node_modules/.bin/actionHero help\"\n\
  }\n\
}\n\
";

documents._project_js = "exports._project = function(api, next){\n\
// modify / append the api global variable\n\
// I will be run as part of actionHero\'s boot process\n\
\n\
next();\n\
}\
";

documents.readme_md = "# My actionHero Project\nreadme"; 

documents.index_html = "<h1>Hello from actionHero!</h1>\n\
<p>If you are reading this, your actionHero project is working.</p>\n\
<p><strong>Good Job!</strong></p>\n\
";

documents.git_ignore = "log\npids\nnode_modules";

//////// LOGIC ////////

bin.log("Generating a new actionHero project...");

// make directories
bin.utils.create_dir_safely(bin.projectRoot + "/actions");
bin.utils.create_dir_safely(bin.projectRoot + "/pids");
bin.utils.create_dir_safely(bin.projectRoot + "/certs");
bin.utils.create_dir_safely(bin.projectRoot + "/initializers");
bin.utils.create_dir_safely(bin.projectRoot + "/log");
bin.utils.create_dir_safely(bin.projectRoot + "/public");
bin.utils.create_dir_safely(bin.projectRoot + "/servers");
bin.utils.create_dir_safely(bin.projectRoot + "/public/javascript");
bin.utils.create_dir_safely(bin.projectRoot + "/tasks");

// make files
bin.utils.create_file_safely(bin.projectRoot + '/.gitignore', documents.git_ignore);
bin.utils.create_file_safely(bin.projectRoot + '/config.js', documents.config_js);
bin.utils.create_file_safely(bin.projectRoot + '/routes.js', documents.routes_js);
bin.utils.create_file_safely(bin.projectRoot + '/package.json', documents.package_json);
bin.utils.create_file_safely(bin.projectRoot + '/actions/actionsView.js', documents.action_actions_view);
bin.utils.create_file_safely(bin.projectRoot + '/actions/status.js', documents.action_status);
bin.utils.create_file_safely(bin.projectRoot + '/actions/chat.js', documents.action_chat);
bin.utils.create_file_safely(bin.projectRoot + '/tasks/runAction.js', documents.task_runAction);
bin.utils.create_file_safely(bin.projectRoot + '/initializers/_project.js', documents._project_js);
bin.utils.create_file_safely(bin.projectRoot + '/public/index.html', documents.index_html);
bin.utils.create_file_safely(bin.projectRoot + '/public/javascript/actionHeroWebSocket.js', documents.public_actionHeroWebSocket);
bin.utils.create_file_safely(bin.projectRoot + '/readme.md', documents.readme_md);

bin.log("");
bin.log("Generation Complete.  Your project directory should look like this:\n" + documents.projectMap);
bin.log("");
bin.log("run `npm run-script actionHero start` to start your server");