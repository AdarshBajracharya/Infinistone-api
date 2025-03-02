const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize"); 
const helmet = require("helmet");
const xss = require("xss-clean");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.options("*", cors());

// Load env file
dotenv.config({
  path: "./config/config.env",
});

// Connect to database
connectDB();

// Route files
const auth = require("./routes/customer");
const product = require("./routes/product");
const booking = require("./routes/booking");


// Body parser
app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static('public'));

// Mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/product", product);
app.use("/api/v1/booking", booking);


const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});