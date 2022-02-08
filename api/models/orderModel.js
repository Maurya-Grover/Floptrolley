const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
	product: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "Product",
		required: true,
	},
	quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model("Order", orderSchema);
