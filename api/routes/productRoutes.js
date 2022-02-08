const express = require("express");
const Product = require("../models/productModel");
const router = express.Router();

router.get("/", async (req, res, next) => {
	let products = await Product.find()
		.select("name price _id")
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});

	if (products.length > 0) {
		const response = {
			count: products.length,
			products: products.map((product) => {
				// console.log({ ...product._doc }); // simply sending product doesn't work as it has alot of metadata attached as well
				return {
					...product._doc,
					request: {
						type: "GET",
						url: "http://localhost:3000/products/" + product._id,
					},
				};
			}),
		};
		res.status(200).json(response);
	} else if (products.length === 0)
		res.status(404).json({
			message: "No Products Found",
		});
});
router.post("/", async (req, res, next) => {
	const product = await Product.create({
		name: req.body.name,
		price: req.body.price,
	}).catch((error) => {
		res.status(500).json({ error: error.message });
	});
	// the below two lines achieves the same task as the line above. does both create the user and save to the db
	// const product = new Product({
	// name: req.body.productName,
	// price: req.body.price,
	// });
	// await product.save();
	// console.log(product);
	if (product)
		res.status(201).json({
			message: "Created Product Successfully",
			createdProduct: {
				...product._doc,
				request: {
					type: "GET",
					url: "http://localhost:3000/products/" + product._id,
				},
			},
		});
});

router.get("/:productId", async (req, res, next) => {
	const id = req.params.productId;
	let doc = await Product.findById(id)
		.select("name price _id")
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
	if (doc) {
		const response = {
			product: doc,
			request: {
				type: "GET",
				description: "Get All Products List",
				url: "http://localhost:3000/products",
			},
		};
		res.status(200).json(response);
	} else if (doc === null)
		res.status(404).json({
			message: "Product " + id + " Not Found in Database",
		});
});

router.patch("/:productId", async (req, res, next) => {
	const id = req.params.productId;
	let updatedProduct = await Product.findByIdAndUpdate(
		id,
		{ $set: req.body },
		{ new: true }
	).catch((error) => {
		res.status(500).json({ error: error.message });
	});
	if (updatedProduct)
		res.status(200).json({
			message: "Product " + id + " updated successfully",
			request: {
				type: "GET",
				url: "http://localhost:3000/products/" + updatedProduct._id,
			},
		});
	else if (updatedProduct === null)
		res.status(404).json({
			message: "Product " + id + " Not Found in Database",
		});
});

router.delete("/:productId", async (req, res, next) => {
	const id = req.params.productId;
	let deletedProduct = await Product.findByIdAndDelete(id).catch((error) => {
		res.status(500).json({ error: error.message });
	});
	if (deletedProduct)
		res.status(200).json({
			message: "Product " + id + " deleted successfully",
			request: {
				type: "POST",
				description: "Add New Products(format for payload given in body)",
				url: "http://localhost:3000/products",
				body: {
					name: "String",
					price: "Number",
				},
			},
		});
	else if (deletedProduct === null)
		res.status(404).json({
			message: "Product " + id + " Not Found in Database",
		});
});

// res.status() only sets the status on the response on the server side
// whereas res.sendStatus() sets the status and sends it back to the client
// In most cases one would use sendStatus anyway since it's unlikely that
// the status changes once the request is processed
// res.sendStatus is shorthand for implementing res.send and res.status

// const productController = require('../controllers/productController');
// router.get('/', productController.getRequest);
// router.post('/', productController.postRequest);
// router.get('/:productId', productController.getRequestByID);
module.exports = router;
