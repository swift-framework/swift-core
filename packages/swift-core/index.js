/**
 *  Swift Framwork
 *  Github: https://github.com/swift-framework/swift-core
 *  Wiki: https://github.com/swift-framework/swift-core/wiki
 */

const fs = require('fs');
const EventEmitter = require('events');
global.swift = {};

//  Ensure there is a config file that exists
if(!fs.existsSync('packages/swift-core/config.json')){
    console.log(`${swift.chalk.red('You do not have a \'config.json\' file setup.')}`);
    process.exit(0);
} else {
    swift.config = require('./config.json');
}

swift.prefix = {};
swift.prefix.error = '!{eb4d4b}[ERROR] !{fff}';
swift.prefix.info = '!{686de0}[INFO] !{fff}';
swift.prefix.permission = '!{eb4d4b}You do not have permission to use that command. Please contact an admin if you believe this is an error.';
swift.prefix.syntax = '!{6ab04c}[USAGE] !{fff}';
swift.prefix.server = '!{42f49b}[SERVER] !{fff}';

swift.chalk = require('chalk');
swift.db = require('./database.js');
swift.events = new EventEmitter();

swift.loadModules = function(){
    swift.auth = require('./auth.js');
    swift.finance = require('./finance.js');
    swift.time = require('./time.js');
    swift.group = require('./groups.js');
    swift.utility = require('./utility.js');
    swift.modules = require('./swift-modules');

    require('./admin.js');
    require('./general.js');
    require('./chat.js');
    require('./wrapper/player.js');

    // Eventually remove this possibly
    require('./events/playerJoin');
    require('./events/playerDeath');
    require('./events/playerQuit');
    require('./events/playerCommand.js');
    require('./events/playerEnterMarker.js');
};