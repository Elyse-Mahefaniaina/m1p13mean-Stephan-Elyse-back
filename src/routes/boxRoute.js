const express = require('express');
const router = express.Router();
const Box = require("../model/Box");
const createGenericController = require("../core/GenericController");

const boxController = createGenericController(Box, {}, [])

router.get("/", boxController.findAll);
router.get("/:id", boxController.findOne);
router.post("/", boxController.create);
router.put("/:id", boxController.update);
router.delete("/:id", boxController.remove);

module.exports = router;
