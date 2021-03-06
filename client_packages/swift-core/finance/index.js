let bankUI;
let bankMoney;

mp.events.addDataHandler('loggedIn', (entity, value) => {
    if(value) bankMoney = entity.getVariable('bAmount');
});

mp.events.addDataHandler('bAmount', (entity, value) => {
    bankMoney = value;
});

mp.events.add({'openBankUI': () => {
    !bankUI ? bankUI = mp.browsers.new('package://swift-core/finance/bank.html') : bankUI.active = true;
    bankUI.execute(`document.getElementById('mAmount').innerHTML = ${bankMoney}`);
    mp.gui.chat.activate(false);
    mp.gui.cursor.show(true, true);
},
'closeBankUI': () => {
    bankUI.active = false;
    mp.gui.chat.activate(true);
    mp.gui.cursor.show(false, false);
},
'bankAction': (action, amount) => {
    mp.events.callRemote('bankFunction', action, amount);
},
'changeMoney': (money) => {
    mp.game.stats.statSetInt(mp.game.joaat('SP0_TOTAL_CASH'), parseInt(money), true);
}
});

// eslint-disable-next-line no-unused-vars
function bankFunction(action){
    let money = document.getElementById(`${action}Value`);
    mp.trigger('bankAction', action, money.value);
}