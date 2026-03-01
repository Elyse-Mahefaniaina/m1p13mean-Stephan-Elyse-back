const mongoose = require("mongoose");

const rolePermissionSchema = new mongoose.Schema({
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

const RolePermission = mongoose.model("RolePermission", rolePermissionSchema);

module.exports = RolePermission;