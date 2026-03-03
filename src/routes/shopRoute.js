const express = require('express');
const router = express.Router();
const Shop = require("../model/Shop");
const createGenericController = require("../core/GenericController");

const shopController = createGenericController(Shop, {}, [])

router.get("/", shopController.findAll);
router.get("/:id", shopController.findOne);
router.post("/", shopController.create);
router.put("/:id", shopController.update);
router.delete("/:id", shopController.remove);

module.exports = router;
