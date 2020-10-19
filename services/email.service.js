const nodemailer = require('nodemailer');

class EmailService {
    /**
     *
     * @param {string} content
     * @param {string} rawContent
     * @param {string} subject
     * @param {string} recipient
     */
    async sendMail(rawContent, htmlContent, subject, recipient) {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER,
            port: 587, // secure SMTP
            requireTLS: true,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });

        await transporter.sendMail({
            from: `"Call-Statistics" <${process.env.EMAIL_SENDADDRESS}>`,
            to: recipient,
            subject,
            text: rawContent,
            html: `<div>${rawContent}</div>`
        });
    }
}

module.exports = new EmailService();