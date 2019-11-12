function start(){
    return new Promise((resolve) => {
        console.log(`Starting test resource....`);
        setTimeout(() => {
            resolve(console.log('Successfully started test resource.'));
        }, 5000);
    });
}

module.exports.start = start;