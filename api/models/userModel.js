const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	email: {
		type: String,
		required: [true, "field is required"],
		unique: [
			true,
			"Please provide a unique email. User with this email id already exists",
		],
	},
	password: {
		type: String,
		required: [true, "field is required"],
	},
});

module.exports = mongoose.model("User", userSchema);
