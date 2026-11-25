const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du produit est obligatoire"],
      trim: true,
      maxlength: [150, "Le nom ne doit pas dépasser 150 caractères"],
    },
    description: {
      type: String,
      required: [true, "La description est obligatoire"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Le prix est obligatoire"],
      min: [0, "Le prix ne peut pas être négatif"],
    },
    category: {
      type: String,
      required: [true, "La catégorie est obligatoire"],
      trim: true,
      enum: {
        values: [
          "Ordinateurs portables",
          "PC de bureau",
          "Composants",
          "Écrans",
          "Périphériques",
          "Stockage",
          "Réseau",
          "Accessoires",
        ],
        message: "Catégorie invalide : {VALUE}",
      },
    },
    stock: {
      type: Number,
      required: [true, "Le stock est obligatoire"],
      min: [0, "Le stock ne peut pas être négatif"],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "Le stock doit être un nombre entier",
      },
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);