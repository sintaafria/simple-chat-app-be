const express = require("express")
const { register } = require("../controller/userController")

const router = express.Router()

router.post('/register', register)
router.get('/login', (req, res) => res.send("login"))

module.exports = router