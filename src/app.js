require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const donorRoutes = require("./routes/donorRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    mensaje: "API del sistema de donantes funcionando"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);

app.use((req, res) => {
  res.status(404).json({
    mensaje: "Ruta no encontrada"
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    mensaje: "Error interno del servidor"
  });
});

module.exports = app;