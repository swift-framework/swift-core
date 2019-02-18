//  Bank Blips
mp.blips.new(108, new mp.Vector3(230.05, 214.36, 0), { name: 'Bank', color: 2, shortRange: true });

module.exports = {
    generateBankID: function(){
        return Math.floor(Math.random() * (999999999 - 100000000) ) + 100000000;
    }
};

mp.events.add('bankFunction', (player, action, amount) => {
    switch(action){
    case 'deposit':
    {
        if(player.data.money < amount) return player.outputChatBox(`${swift.prefix.error} You do not have that much money to deposit.`);
        if(amount < 0) return player.outputChatBox(`${swift.prefix.error} You cannot deposit less than $0.`);
        player.data.money -= parseInt(amount);
        player.data.bAmount += parseInt(amount);
        break;
    }
    case 'withdraw':
    {
        if(player.data.bAmount < amount) return player.outputChatBox(`${swift.prefix.error} You do not have that much money to withdraw.`);
        if(amount < 0) return player.outputChatBox(`${swift.prefix.error} You cannot withdraw less than $0.`);
        player.data.money += parseInt(amount);
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