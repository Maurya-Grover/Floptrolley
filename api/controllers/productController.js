exports.getRequest = (req, res, next) => {
	res.status(200).json({
		message: 'Handled GET request to /products route',
	});
};

exports.postRequest = (req, res, next) => {
	res.status(200).json({
		message: 'Handled POST request to /products route',
	});
};

exports.getRequestByID = (req, res, next) => {
	const id = req.params.productId;
	res.status(200).json({
		message: 'Handled POST request to /products route',
		productId: id,
	});
};
