require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');
const authenticateToken = require('./src/middleware/middleware');

// routes
const authRoute = require('./src/routes/authRoute');
const canActiveRoute = require('./src/routes/canActiveRoute');
const boxRoute = require("./src/routes/boxRoute");
const shopRoute = require("./src/routes/shopRoute");
const productRoute = require("./src/routes/productRoute");
const userRoute = require("./src/routes/userRoute");
const commandeRoute = require("./src/routes/commandeRoute");
const commandeShopRoute = require("./src/routes/commandeShopRoute");

const corsOptions = {
  origin: "https://m1p13mean-stephan-elyse-front.vercel.app/",
  credentials: true,
};  

const app = express();

app.use('/assets',express.static(path.join(__dirname, 'assets')));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ extended: true }));

// controller
app.use('/auth', authRoute);
app.use('/can-active', authenticateToken, canActiveRoute);
app.use('/boxes', authenticateToken, boxRoute);
app.use('/shops', authenticateToken, shopRoute);
app.use('/products', productRoute);
app.use('/commandes', commandeRoute);
app.use('/commande-shops', authenticateToken, commandeShopRoute);
app.use('/users', authenticateToken, userRoute);

module.exports = app;
