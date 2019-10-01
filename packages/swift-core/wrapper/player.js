/**
 *  Returns the players money amount.
 *  This helps developers from having to find out what the money variable is.
 *  @return {int} Amount of money
 */
mp.Player.prototype.getMoney = function(){
    return this.getVariable('swift:money');
};

/**
 *  Sets the player's money (Do not get this confused with addMoney()).
 *  @param {int} amount - Amount of money to set
 *  @example
 *      player.setMoney(5000);
 */
mp.Player.prototype.setMoney = function(amount){
    if(isNaN(amount) || amount < 0) return this.outputChatBox(`${swift.prefix.error} You must enter a valid number.`);
    this.setVariable('swift:money', parseInt(amount));
};

/**
 *  Add's money on top of the player's current amount.
 *  @param {int} amount - Amount of money to add
 *  @example
 *      player.addMoney(5000);
 */
mp.Player.prototype.addMoney = function(amount){
    if(isNaN(amount) || amount < 0) return this.outputChatBox(`${swift.prefix.error} You must enter a valid number.`);
    let money = this.getMoney() + parseInt(amount);
    this.setVariable('swift:money', money);
};

/**
 *  Removes money off of the player's current amount.
 *  @param {int} amount - Amount of money to remove
 *  @example
 *      player.removeMoney(5000);
 */
mp.Player.prototype.removeMoney = function(amount){
    if(isNaN(amount) || amount < 0) return this.outputChatBox(`${swift.prefix.error} You must enter a valid number.`);
    if(this.getMoney < amount) return false;
    let money = this.getMoney() - parseInt(amount);
    this.setVariable('swift:money', money);
};

/**
 *  Sends money from one player to another player.
 *  @param {object} target - The target player you want to send the money to
 *  @param {int} amount - The amount of money to send to the target player
 */
mp.Player.prototype.sendMoney = function(target, amount){
    if(isNaN(amount) || amount < 0) return this.outputChatBox(`${swift.prefix.error} You must enter a valid number.`);
    if(this.getMoney < amount) return this.outputChatBox(`${swift.prefix.error} You do not have enough money to send.`);
    target.addMoney(amount);
    this.removeMoney(amount);
};

/**
 *  Returns the group the player is apart of
 *  @return {int} Group ID
 */
mp.Player.prototype.getGroup = function(){
    return this.getVariable('swift:group');
};

/**
 *  Sets the group ID of the player
 *  @param {int} id - Group ID
 */
mp.Player.prototype.setGroup = function(id){
    if(swift.group.getGroup(id) == undefined) return this.outputChatBox(`${swift.prefix.error} Group failed to change (does not exist).`);
    this.setVariable('swift:group', id);
    this.outputChatBox(`${swift.prefix.info} Your group has been updated.`);
};