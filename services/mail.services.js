const nodemailer = require('nodemailer');
const mailService = {
    async sendMail({ emailFrom, emailTo, emailSubject, emailText }) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
        await transporter.sendMail({
            from: emailFrom,
            to: emailTo,
            subject: emailSubject,
            text: emailText
        })
    }
};
Object.freeze(mailService);
const poolMailService = {
    establishMail() {
        const transport = nodemailer.createTransport({
            pool: true,
            host: process.env.SMTP_PORT,
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
            poolConfig: {
                maxConnections: 3,
                maxMessages: 10,
                rateDelta: 1000,
                rateLimit: 5
            }
        }
        )
        const emailOptions = [{
            emailFrom: process.env.SERVER_MAIL,
            emailTo: "kiet123@gmail.com",
            emailSubject: "Mail",
            emailText: "123"
        },
        {
            emailFrom: process.env.SERVER_MAIL,
            emailTo: "kiet1234@gmail.com",
            emailSubject: "Mail",
            emailText: "123"
        },
        {
            emailFrom: process.env.SERVER_MAIL,
            emailTo: "kiet12345@gmail.com",
            emailSubject: "Mail",
            emailText: "123"
        }
        ]
        emailOptions.forEach((item) => {
            
        })
    }
}

module.exports = mailService;