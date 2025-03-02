require("dotenv").config({ path: "./config/config.env" }); 
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { expect } = require("chai");  // Add this line
const Customer = require("../models/Customer"); 

describe("Customer Model", () => {
  before(async () => {
    console.log("TEST_DB_URI:", process.env.TEST_DB_URI);

    await mongoose.connect(process.env.TEST_DB_URI);
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Customer.deleteMany({});
  });

  it("should hash the password before saving", async () => {
    const customerData = {
      fname: "John",
      lname: "Doe",
      email: "john.doe@example.com",
      address: "123 Main St",
      password: "password123",
    };

    const customer = new Customer(customerData);
    await customer.save();

    expect(customer.password).to.not.equal("password123");
    const isMatch = await bcrypt.compare("password123", customer.password);
    expect(isMatch).to.be.true;
  });

  it("should generate a valid JWT token", async () => {
    const customerData = {
      fname: "Jane",
      lname: "Doe",
      email: "jane.doe@example.com",
      address: "456 Elm St",
      password: "password123",
    };

    const customer = new Customer(customerData);
    await customer.save();

    const token = customer.getSignedJwtToken();
    expect(token).to.be.a("string");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).to.equal(customer._id.toString());
  });

  it("should correctly match passwords", async () => {
    const customerData = {
      fname: "Alice",
      lname: "Smith",
      email: "alice.smith@example.com",
      address: "789 Oak St",
      password: "password123",
    };

    const customer = new Customer(customerData);
    await customer.save();

    const isMatch = await customer.matchPassword("password123");
    expect(isMatch).to.be.true;

    const isNotMatch = await customer.matchPassword("wrongpassword");
    expect(isNotMatch).to.be.false;
  });

  it("should generate and hash a reset password token", async () => {
    const customerData = {
      fname: "Bob",
      lname: "Johnson",
      email: "bob.johnson@example.com",
      address: "101 Pine St",
      password: "password123",
    };

    const customer = new Customer(customerData);
    await customer.save();

    const resetToken = customer.getResetPasswordToken();
    expect(resetToken).to.be.a("string");

    expect(customer.resetPasswordToken).to.be.a("string");
    expect(customer.resetPasswordExpire).to.be.a("number");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    expect(customer.resetPasswordToken).to.equal(hashedToken);
  });
});
