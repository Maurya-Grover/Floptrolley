const Order = require("../models/orderModel");
const Product = require("../models/productModel");

exports.getAll = async (req, res, next) => {
	let orders = await Order.find()
		.select("_id product quantity")
		.populate("product", "name")
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
	if (orders.length > 0) {
		const response = {
			count: orders.length,
			orders: orders.map((order) => {
				return {
					...order._doc,
					request: {
						type: "GET",
						url: "http://localhost:3000/orders/" + order._id,
					},
				};
			}),
		};
		res.status(200).json(response);
	} else if (orders.length === 0)
		res.status(404).json({
			message: "No Orders Found",
		});
};

exports.createNew = async (req, res, next) => {
	const id = req.body.productId;
	if (id) {
		let product = await Product.findById(id).catch((error) => {
			res.status(500).json({
				message: "Incorrect Product ID",
				error: error.message,
			});
		});
		if (product === undefined) return;
		if (product === null) {
			res.status(404).json({ message: "Product With Given ID Not Found" });
			return;
		}
	}
	const order = await Order.create({
		product: id,
		quantity: req.body.quantity,
	}).catch((error) => {
		res.status(500).json({ error: error.message });
	});
	if (order)
		res.status(201).json({
			message: "Order Created Successfully",
			addedOrder: {
				...order._doc,
				request: {
					type: "GET",
					description: "Get This Order Details",
					url: "http://localhost:3000/orders/" + order._id,
				},
			},
		});
};

exports.getById = async (req, res, next) => {
	const id = req.params.orderId;
	let order = await Order.findById(id)
		.select("_id product quantity")
		.populate("product")
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
	if (order) {
		const response = {
			order: order,
			request: {
				type: "GET",
				description: "Get All Orders List",
				url: "http://localhost:3000/orders",
			},
		};
		res.status(200).json(response);
	} else if (order === null) {
		res.status(404).json({
			message: "Order Not Found",
		});
	}
};

exports.updateById = async (req, res, next) => {
	const id = req.params.orderId;
	let updatedOrder = await Order.findByIdAndUpdate(
		id,
		{ $set: req.body },
		{ new: true }
	).catch((error) => {
		res.status(500).json({ error: error.message });
	});
	if (updatedOrder) {
		res.status(200).json({
			message: "Order " + id + "Updated Successfully",
			request: {
				type: "GET",
				url: "http://localhost:3000/orders/" + updatedOrder._id,
			},
		});
	} else if (updatedOrder === null)
		res.status(404).json({
			message: "Order " + id + " Not Found in Database",
		});
};

exports.deleteById = async (req, res, next) => {
	const id = req.params.orderId;
	let deletedOrder = await Order.findByIdAndDelete(id).catch((error) => {
		res.status(500).json({ error: error.message });
	});
	if (deletedOrder) {
		const response = {
			message: "Order " + id + " deleted successfully",
			request: {
				type: "POST",
				description: "Add New Orders(format for payload given in body)",
				url: "http://localhost:3000/orders",
				body: {
					productId: "Product ID for the Product You want to Order",
					quantity: "Number",
				},
			},
		};
		res.status(200).json(response);
	} else if (deletedOrder === null)
		res.status(404).json({
			message: "Order " + id + " Not Found in Database",
		});
};
