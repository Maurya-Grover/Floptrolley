const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'Handled GET request to /products route',
	});
});
router.post('/', (req, res, next) => {
	res.status(201).json({
		message: 'Handled POST request to /products route',
	});
});

router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;
	if (id === '23') {
		res.status(200).json({
			message: 'Received Specific ID',
			productId: id,
		});
	} else {
		res.status(200).json({
			message: 'Welcome ' + id,
		});
	}
});

router.patch('/:productId', (req, res, next) => {
	res.status(200).json({
		message: 'Product ' + req.params.productId + ' updated successfully',
	});
});

router.delete('/:productId', (req, res, next) => {
	res.status(200).json({
		message: 'Product ' + req.params.productId + ' deleted successfully',
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
