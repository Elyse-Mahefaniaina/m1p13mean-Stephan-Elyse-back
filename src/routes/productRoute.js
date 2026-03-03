const express = require('express');
const router = express.Router();
require("../model/ProductDetail"); 
const Product = require("../model/Product");
const createGenericController = require("../core/GenericController");

const productController = createGenericController(Product, {
    details: "details"
}, [])

router.get("/", productController.findAll);
router.get("/:id", productController.findOne);
router.post("/", productController.create);
router.put("/:id", productController.update);
router.delete("/:id", productController.remove);

module.exports = router;
