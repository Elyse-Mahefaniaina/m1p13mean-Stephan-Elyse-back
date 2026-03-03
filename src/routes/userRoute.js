const express = require('express');
const router = express.Router();
const User = require("../model/User");
const createGenericController = require("../core/GenericController");

const userController = createGenericController(User, {}, ["password"])

router.get("/", userController.findAll);
router.get("/:id", userController.findOne);
router.post("/", userController.create);
router.put("/:id", userController.update);
router.delete("/:id", userController.remove);

module.exports = router;
