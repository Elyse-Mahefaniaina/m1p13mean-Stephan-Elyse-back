require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const User = require("../src/model/User");
const bcrypt = require("bcrypt");

// mongoose.connect(process.env.MONGO_URI)
mongoose.connect("mongodb+srv://elyse_db:28F5WGV5s41AWZmy@mean.n7rxhjt.mongodb.net/?appName=mean")
.then(() => console.log("MongoDB connecté"))
.catch(err => {
  console.error("Erreur connexion MongoDB :", err);
  process.exit(1);
});

const dataPath = path.join(__dirname, "scriptUser.json");
const rawData = fs.readFileSync(dataPath, "utf8");
const usersData = JSON.parse(rawData);


const createUsers = async () => {
  for (let user of usersData) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  try {
    await User.deleteMany({});
    await User.insertMany(usersData, { ordered: false });
    console.log("user createds");
    
    process.exit(0);
  } catch (err) {
    console.error("Erreur :", err.message);
    process.exit(1);
  }
};

createUsers();