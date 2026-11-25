const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/Product");

const products = [
  {
    name: "Laptop Pro 15",
    description: "Ordinateur portable 15,6 pouces, Intel Core i7, 16 Go de RAM, SSD 512 Go.",
    price: 1299.99,
    category: "Ordinateurs portables",
    stock: 12,
    image: "https://placehold.co/600x400?text=Laptop+Pro+15",
  },
  {
    name: "UltraBook Air 13",
    description: "Ultraportable 13 pouces, 8 Go de RAM, SSD 256 Go, autonomie de 14 heures.",
    price: 899.9,
    category: "Ordinateurs portables",
    stock: 20,
    image: "https://placehold.co/600x400?text=UltraBook+Air+13",
  },
  {
    name: "PC Gamer Titan",
    description: "Tour gamer avec processeur Ryzen 7, carte graphique 8 Go, 32 Go de RAM, SSD 1 To.",
    price: 1599,
    category: "PC de bureau",
    stock: 6,
    image: "https://placehold.co/600x400?text=PC+Gamer+Titan",
  },
  {
    name: "Mini PC Office",
    description: "Mini PC silencieux pour le bureau, 8 Go de RAM, SSD 256 Go.",
    price: 399.5,
    category: "PC de bureau",
    stock: 15,
    image: "https://placehold.co/600x400?text=Mini+PC+Office",
  },
  {
    name: "Processeur Ryzen 7 7700X",
    description: "Processeur 8 coeurs, 16 threads, socket AM5.",
    price: 329,
    category: "Composants",
    stock: 25,
    image: "https://placehold.co/600x400?text=Ryzen+7",
  },
  {
    name: "Carte graphique RTX 4060",
    description: "Carte graphique 8 Go GDDR6, idéale pour le jeu en 1080p.",
    price: 319.99,
    category: "Composants",
    stock: 9,
    image: "https://placehold.co/600x400?text=RTX+4060",
  },
  {
    name: "Écran 27 pouces QHD 144 Hz",
    description: "Écran IPS 27 pouces, résolution 2560x1440, fréquence 144 Hz.",
    price: 279.9,
    category: "Écrans",
    stock: 18,
    image: "https://placehold.co/600x400?text=Ecran+27+QHD",
  },
  {
    name: "Écran 24 pouces Full HD",
    description: "Écran 24 pouces Full HD, dalle IPS, sortie HDMI et DisplayPort.",
    price: 139,
    category: "Écrans",
    stock: 30,
    image: "https://placehold.co/600x400?text=Ecran+24+FHD",
  },
  {
    name: "Clavier mécanique RGB",
    description: "Clavier mécanique avec switches rouges et rétroéclairage RGB.",
    price: 79.9,
    category: "Périphériques",
    stock: 40,
    image: "https://placehold.co/600x400?text=Clavier+RGB",
  },
  {
    name: "Souris sans fil ergonomique",
    description: "Souris sans fil rechargeable, capteur 4000 DPI, 6 boutons.",
    price: 39.9,
    category: "Périphériques",
    stock: 55,
    image: "https://placehold.co/600x400?text=Souris+sans+fil",
  },
  {
    name: "SSD NVMe 1 To",
    description: "Disque SSD NVMe M.2 de 1 To, lecture jusqu'à 7000 Mo/s.",
    price: 99.9,
    category: "Stockage",
    stock: 35,
    image: "https://placehold.co/600x400?text=SSD+NVMe+1To",
  },
  {
    name: "Routeur Wi-Fi 6",
    description: "Routeur Wi-Fi 6 double bande, 4 ports Ethernet Gigabit.",
    price: 89,
    category: "Réseau",
    stock: 22,
    image: "https://placehold.co/600x400?text=Routeur+Wi-Fi+6",
  },
];

const seed = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    const created = await Product.insertMany(products);
    console.log(`${created.length} produits insérés dans la base`);
  } catch (error) {
    console.error(`Erreur pendant le seed : ${error.message}`);
  } finally {
    await mongoose.connection.close();
  }
};

seed();