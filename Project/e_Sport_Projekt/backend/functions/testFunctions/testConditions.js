const sumArgs = (...args) => {
    let sum = 0;
    for (let arg of args) {
        sum += arg;
    }
    return sum;
};

module.exports = {
    sumArgs
};