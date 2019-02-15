function rangeChat(player, range, chat, suffix){
    if(player.data.mute) return player.outputChatBox(`${swift.prefix.error} You cannot talk while you are muted.`);
    if(!suffix){
        mp.players.broadcastInRange(player.position, range, `${player.name}: ${chat}`);
    } else {
        mp.players.broadcastInRange(player.position, range, `${player.name} ${suffix}: ${chat}`);
    }
}

mp.events.add('playerChat', (player, text) => { //  Local chat
    rangeChat(player, 10, text, 'says');
});

mp.events.addCommand({
    's': (player, text) => {
        rangeChat(player, 20, text, 'shouts');
    },
    'w': (player, text) => {
        rangeChat(player, 5, text, 'whispers');
    },
    'b': (player, text) => {
        if(player.data.mute) return player.outputChatBox(`${swift.prefix.error} You cannot talk while you are muted.`);
        mp.players.broadcastInRange(player.position, 10, `!{#bfbfbf}(( ${player.name} )): ${text}`);
    },
    'me': (player, text) => {
        if(player.data.mute) return player.outputChatBox(`${swift.prefix.error} You cannot talk while you are muted.`);
        mp.players.broadcastInRange(player.position, 10, `!{#d19aed}* ${player.name} ${text}`);
    },
    'do': (player, text) => {
        if(player.data.mute) return player.outputChatBox(`${swift.prefix.error} You cannot talk while you are muted.`);
        mp.players.broadcastInRange(player.position, 10, `!{#d19aed}* ${text} (( ${player.name} ))`);
    }
});