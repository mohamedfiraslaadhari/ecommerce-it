const express = require("express");
const {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

router.get("/", getCart);
router.delete("/", clearCart);
router.post("/items", addItem);
router.put("/items/:productId", updateItem);
router.delete("/items/:productId", removeItem);

module.exports = router;