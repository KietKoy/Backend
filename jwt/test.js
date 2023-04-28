//json web token
// const jsonwebtoken = require('jsonwebtoken');
// const SECRET = 'kk1807'
// const user = {
//     'fullName': 'Truong Tuan Kiet',
//     'username': 'Kiet Koy',
//     'password': '1234',
//     'age': 12,
//     'gender': 'male',
//     'email': 'dolam3131@gmail.com'
// }
// const jwtPayload = {
//     name: user.name,
//     username: user.username,
//     age: user.age,
//     gender: user.gender,
//     email: user.email
// }
// const jwt = jsonwebtoken.sign(jwtPayload, SECRET, {
//     algorithm: 'HS256',// Thuật toán sử dụng để mã hoá
//     expiresIn: '1d', // Thời gian csử dụng jwt đó
//     issuer: 'sgroup' // người cấp phát jwt
// });
// const tokenUser = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IktpZXQgS295IiwiYWdlIjoxMiwiZ2VuZGVyIjoibWFsZSIsImVtYWlsIjoiZG9sYW0zMTMxQGdtYWlsLmNvbSIsImlhdCI6MTY4MTgyNTk3OCwiZXhwIjoxNjgxOTEyMzc4LCJpc3MiOiJzZ3JvdXAifQ.-bK2xVbZmhDoKtQswmxRQU41FbeNq_XI3wn2OD5jZzk';
// const isTokenValid = jsonwebtoken.verify(tokenUser, SECRET);

//Hashing and encryption
const crypto = require('crypto');
const rawPassword = 'kk123';
//Hash password with SHA-512 algorithm
const hashWithSHA512 = (input) => {
    return crypto.createHash('sha512')
                .update(input)
                .digest('hex');    
}
// console.log(hashWithSHA512(rawPassword));
// console.log("================================================");
//hashing password with SHA-256 + salt
const hashWithSHA256RandomSalt = (input) => {
    const salt =  crypto.randomBytes(12).toString('hex');
    return crypto.pbkdf2Sync(
        rawPassword,
        salt,
        1000,
        64,
        'sha512'
    ).toString('hex');
}
// console.log(hashWithSHA256RandomSalt(rawPassword));
// console.log('----------------------------------------------------------------');
// console.log(hashWithSHA256RandomSalt(rawPassword));

const key  = crypto.generateKeyPairSync(
    'rsa',
    {modulusLength: 2048},
);
const publicKey = key.publicKey;
const privateKey = key.privateKey;
//decrypt with public key
const encryptedData = crypto.publicEncrypt(
    {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256"
    },
    Buffer.from(rawPassword)
).toString('base64')
//decrypt with private key
const decryptedData= crypto.privateDecrypt(
    {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256"
    },
    Buffer.from(encryptedData, 'base64')
);
console.log("decrypted data: " + decryptedData.toString('utf-8'));

