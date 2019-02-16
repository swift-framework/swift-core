mp.events.addCommand({
    'stats': (player) => {
        player.outputChatBox(`!{#42f49e}========== [ !{#fff}${player.name}'s Stats !{#42f49e}] ==========`);
        player.outputChatBox(`!{#9effd0}Level: [${player.data.money}], Admin: [${player.adminlvl}]`);
        player.outputChatBox(`!{#9effd0}Health: [${player.health}], Armour: [${player.armour}], Money: [$${player.data.money}], Bank: [$0]`);
    },
    'time': (player) => {
        player.outputChatBox(`Time: ${swift.time.getTime()}`);
    },
    'help': (player) => {
        player.outputChatBox('/stats, /time, /pay');
        player.outputChatBox('/me, /do, /b');
    },
    'pay': (player, _, user, amount) => {
        if(!user || !amount) return player.outputChatBox(`${swift.prefix.syntax} /pay [name/id] [amount]`);
        if(isNaN(amount) || amount <= 0) return player.outputChatBox(`${swift.prefix.error} You must enter a valid number.`);
        if(player.data.money < amount) return player.outputChatBox(`${swift.prefix.error} You do not have that much money`);
        let target = swift.utility.findPlayer(user);
        if(target === player) return player.outputChatBox(`${swift.prefix.error} You cannot pay yourself.`);
        if(target.dist(player.position) >= 5) return player.outputChatBox(`${swift.prefix.error} That player is too far away from you.`);
        target.data.money += parseInt(amount);
        player.data.money -= parseInt(amount);
        mp.players.broadcastInRange(player.position, 10, `!{#d19aed}* ${player.name} hands over money to ${target.name}`);
        player.outputChatBox(`${swift.prefix.info} You have just paid ${target.name} $${amount}`);
        target.outputChatBox(`${swift.prefix.info} You have just received $${amount} from ${player.name}`);
    }
});