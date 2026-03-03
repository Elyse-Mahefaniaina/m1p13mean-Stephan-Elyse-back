const mongoose = require("mongoose");

const commandeShopSchema = new mongoose.Schema({
  commandeUuid: {
    type: String,
    required: true,
    index: true
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ["en_attente", "en_preparation", "expediee", "livree", "terminee", "annulee"],
    default: "en_attente",
    required: true
  }
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "modifiedAt"
  }
});

const CommandeShop = mongoose.model("CommandeShop", commandeShopSchema);

module.exports = CommandeShop;
