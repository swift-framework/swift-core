/*
    Admin Levels
    1 - Moderator
    2 - Trial Admin
    3 - Administrator
    9 - Owner

*/
mp.events.addCommand({
    //  Moderator (Level 1)
    'ahelp': (player) => {
        if(player.adminlvl <= 0) {
            player.outputChatBox(`${swift.prefix.permission}`);
        }
        if(player.adminlvl > 0){
            player.outputChatBox('[1] /a, /ahelp, /mute, /unmute, /kick');
        }
        if(player.adminlvl > 1){
            player.outputChatBox('[2] /freeze, /unfreeze, /goto, /dimension, /tpto, /tphere, /ajail');
        }
        if(player.adminlvl > 2){
            player.outputChatBox('[3] /pos, /tempban, /ban, /gotocoord, /weapon, /veh, /skin');
        }
    },
    'a': (player, message) => {
        if(player.adminlvl <= 0) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!message) return player.outputChatBox(`${swift.prefix.syntax} /a [message]`);
        mp.players.forEach(user => {
            if(user.data.adminlvl > 0){
                user.outputChatBox(`!{FFF000}${player.name} [${player.adminlvl}]: !{FFF}${message}`);
            }
        });
    },
    'mute': (player, target) => {
        if(player.data.admin <= 0) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!target) return player.outputChatBox(`${swift.prefix.syntax} /mute [name/id]`);
        let user = swift.utility.findPlayer(target);
        if(user == null) return player.outputChatBox(`${swift.prefix.error} Player not found.`);
        user.data.mute = true;
        user.outputChatBox(`${swift.prefix.server} You have been muted by an administrator.`);
    },
    'unmute': (player, target) => {
        if(player.data.admin <= 0) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!target) return player.outputChatBox(`${swift.prefix.syntax} /unmute [name/id]`);
        let user = swift.utility.findPlayer(target);
        if(user == null) return player.outputChatBox(`${swift.prefix.error} Player not found.`);
        user.data.mute = false;
        user.outputChatBox(`${swift.prefix.server} You have been unmuted by an administrator.`);
    },
    'kick': (player, _, target, ...reason) => {
        if(player.data.admin <= 0) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!target || !reason) return player.outputChatBox(`${swift.prefix.syntax} /kick [name/id] [reason]`);
        let user = swift.utility.findPlayer(target);
        if(user == null) return player.outputChatBox(`${swift.prefix.error} Player not found.`);
        if(user.data.adminlvl > 0) return player.outputChatBox(`${swift.prefix.error} You cannot kick another administrator.`);
        let reasonMessage = reason.join(' ');
        user.outputChatBox(`${swift.prefix.server} You have been kicked from the server. Reason: ${reasonMessage}`);
        user.kick('Kicked.');
    },
    //  Trial Admin (Level 2)
    'freeze': (player, target) => {
        if(player.data.admin <= 1) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!target) return player.outputChatBox(`${swift.prefix.syntax} /freeze [name/id]`);
        let user = swift.utility.findPlayer(target);
        if(user == null) return player.outputChatBox(`${swift.prefix.error} Player not found.`);
        user.call('freezePlayer', [user]);
        user.outputChatBox(`${swift.prefix.server} You have been frozen by an administrator.`);
    },
    'unfreeze': (player, target) => {
        if(player.data.admin <= 1) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!target) return player.outputChatBox(`${swift.prefix.syntax} /unfreeze [name/id]`);
        let user = swift.utility.findPlayer(target);
        if(user == null) return player.outputChatBox(`${swift.prefix.error} Player not found.`);
        player.call('unfreezePlayer', [user]);
        user.outputChatBox(`${swift.prefix.server} You have been unfrozen by an administrator.`);
    },
    'goto': (player, location) => {
        if(player.data.admin <= 1) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!location) return player.outputChatBox(`${swift.prefix.syntax} /goto [location] - Use '/goto help' for locations`);
        switch(location.toLowerCase()){
        case 'help':
            player.outputChatBox(`${swift.prefix.info} Goto Locations: LSPD, FIB, Army, PaletoBay, GrapeSeed, SandyShores, Ajail`);
            break;
        case 'lspd':
            if(player.vehicle) return player.vehicle.position = new mp.Vector3(426.10, -977.90, 31);
            player.position = new mp.Vector3(426.10, -977.90, 31);
            break;
        case 'fib':
            if(player.vehicle) return player.vehicle.position = new mp.Vector3(95.89, -743.12, 46);
            player.position = new mp.Vector3(95.89, -743.12, 46);
            break;
        case 'army':
            if(player.vehicle) return player.vehicle.position = new mp.Vector3(-2230.69, 3316.90, 33.5);
            player.position = new mp.Vector3(-2230.69, 3316.90, 33.5);
            break;
        case 'paletobay':
            if(player.vehicle) return player.vehicle.position = new mp.Vector3(-405.08, 5988.11, 32);
            player.position = new mp.Vector3(-405.08, 5988.11, 32);
            break;
        case 'grapeseed':
            if(player.vehicle) return player.vehicle.position = new mp.Vector3(1683.45, 4777.93, 41.9);
            player.position = new mp.Vector3(1683.45, 4777.93, 41.9);
            break;
        case 'sandyshores':
            if(player.vehicle) return player.vehicle.position = new mp.Vector3(2050.84, 3722.94, 33);
            player.position = new mp.Vector3(2050.84, 3722.94, 33);
            break;
        case 'ajail':
            player.outputChatBox(`${swift.prefix.server} Your dimension was changed to 123456. Change it back to 0 when you want to leave.`);
            player.position = new mp.Vector3(464.16, -998.80, 24.91);
            break;
        default:
            player.outputChatBox(`${swift.prefix.syntax} /goto [location] - Use '/goto help' for locations`);
            break;
        }
    },
    'dimension': (player, _, target, dimension) => {
        if(player.data.admin <= 1) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!target || !dimension) return player.outputChatBox(`${swift.prefix.syntax} /dimension [name/id] [dimension]`);
        let user = swift.utility.findPlayer(target);
        if(user == null) return player.outputChatBox(`${swift.prefix.error} Player not found.`);
        user.dimension = parseInt(dimension);
        user.outputChatBox(`${swift.prefix.server} Your dimension has been set to: ${dimension}`);
    },
    'tpto': (player, target) => {
        if(player.data.admin <= 0) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!target) return player.outputChatBox(`${swift.prefix.syntax} /tpto [name/id]`);
        let user = swift.utility.findPlayer(target);
        if(user == null) return player.outputChatBox(`${swift.prefix.error} Player not found.`);
        player.position = new mp.Vector3(user.position.x + 2, user.position.y + 2, user.position.z);
        player.outputChatBox(`${swift.prefix.server} You have teleported to that player.`);
    },
    'tphere': (player, target) => {
        if(player.data.admin <= 0) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!target) return player.outputChatBox(`${swift.prefix.syntax} /tphere [name/id]`);
        let user = swift.utility.findPlayer(target);
        if(user == null) return player.outputChatBox(`${swift.prefix.error} Player not found.`);
        user.position = new mp.Vector3(player.position.x + 2, player.position.y + 2, player.position.z);
        user.outputChatBox(`${swift.prefix.server} You have been teleported to an administrator.`);
    },
    //  Administrator (Level 3)
    'pos': (player) => {
        if(player.data.admin <= 2) return player.outputChatBox(`${swift.prefix.permission}`);
        console.log(`Position: ${player.position.x.toFixed(2)} ${player.position.y.toFixed(2)} ${player.position.z.toFixed(2)}, ${player.heading.toFixed(2)}`);
        player.outputChatBox(`${swift.prefix.server} Position: ${player.position.x.toFixed(2)} ${player.position.y.toFixed(2)} ${player.position.z.toFixed(2)}, ${player.heading.toFixed(2)}`);
    },
    'veh': (player, veh_model) => {
        if(player.data.admin <= 2) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!veh_model) return player.outputChatBox(`${swift.prefix.syntax} /veh [vehicle_model]`);
        if(player.data.adminVeh) player.data.adminVeh.destroy();
        player.data.adminVeh = mp.vehicles.new(mp.joaat(veh_model), player.position,
            {
                heading: player.heading,
                numberPlate: 'ADMIN',
                engine: true,
                dimension: player.dimension
            });
        player.putIntoVehicle(player.data.adminVeh, -1);
        player.outputChatBox(`${swift.prefix.server} You have created an admin vehicle.`);
    },
    'lookup': (player, target) => {
        if(player.data.admin <= 2) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!target) return player.outputChatBox(`${swift.prefix.syntax} /lookup [name/id]`);
        let user = swift.utility.findPlayer(target);
        if(user == null) return player.outputChatBox(`${swift.prefix.error} Player not found.`);
        player.outputChatBox('===========[ Lookup Info ]===========');
        player.outputChatBox(`Username: [${user.name}], IP: [${user.ip}] Level: [${user.data.level}], Money: [${player.data.money}]`);
        player.outputChatBox(`Health: [${user.health}], Armour: [${user.armour}] Kills: [${user.data.kills}], Deaths: [${user.data.deaths}]`);
        player.outputChatBox(`Skin: [${user.model}], Logged In?: [${user.loggedInAs}] Social Club: [${player.socialClub}]`);
        player.outputChatBox('===========[ Lookup Info ]===========');
    },
    'weapon': (player, weapon_model) => {
        if(player.data.admin <= 2) return player.outputChatBox(`${swift.prefix.permission}`);
        player.giveWeapon(mp.joaat(weapon_model), 1000);
        player.outputChatBox(`${swift.prefix.server} You have received your weapon.`);
    },
    'gotocoord': (player, _, x, y, z) => {
        if(player.data.admin <= 2) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!x || !y || !z) return player.outputChatBox(`${swift.prefix.syntax} /gotocoord [x] [y] [z]`);
        player.position = new mp.Vector3(parseInt(x), parseInt(y), parseInt(z));
        player.outputChatBox(`${swift.prefix.server} You've been teleported to ${x} ${y} ${z}`);
    },
    'skin': (player, _, target, skinid) => {
        if(player.data.admin <= 2) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!target || !skinid) return player.outputChatBox(`${swift.prefix.syntax} /skin [name/id] [skin id]`);
        let user = swift.utility.findPlayer(target);
        if(user == null) return player.outputChatBox(`${swift.prefix.error} Player not found.`);
        user.model = skinid;
        user.outputChatBox(`${swift.prefix.server} Your player model has been updated.`);
    },
    'ban': (player, _, target, amount, type, ...reason) => {
        if(player.data.admin <= 2) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!target || !amount || !type || !reason || isNaN(amount)) return player.outputChatBox(`${swift.prefix.syntax} /ban [name/id] [amount] [hour/day/year] [reason] `);
        if(type != 'hour' && type != 'day' && type != 'year') return player.outputChatBox(`${swift.prefix.error} Type must be 'hour', 'day', or 'year'`);
        let user = swift.utility.findPlayer(target);
        if(user == null) return player.outputChatBox(`${swift.prefix.error} Player not found.`);
        if(user.data.adminlvl >= player.adminlvl) return player.outputChatBox(`${swift.prefix.error} You cannot ban an admin the same rank or higher than you.`);
        let reasonMsg = reason.join(' ');

        swift.db.handle.query(`INSERT INTO bans SET userID = ?, username = ?, adminID = ?, unbandate = (now() + INTERVAL ${amount} ${type.toUpperCase()}), reason = ?`, [user.sqlID, user.name, player.sqlID, reasonMsg], function(err){
            if(!err){
                user.outputChatBox(`${swift.prefix.server} You have been banned for the following reason:`);
                user.outputChatBox(`${reasonMsg}`);
                user.kick('You have been banned.');
            } else {
                console.log(swift.chalk.red(`[MySQL] ERROR: ${err.sqlMessage}\n[MySQL] QUERY: ${err.sql}`));
            }
        });
    },
    'sethealth': (player, _, target, health) => {
        if(player.data.admin <= 2) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!target || !health) return player.outputChatBox(`${swift.prefix.syntax} /sethealth [name/id] [amount]`);
        let user = swift.utility.findPlayer(target);
        if(user == null) return player.outputChatBox(`${swift.prefix.error} Player not found.`);
        user.health = parseInt(health);
        player.outputChatBox(`${swift.prefix.server} You've set ${user.name}'s health to ${health}`);
    },
    'setarmour': (player, _, target, armour) => {
        if(player.data.admin <= 2) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!target || !armour) return player.outputChatBox(`${swift.prefix.syntax} /setarmour [name/id] [amount]`);
        let user = swift.utility.findPlayer(target);
        if(user == null) return player.outputChatBox(`${swift.prefix.error} Player not found.`);
        user.armour = parseInt(armour);
        player.outputChatBox(`${swift.prefix.server} You've set ${user.name}'s armour to ${armour}`);
    },
    'ajail': (player, _, target, ...reason) => {
        if(player.data.admin <= 2) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!target || !reason) return player.outputChatBox(`${swift.prefix.syntax} /ajail [name/id] [reason]`);
        let user = swift.utility.findPlayer(target);
        if(user == null) return player.outputChatBox(`${swift.prefix.error} Player not found.`);
        if(user.data.adminlvl > 0) return player.outputChatBox(`${swift.prefix.error} You cannot jail another administrator.`);

        let reasonMsg = reason.join(' ');
        user.dimension = 123456;
        user.position = new mp.Vector3(459.89, -1001.46, 24.91);
        user.outputChatBox(`${swift.prefix.server} You have been jailed by an administrator. Reason: ${reasonMsg}`);
    },
    //  Owner (Level 9)
    'setadmin': (player, _, target, lvl) => {
        if(player.adminlvl <= 8) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!target || !lvl) return player.outputChatBox(`${swift.prefix.syntax} /setadmin [name/id] [level]`);
        let user = swift.utility.findPlayer(target);
        if(user == null) return player.outputChatBox(`${swift.prefix.error} Player not found.`);
        swift.db.handle.query('UPDATE `accounts` SET adminlvl = ? WHERE username = ?', [lvl, user.name], function(err){
            if(!err){
                user.data.adminlvl = lvl;
                player.outputChatBox(`${swift.prefix.server} ${user.name}'s admin rank has been updated to ${lvl}`);
            } else {
                console.log(swift.chalk.red(`[MySQL] ERROR: ${err.sqlMessage}\n[MySQL] QUERY: ${err.sql}`));
            }
        });
    },
    'setlevel': (player, _, target, lvl) => {
        if(player.adminlvl <= 8) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!target || !lvl) return player.outputChatBox(`${swift.prefix.syntax} /setlevel [name/id] [level]`);
        let user = swift.utility.findPlayer(target);
        swift.db.handle.query('UPDATE `accounts` SET level = ? WHERE username = ?', [lvl, user.name], function(err){
            if(!err){
                user.data.level = lvl;
                player.outputChatBox(`${swift.prefix.server} ${user.name}'s level has been updated to ${lvl}`);
            } else {
                console.log(swift.chalk.red(`[MySQL] ERROR: ${err.sqlMessage}\n[MySQL] QUERY: ${err.sql}`));
            }
        });
    },
    'setmoney': (player, _, target, amount) => {
        if(player.adminlvl <= 8) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!target || !amount) return player.outputChatBox(`${swift.prefix.syntax} /setmoney [name/id] [amount]`);
        let user = swift.utility.findPlayer(target);
        swift.db.handle.query('UPDATE `accounts` SET money = ? WHERE username = ?', [amount, user.name], function(err){
            if(!err){
                user.data.money = amount;
                player.outputChatBox(`${swift.prefix.server} ${user.name}'s money has been updated to ${amount}`);
            } else {
                console.log(swift.chalk.red(`[MySQL] ERROR: ${err.sqlMessage}\n[MySQL] QUERY: ${err.sql}`));
            }
        });
    },
    'createmarker': (player, _, type, scale) => {
        if(player.adminlvl <= 8) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!type || !scale || isNaN(scale)) return player.outputChatBox(`${swift.prefix.syntax} /createmarker [type] [scale]`);
        swift.utility.createMarker(type, player.position.x, player.position.y, player.position.z, scale);
        player.outputChatBox('Marker created');
    },
    'deletemarker': (player, markerID) => {
        if(player.adminlvl <= 8) return player.outputChatBox(`${swift.prefix.permission}`);
        if(isNaN(markerID) || !markerID) return player.outputChatBox(`${swift.prefix.syntax} /createmarker [type] [scale]`);
        swift.utility.deleteMarker(player, markerID);
        player.outputChatBox(`Marker ID: ${markerID} Deleted`);
    },
    'ipban': (player, _, ip, ...reason) => {
        if(player.data.admin <= 8) return player.outputChatBox(`${swift.prefix.permission}`);
        if(!ip || !reason) return player.outputChatBox(`${swift.prefix.syntax} /ipban [ip address] [reason]`);
        let reasonMsg = reason.join(' ');
        swift.db.handle.query('INSERT INTO `ip-bans` SET ip = ?, reason = ?', [ip, reasonMsg], function(err){
            if(!err){
                player.outputChatBox(`${swift.prefix.info}Banned IP: ${ip}`);
            } else {
                console.log(swift.chalk.red(`[MySQL] ERROR: ${err.sqlMessage}\n[MySQL] QUERY: ${err.sql}`));
            }
        });
    },
});