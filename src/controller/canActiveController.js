const UserRole = require("../model/UserRole");
const RolePermission = require("../model/RolePermission");
const connectDB = require("../config/db");

const canActive = async (req, res) => {
  try {
    await connectDB();
    const user = req.user;
    const path = req.body.path;

    if (!path) {
      return res.status(400).json({ state: false, message: "Path manquant" });
    }
    const userRoles = await UserRole.find({ user: user.id });
    if (!userRoles.length) {
      return res.json({ state: false });
    }

    const roleIds = userRoles.map(ur => ur.role);

    const permission = await RolePermission.findOne({
      role: { $in: roleIds },
      url: path
    });

    if (permission) {
      return res.json({ state: true });
    } else {
      return res.json({ state: false });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ state: false, message: "Erreur serveur", error: error.message });
  }
};

module.exports = canActive;