const express = require('express')
const jsonwebtoken = require('jsonwebtoken')
const crypto = require('crypto');
const app = express()
const fs = require('fs')
// const SECRET = 'your_secret'
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
});
fs.writeFileSync("public.pem", publicKey);
fs.writeFileSync("private.pem", privateKey);
// const db = [
//     {
//         username: 'kiet',
//         age: 20,
//         email: 'kiet@gmail.com',
//         balance: 5000,
//         id: 1,
//         password: 'kk123'
//     },
//     {
//         username: 'thao',
//         age: 20,
//         email: 'thao@gmail.com',
//         balance: 2000,
//         id: 2,
//         password: 'pt123'
//     }
// ]
// app.use(express.json())
// app.post('/login', (req, res, next) => {
//     const username = req.body.username
//     const password = req.body.password

//     const user = db.find(user => user.username == username)
//     if (!user) {
//         return res.status(401).json({message: 'User not found'});
//     }
//     // if (user.password == password) {
//     //     const jwt = jsonwebtoken.sign({
//     //         username : user.username,
//     //         email : user.email,
//     //         age : user.age
//     //     }, SECRET,
//     //     {
//     //         algorithm: 'HS256',
//     //         expiresIn: '1h'
//     //     });
//     //     return res.status(200).json({data: jwt});
//     // }
//     if (user.password == password) {
//             const jwt = jsonwebtoken.sign({
//                 username : user.username,
//                 email : user.email,
//                 age : user.age
//             }, privateKey,
//             {
//                 algorithm: 'RS256',
//                 expiresIn: '1h'
//             });
//             return res.status(200).json({data: jwt});
//         }
//     return res.status(401).json({ message: 'Invalid'})
// })

// app.get('/balance', (req, res, next) => {
//     const username = req.query.username;
//     const authorizationHeader = req.headers.authorization
//     //authorizationHeader = Bearer <TOKEN> 
//     // => token  = authorizationHeader.substring(7)
//     const tokenUser = authorizationHeader.substring(7)
//     try {
//         const isTokenValid = jsonwebtoken.verify(tokenUser, publicKey);
//         //authorization
//         if(isTokenValid.username == username) {
//             const user = db.find(user => user.username == username);
//             return res.status(200).json({ balance: user.balance});
//         }
//         else {
//             return res.status(401).json({message: 'Authentication failed'});
//         }
//     } catch (error) {
//         return res.status(401).json({message: error.message})
//     }
// })

// app.listen(3000)