function getUser(req, res) {
    res.json({
        message: "getting users",
    });
}

function registerUser(req, res) {
    res.json({
        message: "registering new user",
    });
}

module.exports = {
    getUser,
    registerUser,
};
