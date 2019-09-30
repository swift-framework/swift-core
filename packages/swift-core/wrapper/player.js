//  This stops confusion between the RAGEMP API and Swift API
//  Variable names should be 'swift:{variableName}' again to keep consistent

/**
 *  Returns the players money amount.
 *  -   This helps developers from having to find out what the money variable is.
 */
mp.Player.prototype.getMoney = function(){
    return this.getVariable('swift:money');
};

mp.Player.prototype.setMoney = function(amount){
    if(isNaN(amount) || amount < 0) return;
    return this.setVariable('swift:money', parseInt(amount));
};

mp.Player.prototype.getGroup = function(){
    return this.getVariable('swift:group');
};