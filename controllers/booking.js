const Booking = require("../models/Booking"); 
const Customer = require("../models/Customer");
const Product = require("../models/Product");

// Add a new booking
exports.addBooking = async (req, res) => {
  try {
    const { customerId, productId, bookingDate } = req.body;

    // Check if the customer and product exist
    const customer = await Customer.findById(customerId);
    const product = await Product.findById(productId);

    if (!customer || !product) {
      return res.status(404).json({ message: "Customer or Product not found" });
    }

    // Create the new booking
    const newBooking = await Booking.create({
      customer: customerId,
      product: productId,
      bookingDate: bookingDate || Date.now(),
    });

    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an existing booking
exports.updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { customerId, productId, bookingDate } = req.body;

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Optional: Check if the new customer or product exists (same as in addBooking)
    if (customerId) {
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
    }

    if (productId) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
    }

    // Update booking details
    if (customerId) booking.customer = customerId;
    if (productId) booking.product = productId;
    if (bookingDate) booking.bookingDate = bookingDate;

    // Save updated booking
    const updatedBooking = await booking.save();
    res.status(200).json({ message: "Booking updated successfully", booking: updatedBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
    try {
      const { bookingId } = req.params;
      console.log(bookingId);
  
      // Find the booking and delete it
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      // Use deleteOne() instead of remove()
      await booking.deleteOne(); // or alternatively: await Booking.deleteOne({ _id: bookingId });
      
      res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

// Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
      // Retrieve all bookings, optionally populate with customer and product details
      const bookings = await Booking.find()
        .populate("customer", "fname lname email") // Select relevant customer fields
        .populate("product", "item_name item_price"); // Select relevant product fields
  
      res.status(200).json({ message: "Bookings retrieved successfully", bookings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // Get bookings by customerId (userId)
exports.getBookingsByCustomerId = async (req, res) => {
    try {
      const { customerId } = req.params;
  
      // Retrieve bookings by customerId and populate customer and product details
      const bookings = await Booking.find({ customer: customerId })
        .populate("customer", "fname lname email") // Select relevant customer fields
        .populate("product", "item_name item_price"); // Select relevant product fields
  
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: "No bookings found for this customer" });
      }
  
      res.status(200).json({ message: "Bookings retrieved successfully", bookings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  // Get a booking by ID
exports.getBooking = async (req, res) => {
    try {
      const { bookingId } = req.params;
  
      // Find the booking by ID and populate customer and product details
      const booking = await Booking.findById(bookingId)
        .populate("customer", "fname lname email") // Select relevant customer fields
        .populate("product", "item_name item_price"); // Select relevant product fields
  
      if (!booking) {
        return res.status(404).json({success:false, message: "Booking not found" });
      }
  
      res.status(200).json({success:true, message: "Booking retrieved successfully", booking });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  