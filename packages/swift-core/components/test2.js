function start(){
    return new Promise((resolve) => {
        console.log(`Starting test2 resource....`);
        setTimeout(() => {
            resolve(console.log('Successfully started test2 resource.'));
        }, 3000);
    });
}

module.exports.start = start;