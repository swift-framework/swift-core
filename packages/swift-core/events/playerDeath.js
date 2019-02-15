mp.events.add('playerDeath', (player) => {
    if(player.data.limbo){
        player.outputChatBox(`${swift.prefix.info} You have passed out from the pain. You're being sent to the hospital where you'll be revived.`);
        player.data.limbo = false;
        player.deathTimer = setTimeout(function(){
            player.spawn(new mp.Vector3(-1037.85, -2735.51, 13.76));
        }, 5000);
    } else {
        player.outputChatBox(`${swift.prefix.info} You have been critically injured. If a medic does not revive you soon you might faint.`);
        player.spawn(player.position);
        player.health = 10;
        player.data.limbo = true;
    }
});