const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWTKEY);
		req.userData = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: "Authentication Failed" });
	}
};
