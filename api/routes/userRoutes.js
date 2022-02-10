const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { hash } = require("bcrypt");
const router = express.Router();

router.post("/signup", async (req, res, next) => {
	const hashedPassword = await bcrypt
		.hash(req.body.password, 10)
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});

	// TODO: Consider case if hashedPassword === null
	if (hashedPassword === undefined) return;
	const user = await User.create({
		email: req.body.email,
		password: hashedPassword,
	}).catch((error) => {
		res.status(500).json({ error: error.message });
	});
});

/**	NOTE: In a restful architecture since we don't store information about the user on the server
 * 	We don't need a logout route as the API doesn't care when the user is logging out
 *	API will only authenticate if the user has entered correct details
 */

module.exports = router;
