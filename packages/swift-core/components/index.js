const test = require('./test.js');
const test2 = require('./test2.js');

swift.auth = require('./auth.js');
swift.group = require('./groups.js');


async function initModules(){
    try {
        await test.start();
        await swift.group.start();
        await test2.start();
    } catch(e){
        console.log(e);
    }
}

module.exports.initModules = initModules;