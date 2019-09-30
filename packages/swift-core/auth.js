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
        swift.db.handle.query('UPDATE `accounts` SET money = ?, posX = ?, posY = ?, posZ = ?, health = ?, armour = ?, bAmount = ? WHERE username = ?', [player.getVariable('swift:money'), player.position.x.toFixed(2), player.position.y.toFixed(2), player.position.z.toFixed(2), player.health, player.armour, player.data.bAmount, player.name], function(err){
            if(err) return console.log(swift.chalk.red(`[MySQL] ERROR: ${err.sqlMessage}\n[MySQL] QUERY: ${err.sql}`));
        });
    },
    loadAccount: function(player){
        swift.db.handle.query('SELECT * FROM `accounts` WHERE username = ?', [player.name], function(err, res){
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