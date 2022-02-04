const express = require('express');
const morgan = require('morgan');
const app = express();
const productRoutes = require('./api/routes/productRoutes');
const orderRoutes = require('./api/routes/orderRoutes');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// if the next line is reached it implies that the
// routes we have defined weren't able to process the request.
// Hence, it most likely is an invalid route or request.
// We will use the following middleware to sort out every request
// the user makes other than the ones we have defined.

app.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
		},
	});
});

module.exports = app;
