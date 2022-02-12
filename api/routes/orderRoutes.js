const express = require("express");
const orders = require("../controllers/orderController");
const checkAuth = require("../middleware/checkAuth");
const router = express.Router();

router.get("/", checkAuth, orders.getAll);

router.post("/", checkAuth, orders.createNew);

router.get("/:orderId", checkAuth, orders.getById);

router.patch("/:orderId", checkAuth, orders.updateById);

router.delete("/:orderId", checkAuth, orders.deleteById);

module.exports = router;
