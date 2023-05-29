const express = require('express');
const authRouter = express.Router();
const jsonwebtoken = require('jsonwebtoken');
const { validate } = require('../validate');
const connection = require('../../database/connection');
const verifyToken = require('../../helpers/JwtHelper');
const { hashPassword, comparePassword } = require('../../helpers/hash.js');
const mailService = require('../../services/mail.services')
const { authService } = require('./auth.service')
const fs = require('fs');
const crypto = require('crypto');
const { request } = require('http');
const PRIVATE_KEY = fs.readFileSync('./Key/private.pem');
authRouter.post('/register', validate, async function (req, res) {
    const {
        username,
        password,
        email,
        age,
        name,
        gender
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
                (err, data) => {
                    if (err) {
                        return res.status(500).json({ message: "Internal server error" });
                    }
                    return res.status(201).json({ message: "Register successful" });
                }
            )
        }
    );
});
authRouter.post('/login', validate, async function (req, res, next) {
    const { username, password } = req.body;
    const user = await connection.query(
        'Select * from users where username = ?',
        username,
        (err, rows) => {
            if (err) {
                return res.status(500).json({ message: "Internal server error" });
            }
            const user = rows[0];
            if (!user) {
                return res.status(400).json({ message: 'User is not exist' });
            }
            const saltDb = user.salt;
            const passwordDb = user.password;
            if (comparePassword(password, saltDb, passwordDb)) {
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
                return res.status(200).send({ data: jwt });
            }
            return res.status(400).json({ message: "password is incorrect" })
        }
    )
})
authRouter.put('/users/:username', verifyToken, validate, async function (req, res, next) {
    const username = req.username;
    // try {
    //     const isTokenValid = jsonwebtoken.verify(tokenUser, PUBLIC_KEY);
    if (isTokenValid.username == username) {
        connection.query(
            'UPDATE users SET name = ?, age = ?, gender = ? WHERE username = ?',
            [req.body.name, req.body.age, req.body.gender, username],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Can't update user" })
                }
                else {
                    return res.status(204).json({ message: "User updated successfully" });
                }
            }
        )
    } else {
        return res.status(401).json({ message: "Authentication failed" });
    }
    // } catch (error) {
    //     return res.status(401).json({message: error.message})
    // }
})
authRouter.post('/users/sendmail', async function (req, res, next) {
    try {
        const { emailFrom, emailTo, emailSubject, emailText } = req.body;
        await mailService.sendMail({ emailFrom, emailTo, emailSubject, emailText });
        return res.status(200).json({ message: "successfull" })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})
authRouter.post('/fotgot-password', async function (req, res, next) {
    const { email } = req.body;
    const user = await authService.getUserByemail(email);
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    const passwordResetToken = crypto.randomBytes(16).toString('hex');
    const isSaveResetToken = await authService.saveResetToken(user.username, passwordResetToken);
    if(isSaveResetToken) {
        const isSendMail = await authService.sendMail(user.email, passwordResetToken);
        if(isSendMail) {
            return res.status(200).json({message: "Check mail to reset password"})
        }
        else {
            return res.status(400).json({message: "Can't send email"});
        }
    }
    else {
        return res.status(400).json({message: "User does not exist"})
    }
})
authRouter.post('/reset-password', async function (req, res, next) {
    const { email, passwordResetToken, newPassword} = req.body;
    const user = authService.getUserToResetPassword(email, passwordResetToken);
    if(!user) {
        return res.status(400).json({ message: "User does not exist"})
    }
    const { salt, hashedPassword } = hashPassword(newPassword);
    const isResetPassword = authService.updatePassword(email, hashedPassword, salt);
    if(isResetPassword) {
        return res.status(200).json({ message: "Reset password successfully"});
    }
    else {
        return res.status(401).json({ message: "Reset password failed" });
    }
})
module.exports = authRouter;