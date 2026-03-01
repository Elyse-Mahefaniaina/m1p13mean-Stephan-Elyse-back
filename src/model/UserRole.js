const mongoose = require("mongoose");

const userRoleSchema = new mongoose.Schema({
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const UserRole = mongoose.model("UserRole", userRoleSchema);

module.exports = UserRole;