const express = require("express");
const { getAllUsers, userProfile } = require("../controller/userController");

const router = express.Router();

router.get("/user-profile", userProfile);
router.get("/users", getAllUsers);

module.exports = router;
