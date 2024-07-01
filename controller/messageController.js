const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = async (req, res, next) => {
	try {
		const { content, chat_id } = req.body;
		if (!content || !chat_id) {
			return res.status(400).json({
				message: "Invalid data passed into request",
			});
		}

		const newMessage = {
			sender: req.user._id,
			content,
			chat: chat_id,
		};
		let message = await Message.create(newMessage);
		message = await message.populate("sender", "name pic");
		message = await message.populate("chat");
		message = await User.populate(message, {
			path: "chat.users",
			select: "name pic email",
		});

		await Chat.findByIdAndUpdate(chat_id, { latest_message: message });

		return res.status(200).json(message);
	} catch (err) {
		next(err);
	}
};

const getAllMessages = async (req, res) => {
	try {
		const messages = await Message.find({ chat: req.params.chat_id })
			.sort({ createdAt: "desc" })
			.populate("sender", "name pic email")
			.populate("chat");
		res.json(messages);
	} catch (err) {
		next(err);
	}
};

module.exports = { sendMessage, getAllMessages };
