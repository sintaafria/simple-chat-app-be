const express = require("express");
const {
	sendMessage,
	getAllMessages,
} = require("../controller/messageController");

const router = express.Router();

router.post("/", sendMessage);
router.get("/:chat_id", getAllMessages);

module.exports = router;
