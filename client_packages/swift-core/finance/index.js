let bankUI;

mp.events.add({'openBankUI': () => {
    !bankUI ? bankUI = mp.browsers.new('package://swift-core/finance/bank.html') : bankUI.active = true;
    bankUI.execute(`document.getElementById('mAmount').innerHTML += ${mp.players.local.getVariable('bAmount')}`);
    mp.gui.cursor.show(true, true);
},
'closeBankUI': () => {
    bankUI.execute(`document.getElementById('mAmount').innerHTML = ''`);
    bankUI.active = false;
    mp.gui.cursor.show(false, false);
}
});