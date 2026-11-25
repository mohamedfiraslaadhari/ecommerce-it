const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_QUANTITY = 99;

// Lit l'identifiant de session envoyé par le client dans l'en-tête x-session-id
const getSessionId = (req) => {
  const sessionId = req.header("x-session-id");
  return sessionId && sessionId.trim() ? sessionId.trim() : null;
};

const arrondir = (nombre) => Math.round(nombre * 100) / 100;

// Transforme un panier de la base en réponse claire pour le client (avec les totaux)
const formatCart = (sessionId, cart) => {
  const items = cart
    ? cart.items
        .filter((item) => item.product)
        .map((item) => ({
          product: item.product,
          quantity: item.quantity,
          subtotal: arrondir(item.product.price * item.quantity),
        }))
    : [];

  return {
    sessionId,
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    total: arrondir(items.reduce((total, item) => total + item.subtotal, 0)),
  };
};

const loadCart = (sessionId) =>
  Cart.findOne({ sessionId }).populate("items.product");

const prolongerExpiration = (cart) => {
  cart.expiresAt = new Date(Date.now() + EXPIRATION_MS);
};

const erreurSession = (res) =>
  res.status(400).json({ message: "En-tête x-session-id manquant" });

// GET /api/cart : consulter le panier
const getCart = async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    if (!sessionId) return erreurSession(res);

    const cart = await loadCart(sessionId);
    res.json(formatCart(sessionId, cart));
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// POST /api/cart/items : ajouter un article { productId, quantity }
const addItem = async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    if (!sessionId) return erreurSession(res);

    const { productId } = req.body || {};
    const quantity = Number((req.body || {}).quantity ?? 1);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Identifiant de produit invalide" });
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res
        .status(400)
        .json({ message: "La quantité doit être un entier supérieur ou égal à 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
    }

    const existing = cart.items.find(
      (item) => item.product.toString() === productId
    );
    const newQuantity = (existing ? existing.quantity : 0) + quantity;

    if (newQuantity > product.stock) {
      return res
        .status(400)
        .json({ message: `Stock insuffisant (disponible : ${product.stock})` });
    }
    if (newQuantity > MAX_QUANTITY) {
      return res
        .status(400)
        .json({ message: `Quantité maximale par article : ${MAX_QUANTITY}` });
    }

    if (existing) {
      existing.quantity = newQuantity;
    } else {
      cart.items.push({ product: product._id, quantity });
    }

    prolongerExpiration(cart);
    await cart.save();

    const populated = await loadCart(sessionId);
    res.status(201).json(formatCart(sessionId, populated));
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// PUT /api/cart/items/:productId : modifier la quantité { quantity }
const updateItem = async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    if (!sessionId) return erreurSession(res);

    const { productId } = req.params;
    const quantity = Number((req.body || {}).quantity);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Identifiant de produit invalide" });
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res
        .status(400)
        .json({ message: "La quantité doit être un entier supérieur ou égal à 1" });
    }

    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json({ message: "Panier introuvable" });
    }

    const item = cart.items.find(
      (cartItem) => cartItem.product.toString() === productId
    );
    if (!item) {
      return res.status(404).json({ message: "Article absent du panier" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Produit introuvable" });
    }
    if (quantity > product.stock) {
      return res
        .status(400)
        .json({ message: `Stock insuffisant (disponible : ${product.stock})` });
    }
    if (quantity > MAX_QUANTITY) {
      return res
        .status(400)
        .json({ message: `Quantité maximale par article : ${MAX_QUANTITY}` });
    }

    item.quantity = quantity;
    prolongerExpiration(cart);
    await cart.save();

    const populated = await loadCart(sessionId);
    res.json(formatCart(sessionId, populated));
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// DELETE /api/cart/items/:productId : supprimer un article
const removeItem = async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    if (!sessionId) return erreurSession(res);

    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Identifiant de produit invalide" });
    }

    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json({ message: "Panier introuvable" });
    }

    const countBefore = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === countBefore) {
      return res.status(404).json({ message: "Article absent du panier" });
    }

    prolongerExpiration(cart);
    await cart.save();

    const populated = await loadCart(sessionId);
    res.json(formatCart(sessionId, populated));
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// DELETE /api/cart : vider le panier
const clearCart = async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    if (!sessionId) return erreurSession(res);

    const cart = await Cart.findOne({ sessionId });
    if (cart) {
      cart.items = [];
      prolongerExpiration(cart);
      await cart.save();
    }

    res.json(formatCart(sessionId, null));
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };