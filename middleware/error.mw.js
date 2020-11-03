/* eslint-disable no-unused-vars */
// error handling
module.exports = (err, req, res, next) => {
    const { status = 500 } = err;

    res.setHeader('Content-Type', 'application/json');
    res.status(status).send({ error: err });
    res.end();
};