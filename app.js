const express = require('express');
const app = express();

app.use((req, res, next) => {
	res.status(201).json({
		message: 'Connection Successful',
	});
});

module.exports = app;
