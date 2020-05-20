// error handling
module.exports = (err, req, res, next) => {
    const { status = 500, internalMsg } = err;
    console.error(err);

    res.status(status).send(err.message);
};