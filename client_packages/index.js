let isFrozen = false;

require('swift-core');

mp.gui.chat.activate(false);

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