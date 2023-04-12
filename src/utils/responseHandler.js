function responseHandler(res, success, message, data, code = 200){
    return res.status(code).json({
        success,
        message,
        data,
        code
    })
}

module.exports = {
    responseHandler
}