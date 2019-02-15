require('swift-core/login');
require('swift-core/hud');
require('swift-core/finance');

mp.events.call('enableLoginCamera');

mp.keys.bind(0x72, true, function() {   // F3
    mp.gui.cursor.visible = !mp.gui.cursor.visible;
});