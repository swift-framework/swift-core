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
    },
    saveAccount: function(player){
        swift.db.query('UPDATE `accounts` SET money = ?, posX = ?, posY = ?, posZ = ?, health = ?, armour = ?, bAmount = ? WHERE username = ?', [player.getVariable('swift:money'), player.position.x.toFixed(2), player.position.y.toFixed(2), player.position.z.toFixed(2), player.health, player.armour, player.data.bAmount, player.name], function(err){
            if(err) return console.log(swift.chalk.red(`[MySQL] ERROR: ${err.sqlMessage}\n[MySQL] QUERY: ${err.sql}`));
        });
    },
    loadAccount: function(player){
        swift.db.query('SELECT * FROM `accounts` WHERE username = ?', [player.name], function(err, res){
            if(!err){
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
                    console.log(`${swift.chalk.green(player.name)} has logged in. [${player.ip}]`);
                }
            } else {
                return console.log(swift.chalk.red(`[MySQL] ERROR: ${err.sqlMessage}\n[MySQL] QUERY: ${err.sql}`));
            }
        });
    }
};

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