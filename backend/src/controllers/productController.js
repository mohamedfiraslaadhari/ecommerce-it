const mongoose = require("mongoose");
const Product = require("../models/Product");

// GET /api/products : liste des produits (filtres optionnels : category, search)
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      const escaped = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.name = { $regex: escaped, $options: "i" };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// GET /api/products/:id : détail d'un produit
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Identifiant de produit invalide" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = { getProducts, getProductById };