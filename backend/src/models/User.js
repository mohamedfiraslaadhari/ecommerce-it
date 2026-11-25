const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est obligatoire"],
      trim: true,
      maxlength: [100, "Le nom ne doit pas dépasser 100 caractères"],
    },
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Adresse email invalide"],
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est obligatoire"],
      minlength: [8, "Le mot de passe doit contenir au moins 8 caractères"],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["customer", "admin"],
        message: "Rôle invalide : {VALUE}",
      },
      default: "customer",
    },
  },
  { timestamps: true }
);

// Chiffre le mot de passe avant l'enregistrement (seulement s'il a changé)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare un mot de passe saisi avec le mot de passe chiffré
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);