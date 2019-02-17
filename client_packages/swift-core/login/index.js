var loginBrowser = mp.browsers.new('package://swift-core/login/index.html');
let loginCam = mp.cameras.new('default', new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0), 40);
mp.gui.cursor.show(true, true);

mp.events.add('loginDataToServer', (user, email, pass, state) => {
    mp.events.callRemote('sendDataToServer', user, email, pass, state);
});

mp.events.add('loginHandler', (handle) => {
    switch(handle){
    case 'success':
    {
        loginBrowser.destroy();
        mp.gui.chat.push('Welcome back to Swift Roleplay!');
        mp.gui.chat.activate(true);
        mp.gui.cursor.show(false, false);
        mp.events.call('disableLoginCamera');
        break;
    }
    case 'registered':
    {
        loginBrowser.destroy();
        mp.gui.chat.push('Registration successful. Welcome to Swift Roleplay!');
        mp.gui.chat.activate(true);
        mp.gui.cursor.show(false, false);
        mp.events.call('disableLoginCamera');
        break;
    }
    case 'kicked':
    {
        loginBrowser.destroy();
        break;
    }
    case 'incorrectinfo':
    {
        loginBrowser.execute(`$('.incorrect-info').show(); $('#loginBtn').show();`);
        break;
    }
    case 'takeninfo':
    {
        loginBrowser.execute(`$('.taken-info').show(); $('#registerBtn').show();`);
        break;
    }
    case 'tooshort':
    {
        loginBrowser.execute(`$('.short-info').show(); $('#registerBtn').show();`);
        break;
    }
    case 'logged':
    {
        loginBrowser.execute(`$('.logged').show(); $('#loginBtn').show();`);
        break;
    }
    case 'invalid-info':
    {
        loginBrowser.execute(`$('.invalid-info').show(); $('#registerBtn').show();`);
        break;
    }
    case 'banned':
    {
        loginBrowser.execute(`$('.banned').show();`);
        break;
    }
    default:
    {
        break;
    }
    }
});

mp.events.add('enableLoginCamera', () => {
    mp.players.local.position = new mp.Vector3(-1757.12, -739.53, 10);
    mp.players.local.freezePosition(true);
    mp.game.ui.setMinimapVisible(true);
    mp.game.ui.displayRadar(false);

    loginCam.setActive(true);
    loginCam.setCoord(-1757.12, -739.53, 25);
    loginCam.pointAtCoord(-1764, -715, 35);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
});

mp.events.add('disableLoginCamera', () => {
    mp.game.cam.renderScriptCams(false, false, 0, false, false);
    mp.players.local.freezePosition(false);
    mp.game.ui.setMinimapVisible(false);
    mp.game.ui.displayRadar(true);
});