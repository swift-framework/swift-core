var gDate = new Date();
var year = gDate.getFullYear();
var month = gDate.getMonth();
var day = gDate.getDate();
var hour = gDate.getHours();
var minute = gDate.getMinutes();
var second = gDate.getSeconds();

var heartbeats = require('heartbeats');
var serverTime = heartbeats.createHeart(1000);

serverTime.createEvent(1, function(){
    second += swift.config.timeSpeed;
    if(second > 59){
        second = 0;
        minute +=1;
        if(minute > 59){
            minute = 0;
            hour += 1;
            if(hour > 23){
                hour = 0;
            }
        }
    }
});

mp.events.add('playerJoin', () => {
    mp.world.time.set(hour, minute, second);
});

module.exports = {
    getTime: () => {
        return `${hour}:${minute}:${second}`;
    },
    getFullDateTime: () => {
        return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    }
};