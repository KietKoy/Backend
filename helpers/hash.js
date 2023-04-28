const crypto = require('crypto');
function hashPassword(password) {
    //Generate a random salt
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(
        password,
        salt,
        1000,
        64,
        'sha1'
    ).toString('hex');
    return {
        salt,
        hashedPassword
    };
}
function comparePassword(password, salt, passwordDb) {
    //Generate a random salt
    // const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(
        password,
        salt,
        1000,
        64,
        'sha1'
    ).toString('hex');
    return hashedPassword == passwordDb;
}
module.exports = {hashPassword, comparePassword};