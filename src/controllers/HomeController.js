const utils = require("./../utils/responseHandler");
const util = require("util");
const fs = require("fs").promises;
const path = require("path")
const jwt = require("jsonwebtoken");
const jwtSignAsync = util.promisify(jwt.sign);
const {v4: uuidv4} = require("uuid");
const bcrypt = require("bcrypt");

function welcome(req, res) {
    return utils.responseHandler(res, true, "Welcome to API", null);
}

async function register(req, res) {
    const { username, email, password } = req.body;
    const fullPath = path.resolve(__dirname, "./../database/users.json");
    if(!username || !email || !password){
        return utils.responseHandler(res, false, "Missing credentials", null, 401)
    }

    try {
        // getting all users
        let users = await fs.readFile(fullPath, 'utf-8')
        users = JSON.parse(users);
        
        // finding existing username or email if available
        const isExistUser = users.some(x => x.username === username || x.email === email);
    
        if(isExistUser){
            return utils.responseHandler(res, false, "User already exists", null, 400);
        }

        // hashing password
        const hash_password = await bcrypt.hash(password, Number(process.env.SALT));

        // storing new users
        const newUser = {
            id: uuidv4(),
            username,
            email,
            password: hash_password
        }
        users.push(newUser);

        await fs.writeFile(fullPath, JSON.stringify(users));
        
        const token = await jwtSignAsync({id: newUser.id}, process.env.TOKEN_SECRET, {
            expiresIn: '1h'
        });

        return utils.responseHandler(res, true, "User has been created successfully", {
            username: newUser.username,
            token
        }, 201);
    } catch (error) {
        return utils.responseHandler(res, false, error.message, null, 500);
    }
}

async function login(req, res) {
    const { username, password } = req.body;
    const fullPath = path.resolve(__dirname, "./../database/users.json");
    if(!username || !password){
        return utils.responseHandler(res, false, "Missing credentials", null, 401)
    }

    try {
        // getting all users
        let users = await fs.readFile(fullPath, 'utf-8')
        users = JSON.parse(users);

        // finding existing username or email if available
        const foundUser = users.find(x => x.username === username);
    
        if(!foundUser || !await bcrypt.compare(password, foundUser.password)){
            return utils.responseHandler(res, false, "Invalid credentials", null, 400);
        }

        const token = await jwtSignAsync({id: foundUser.id}, process.env.TOKEN_SECRET, {
            expiresIn: '1h'
        });

        return utils.responseHandler(res, true, "Login successfully", {
            username: foundUser.username,
            token
        }, 200);
    } catch (error) {
        return utils.responseHandler(res, false, error.message, null, 500);
    }
}

module.exports = {
    welcome,
    register,
    login
};
