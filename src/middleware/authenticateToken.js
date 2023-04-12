const { responseHandler } = require("../utils/responseHandler");
const jwt = require("jsonwebtoken");
const path = require("path");
const util = require("util");
const jwtVerifyAsync = util.promisify(jwt.verify);
const fs = require("fs").promises;

async function authenticateToken(req, res, next){
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) {
        return responseHandler(res, false, "No Token !", null, 401);
    }
    try {
        const {id} = await jwtVerifyAsync(token, process.env.TOKEN_SECRET);
        const fullPath = path.resolve(__dirname, "../database/users.json");
        let users = await fs.readFile(fullPath, "utf-8");

        users = JSON.parse(users);
        const foundUser = users.find(x => x.id === id)

        // if not found
        if(!foundUser){
            throw new Error("User not found !");
        }

        // deleting password
        delete foundUser.password;

        req.user = foundUser;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = authenticateToken;