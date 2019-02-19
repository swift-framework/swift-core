mp.events.add('playerJoin', (player) => {
    if(swift.ipbans.indexOf(player.ip) != -1) return player.kick('IP Banned');
    player.loggedInAs = '';
    player.data.loggedIn = false;
    player.idleKick = setTimeout(() => {
        player.outputChatBox(`${swift.prefix.server} You were kicked for idling too long.`);
        player.call('loginHandler', ['kicked']);
        player.kick();
    }, 60000);
});