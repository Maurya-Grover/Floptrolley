const express = require("express");
const multer = require("multer"); // used to handle multipart/form-data which 'express.urlencoded' cannot.
const products = require("../controllers/productController");
const checkAuth = require("../middleware/checkAuth");
const router = express.Router();
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
	if (allowedFileTypes.includes(file.mimetype)) {
		// accept a file
		cb(null, true);
	}
	// reject a file
	else cb(null, false);
};

// adding a slash first in the path makes it an absolute path and will try to create in the root folder
// const upload = multer({ dest: "/uploads/" });
// 5MB file upload limit
const upload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 * 5 },
	fileFilter: fileFilter,
});

router.get("/", products.getAll);

router.post("/", checkAuth, upload.single("productImage"), products.createNew);

router.get("/:productId", products.getByID);

router.patch("/:productId", checkAuth, products.updateById);

router.delete("/:productId", checkAuth, products.deleteById);

module.exports = router;
