const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API e-commerce opérationnelle" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

module.exports = app;