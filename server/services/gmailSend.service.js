// services/emailService.js
const nodemailer = require("nodemailer");
const { email, password } = require("../config/demo.js");
const { gmail } = require("../config/mailConfig.js");

class EmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }

    initializeTransporter() {
        this.transporter = nodemailer.createTransport({
            host: gmail.smtp.host,
            port: gmail.smtp.port,
            secure: gmail.smtp.secure,
            auth: {
                user: email,
                pass: password,
            },
        });
    }

    async sendEmail({
        to,
        subject,
        text,
        html,
        attachments = [],
        cc,
        bcc,
        replyTo,
    }) {
        try {
            const mailOptions = {
                from: `<${email}>`, // sender address
                to: to, // list of receivers (comma separated)
                subject: subject, // Subject line
                text: text, // plain text body
                html: html, // html body
                attachments: attachments, // attachments array
                cc: cc,
                bcc: bcc,
                replyTo: replyTo,
            };

            const result = await this.transporter.sendMail(mailOptions);
            return {
                success: true,
                messageId: result.messageId,
                message: "Email sent successfully",
            };
        } catch (error) {
            console.error("Error sending email:", error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async verifyConnection() {
        try {
            await this.transporter.verify();
            return { success: true, message: "SMTP connection verified" };
        } catch (error) {
            console.error("SMTP connection failed:", error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new EmailService();
