const express = require("express");
const router = express.Router();
const { create, findOne } = require("../controller/commandeController");

router.post("/", create);
router.get("/:uuid", findOne);

module.exports = router;
