require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const User = require("./src/model/User");

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connecté"))
.catch(err => {
  console.error("Erreur connexion MongoDB :", err);
  process.exit(1);
});

const dataPath = path.join(__dirname, "scriptUser.json");
const rawData = fs.readFileSync(dataPath, "utf8");
const usersData = JSON.parse(rawData);

const createUsers = async () => {
  try {
    for (const u of usersData) {
      const user = new User(u);
      await user.save();
      console.log("Utilisateur créé :", user.email);
    }
    process.exit(0);
  } catch (err) {
    console.error("Erreur :", err.message);
    process.exit(1);
  }
};

createUsers();