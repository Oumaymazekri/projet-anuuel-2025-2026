const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const globalError = require("./middleware/errorMiddleware.js");
const orderRoutes = require('./Routers/orderRoutes.js');
require("./config/connect");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const app = express();


// ** Place cors AVANT tout le reste **
const allowedOrigins = ["http://localhost:4200", "http://localhost:3003","http://localhost","http://localhost/dashboard/"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type", "X-Auth-User", "X-Auth-Role"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.json());

// Tes routes et middlewares
app.use('/api/order', orderRoutes);

// Gestion des erreurs - Route non trouvée
app.use((req, res, next) => {
  res.status(404).json({ message: "Page not found" });
});

// Gestion des erreurs génériques
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
