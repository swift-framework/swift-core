mp.events.add('playerQuit', (player) => {
    if(player.loggedInAs != ''){
        swift.auth.saveAccount(player);
    } else {
        clearTimeout(player.idleKick);
    }
});