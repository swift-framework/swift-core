swift.groupData = [];

swift.db.query('SELECT * FROM `groups`', [], function(err, res) {
    if(err) return console.log(swift.chalk.red(`[MySQL] ERROR: ${err.sqlMessage}\n[MySQL] QUERY: ${err.sql}`));
    res.forEach(function(group){
        swift.groupData.push(group);
    });
    console.log(`${swift.chalk.green('[Swift-Groups]')} ${swift.groupData.length} groups loaded.`);
});


module.exports = {
    addGroup: function(player, name, level){
        let group = swift.group.getGroup(name);
        let grouplevel = parseInt(level);
    
        if(group === undefined){ //  Check if a group with the same name exists
            
            let res = swift.groupData.find(group => { return group.id === grouplevel; });
            if(res === undefined){ //  Check if a group with the same level exists
                swift.db.query('INSERT INTO `groups` VALUES (?, ?, ?)', [level, name, 0], function(err, res){
                    if(err) return console.log(swift.chalk.red(`[MySQL] ERROR: ${err.sqlMessage}\n[MySQL] QUERY: ${err.sql}`));
                    swift.groupData.push({'id': level, 'name': name, 'protected': 0});
                    player.outputChatBox(`${swift.prefix.server} The group ${name} has been created`);
                });
            } else {
                player.outputChatBox(`${swift.prefix.error} A group already exists with that level`);
            }
        } else {
            player.outputChatBox(`${swift.prefix.error} A group already exists with that name.`);
        }
    },
    removeGroup: function(player, name){
        let group = swift.group.getGroup(name);
        if(group.protected === 1) return player.outputChatBox(`${swift.prefix.error} You cannot delete a protected group.`);
        if(group === undefined) return player.outputChatBox(`${swift.prefix.error} No group found with that name.`);
        swift.db.query('DELETE FROM `groups` WHERE name = ?', [name], function(err){
            if(err) return console.log(swift.chalk.red(`[MySQL] ERROR: ${err.sqlMessage}\n[MySQL] QUERY: ${err.sql}`));
            swift.groupData.splice((swift.groupData.findIndex(e => e.name == name)), 1);
            player.outputChatBox(`${swift.prefix.info} Group deleted`);
        });
    },
    getGroup: function(data){
        if(data == parseInt(data)){
            let result = swift.groupData.find(group => {
                return group.id == data;
            });
            return result;
        } else {
            let result = swift.groupData.find(group => {
                return group.name.toLowerCase() == data.toLowerCase();
            });
            return result;
        }
    }
};

mp.events.add('playerJoin', player => { //  Sets default group to 0[Guest]
    player.setVariable('swift:group', 0);
});