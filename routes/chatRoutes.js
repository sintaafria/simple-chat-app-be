const express = require("express");
const { accessChat, fetchChats } = require("../controller/chatController");

const router = express.Router();

router.post("/access-chat", accessChat);
router.get("/chat-list", fetchChats);

module.exports = router;
