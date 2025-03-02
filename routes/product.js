const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploads");

const {
  addProduct,
  uploadImage,
  getProduct,
  getProducts, 
  updateProduct,
  deleteProduct
} = require("../controllers/product");

router.post("/uploadImage", upload, uploadImage);
router.post("/create", addProduct);
router.get("/getAllProducts", getProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);



module.exports = router;
