function hianyzoAdatFuggveny(res, message, ...args) {
    if (args.some(arg => !arg)) {
        return res.status(400).json({ message });
    }
};

function validalasFuggveny(res, validationList) {
    for (let { condition, message } of validationList) {
        if (condition) {
            res.status(400).json({ message });
            return true;
        }
    }
    return false;
}

module.exports = {
    hianyzoAdatFuggveny,
    validalasFuggveny
}