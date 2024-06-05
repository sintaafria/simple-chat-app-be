const express = require("express");
const {
	accessChat,
	fetchChats,
	createGroupChat,
	renameGroup,
	addToGroup,
} = require("../controller/chatController");

const router = express.Router();

router.post("/access-chat", accessChat);
router.get("/chat-list", fetchChats);
router.post("/create-group", createGroupChat);
router.put("/rename-group", renameGroup);
router.put("/add-group-member", addToGroup);

module.exports = router;
