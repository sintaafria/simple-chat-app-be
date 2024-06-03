const express = require("express")
const { register, login, logout } = require("../controller/userController")
const { decodeToken } = require("../middleware/token")

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', decodeToken(), logout)

module.exports = router