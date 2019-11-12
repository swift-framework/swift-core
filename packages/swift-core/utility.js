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