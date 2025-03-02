const asyncHandler = require("../middleware/async");
const Customer = require("../models/Customer");
const path = require("path");
const fs = require("fs");

// @desc    Create new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findOne({ email: req.body.email });
  console.log(req.body);
  if (customer) {
    return res.status(400).send({ message: "User already exists" });
  }

  await Customer.create(req.body);

  res.status(200).json({
    success: true,
    message: "User created successfully",
  });
});

// @desc   Login user
// @route  POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide an email and password" });
  }

  // Check if user exists
  const customer = await Customer.findOne({ email }).select("+password");

  if (!customer || !(await customer.matchPassword(password))) { 
    return res.status(401).json({ message: "Invalid credentials" });
  }

  sendTokenResponse(customer, 200, res);
});

// @desc   Update user profile
// @route  PATCH /api/v1/auth/updateProfile
// @access Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const { fname, lname, email, phone, address, image } = req.body;

  // Get user ID from URL parameters
  const userId = req.params.id;

  // Find the user by ID
  const customer = await Customer.findById(userId);

  if (!customer) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update user's profile data with values from the request body (if provided)
  customer.fname = fname || customer.fname;
  customer.lname = lname || customer.lname;
  customer.email = email || customer.email;
  customer.phone = phone || customer.phone;
  customer.address = address || customer.address;

  // Handle image upload (optional, if provided)
  if (image) {
    // Add your logic for handling file upload if necessary
    customer.image = image; // Save the image filename or URL in the database
  }

  // Save updated user profile
  await customer.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: customer,
  });
});



// @desc Upload Single Image
// @route POST /api/v1/auth/upload
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

// Get token from model , create cookie and send response
const sendTokenResponse = (customer, statusCode, res) => {
  const token = customer.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "proc") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      userId: customer._id,
      user: customer,
      isAdmin: customer.isAdmin, 
    });
};

// @desc   Get user details
// @route  GET /api/v1/auth/:userId
// @access Private
exports.getUserDetails = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const customer = await Customer.findById(userId);

  if (!customer) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    success: true,
    data: customer,
  });
});


// Find user by ID
exports.findbyid = asyncHandler(async (req, res) => {
  try {
    // Debugging: Check the value of req.user (set in authenticateToken middleware)
    console.log("User data from token:", req.user);

    // Get userId from the token (req.user is set by authenticateToken middleware)
    const userId = req.user._id; // Ensure that req.user is correctly set

    if (!userId) {
      return res.status(400).json({ error: "User ID is missing from token" });
    }

    // Ensure userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(422).json({ error: "Invalid User ID" });
    }

    // Fetch user by userId from database
    const cred = await Customer.findById(userId);

    if (!cred) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User data found:", cred);
    res.status(200).json({
      success: true,
      data: cred,
    });
  } catch (e) {
    console.error("Error while fetching user data:", e);
    res.status(500).json({ error: "Server error" });
  }
});