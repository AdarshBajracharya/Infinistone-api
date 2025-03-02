const { expect } = require("chai");
const mongoose = require("mongoose");
const Product = require("../models/Product");

describe("Product Model", () => {
  before(async () => {
    // Connect to the test database
    await mongoose.connect("mongodb://localhost:27017/testdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    // Clean up and disconnect
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the products collection before each test
    await Product.deleteMany({});
  });

  it("should require all necessary fields", async () => {
    const product = new Product({});

    let error;
    try {
      await product.validate();
    } catch (err) {
      error = err;
    }

    expect(error).to.exist;
    expect(error.errors.item_name).to.exist;
    expect(error.errors.item_type).to.exist;
    expect(error.errors.item_description).to.exist;
    expect(error.errors.item_price).to.exist;
  });

  it("should save a valid product", async () => {
    const productData = {
      item_name: "Marble Tile",
      item_type: "Flooring",
      item_description: "High-quality marble tile",
      item_price: 150,
      image: "marble_tile.jpg",
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    expect(savedProduct._id).to.exist;
    expect(savedProduct.item_name).to.equal(productData.item_name);
    expect(savedProduct.item_type).to.equal(productData.item_type);
    expect(savedProduct.item_description).to.equal(productData.item_description);
    expect(savedProduct.item_price).to.equal(productData.item_price);
    expect(savedProduct.image).to.equal(productData.image);
  });

  it("should set image to null by default if not provided", async () => {
    const productData = {
      item_name: "Granite Tile",
      item_type: "Flooring",
      item_description: "Durable granite tile",
      item_price: 200,
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    expect(savedProduct.image).to.be.null;
  });
});
