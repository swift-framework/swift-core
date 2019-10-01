mp.events.addCommand({
    'stats': (player) => {
        player.outputChatBox(`!{#42f49e}========== [ !{#fff}${player.name}'s Stats !{#42f49e}] ==========`);
        player.outputChatBox(`!{#9effd0}Level: [${player.getMoney()}], Group: [${player.getGroup()}]`);
        player.outputChatBox(`!{#9effd0}Health: [${player.health}], Armour: [${player.armour}], Money: [$${player.getMoney()}], Bank: [$${player.getVariable('bAmount')}]`);
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
        let target = swift.utility.findPlayer(user);
        if(target.dist(player.position) >= 5) return player.outputChatBox(`${swift.prefix.error} That player is too far away from you.`);
        player.sendMoney(target, amount);
        mp.players.broadcastInRange(player.position, 10, `!{#d19aed}* ${player.name} hands over money to ${target.name}`);
        player.outputChatBox(`${swift.prefix.info} You have just paid ${target.name} $${amount}`);
        target.outputChatBox(`${swift.prefix.info} You have just received $${amount} from ${player.name}`);
    }
});