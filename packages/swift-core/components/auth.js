var bcrypt = require('bcrypt-nodejs');

module.exports = {
    registerAccount: function(player){
        player.setVariable('swift:money', swift.config.startingMoney);
        player.position = new mp.Vector3(-1037.85, -2735.51, 13.76);
        player.setVariable('swift:group', 1);
        player.health = swift.config.startingHealth;
        player.armour = swift.config.startingArmour;
        player.loggedInAs = player.name;
        player.data.loggedIn = true;
        player.data.limbo = false;
        player.data.bAmount = 50;
        player.call('loginHandler', ['registered']);
    },
    saveAccount: async function(player){     //  Save account cannot use player object inside then()
        let name = player.name;
        let ip = player.ip;
        await swift.db.query('UPDATE `accounts` SET money = ?, posX = ?, posY = ?, posZ = ?, health = ?, armour = ?, bAmount = ? WHERE username = ?', [player.getVariable('swift:money'), player.position.x.toFixed(2), player.position.y.toFixed(2), player.position.z.toFixed(2), player.health, player.armour, player.data.bAmount, player.name]).then(() => {
            console.log(`${swift.chalk.red(name)}'s account data saved successfully.`);
            console.log(`${swift.chalk.red(name)} has quit the server. [${ip}]`);
        }).catch(e => { console.log(`${swift.chalk.red('Error Saving Account')}: ${e}`)})
    },
    loadAccount: async function(player){
        await swift.db.query('SELECT * FROM `accounts` WHERE username = ?', [player.name]).then(([res]) => {
            if(res.length){
                player.name = res[0]['username'];
                player.sqlID = res[0]['id'];
                player.setVariable('swift:money', res[0]['money']);
                player.setVariable('swift:group', res[0]['grouplvl']);
                player.position = new mp.Vector3(res[0]['posX'], res[0]['posY'], res[0]['posZ']);
                player.health = res[0]['health'];
                player.armour = res[0]['armour'];
                player.loggedInAs = res[0]['username'];
                player.data.loggedIn = true;
                player.data.limbo = false;
                player.data.bAmount = res[0]['bAmount'];
            }
            player.call('loginHandler', ['success']);
        }).catch(e => { console.log(`${swift.chalk.red('Error Loading Account')}: ${e}`)})
    }
};

mp.events.add('sendDataToServer', async function(player, username, email, pass, state) {
    let loggedAccount = mp.players.toArray().find(p => p.loggedInAs == username);
    switch(state){
    case 0: //Login State
    {
        if(loggedAccount){
            player.call('loginHandler', ['logged']);
        } else {
            try {
                await attemptLogin(player, username, pass);
            } catch (e) {
                console.log(e)
            }
        }
        break;
    }
    case 1: //Register State
    {
        if(username.length >= 3 && pass.length >= 5){
            if(validEmail(email) && validUsername(username)){
                try {
                    await attemptRegister(player, username, email, pass)
                } catch(e) { console.log(e) }
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

function attemptRegister(player, username, email, pass){
    return new Promise(async function(resolve, reject){
        await swift.db.query('SELECT * FROM `accounts` WHERE `username` = ? OR `email` = ?', [username, email]).then(([rows]) => {
            // console.log(`${JSON.stringify(rows)} ${rows.length} ${rows == null}`)
            if(rows.length === 0){   //  Account was not found and available to register
                bcrypt.hash(pass, null, null, function(err, hash) {
                    if(err) reject(console.log(`${swift.chalk.red('[BCrypt]')}: ${err}`));
                    swift.db.query('INSERT INTO `accounts` SET username = ?, email = ?, password = ?', [username, email, hash]).then(() => {
                        player.name = username;
                        swift.auth.registerAccount(player);
                        clearTimeout(player.idleKick);
                        resolve(console.log(`${swift.chalk.green(username)} has just registered.`));
                    }).catch(e => {
                        reject(console.log(swift.chalk.red(`[MySQL] ERROR: ${e.sqlMessage}\n[MySQL] QUERY: ${e.sql}`)));
                    });
                });
            } else {
                player.call('loginHandler', ['takeninfo']);
                reject(`${swift.chalk.red(player.name)} Invalid registration attempt. [${player.ip}]`);
            }
        });
    })
}

function attemptLogin(player, username, password){
    return new Promise(async function(resolve, reject){
        await swift.db.query('SELECT `password` FROM `accounts` WHERE `username` = ?; SELECT `unbandate`, `reason` FROM `bans` WHERE `unbandate` > NOW() AND `username` = ?;', [username, username]).then(([res]) => {
            if(res[0].length === 1){ //  Account exists
                if(res[1].length > 0){  //  If a result is found when searching for banned user
                    player.call('loginHandler', ['banned']);
                    reject(`${swift.chalk.red(player.name)} attempted login while banned. [${player.ip}]`);
                }
                bcrypt.compare(password, res[0][0]['password'], function(err, bcryptRes){
                    if(err) reject(`BCRYPT ERR: ${err}`);
                    if(bcryptRes){    //  Correct password
                        player.name = username;
                        swift.events.emit('swift:playerLogin', player);
                        swift.auth.loadAccount(player);
                        clearTimeout(player.idleKick);
                        resolve(console.log(`${swift.chalk.green(player.name)} Successfully logged in. [${player.ip}]`));
                    } else {
                        player.call('loginHandler', ['incorrectinfo']);
                        resetTimeout(player);
                        reject(`${swift.chalk.red(player.name)} Incorrect login information attempt to username '${username}' [${player.ip}]`);
                    }
                })
            } else {
                player.call('loginHandler', ['incorrectinfo']);
                resetTimeout(player);
                reject(`${swift.chalk.red(player.name)} Incorrect login information attempt to username '${username}' [${player.ip}]`);
            }
        }).catch(e => { console.log(swift.chalk.red(`[MySQL] ERROR: ${e.sqlMessage}\n[MySQL] QUERY: ${e.sql}`)) });
    })
}