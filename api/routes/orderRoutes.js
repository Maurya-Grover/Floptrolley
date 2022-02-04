const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'Handled GET request to /orders route',
	});
});
router.post('/', (req, res, next) => {
	res.status(201).json({
		message: 'Handled POST request to /orders route',
	});
});

router.get('/:orderId', (req, res, next) => {
	const id = req.params.orderId;
	if (id === '23') {
		res.status(200).json({
			message: 'Received Specific ID',
			orderId: id,
		});
	} else {
		res.status(200).json({
			message: 'Welcome ' + id,
		});
	}
});

router.patch('/:orderId', (req, res, next) => {
	res.status(200).json({
		message: 'Order ' + req.params.orderId + ' updated successfully',
	});
});

router.delete('/:orderId', (req, res, next) => {
	res.status(200).json({
		message: 'Order ' + req.params.orderId + ' deleted successfully',
	});
});

module.exports = router;
