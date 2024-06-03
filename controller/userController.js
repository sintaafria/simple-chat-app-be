const User = require("../models/userModel")
const { encodeToken, getToken } = require("../middleware/token")

const register = async function(req, res, next){
    try{
        const {name, email, password} = req.body
        let user = await User.findOne({email})
        if(!user){
            user = await new User({
                name, email, password
            })
            await user.save()
            const token = encodeToken({_id: user._id})
            user  = await User.findByIdAndUpdate(user._id, { $push: { token } })
                                .select('-__v -createdAt -updatedAt -token -password')
            return res.status(201).json({
                user,
                token
            });
        }
        return res.status(400).json({
            message: 'email is already exist',
            field: 'email'
        });
    }catch(err){
        if (err && err.name === 'ValidationError') {
            return res.status(400).json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(err);
    }
}

const login = async function(req, res, next){
    try{
        const {email, password} = req.body
        let user = await User.findOne({email})
        if(user && password && await user.matchPassword(password)){
            const token = encodeToken({_id: user._id})
            user = await User.findByIdAndUpdate(user._id, { $push: { token } })
            .select('-__v -createdAt -updatedAt -token -password')
            return res.status(200).json({
                user,
                token
            })
        }
        return res.status(401).json({
            message: "The email and password combination is incorrect."
        })
    }catch(err){
        if (err && err.name === 'ValidationError') {
            return res.status(400).json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(err);
    }
}

const getAllUsers = async function(req, res, next){
    try{
        const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};
        
        const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
        return res.status(200).json(users);
    }catch(err){
        next(err);
    }
}

const logout = async (req, res, next) => {
    try{
        let token = getToken(req);
        let user = await User.findOneAndUpdate({ token: { $in: token } }, { $pull: { token: token } }, { userFindAndModify: false });
        if (!token || !user) {
            res.send(400).json({
                message: 'No user Found'
            })
        }
        return res.status(200).json({
            message: 'Logout Succesfully'
        });
    }catch(err){
        next(err)
    }
};

module.exports = {register, login, getAllUsers, logout}