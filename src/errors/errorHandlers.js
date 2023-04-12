const utils = require("../utils/responseHandler");

// error handler
function errorHandler(err, req, res, next) {
    if(!res.statusCode || Number(res.statusCode) < 400){
        res.statusCode = 500;
    }
    utils.responseHandler(res, false, err.message, null, res.statusCode);
}

// default handler
function notFoundHandler(req, res, next){
    res.status(404).json({
        error: "Not Found",
        url: req.url,
        method: req.method,
    })
}

module.exports = {
    errorHandler,
    notFoundHandler,
}