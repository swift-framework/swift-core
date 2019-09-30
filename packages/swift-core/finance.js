//  Bank Blips
mp.blips.new(108, new mp.Vector3(230.05, 214.36, 0), { name: 'Bank', color: 2, shortRange: true });
mp.markers.new(1, new mp.Vector3(237.17, 217.55, 104.89), 1.5, { color: [0, 255, 0, 255] });
let bankColshape = mp.colshapes.newSphere(237.17, 217.55, 105.29, 1.5);
bankColshape.setVariable('colType', 'bank');

mp.events.add('bankFunction', (player, action, amount) => {
    switch(action){
    case 'deposit':
    {
        let money = player.getMoney();
        if(player.getVariable('swift:money') < amount) return player.outputChatBox(`${swift.prefix.error} You do not have that much money to deposit.`);
        if(amount < 0) return player.outputChatBox(`${swift.prefix.error} You cannot deposit less than $0.`);
        player.setVariable('swift:money', money - parseInt(amount));
        player.data.bAmount += parseInt(amount);
        break;
    }
    case 'withdraw':
    {
        let money = player.getMoney();
        if(player.data.bAmount < amount) return player.outputChatBox(`${swift.prefix.error} You do not have that much money to withdraw.`);
        if(amount < 0) return player.outputChatBox(`${swift.prefix.error} You cannot withdraw less than $0.`);
        player.setVariable('swift:money', money + parseInt(amount));
        player.data.bAmount -= parseInt(amount);
        break;
    }
    default:
    {
        player.outputChatBox(`Bank Error, report to server developer.`);
        break;
    }
    }
});