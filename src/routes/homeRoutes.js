const express = require('express');
const router = express.Router();
const HomeController = require("./../controllers/HomeController")

router.get("/", HomeController.welcome);
router.post("/register", HomeController.register)
router.post("/login", HomeController.login)

module.exports = router;