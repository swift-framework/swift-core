const fs = require('fs');

global.swift = {};

swift.auth = require('./auth.js');
swift.chalk = require('chalk');
swift.db = require('./database.js');
swift.finance = require('./finance.js');
swift.time = require('./time.js');
swift.utility = require('./utility.js');

if(!fs.existsSync('packages/swift-core/config.json')){
    console.log(`${swift.chalk.red('You do not have a \'config.json\' file setup.')}`);
    process.exit(0);
} else {
    swift.config = require('./config.json');
}

require('./admin.js');
require('./general.js');
require('./chat.js');

// Events (loop through this?)
require('./events/playerJoin');
require('./events/playerDeath');
require('./events/playerQuit');
require('./events/playerCommand.js');
require('./events/playerEnterMarker.js');

swift.prefix = {};
swift.prefix.error = '!{eb4d4b}[ERROR] !{fff}';
swift.prefix.info = '!{686de0}[INFO] !{fff}';
swift.prefix.permission = '{eb4d4b}You do not have permission to use that command. Please contact an admin if you believe this is an error.';
swift.prefix.syntax = '!{6ab04c}[USAGE] !{fff}';
swift.prefix.server = '!{42f49b}[SERVER] !{fff}';

swift.db.connect();