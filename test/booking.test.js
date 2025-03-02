const { expect } = require("chai");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Customer = require("../models/Customer"); 
const Product = require("../models/Product"); 

describe("Booking Model", () => {
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
    // Clear the database before each test
    await Booking.deleteMany({});
    await Customer.deleteMany({});
    await Product.deleteMany({});
  });

  it("should require customer and product fields", async () => {
    const booking = new Booking({});

    let error;
    try {
      await booking.validate();
    } catch (err) {
      error = err;
    }

    expect(error).to.exist;
    expect(error.errors.customer).to.exist;
    expect(error.errors.product).to.exist;
  });

  it("should default bookingDate to the current date", async () => {
    const customer = new Customer({ 
      fname: "John", 
      lname: "Doe", 
      email: "john.doe@example.com", 
      address: "123 Main St", 
      password: "password123" 
    });
    await customer.save();

    const product = new Product({ 
      item_name: "Product 1", 
      item_price: 100, 
      item_description: "Sample description", 
      item_type: "Sample type" 
    });
    await product.save();

    const booking = new Booking({
      customer: customer._id,
      product: product._id,
    });

    await booking.save();

    expect(booking.bookingDate).to.be.a("date");
    expect(booking.bookingDate.getTime()).to.be.closeTo(Date.now(), 1000); 
  });

  it("should reference customer and product correctly", async () => {
    const customer = new Customer({ 
      fname: "Jane", 
      lname: "Doe", 
      email: "jane.doe@example.com", 
      address: "456 Elm St", 
      password: "password123" 
    });
    await customer.save();

    const product = new Product({ 
      item_name: "Product 2", 
      item_price: 200, 
      item_description: "Another sample description", 
      item_type: "Another type" 
    });
    await product.save();

    const booking = new Booking({
      customer: customer._id,
      product: product._id,
    });

    await booking.save();

    const foundBooking = await Booking.findById(booking._id)
      .populate("customer")
      .populate("product");

    expect(foundBooking.customer._id.toString()).to.equal(customer._id.toString());
    expect(foundBooking.product._id.toString()).to.equal(product._id.toString());
  });
});
