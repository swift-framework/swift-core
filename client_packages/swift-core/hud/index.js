let money;

mp.events.addDataHandler('loggedIn', (entity, value) => {
    if(value){
        money = entity.getVariable('money');
        mp.game.stats.statSetInt(mp.game.joaat('SP0_TOTAL_CASH'), parseInt(money), true);
    }
});

mp.events.addDataHandler('money', (entity, value) => {
    money = value;
    mp.game.stats.statSetInt(mp.game.joaat('SP0_TOTAL_CASH'), parseInt(money), true);
});