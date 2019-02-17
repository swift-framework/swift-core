let money;
let enableHud = false;

mp.events.addDataHandler('loggedIn', (entity, value) => {
    if(value){
        money = entity.getVariable('money');
        enableHud = true;
    }
});

mp.events.addDataHandler('money', (entity, value) => {
    money = value;
});

mp.events.add('render', () => {
    if(enableHud) mp.game.graphics.drawText(`~g~$~w~${money}`, [0.21, 0.81], { font: 7, color: [255,255,255,255], scale: [0.8, 0.8] });
});