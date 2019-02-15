mp.events.add('render', () => {
    let money = mp.players.local.getVariable('money');
    if(mp.players.local.getVariable('loggedIn')) mp.game.graphics.drawText(`~g~$~w~${money}`, [0.19, 0.81], { font: 7, color: [255,255,255,255], scale: [0.8, 0.8] });
});