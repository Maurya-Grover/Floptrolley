const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const productRoutes = require("./api/routes/productRoutes");
const orderRoutes = require("./api/routes/orderRoutes");
dotenv.config();
mongoose
	.connect(process.env.CONNECTIONSTRING, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((e) => console.log("Database Status: Connected"))
	.catch((e) => console.log("\nFollowing error occurred:\n" + e));

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// append appropriate headers to manage CORS errors. These headers must be appended before all kinds of responses are sent back as all responses will need these headers to get permissions past the browser. Just search CORS errors for more info. CORS errors are a security mechanism by the browser which can be bypassed by using headers and telling the browser to let requests/responses through
app.use((req, res, next) => {
	// the following will not send a response only set some content in the headers so that all responses have this header content.'*' gives access to all clients however can be limited by giving access to only particular websites
	res.header("Access-Control-Allow-Origin", "*");
	// specifies what headers my API will accept i.e. what kind of headers must be sent with requests to my API
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-Width, Content-Type, Accept, Authorization"
	);
	// browser always sends an OPTIONS request first when the client sends any request(PUT,POST etc) to see if the browser can make the request, if it is allowed to do so. This behaviour can't be avoided. So I will tell the browser what kind of requests can the browser send.
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		// we need to send the response for our options request to tell the browser to send further requests
		return res.status(200).json({});
	}
	// we need to go to next function in the case we are not returning from the if else block
	next();
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// if the next line is reached(i.e. next middleware is executed) it implies that the routes we have defined weren't able to process the request. Hence, it most likely is an invalid route or request. We will use the following middleware to sort out every request the user makes other than the ones we have defined.

app.use((req, res, next) => {
	const error = new Error("Not Found");
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
