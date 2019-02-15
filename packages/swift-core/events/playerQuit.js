mp.events.add('playerQuit', (player) => {
    if(player.deathTimer) clearTimeout(player.deathTimer);
    if(player.loggedInAs != ''){
        swift.auth.saveAccount(player);
    } else {
        clearTimeout(player.idleKick);
    }
});