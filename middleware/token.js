const jwt = require('jsonwebtoken')
const dotenv = require("dotenv")
const User = require('../models/userModel')
const { secretKey } = require('../config/db')
dotenv.config()

const encodeToken = function(payload){
    const token = jwt.sign(payload, process.env.SECRET_KEY)
    return token
}

const getToken =  function(req) {
    let token = 
        req.headers.authorization
        ? req.headers.authorization.replace('Bearer ', '')
        : null;

    return token && token.length ? token : null;
}

function decodeToken(){
    return async function(req, res, next) {
        try {
            let token = getToken(req);

            if (!token){
                return res.status(401).json({
                    message: 'Unauthorized'
                })
            }

            req.user = jwt.verify(token, secretKey);
            let user = await User.findOne({token: {$in: [token]}});
            if (!user) {
                return res.status(401).json({
                    message: 'Token Expired'
                });
            }
        } catch(err) {
            if(err && err.name === 'JsonWebTokenError') {
                return res.status(400).json({
                    error: 1,
                    message: err.message
                });
            }
            next(err)
        } 
        return next();
    }
};

module.exports = {encodeToken, decodeToken, getToken}