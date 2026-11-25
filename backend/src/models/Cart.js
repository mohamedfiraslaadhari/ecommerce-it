const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Le produit est obligatoire"],
    },
    quantity: {
      type: Number,
      required: [true, "La quantité est obligatoire"],
      min: [1, "La quantité minimale est 1"],
      max: [99, "La quantité maximale est 99"],
      default: 1,
      validate: {
        validator: Number.isInteger,
        message: "La quantité doit être un nombre entier",
      },
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: [true, "L'identifiant de session est obligatoire"],
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

// MongoDB supprime automatiquement le panier une fois la date expiresAt dépassée
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Cart", cartSchema);