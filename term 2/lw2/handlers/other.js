let OTHER = (req, res) => {
    res.end(JSON.stringify({message: `this method is not processed by the server`}));
}

module.exports = OTHER;