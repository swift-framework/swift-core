//  Bank Blips
mp.blips.new(108, new mp.Vector3(230.05, 214.36, 0), { name: 'Bank', color: 2, shortRange: true });

module.exports = {
    generateBankID: function(){
        return Math.floor(Math.random() * (999999999 - 100000000) ) + 100000000;
    },
    depositMoney: function(user, amount){
        if(user.data.money < amount) return user.outputChatBox(`${swift.prefix.server} You do not have that much to deposit`);
    }
};