mp.events.add('playerQuit', (player) => {
    if(player.deathTimer) clearTimeout(player.deathTimer);
    if(player.loggedInAs != ''){
        swift.auth.saveAccount(player);
        console.log(`${swift.chalk.red(player.name)} has quit the server.`);
    } else {
        clearTimeout(player.idleKick);
    }
});