const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { hash } = require("bcrypt");
const router = express.Router();

router.post("/signup", async (req, res, next) => {
	const inputEmail = req.body.email;
	const inputPassword = req.body.password;
	/*
	// NOTE: Checking Input Validity
	if (!inputPassword) {
		res.status(404).json({ message: "Please provide a password" });
		return;
	}
	if (inputEmail) {
		const userExists = await User.find({ email: inputEmail }).catch((error) => {
			res.status(500).json({ error: error.message });
		});
		if (userExists === undefined) return;
		if (userExists.length > 0) {
			res.status(422).json({
				message:
					"Please provide a unique email. User with this email id already exists",
			});
			return;
		}
	}*/
	// NOTE: Hashing the input password
	const hashedPassword = inputPassword
		? await bcrypt.hash(inputPassword, 10).catch((error) => {
				res.status(500).json({ error: error.message });
		  })
		: null;
	if (hashedPassword === undefined) return;
	// NOTE: Storing User to DB
	const user = await User.create({
		email: inputEmail,
		password: hashedPassword,
	}).catch((error) => {
		res.status(500).json({ error: error.message });
	});
	if (user)
		res.status(201).json({
			message: "User created",
			email: user.email,
		});
});

router.delete("/:userId", async (req, res, next) => {
	const id = req.params.userId;
	const deletedUser = await User.findByIdAndDelete(id).catch((error) => {
		res.status(500).json({ error: error.message });
	});
	if (deletedUser === undefined) return;
	if (deletedUser === null)
		res.status(404).json({
			message: "User " + id + " Not Found in Database",
		});
	else res.status(200).json({ message: "User Deleted" });
});
/**
 * Keep in mind if SCAM: needed
 *  if (hashedPassword === null) {
 *		res.status(404).json({ message: "Please provide a password" });
 *		return;
 *	}
 *
 * NOTE: In a restful architecture since we don't store information about the user on the server
 * 	We don't need a logout route as the API doesn't care when the user is logging out
 *	API will only authenticate if the user has entered correct details
 */

module.exports = router;
