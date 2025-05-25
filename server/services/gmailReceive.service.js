const Imap = require("imap");
const { simpleParser } = require("mailparser");
const { imapConfig } = require("../config/mailConfig");

class GmailReceiveService {
    constructor() {
        this.imap = null;
    }

    /**
     * Connect to Gmail IMAP server
     */
    connect() {
        return new Promise((resolve, reject) => {
            const config = {
                ...imapConfig,
                tlsOptions: {
                    rejectUnauthorized: false,
                    servername: "imap.gmail.com",
                },
            };

            this.imap = new Imap(config);

            this.imap.once("ready", () => {
                console.log("IMAP connection ready");
                resolve();
            });

            this.imap.once("error", (err) => {
                console.error("IMAP connection error:", err);
                reject(err);
            });

            this.imap.once("end", () => {
                console.log("IMAP connection ended");
            });

            this.imap.connect();
        });
    }

    /**
     * Disconnect from Gmail IMAP server
     */
    disconnect() {
        if (this.imap) {
            this.imap.end();
        }
    }

    /**
     * Debug mailbox information
     */
    async debugMailboxInfo(mailbox = "INBOX") {
        try {
            await this.connect();

            return new Promise((resolve, reject) => {
                this.imap.openBox(mailbox, true, (err, box) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const info = {
                        name: box.name,
                        flags: box.flags,
                        readOnly: box.readOnly,
                        uidvalidity: box.uidvalidity,
                        uidnext: box.uidnext,
                        messages: {
                            total: box.messages.total,
                            new: box.messages.new,
                            unseen: box.messages.unseen,
                        },
                        permFlags: box.permFlags,
                        keywords: box.keywords,
                        newKeywords: box.newKeywords,
                        persistentUIDs: box.persistentUIDs,
                        nomodseq: box.nomodseq,
                    };

                    console.log("=== MAILBOX DEBUG INFO ===");
                    console.log(JSON.stringify(info, null, 2));
                    console.log("=== END DEBUG INFO ===");

                    this.disconnect();
                    resolve(info);
                });
            });
        } catch (error) {
            console.error("Error getting mailbox info:", error);
            this.disconnect();
            throw error;
        }
    }

    /**
     * Get available mailboxes/folders
     */
    async getMailboxes() {
        try {
            await this.connect();

            return new Promise((resolve, reject) => {
                this.imap.getBoxes((err, boxes) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    console.log("=== AVAILABLE MAILBOXES ===");
                    console.log(JSON.stringify(boxes, null, 2));
                    console.log("=== END MAILBOXES ===");

                    this.disconnect();
                    resolve(boxes);
                });
            });
        } catch (error) {
            console.error("Error getting mailboxes:", error);
            this.disconnect();
            throw error;
        }
    }

    /**
     * Fetch emails with detailed debugging
     * @param {string} mailbox - Mailbox to read from
     * @param {number} limit - Number of emails to fetch
     * @param {boolean} fetchAll - Whether to fetch from all messages or just recent
     * @returns {Promise<Array>} Array of parsed email objects
     */
    async fetchLastEmails(mailbox = "INBOX", limit = 10, fetchAll = false) {
        try {
            await this.connect();

            return new Promise((resolve, reject) => {
                this.imap.openBox(mailbox, true, (err, box) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    console.log(`=== FETCHING FROM ${mailbox} ===`);
                    console.log(`Total messages: ${box.messages.total}`);
                    console.log(`New messages: ${box.messages.new}`);
                    console.log(`Unseen messages: ${box.messages.unseen}`);

                    if (box.messages.total === 0) {
                        console.log("No messages in mailbox");
                        this.disconnect();
                        resolve([]);
                        return;
                    }

                    let range;
                    if (fetchAll) {
                        // Fetch from all messages
                        const start = Math.max(
                            1,
                            box.messages.total - limit + 1
                        );
                        const end = box.messages.total;
                        range = `${start}:${end}`;
                    } else {
                        // Try different approaches
                        // Option 1: Last N messages by sequence number
                        const start = Math.max(
                            1,
                            box.messages.total - limit + 1
                        );
                        const end = box.messages.total;
                        range = `${start}:${end}`;
                    }

                    console.log(`Fetching range: ${range}`);
                    console.log(`Requesting ${limit} emails`);

                    const fetch = this.imap.fetch(range, {
                        bodies: "",
                        markSeen: false,
                        struct: true,
                    });

                    const emails = [];
                    let processedCount = 0;
                    let totalMessages = 0;

                    fetch.on("message", (msg, seqno) => {
                        console.log(`Processing message ${seqno}`);
                        totalMessages++;
                        let emailData = { seqno: seqno };
                        let bodyProcessed = false;
                        let attributesProcessed = false;

                        const checkComplete = () => {
                            if (bodyProcessed && attributesProcessed) {
                                emails.push(emailData);
                                processedCount++;
                                console.log(
                                    `Completed processing message ${seqno} (${processedCount}/${totalMessages})`
                                );

                                if (processedCount === totalMessages) {
                                    // Sort emails by date (newest first)
                                    emails.sort((a, b) => {
                                        const dateA = new Date(a.date || 0);
                                        const dateB = new Date(b.date || 0);
                                        return dateB - dateA;
                                    });

                                    console.log(
                                        `Successfully processed ${emails.length} emails`
                                    );
                                    this.disconnect();
                                    resolve(emails);
                                }
                            }
                        };

                        msg.on("body", (stream, info) => {
                            let buffer = "";

                            stream.on("data", (chunk) => {
                                buffer += chunk.toString("utf8");
                            });

                            stream.once("end", async () => {
                                try {
                                    const parsed = await simpleParser(buffer);

                                    emailData = {
                                        ...emailData,
                                        messageId: parsed.messageId,
                                        from: parsed.from?.value || parsed.from,
                                        to: parsed.to?.value || parsed.to,
                                        cc: parsed.cc?.value || parsed.cc,
                                        bcc: parsed.bcc?.value || parsed.bcc,
                                        subject: parsed.subject,
                                        date: parsed.date,
                                        text: parsed.text,
                                        html: parsed.html,
                                        attachments:
                                            parsed.attachments?.map((att) => ({
                                                filename: att.filename,
                                                contentType: att.contentType,
                                                size: att.size,
                                            })) || [],
                                        headers: parsed.headers,
                                        priority: parsed.priority,
                                        references: parsed.references,
                                        inReplyTo: parsed.inReplyTo,
                                    };

                                    console.log(
                                        `Parsed email ${seqno}: ${
                                            parsed.subject
                                        } from ${
                                            parsed.from?.text || "Unknown"
                                        }`
                                    );
                                } catch (parseErr) {
                                    console.error(
                                        `Error parsing email ${seqno}:`,
                                        parseErr
                                    );
                                    emailData.error = parseErr.message;
                                }

                                bodyProcessed = true;
                                checkComplete();
                            });
                        });

                        msg.once("attributes", (attrs) => {
                            emailData.attributes = {
                                uid: attrs.uid,
                                flags: attrs.flags,
                                date: attrs.date,
                                size: attrs.size,
                            };

                            console.log(
                                `Got attributes for message ${seqno}: UID ${attrs.uid}`
                            );
                            attributesProcessed = true;
                            checkComplete();
                        });
                    });

                    fetch.once("error", (err) => {
                        console.error("Fetch error:", err);
                        reject(err);
                    });

                    fetch.once("end", () => {
                        console.log(
                            `Fetch completed, processing ${totalMessages} messages...`
                        );
                        if (totalMessages === 0) {
                            console.log("No messages were fetched");
                            this.disconnect();
                            resolve([]);
                        }
                    });
                });
            });
        } catch (error) {
            console.error("Error fetching emails:", error);
            this.disconnect();
            throw error;
        }
    }

    /**
     * Fetch emails by UID instead of sequence number
     */
    async fetchEmailsByUID(mailbox = "INBOX", limit = 10) {
        try {
            await this.connect();

            return new Promise((resolve, reject) => {
                this.imap.openBox(mailbox, true, (err, box) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    console.log(`=== FETCHING BY UID FROM ${mailbox} ===`);
                    console.log(`UID next: ${box.uidnext}`);
                    console.log(`UID validity: ${box.uidvalidity}`);

                    // Search for all messages first to get UIDs
                    this.imap.search(["ALL"], (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        if (!results || results.length === 0) {
                            console.log("No messages found");
                            this.disconnect();
                            resolve([]);
                            return;
                        }

                        console.log(`Found ${results.length} messages`);

                        // Get the last 'limit' sequence numbers
                        const seqNumbers = results.slice(-limit);
                        console.log(
                            `Fetching sequence numbers: ${seqNumbers.join(
                                ", "
                            )}`
                        );

                        const fetch = this.imap.fetch(seqNumbers, {
                            bodies: "",
                            markSeen: false,
                            struct: true,
                        });

                        const emails = [];
                        let processedCount = 0;
                        let totalMessages = 0;

                        fetch.on("message", (msg, seqno) => {
                            totalMessages++;
                            let emailData = { seqno: seqno };
                            let bodyProcessed = false;
                            let attributesProcessed = false;

                            const checkComplete = () => {
                                if (bodyProcessed && attributesProcessed) {
                                    emails.push(emailData);
                                    processedCount++;

                                    if (processedCount === totalMessages) {
                                        emails.sort(
                                            (a, b) =>
                                                new Date(b.date) -
                                                new Date(a.date)
                                        );
                                        console.log(
                                            `Successfully processed ${emails.length} emails`
                                        );
                                        this.disconnect();
                                        resolve(emails);
                                    }
                                }
                            };

                            msg.on("body", (stream, info) => {
                                let buffer = "";
                                stream.on("data", (chunk) => {
                                    buffer += chunk.toString("utf8");
                                });

                                stream.once("end", async () => {
                                    try {
                                        const parsed = await simpleParser(
                                            buffer
                                        );
                                        emailData = {
                                            ...emailData,
                                            messageId: parsed.messageId,
                                            from:
                                                parsed.from?.value ||
                                                parsed.from,
                                            to: parsed.to?.value || parsed.to,
                                            subject: parsed.subject,
                                            date: parsed.date,
                                            text: parsed.text,
                                            html: parsed.html,
                                            attachments:
                                                parsed.attachments?.map(
                                                    (att) => ({
                                                        filename: att.filename,
                                                        contentType:
                                                            att.contentType,
                                                        size: att.size,
                                                    })
                                                ) || [],
                                        };
                                    } catch (parseErr) {
                                        console.error(
                                            "Error parsing email:",
                                            parseErr
                                        );
                                        emailData.error = parseErr.message;
                                    }

                                    bodyProcessed = true;
                                    checkComplete();
                                });
                            });

                            msg.once("attributes", (attrs) => {
                                emailData.attributes = {
                                    uid: attrs.uid,
                                    flags: attrs.flags,
                                    date: attrs.date,
                                    size: attrs.size,
                                };

                                attributesProcessed = true;
                                checkComplete();
                            });
                        });

                        fetch.once("error", (err) => {
                            console.error("Fetch error:", err);
                            reject(err);
                        });

                        fetch.once("end", () => {
                            console.log(
                                `Fetch completed for ${totalMessages} messages`
                            );
                        });
                    });
                });
            });
        } catch (error) {
            console.error("Error fetching emails by UID:", error);
            this.disconnect();
            throw error;
        }
    }

    // Keep other methods as they were...
    async searchEmails(criteria = ["ALL"], limit = 120) {
        // Previous implementation remains the same
        return this.fetchEmailsByUID("INBOX", limit);
    }

    async getUnreadEmails(limit = 120) {
        return this.searchEmails(["UNSEEN"], limit);
    }

    async getEmailsFromSender(fromEmail, limit = 120) {
        return this.searchEmails([["FROM", fromEmail]], limit);
    }

    async getEmailsBySubject(subject, limit = 120) {
        return this.searchEmails([["SUBJECT", subject]], limit);
    }

    async getEmailsByDateRange(since, before = null, limit = 120) {
        const sinceStr = since.toISOString().split("T")[0];
        let criteria;

        if (before) {
            const beforeStr = before.toISOString().split("T")[0];
            criteria = [
                ["SINCE", sinceStr],
                ["BEFORE", beforeStr],
            ];
        } else {
            criteria = [["SINCE", sinceStr]];
        }

        return this.searchEmails(criteria, limit);
    }

    async getEmailsByText(text, limit = 120) {
        return this.searchEmails([["TEXT", text]], limit);
    }

    async getEmailsToRecipient(toEmail, limit = 120) {
        return this.searchEmails([["TO", toEmail]], limit);
    }
}

const gmailReceiveService = new GmailReceiveService();

module.exports = {
    GmailReceiveService,
    gmailReceiveService,

    async getLastEmails(limit = 120) {
        return gmailReceiveService.fetchLastEmails("INBOX", limit);
    },

    async getLastEmailsByUID(limit = 120) {
        return gmailReceiveService.fetchEmailsByUID("INBOX", limit);
    },

    async debugMailbox() {
        return gmailReceiveService.debugMailboxInfo();
    },

    async getMailboxes() {
        return gmailReceiveService.getMailboxes();
    },

    async getUnreadEmails(limit = 120) {
        return gmailReceiveService.getUnreadEmails(limit);
    },

    async searchEmails(criteria, limit = 120) {
        return gmailReceiveService.searchEmails(criteria, limit);
    },

    async getEmailsFromSender(fromEmail, limit = 120) {
        return gmailReceiveService.getEmailsFromSender(fromEmail, limit);
    },

    async getEmailsBySubject(subject, limit = 120) {
        return gmailReceiveService.getEmailsBySubject(subject, limit);
    },
};
