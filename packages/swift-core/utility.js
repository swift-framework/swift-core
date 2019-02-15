module.exports = {
    'findPlayer': (name) => {
        let match;
        if(name == parseInt(name)){
            return mp.players.at(name);
        } else {
            let username = name.toLowerCase();
            mp.players.forEach((pInfo) => {
                if(pInfo.name.toLowerCase() == username){ match = pInfo; }
            });
            return match;
        }
    },
    'createMarker': (type, x, y, z, scale) => {
        swift.db.handle.query('INSERT INTO `markers` VALUES (?, ?, ?, ?, ?, ?)', [null, type, x.toFixed(2), y.toFixed(2), z.toFixed(2), scale], function(err, res){
            if(err) return console.log(swift.chalk.red(`[MySQL] ERROR: ${err.sqlMessage}\n[MySQL] QUERY: ${err.sql}`));
            swift.markers[res.insertId] = mp.markers.new(1, new mp.Vector3(x, y, z - 1.5), scale, { color: [127, 216, 88, 255] });
            swift.colshapes[res.insertId] = mp.colshapes.newSphere(x, y, z, 1.5);
            swift.colshapes[res.insertId].setVariable('colType', type);
        });
    },
    'loadMarkers': () => {
        swift.db.handle.query('SELECT * FROM `markers`', [], function(err, rows){
            rows.forEach(markerData => {
                swift.markers[markerData.id] = mp.markers.new(1, new mp.Vector3(markerData.x, markerData.y, markerData.z - 1.5), markerData.scale, { color: [127, 216, 88, 255] });
                swift.colshapes[markerData.id] = mp.colshapes.newSphere(markerData.x, markerData.y, markerData.z, 1.5);
                swift.colshapes[markerData.id].setVariable('colType', markerData.type);
            });
            console.log(`Markers loaded: ${rows.length}`);
        });
    },
    'deleteMarker': (player, markerID) => {
        swift.db.handle.query('DELETE FROM `markers` WHERE id = ?', [markerID], function(err, rows){
            if(err) return console.log(swift.chalk.red(`[MySQL] ERROR: ${err.sqlMessage}\n[MySQL] QUERY: ${err.sql}`));
            if(rows.affectedRows <= 0) return player.outputChatBox(`${swift.prefix.error}No marker found with that ID.`);
            swift.markers[markerID].destroy();
            swift.colshapes[markerID].destroy();
            delete swift.markers[markerID];
            delete swift.colshapes[markerID];
        });
    }
};

process.on('SIGINT', shutdownProcess);  // Runs when you Ctrl + C in console
process.on('SIGHUP', shutdownProcess);  // Runs when you press the 'Close' button on your server.exe window

function shutdownProcess(){
    console.log('Shutdown sequence initiated. Server closing.');
    mp.players.forEach(user => {
        if(user.loggedInAs != ''){
            swift.auth.saveAccount(user);
        }
    });
    console.log('All player data successfully saved.');
    process.exit(0);
}