const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Quelque chose s\'est mal passé, réessayez plus tard.' });
};

module.exports = errorHandler;