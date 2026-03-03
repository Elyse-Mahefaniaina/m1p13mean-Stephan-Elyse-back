const mongoose = require("mongoose");
const crypto = require("crypto");
const Commande = require("../model/Commande");
const CommandeShop = require("../model/CommandeShop");
const Product = require("../model/Product");

const create = async (req, res) => {
  try {
    const { email, items } = req.body;

    if (!email || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "email et items requis" });
    }

    const invalidItem = items.find(item =>
      !item ||
      !item.product ||
      !mongoose.Types.ObjectId.isValid(item.product) ||
      !Number.isFinite(item.quantity) ||
      item.quantity <= 0
    );

    if (invalidItem) {
      return res.status(400).json({ error: "items invalides" });
    }

    const productIds = [...new Set(items.map(i => i.product))];
    const products = await Product.find({ _id: { $in: productIds } }).select("_id shop");

    if (products.length !== productIds.length) {
      const existing = new Set(products.map(p => p._id.toString()));
      const missing = productIds.filter(id => !existing.has(id));
      return res.status(400).json({ error: "produits introuvables", missing });
    }

    const productMap = new Map(products.map(p => [p._id.toString(), p]));
    const withoutShop = products.find(p => !p.shop);
    if (withoutShop) {
      return res.status(400).json({ error: "produit sans shop", product: withoutShop._id });
    }

    const uuid = crypto.randomUUID ? crypto.randomUUID() : new mongoose.Types.ObjectId().toString();
    const commande = await Commande.create({
      uuid,
      email: email.toLowerCase().trim()
    });

    const orderItems = items.map(i => ({
      commandeUuid: uuid,
      product: i.product,
      shop: productMap.get(i.product.toString()).shop,
      quantity: i.quantity
    }));

    await CommandeShop.insertMany(orderItems);

    return res.status(201).json({
      uuid: commande.uuid,
      email: commande.email,
      items: orderItems
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const findOne = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { email } = req.query;

    if (!uuid) {
      return res.status(400).json({ error: "uuid requis" });
    }
    if (!email) {
      return res.status(400).json({ error: "email requis" });
    }

    const commande = await Commande.findOne({
      uuid,
      email: email.toLowerCase().trim()
    });

    if (!commande) {
      return res.status(404).json({ error: "commande introuvable" });
    }

    const items = await CommandeShop.find({ commandeUuid: uuid })
      .populate("product")
      .populate("shop");

    return res.json({
      uuid: commande.uuid,
      email: commande.email,
      createdAt: commande.createdAt,
      modifiedAt: commande.modifiedAt,
      items
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { create, findOne };
