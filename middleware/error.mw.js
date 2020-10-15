/* eslint-disable no-unused-vars */
// error handling
module.exports = (err, req, res, next) => {
    const { status = 500 } = err;

    console.log('hi from the error handler');
    res.setHeader('Content-Type', 'application/json');
    res.status(status).send({ error: err });
};