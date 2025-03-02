//PROTECT THE MIDDLEWARE
const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const User = require("../models/Customer");

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }

  //Make sure token exist
  if (!token) {
    // return next(new ErrorResponse('Not authorized to access this route', 401));
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    // return next(new ErrorResponse('Not authorized to access this route', 401));
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }
});

// Grant access to specific roles , i.e publisher and admin

exports.authorize = (...roles) => {
  return (req, res, next) => {
    ///check if it is admin or publisher. user cannot access
    //  console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      // return next(new ErrorResponse(`User role ${req.user.roles} is not authorized to access this route`, 403));
      return res.status(403).json({
        message: `User role ${req.user.roles} is not authorized to access this route`,
      });
    }
    next();
  };
};

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Customer.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized" });
  }
});

exports.authenticateToken = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ error: "Access denied: No token provided" }); // Return JSON response
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Ensure SECRET_KEY is set in .env file
    req.user = verified; // Attach the verified payload to the req object
    next(); // Call the next middleware or route handler
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired" }); // Handle expired token separately
    }
    return res.status(401).json({ error: "Invalid token" }); // Handle other JWT errors
  }
};