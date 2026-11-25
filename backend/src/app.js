const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    allowedHeaders: ["Content-Type", "x-session-id"],
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API e-commerce opérationnelle" });
});

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

module.exports = app;