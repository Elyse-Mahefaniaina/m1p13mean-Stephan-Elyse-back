require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');
const authenticateToken = require('./src/middleware/middleware');

// routes
const authRoute = require('./src/routes/authRoute');
const canActiveRoute = require('./src/routes/canActiveRoute');

const corsOptions = {
   origin: "http://localhost:4200",
  credentials: true,
};  

const app = express();

connectDB();

app.use('/assets',express.static(path.join(__dirname, 'assets')));

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json({ extended: true }));

// controller
app.use('/auth', authRoute);
app.use('/can-active', authenticateToken, canActiveRoute);

app.listen(process.env.PORT, () =>
  console.log(`Serveur lancé sur le port ${process.env.PORT}`)
);