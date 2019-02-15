mp.events.add('playerCommand', (player, command) => {		
    player.outputChatBox(`${swift.prefix.error} /${command} is not a valid command. Use /help to find a list of commands.`);
});