const { query } = require('../../database/connection');
const connection = require('../../database/connection');
const mailService = require('../../services/mail.services')
const authService = {
    async getUserByemail(email) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM users WHERE email = ?',
                email,
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows.length ? rows[0] : null);
                    }
                }
            )
        })
    },
    async saveResetToken(username, passwordResetToken) {
        return new Promise((resolve, reject) => {
            const passwordResetExpiration = new Date(Date.now() + 10 * 60 * 1000)
            connection.query(
                'UPDATE users SET passwordResetExpiration = ?, passwordResetToken = ?  WHERE username = ?',
                [passwordResetExpiration, passwordResetToken, username],
                (err, rows) => {
                    if (err) {  
                        reject(err);
                    } else {
                        resolve(rows?.affectedRows > 0 ? true : false);
                    }
                }
            )
        })
    },
    async sendMail(email, passwordResetToken) {
        try {
            await mailService.sendMail({
                emailFrom: process.env.SMTP_SERVER_MAIL,
                emailTo: email,
                emailSubject: "Reset Password",
                emailText:passwordResetToken
             });
        } catch (error) {
            console.log(error.message);
            return false;
        }
        return true;
    },
    async getUserToResetPassword(email, passwordResetToken) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM users WHERE email = ? AND passwordResetToken = ? AND passwordResetExpiration >= ?',
                [email, passwordResetToken, new Date(Date.now())],
                (err, rows) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(rows.length ? rows[0] : null);
                    }
                }
            )
        })
    },
    async updatePassword(email, password, salt) {
        return new Promise((resolve, reject) => {
            connection.query(
                'update users set password = ?, salt = ?, passwordResetToken = null, passwordResetExpiration = null  where email = ?',
                [password, salt, email],
                (err, rows) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(rows.affectedRows > 0 ? true : false);
                    }
                }
            )
        })
    }
}
module.exports = { authService}
