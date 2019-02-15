mp.events.add('playerDeath', () => {
    mp.game.ui.setMinimapVisible(true); /* this is reversed */
    mp.game.ui.displayRadar(false);
});