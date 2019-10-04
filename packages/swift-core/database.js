var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

const pool = mysql.createPool({
    connectionLimit : swift.config.db_connectionLimit,
    host : swift.config.db_host,
    user : swift.config.db_username,
    password : swift.config.db_password,
    database : swift.config.db_name
});

pool.getConnection((err, connection) => {
    console.log(`${swift.chalk.green('[Swift-Core]')} Connecting to the database. `);
    if (err) {
        switch(err.code){
        case 'PROTOCOL_CONNECTION_LOST':
            console.log(`${swift.chalk.green('[Swift-Core] ') + swift.chalk.red('Error: Database connection was closed.')}`);
            break;
        case 'ER_CON_COUNT_ERROR':
            console.log(`${swift.chalk.green('[Swift-Core] ') + swift.chalk.red('Error: Database has too many connections.')}`);
            break;
        case 'ECONNREFUSED':
            console.log(`${swift.chalk.green('[Swift-Core] ') + swift.chalk.red('Error: Check your connection details (packages/swift-core/database.js) or make sure your MySQL server is running.')}`);
            break;
        case 'ER_BAD_DB_ERROR':
            console.log(`${swift.chalk.green('[Swift-Core] ') + swift.chalk.red('Error: The database name you\'ve entered does not exist.')}`);
            break;
        case 'ER_ACCESS_DENIED_ERROR':
            console.log(`${swift.chalk.green('[Swift-Core] ') + swift.chalk.red('Error: Check your MySQL username and password and make sure they\'re correct.')}`);
            break;
        case 'ENOENT':
            console.log(`${swift.chalk.green('[Swift-Core] ') + swift.chalk.red('Error: There is no internet connection. Check your connection and try again.')}`);
            break;
        default:
            console.log(`${swift.chalk.green('[Swift-Core] ') + swift.chalk.red('Error: ' + err.code)}`);
            break;
        }
    }
    if (connection) {
        console.log(`${swift.chalk.green('[Swift-Core]')} Connected Successfully`);
        swift.loadModules();
        connection.release();
    }
    return;
});

module.exports = pool;

mp.events.add('sendDataToServer', (player, username, email, pass, state) => {
    let loggedAccount = mp.players.toArray().find(p => p.loggedInAs == username);
    switch(state){
    case 0: //Login State
    {
        if(loggedAccount){
            player.call('loginHandler', ['logged']);
        } else {
            swift.db.query('SELECT `password` FROM `accounts` WHERE `username` = ?', [username], function(err, res){
                if(res.length > 0){
                    let sqlPassword = res[0]['password'];
                    bcrypt.compare(pass, sqlPassword, function(err, res2) {
                        if(res2 === true){  //Password is correct
                            swift.db.query('SELECT `unbandate`, `reason` FROM `bans` WHERE `unbandate` > NOW() AND `username` = ?', [username], function(banErr, banRes){
                                if(banErr) return console.log(swift.chalk.red(`[MySQL] ERROR: ${banErr.sqlMessage}\n[MySQL] QUERY: ${banErr.sql}`));
                                if(banRes.length == 0){
                                    player.name = username;
                                    player.call('loginHandler', ['success']);
                                    swift.auth.loadAccount(player);
                                    clearTimeout(player.idleKick);
                                } else {
                                    player.call('loginHandler', ['banned']);
                                }
                            });
                        } else {    //Password is incorrect
                            player.call('loginHandler', ['incorrectinfo']);
                            resetTimeout(player);
                        }
                    });
                } else {
                    player.call('loginHandler', ['incorrectinfo']);
                    resetTimeout(player);
                }
            });
        }
        break;
    }
    case 1: //Register State
    {
        if(username.length >= 3 && pass.length >= 5){
            if(validEmail(email) && validUsername(username)){
                swift.db.query('SELECT * FROM `accounts` WHERE `username` = ? OR `email` = ?', [username, email], function(err, res){
                    if(res.length > 0){
                        player.call('loginHandler', ['takeninfo']);
                    } else {
                        bcrypt.hash(pass, null, null, function(err, hash) {
                            if(err) return console.log(swift.chalk.red(`[MySQL] ERROR: ${err.sqlMessage}\n[MySQL] QUERY: ${err.sql}`));
                            if(!err){
                                swift.db.query('INSERT INTO `accounts` SET username = ?, email = ?, password = ?', [username, email, hash], function(err){
                                    if(err) return console.log(swift.chalk.red(`[MySQL] ERROR: ${err.sqlMessage}\n[MySQL] QUERY: ${err.sql}`));
                                    player.name = username;
                                    player.call('loginHandler', ['registered']);
                                    swift.auth.registerAccount(player);
                                    clearTimeout(player.idleKick);
                                    console.log('\x1b[92m' + username + '\x1b[39m has just registered.');
                                });
                            } else {
                                console.log('\x1b[31m[BCrypt]: ' + err);
                            }
                        });
                    }
                });
            } else {
                player.call('loginHandler', ['invalid-info']);
                resetTimeout(player);
            }
        } else {
            player.call('loginHandler', ['tooshort']);
            resetTimeout(player);
        }            
        break;
    }
    default:
    {
        player.outputChatBox('An error has occured, please contact your server administrator.');
        console.log('\x1b[31m[ERROR] Login/Register state was one that isn\'t defined. State: ' + state);
        break;
    }
    }
});

function validEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validUsername(username){
    let re = /[A-z]{2,}_[A-z]{2,}/;
    return re.test(String(username));
}

function resetTimeout(user){
    clearTimeout(user.idleKick);
    user.idleKick = setTimeout(() => {
        user.outputChatBox(`${swift.prefix.server} You were kicked for idling too long.`);
        user.call('loginHandler', ['kicked']);
        user.kick();
    }, 60000);
}

if(swift.config.db_debug){
    /**
     * pool.config.connectionLimit     // passed in max size of the pool
        pool._freeConnections.length    // number of free connections awaiting use
        pool._allConnections.length     // number of connections currently created, including ones in use
        pool._acquiringConnections.length // number of connections in the process of being acquired
     */

    //  Connection acquired from the pool
    pool.on('acquire', function (connection) {
        console.log(`Acquire Event:\n[ThreadID: ${connection.threadId}] FREE: ${pool._freeConnections.length} / ALL: ${pool._allConnections.length} / MAX: ${pool.config.connectionLimit} / AQ: ${pool._acquiringConnections.length}\n ===`);
    });
    
    //  When a new connection has been made to the pool
    pool.on('connection', function (connection) {
        console.log(`Connection Event:\n[ThreadID: ${connection.threadId}] FREE: ${pool._freeConnections.length} / ALL: ${pool._allConnections.length} / MAX: ${pool.config.connectionLimit} / AQ: ${pool._acquiringConnections.length}\n ===`);
    });
    
    //  Connection has been released back to the pool
    pool.on('release', function (connection) {
        console.log(`Release Event:\n[ThreadID: ${connection.threadId}] FREE: ${pool._freeConnections.length} / ALL: ${pool._allConnections.length} / MAX: ${pool.config.connectionLimit} / AQ: ${pool._acquiringConnections.length}\n ===`);
    });
}