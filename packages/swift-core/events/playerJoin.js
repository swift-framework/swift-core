mp.events.add('playerJoin', (player) => {
    console.log(`${player.name} has joined. [${player.ip}]`);
    player.loggedInAs = '';
    player.data.loggedIn = false;
    player.idleKick = setTimeout(() => {
        player.outputChatBox(`${swift.prefix.server} You were kicked for idling too long.`);
        player.call('loginHandler', ['kicked']);
        player.kick();
    }, 60000);
});