// config/mailConfig.js
const { email, password } = require("./demo.js");

const config = {
    gmail: {
        label: "Gmail",
        smtp: {
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // TLS
        },
        imap: {
            host: "imap.gmail.com",
            port: 993,
            tls: true,
        },
    },

    outlook: {
        label: "Outlook",
        smtp: {
            host: "smtp.office365.com",
            port: 587,
            secure: false, // STARTTLS
        },
        imap: {
            host: "outlook.office365.com",
            port: 993,
            tls: true,
        },
    },

    zoho: {
        label: "Zoho",
        smtp: {
            host: "smtp.zoho.com",
            port: 465,
            secure: true, // SSL
        },
        imap: {
            host: "imap.zoho.com",
            port: 993,
            tls: true,
        },
    },

    yahoo: {
        label: "Yahoo",
        smtp: {
            host: "smtp.mail.yahoo.com",
            port: 465,
            secure: true, // SSL
        },
        imap: {
            host: "imap.mail.yahoo.com",
            port: 993,
            tls: true,
        },
    },

    custom: {
        label: "Custom Email",
        smtp: {
            host: "mail.company.com", // <-- CHANGE THIS
            port: 587, // or 465 depending on SSL/TLS
            secure: false, // false for TLS (587), true for SSL (465)
        },
        imap: {
            host: "mail.company.com", // <-- CHANGE THIS
            port: 993,
            tls: true,
        },
    },

    // Optional default sender (for nodemailer)
    defaultFrom: '"Your Name" <your@domain.com>',
};

const selected = config.gmail; // or gmail, outlook, yahoo, custom

const smtpTransport = {
    ...selected.smtp,
    auth: { user: email, pass: password },
};

const imapConfig = {
    ...selected.imap,
    user: email,
    password: password,
};

module.exports = {
    config,
    selected,
    smtpTransport,
    imapConfig,
    gmail: config.gmail,
    outlook: config.outlook,
    zoho: config.zoho,
    yahoo: config.yahoo,
    custom: config.custom,
};
