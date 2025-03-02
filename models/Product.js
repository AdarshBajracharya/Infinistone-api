const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  item_name: {
    type: String,
    required: true,
    trim: true,
  },
  item_type: {
    type: String,
    required: true,
    trim: true,
  },
  item_description: {
    type: String,
    required: true,
    trim: true,
  },
  item_price: {
    type: Number,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: null,
  },
});


module.exports = mongoose.model("product", productSchema);
