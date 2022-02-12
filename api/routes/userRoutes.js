const express = require("express");
const users = require("../controllers/userController");
const checkAuth = require("../middleware/checkAuth");
const router = express.Router();

router.post("/signup", users.signUp);

router.post("/login", users.login);

router.delete("/:userId", checkAuth, users.deleteById);

module.exports = router;
