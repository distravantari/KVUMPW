module.exports = (req, res, next) => {
    res.send(req.file);
    res.end(req.file);
};