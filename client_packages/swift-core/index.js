require('swift-core/login');
require('swift-core/hud');
require('swift-core/finance');
require('swift-core/keybinds.js');

let isFrozen = false;

mp.events.call('enableLoginCamera');

mp.events.add({
    'render': () => {
        if(isFrozen) mp.game.controls.disableAllControlActions(0);
    },
    'freezePlayer': (user) => {
        user.freezePosition(true);
        isFrozen = true;
    },
    'unfreezePlayer': (user) => {
        user.freezePosition(false);
        isFrozen = false;
    }
});

//  Set all stats to max for all players to be equal
mp.game.stats.statSetInt(mp.game.joaat('SP0_STAMINA'), 100, false);
mp.game.stats.statSetInt(mp.game.joaat('SP0_STRENGTH'), 100, false);
mp.game.stats.statSetInt(mp.game.joaat('SP0_LUNG_CAPACITY'), 100, false);
mp.game.stats.statSetInt(mp.game.joaat('SP0_WHEELIE_ABILITY'), 100, false);
mp.game.stats.statSetInt(mp.game.joaat('SP0_FLYING_ABILITY'), 100, false);
mp.game.stats.statSetInt(mp.game.joaat('SP0_SHOOTING_ABILITY'), 100, false);
mp.game.stats.statSetInt(mp.game.joaat('SP0_STEALTH_ABILITY'), 100, false);
