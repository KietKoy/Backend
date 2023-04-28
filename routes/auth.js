const express = require('express');
const {validate} = require('./validate');
const jsonwebtoken = require('jsonwebtoken');
const auth_router = express.Router();
const connection = require('../database/connection');
const { hashPassword, comparePassword } = require('../helpers/hash.js');
const fs = require('fs');
const { resolveSoa } = require('dns');
const PRIVATE_KEY = fs.readFileSync('./Key/private.pem');
const PUBLIC_KEY = fs.readFileSync('./Key/public.pem');
auth_router.post('/register',validate, async function (req, res) {
    const {
        username, password, email, age, name, gender
    } = req.body;
    const user = await connection.query(
        'select * from users where username = ?',
        username,
        (err, rows) => {
            if (err) {
                return res.status(500).json({ message: "Internal server error" });
            }
            const user = rows[0];
            if (user) {
                return res.status(400).json({ message: 'Username is already taken' });
            }
            const { salt, hashedPassword } = hashPassword(password);
            connection.query(
                'INSERT INTO users (username, password, email, age, name, gender, salt) VALUES (?,?,?,?,?,?,?)',
                [username, hashedPassword, email, age, name, gender, salt],
                (err, rows) => {
                    if (err) {
                        return res.status(500).json({ message: "Internal server error" });
                    }
                    return res.status(201).json({ message: "Register successful" });
                }
            )
        }
    );
});
auth_router.post('/login',validate, async function (req, res, next) {
    const {username, password} = req.body;
    const user = await connection.query(
        'Select * from users where username = ?', 
        username,
        (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Internal server error" });
            }
            const user = rows[0];
            if (!user) {
                return res.status(400).json({ message: 'Username is not exist' });
            }
            const saltDb = user.salt;
            const passwordDb = user.password;
            if(comparePassword(password, saltDb, passwordDb)) {
                const jwt = jsonwebtoken.sign({
                    username: user.username,
                    email: user.email,
                    age: user.age,
                    gender: user.gender
                }, 
                PRIVATE_KEY,
                {
                    algorithm: 'RS256',
                }
                )
                return res.status(200).send({data: jwt});
            }
            return res.status(400).json({message: "password is incorrect"})
        }
    )
})
auth_router.put('/users/:username', validate, async function(req, res, next) {
    const username = req.params.username;
    const authorizationHeader = req.headers.authorization;
    const tokenUser = authorizationHeader.substring(7);
    if(!tokenUser) {
        return res.status(401).json({message: "No token provided"})
    }
    try {
        const isTokenValid = jsonwebtoken.verify(tokenUser, PUBLIC_KEY);
        if(isTokenValid.username == username) {
            connection.query(
                'UPDATE users SET name = ?, age = ?, gender = ? WHERE username = ?',
                [req.body.name, req.body.age, req.body.gender, username],
                (err, result) => {
                    if(err) {
                        return res.status(500).json({message: "Can't update user"})
                    }
                    else {
                        return res.status(204).json({message: "User updated successfully"});
                    }
                }
            )
        } else {
            return res.status(401).json({message: "Authentication failed"});
        }
    } catch (error) {
        return res.status(401).json({message: error.message})
    }
})
module.exports = auth_router;