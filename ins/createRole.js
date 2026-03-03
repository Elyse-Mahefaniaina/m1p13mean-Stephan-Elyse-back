require("dotenv").config();
const mongoose = require("mongoose");

const User = require("../src/model/User");
const Role = require("../src/model/Role");
const RolePermission = require("../src/model/RolePermission");
const UserRole = require("../src/model/UserRole");

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch(err => {
    console.error("Erreur connexion MongoDB :", err);
    process.exit(1);
  });

const usersPath = ["azer@azer.com", "mora.entana@me.com", "kojakoja.anay@kj.com"];

const rolesData = [
  { code: "ADMIN" },
  { code: "SHOP" },
];

// 3️⃣ Définition des permissions
const permissionsData = [
  // admin
  { roleCode: "ADMIN", url: "/admin/dashboard" },
  { roleCode: "ADMIN", url: "/admin/boxes" },
  { roleCode: "ADMIN", url: "/admin/shops" },

  // shop
  { roleCode: "SHOP", url: "/shop/dashboard" },
  { roleCode: "SHOP", url: "/shop/product-creation" },
  { roleCode: "SHOP", url: "/shop/orders" },
  { roleCode: "SHOP", url: "/shop/promotions" },
  { roleCode: "SHOP", url: "/shop/profile" },
];

const init = async () => {
  try {
    // Créer les rôles
    await Role.deleteMany({});
    await RolePermission.deleteMany({});
    await UserRole.deleteMany({});
    
    const insertedRoles = await Role.insertMany(rolesData, { ordered: false });
    const rolesMap = {};
    insertedRoles.forEach(r => {
      console.log("Rôle créé :", r.code);
      rolesMap[r.code] = r;
    });

    // Créer les permissions
    for (const p of permissionsData) {
      const role = rolesMap[p.roleCode];
      let perm = await RolePermission.findOne({ role: role._id, url: p.url });
      if (!perm) {
        perm = new RolePermission({ role: role._id, url: p.url });
        await perm.save();
        console.log(`Permission ${p.url} ajoutée au rôle ${p.roleCode}`);
      } else {
        console.log(`Permission existante ${p.url} pour ${p.roleCode}`);
      }
    }

    // Créer les utilisateurs
    const userMap = {};
    for (const u of usersPath) {
      console.log(u);
      let user = await User.findOne({ email: u.toUpperCase() });
      userMap[u.toUpperCase()] = user;
    }

    // Associer les utilisateurs aux rôles
    // Exemple : le premier utilisateur du JSON devient ADMIN
    const adminRole = rolesMap["ADMIN"];
    for (const u of usersPath) {
        if(u == "azer@azer.com") {
          const ur = new UserRole({ user: userMap[u.toUpperCase()]._id, role: adminRole._id });
          await ur.save();
          console.log(`Utilisateur ${u.toUpperCase()} lié au rôle ADMIN`);
        }
    }

    const shopRole = rolesMap["SHOP"];    
    for (const u of usersPath) {
      if(u != "azer@azer.com") {
        const ur = new UserRole({ user: userMap[u.toUpperCase()]._id, role: shopRole._id });
        await ur.save();
        console.log(`Utilisateur ${u.toUpperCase()} lié au rôle SHOP`);
      }
    }

    console.log("Initialisation terminée ✅");
    process.exit(0);
  } catch (err) {
    console.error("Erreur :", err);
    process.exit(1);
  }
};

init();