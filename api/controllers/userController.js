const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/userModel");
dotenv.config();

exports.signUp = async (req, res, next) => {
	const inputEmail = req.body.email;
	const inputPassword = req.body.password;
	/*
	// NOTE: Checking Input Validity
	if (!inputPassword) {
		res.status(404).json({ message: "Please provide a password" });
		return;
	}
	*/
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
	}
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
};

exports.login = async (req, res, next) => {
	// NOTE: I can simply look for 1 as I don't allow more than 1 user per email ID to be created
	// therefore. Each user I get for an email ID will be unique by default
	const userEmail = req.body.email;
	const userPassword = req.body.password;
	const user = await User.findOne({ email: userEmail }).catch((error) => {
		res.status(500).json({ error: error.message });
	});
	if (user === undefined) return;
	if (user === null) {
		res.status(401).json({ message: "Auth failed" });
		return;
	}
	const userAuthenticated = userPassword
		? await bcrypt.compare(userPassword, user.password).catch((error) => {
				res.status(500).json({ error: error.message });
		  })
		: null;
	if (userAuthenticated === true) {
		const token = jwt.sign(
			{ email: user.email, userId: user._id },
			process.env.JWTKEY,
			{
				expiresIn: "7d",
			}
		);
		res.status(200).json({ message: "Auth Successful", token: token });
	} else if (userAuthenticated === false || userAuthenticated === null)
		res.status(401).json({ message: "Auth failed" });
};
// Front end will have access to userId throught the JWT that we keep exchanging with it
// front end will decode the jwt to get the id
exports.deleteById = async (req, res, next) => {
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
};

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
