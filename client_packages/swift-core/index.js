require('swift-core/login');
require('swift-core/hud');
require('swift-core/finance');
require('swift-core/keybinds.js');

mp.events.call('enableLoginCamera');

mp.events.add('changeMoney', (money) => {
    mp.game.stats.statSetInt(mp.game.joaat('SP0_TOTAL_CASH'), parseInt(money), true);
});