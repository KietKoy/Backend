const fs = require('fs');
const jwt = require('jsonwebtoken');
const PUBLIC_KEY = fs.readFileSync('./Key/public.pem');
const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    const tokenUser = authorizationHeader.substring(7);
    if(!tokenUser) {
        return res.status(401).json({message: "No token provided"})
    }
    jwt.verify(tokenUser, PUBLIC_KEY, (err, data) => {
        if(err) {
            return res.status(401).json({message: err.message});
        }
        next();
        req.username = data.username;
    })
}
const getUserIdByToken = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    const tokenUser = authorizationHeader.substring(7);
    if(!tokenUser) {
        return res.status(401).json({message: "No token provided"})
    }
    jwt.verify(tokenUser, PUBLIC_KEY, (err, data) => {
        if(err) {
            return res.status(401).json({message: err.message});
        }
        next();
        req.createBy = data.id;
    })
}
module.exports = {verifyToken, getUserIdByToken};