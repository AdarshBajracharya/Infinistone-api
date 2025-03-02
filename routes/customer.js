const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const upload = require("../middleware/uploads");

const {
  register,
  login,
  uploadImage,
  updateProfile,  
  getUserDetails,
  // findbyid
} = require("../controllers/customer");
const { authenticateToken } = require("../middleware/auth");

router.post("/uploadImage", upload, uploadImage);
router.post("/register", register);
router.post("/login", login);
router.put('/update/:id', updateProfile);
router.get('/:userId', getUserDetails);
// router.get("/findById", authenticateToken, findbyid);


module.exports = router;
