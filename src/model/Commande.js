const mongoose = require("mongoose");

const commandeSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  }
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "modifiedAt"
  }
});

const Commande = mongoose.model("Commande", commandeSchema);

module.exports = Commande;
