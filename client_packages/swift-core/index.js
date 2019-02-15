require('swift-core/login');
require('swift-core/hud');
require('swift-core/finance');

mp.keys.bind(0x72, true, function() {   // F3
    mp.gui.cursor.visible ? mp.gui.cursor.show(false, false) : mp.gui.cursor.show(true, true);
});