const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const CommandeShop = require("../model/CommandeShop");
const Commande = require("../model/Commande");
const createGenericController = require("../core/GenericController");

const relations = {
  product: "product",
  shop: "shop"
};
const commandeShopController = createGenericController(CommandeShop, relations, []);

function parseFilter(filterString) {
  if (!filterString) return {};
  const where = {};
  const conditions = filterString.split(/ and | AND /i);

  conditions.forEach(condition => {
    const match = condition.match(/(\w+)\s+(eq|ne|gt|lt|like)\s+'([^']+)'/i);
    if (match) {
      const [, field, op, value] = match;
      const mongooseOp = {
        eq: "$eq",
        ne: "$ne",
        gt: "$gt",
        lt: "$lt",
        like: "$regex"
      }[op.toLowerCase()];

      if (mongooseOp === "$regex") {
        where[field] = { [mongooseOp]: value, $options: "i" };
      } else {
        where[field] = { [mongooseOp]: value };
      }
    }
  });

  return where;
}

router.get("/shop/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;
    const { $expand, $top, $skip, $order, $filter } = req.query;

    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ error: "Invalid shop id" });
    }

    const extraFilter = parseFilter($filter);
    let query = CommandeShop.find({ shop: shopId, ...extraFilter });

    if ($expand) {
      const includes = $expand.split(",").filter(k => relations[k]);
      includes.forEach(r => query = query.populate(r));
    }

    if ($skip) query = query.skip(parseInt($skip, 10));
    if ($top) query = query.limit(parseInt($top, 10));

    if ($order) {
      const sort = {};
      $order.split(",").forEach(o => {
        const [field, dir] = o.trim().split(/\s+/);
        sort[field] = dir && dir.toUpperCase() === "DESC" ? -1 : 1;
      });
      query = query.sort(sort);
    }

    const items = await query.lean().exec();

    const uuids = [...new Set(items.map(i => i.commandeUuid).filter(Boolean))];
    const commandes = await Commande.find({ uuid: { $in: uuids } })
      .select("uuid email")
      .lean();
    const emailMap = new Map(commandes.map(c => [c.uuid, c.email]));

    const data = items.map(i => ({
      ...i,
      commandeEmail: emailMap.get(i.commandeUuid) || null
    }));

    return res.json({ count: data.length, data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router.get("/commande/:uuid", commandeShopController.findByField("commandeUuid", "uuid"));
router.get("/", commandeShopController.findAll);
router.get("/:id", commandeShopController.findOne);
router.post("/", commandeShopController.create);
router.put("/:id", commandeShopController.update);
router.delete("/:id", commandeShopController.remove);

module.exports = router;
