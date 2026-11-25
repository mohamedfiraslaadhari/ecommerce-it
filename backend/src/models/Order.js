const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Le produit est obligatoire"],
    },
    name: {
      type: String,
      required: [true, "Le nom du produit est obligatoire"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Le prix est obligatoire"],
      min: [0, "Le prix ne peut pas être négatif"],
    },
    quantity: {
      type: Number,
      required: [true, "La quantité est obligatoire"],
      min: [1, "La quantité minimale est 1"],
      validate: {
        validator: Number.isInteger,
        message: "La quantité doit être un nombre entier",
      },
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: "Une commande doit contenir au moins un article",
      },
    },
    totalAmount: {
      type: Number,
      required: [true, "Le montant total est obligatoire"],
      min: [0, "Le montant total ne peut pas être négatif"],
    },
    stripePaymentIntentId: {
      type: String,
      trim: true,
      index: true,
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "paid", "failed", "cancelled"],
        message: "Statut invalide : {VALUE}",
      },
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);