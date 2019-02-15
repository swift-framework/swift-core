global.swift = {};

swift.auth = require('./auth.js');
swift.chalk = require('chalk');
swift.config = require('./config.json');
swift.db = require('./database.js');
swift.finance = require('./finance.js');
swift.time = require('./time.js');
swift.utility = require('./utility.js');

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

swift.markers = {};
swift.colshapes = {};

swift.db.connect();
swift.utility.loadMarkers();
