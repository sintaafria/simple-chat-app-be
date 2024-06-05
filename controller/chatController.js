const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = async function (req, res) {
	try {
		const { userId } = req.body;

		if (!userId) {
			return res.sendStatus(400);
		}

		let isChat = await Chat.find({
			isGroupChat: false,
			$and: [
				{ users: { $elemMatch: { $eq: req.user._id } } },
				{ users: { $elemMatch: { $eq: userId } } },
			],
		})
			.populate("users", "-password")
			.populate("latestMessage");

		isChat = await User.populate(isChat, {
			path: "latestMessage.sender",
			select: "name pic email",
		});

		if (isChat.length > 0) {
			res.send(isChat[0]);
		} else {
			const chatData = {
				chatName: "sender",
				isGroupChat: false,
				users: [req.user._id, userId],
			};

			const createdChat = await Chat.create(chatData);
			const FullChat = await Chat.findOne({
				_id: createdChat._id,
			}).populate("users", "-password -token");
			res.status(200).json(FullChat);
		}
	} catch (err) {
		next(err);
	}
};

const fetchChats = async (req, res) => {
	try {
		Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
			.populate("users", "-password -token")
			.populate("groupAdmin", "-password -token")
			.populate("latestMessage")
			.sort({ updatedAt: -1 })
			.then(async results => {
				results = await User.populate(results, {
					path: "latestMessage.sender",
					select: "name pic email",
				});
				res.status(200).send(results);
			});
	} catch (error) {
		next(err);
	}
};

module.exports = { accessChat, fetchChats };
