function Log(stack, level, package, message) {
    console.log(`LOG: [${level.toUpperCase()}] ${message}`);
}
module.exports = { Log };