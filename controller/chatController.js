const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = async function (req, res, next) {
	try {
		const { user_id } = req.body;

		if (!user_id) {
			return res.sendStatus(400);
		}

		let isChat = await Chat.find({
			is_group_chat: false,
			$and: [
				{ users: { $elemMatch: { $eq: req.user._id } } },
				{ users: { $elemMatch: { $eq: user_id } } },
			],
		})
			.populate("users", "-password")
			.populate("latest_message");

		isChat = await User.populate(isChat, {
			path: "latest_message.sender",
			select: "name pic email",
		});

		if (isChat.length > 0) {
			res.send(isChat[0]);
		} else {
			const chatData = {
				chatName: "sender",
				is_group_chat: false,
				users: [req.user._id, user_id],
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

const fetchChats = async (req, res, next) => {
	try {
		let chats = await Chat.find({
			users: { $elemMatch: { $eq: req.user._id } },
		})
			.populate("users", "-password -token")
			.populate("group_admin", "-password -token")
			.populate("latest_message")
			.sort({ updatedAt: -1 });

		chats = await User.populate(chats, {
			path: "latest_message.sender",
			select: "name pic email",
		});
		res.status(200).send(chats);
	} catch (err) {
		next(err);
	}
};

const createGroupChat = async (req, res, next) => {
	try {
		if (!req.body.users || !req.body.name) {
			return res
				.status(400)
				.send({ message: "Please Fill all the feilds" });
		}

		const users = req.body.users;

		if (users.length < 2) {
			return res
				.status(400)
				.send("More than 2 users are required to form a group chat");
		}

		users.push(req.user);

		const groupChat = await Chat.create({
			chat_name: req.body.name,
			users: users,
			is_group_chat: true,
			group_admin: req.user,
		});

		const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
			.populate("users", "-password -token")
			.populate("group_admin", "-password -token");

		res.status(201).json(fullGroupChat);
	} catch (err) {
		next(err);
	}
};

const renameGroup = async (req, res, next) => {
	try {
		const { chat_id, chat_name } = req.body;

		const updatedChat = await Chat.findByIdAndUpdate(
			chat_id,
			{
				chat_name: chat_name,
			},
			{
				new: true,
			}
		)
			.populate("users", "-password -token")
			.populate("group_admin", "-password -token");

		if (!updatedChat) {
			res.status(404).json({
				message: "Chat Not Found",
			});
		} else {
			res.json(updatedChat);
		}
	} catch (err) {
		next(err);
	}
};

const addToGroup = async (req, res) => {
	try {
		const { chat_id, user_id } = req.body;

		// check if the requester is admin

		const added = await Chat.findByIdAndUpdate(
			chat_id,
			{
				$push: { users: user_id },
			},
			{
				new: true,
			}
		)
			.populate("users", "-password -token")
			.populate("group_admin", "-password -token");

		if (!added) {
			return res.status(404).json({
				message: "Chat Not Found",
			});
		} else {
			return res.json(added);
		}
	} catch (err) {
		next(err);
	}
};

module.exports = {
	accessChat,
	fetchChats,
	createGroupChat,
	renameGroup,
	addToGroup,
};
