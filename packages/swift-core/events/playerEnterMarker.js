function playerEnterMarker(player, shape) {
    switch(shape.getVariable('colType')){
    case 'bank':
    {
        player.call('openBankUI');
        break;
    }
    default:
    {
        player.outputChatBox(`Marker isn't being handled ${shape.getVariable('colType')}`);
    }
    }
}

mp.events.add('playerEnterColshape', playerEnterMarker);