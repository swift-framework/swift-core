var mysql = require('mysql');

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