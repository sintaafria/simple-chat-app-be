const User = require("../models/userModel")
const jwt = require('jsonwebtoken')
const dotenv = require("dotenv")

dotenv.config()

const register = async function(req, res, next){
    try{
        const {name, email, password} = req.body
        let user = await User.findOne({email})
        if(!user){
            user = await new User({
                name, email, password
            })
            await user.save()
            const token = jwt.sign({_id: user._id}, process.env.SECRET_KEY)
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
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(err);
    }
}

module.exports = {register}