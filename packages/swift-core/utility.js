module.exports = {
    'findPlayer': (name) => {
        let match;
        if(name == parseInt(name)){
            return mp.players.at(name);
        } else {
            let username = name.toLowerCase();
            mp.players.forEach((pInfo) => {
                if(pInfo.name.toLowerCase() == username){ match = pInfo; }
            });
            return match;
        }
    }
};

process.on('SIGINT', shutdownProcess);  // Runs when you Ctrl + C in console
process.on('SIGHUP', shutdownProcess);  // Runs when you press the 'Close' button on your server.exe window

function shutdownProcess(){
    console.log('Shutdown sequence initiated. Server closing.');
    mp.players.forEach(user => {
        if(user.loggedInAs != ''){
            swift.auth.saveAccount(user);
        }
    });
    console.log('All player data successfully saved.');
    process.exit(0);
}