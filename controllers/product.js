  const asyncHandler = require("../middleware/async");
  const Product = require("../models/Product");
  const path = require("path");
  const fs = require("fs");

  // @desc    Create new product
  // @route   POST /api/v1/product/create
  // @access  Public
  exports.addProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findOne({ item_name: req.body.item_name });
    console.log(req.body);
    if (product) {
      return res.status(400).send({ message: "Product already exists" });
    }

    await Product.create(req.body);

    res.status(200).json({
      success: true,
      message: "Product created successfully",
    });
  });


  // // @desc   Update user profile
  // // @route  PATCH /api/v1/auth/updateProfile
  // // @access Private
  // exports.updateProfile = asyncHandler(async (req, res, next) => {
  //   const { fname, lname, email, phone, address, image } = req.body;

  //   // Find the user by ID (assuming the user is authenticated and their ID is available via req.user)
  //   const customer = await Customer.findById(req.user.id);

  //   if (!customer) {
  //     return res.status(404).json({ message: "User not found" });
  //   }

  //   // Update the user's profile
  //   customer.fname = fname || customer.fname;
  //   customer.lname = lname || customer.lname;
  //   customer.email = email || customer.email;
  //   customer.phone = phone || customer.phone;
  //   customer.address = address || customer.address;

  //   // Handle image upload (optional, if provided)
  //   if (image) {
  //     // You can handle file saving logic here if you're saving images
  //     customer.image = image;  // Save the image filename or URL in the database
  //   }

  //   await customer.save();

  //   res.status(200).json({ 
  //     success: true,
  //     message: "Profile updated successfully",
  //     data: customer,
  //   });
  // });

  // @desc Upload Single Image
  // @route POST /api/v1/product/upload
  // @access Private
  exports.uploadImage = asyncHandler(async (req, res, next) => {
    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file" });
    }

    res.status(200).json({
      success: true,
      data: req.file.filename,
    });
  });

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(401).json({ message: "cannot find the product with " });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  // Use deleteOne() instead of remove()
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  // Update product fields
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,        // Return the updated document
    runValidators: true, // Run schema validators
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});