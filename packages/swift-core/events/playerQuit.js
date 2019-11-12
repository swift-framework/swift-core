mp.events.add('playerQuit', (player) => {
    if(player.loggedInAs == '') return clearTimeout(player.idleKick);
    if(player.deathTimer) clearTimeout(player.deathTimer);

    swift.auth.saveAccount(player);
});