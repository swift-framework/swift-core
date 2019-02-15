module.exports = {
    registerAccount: function(player){
        player.data.money = swift.config.startingMoney;
        player.position = new mp.Vector3(-1037.85, -2735.51, 13.76);
        player.data.adminlvl = 0;
        player.health = swift.config.startingHealth;
        player.armour = swift.config.startingArmour;
        player.loggedInAs = player.name;
        player.data.limbo = false;
        player.data.bAmount = 50;
    },
    saveAccount: function(player){
        swift.db.handle.query('UPDATE `accounts` SET money = ?, posX = ?, posY = ?, posZ = ?, health = ?, armour = ?, bAmount = ? WHERE username = ?', [player.data.money, player.position.x.toFixed(2), player.position.y.toFixed(2), player.position.z.toFixed(2), player.health, player.armour, player.name, player.data.bAmount], function(err){
            if(err) return console.log(swift.chalk.red(`[MySQL] ERROR: ${err.sqlMessage}\n[MySQL] QUERY: ${err.sql}`));
        });
    },
    loadAccount: function(player){
        swift.db.handle.query('SELECT * FROM `accounts` WHERE username = ?', [player.name], function(err, res){
            if(!err){
                if(res.length){
                    res.forEach(function(playerData){
                        player.name = playerData.username;
                        player.sqlID = playerData.id;
                        player.data.money = playerData.money;
                        player.data.adminlvl = playerData.adminlvl;
                        player.position = new mp.Vector3(playerData.posX, playerData.posY, playerData.posZ);
                        player.health = playerData.health;
                        player.armour = playerData.armour;
                        player.loggedInAs = playerData.username;
                        player.data.loggedIn = true;
                        player.data.limbo = false;
                        player.data.bAmount = playerData.bAmount;
                    });
                    console.log(`${player.name} has logged in`);
                }
            } else {
                return console.log(swift.chalk.red(`[MySQL] ERROR: ${err.sqlMessage}\n[MySQL] QUERY: ${err.sql}`));
            }
        });
    }
};