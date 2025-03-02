const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking");

// Routes
router.post("/booking", bookingController.addBooking);
router.get("/booking/:bookingId", bookingController.getBooking);
router.get("/bookings", bookingController.getAllBookings);  
router.get("/bookings/customer/:customerId", bookingController.getBookingsByCustomerId);  
router.put("/booking/:bookingId", bookingController.updateBooking);
router.delete("/booking/:bookingId", bookingController.deleteBooking);

module.exports = router;
