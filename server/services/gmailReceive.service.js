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
     * Fetch latest emails - FIXED VERSION
     * @param {string} mailbox - Mailbox to read from
     * @param {number} limit - Number of emails to fetch
     * @returns {Promise<Array>} Array of parsed email objects sorted by date (newest first)
     */
    async fetchLastEmails(mailbox = "INBOX", limit = 10) {
        try {
            await this.connect();

            return new Promise((resolve, reject) => {
                this.imap.openBox(mailbox, true, (err, box) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    console.log(
                        `=== FETCHING LATEST ${limit} EMAILS FROM ${mailbox} ===`
                    );
                    console.log(`Total messages: ${box.messages.total}`);
                    console.log(`New messages: ${box.messages.new}`);
                    console.log(`Unseen messages: ${box.messages.unseen}`);

                    if (box.messages.total === 0) {
                        console.log("No messages in mailbox");
                        this.disconnect();
                        resolve([]);
                        return;
                    }

                    // Calculate the correct range for the LATEST emails
                    const totalMessages = box.messages.total;
                    const start = Math.max(1, totalMessages - limit + 1);
                    const end = totalMessages;
                    const range = `${start}:${end}`;

                    console.log(
                        `Fetching sequence range: ${range} (last ${limit} messages)`
                    );
                    console.log(
                        `This should get messages ${start} to ${end} out of ${totalMessages} total`
                    );

                    const fetch = this.imap.fetch(range, {
                        bodies: "",
                        markSeen: false,
                        struct: true,
                    });

                    const emails = [];
                    let processedCount = 0;
                    let totalFetched = 0;

                    fetch.on("message", (msg, seqno) => {
                        console.log(`Processing message sequence #${seqno}`);
                        totalFetched++;

                        let emailData = {
                            seqno: seqno,
                            messageNumber: totalFetched, // For debugging
                        };
                        let bodyProcessed = false;
                        let attributesProcessed = false;

                        const checkComplete = () => {
                            if (bodyProcessed && attributesProcessed) {
                                emails.push(emailData);
                                processedCount++;

                                console.log(
                                    `✅ Completed message ${seqno} (${processedCount}/${totalFetched})`
                                );
                                console.log(
                                    `   Subject: ${
                                        emailData.subject || "No Subject"
                                    }`
                                );
                                console.log(`   Date: ${emailData.date}`);
                                console.log(
                                    `   UID: ${emailData.attributes?.uid}`
                                );

                                if (processedCount === totalFetched) {
                                    // Sort by date - NEWEST FIRST
                                    emails.sort((a, b) => {
                                        const dateA = new Date(a.date || 0);
                                        const dateB = new Date(b.date || 0);
                                        return dateB - dateA; // Newest first
                                    });

                                    console.log(
                                        `\n🎉 Successfully processed ${emails.length} emails`
                                    );
                                    console.log(
                                        "📧 Email order (newest first):"
                                    );
                                    emails.forEach((email, index) => {
                                        console.log(
                                            `   ${index + 1}. ${
                                                email.subject
                                            } (${email.date})`
                                        );
                                    });

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
                                } catch (parseErr) {
                                    console.error(
                                        `❌ Error parsing email ${seqno}:`,
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
                        console.error("❌ Fetch error:", err);
                        reject(err);
                    });

                    fetch.once("end", () => {
                        console.log(
                            `📬 Fetch completed, found ${totalFetched} messages to process...`
                        );
                        if (totalFetched === 0) {
                            console.log(
                                "⚠️ No messages were fetched from the specified range"
                            );
                            this.disconnect();
                            resolve([]);
                        }
                    });
                });
            });
        } catch (error) {
            console.error("❌ Error fetching emails:", error);
            this.disconnect();
            throw error;
        }
    }

    /**
     * Get emails using search for better recent email fetching
     */
    async getRecentEmails(limit = 10, daysBack = 30) {
        try {
            await this.connect();

            return new Promise((resolve, reject) => {
                this.imap.openBox("INBOX", true, (err, box) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    // Search for emails from the last X days
                    const sinceDate = new Date();
                    sinceDate.setDate(sinceDate.getDate() - daysBack);
                    const sinceDateStr = sinceDate.toISOString().split("T")[0]; // YYYY-MM-DD format

                    console.log(
                        `🔍 Searching for emails since ${sinceDateStr}`
                    );

                    this.imap.search(
                        ["SINCE", sinceDateStr],
                        (err, results) => {
                            if (err) {
                                console.error("Search error:", err);
                                // If search fails, fall back to fetching last emails
                                console.log(
                                    "Falling back to sequence-based fetch..."
                                );
                                this.disconnect();
                                this.fetchLastEmails("INBOX", limit)
                                    .then(resolve)
                                    .catch(reject);
                                return;
                            }

                            if (!results || results.length === 0) {
                                console.log(
                                    `No emails found since ${sinceDateStr}, trying all emails...`
                                );
                                // If no recent emails, get the last few emails regardless of date
                                this.disconnect();
                                this.fetchLastEmails("INBOX", limit)
                                    .then(resolve)
                                    .catch(reject);
                                return;
                            }

                            console.log(
                                `Found ${results.length} emails since ${sinceDateStr}`
                            );

                            // Get the most recent emails from the search results
                            const recentSeqNums = results.slice(-limit);
                            console.log(
                                `Fetching ${
                                    recentSeqNums.length
                                } most recent emails: ${recentSeqNums.join(
                                    ", "
                                )}`
                            );

                            const fetch = this.imap.fetch(recentSeqNums, {
                                bodies: "",
                                markSeen: false,
                                struct: true,
                            });

                            const emails = [];
                            let processedCount = 0;
                            let totalMessages = recentSeqNums.length;

                            fetch.on("message", (msg, seqno) => {
                                let emailData = { seqno: seqno };
                                let bodyProcessed = false;
                                let attributesProcessed = false;

                                const checkComplete = () => {
                                    if (bodyProcessed && attributesProcessed) {
                                        emails.push(emailData);
                                        processedCount++;

                                        if (processedCount === totalMessages) {
                                            // Sort by date - NEWEST FIRST
                                            emails.sort(
                                                (a, b) =>
                                                    new Date(b.date) -
                                                    new Date(a.date)
                                            );

                                            console.log(
                                                `✅ Successfully processed ${emails.length} recent emails`
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
                                                to:
                                                    parsed.to?.value ||
                                                    parsed.to,
                                                cc:
                                                    parsed.cc?.value ||
                                                    parsed.cc,
                                                bcc:
                                                    parsed.bcc?.value ||
                                                    parsed.bcc,
                                                subject: parsed.subject,
                                                date: parsed.date,
                                                text: parsed.text,
                                                html: parsed.html,
                                                attachments:
                                                    parsed.attachments?.map(
                                                        (att) => ({
                                                            filename:
                                                                att.filename,
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
                                    `Fetch completed for ${totalMessages} recent messages`
                                );
                            });
                        }
                    );
                });
            });
        } catch (error) {
            console.error("Error getting recent emails:", error);
            this.disconnect();
            throw error;
        }
    }

    /**
     * Fetch emails by UID - IMPROVED VERSION
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
                    console.log(`Total messages: ${box.messages.total}`);

                    // Search for all UIDs
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

                        console.log(
                            `Found ${results.length} message sequence numbers`
                        );

                        // Get the last 'limit' sequence numbers (these are the most recent)
                        const recentSeqNumbers = results.slice(-limit);
                        console.log(
                            `Fetching most recent sequence numbers: ${recentSeqNumbers.join(
                                ", "
                            )}`
                        );

                        const fetch = this.imap.fetch(recentSeqNumbers, {
                            bodies: "",
                            markSeen: false,
                            struct: true,
                        });

                        const emails = [];
                        let processedCount = 0;
                        let totalMessages = recentSeqNumbers.length;

                        fetch.on("message", (msg, seqno) => {
                            let emailData = { seqno: seqno };
                            let bodyProcessed = false;
                            let attributesProcessed = false;

                            const checkComplete = () => {
                                if (bodyProcessed && attributesProcessed) {
                                    emails.push(emailData);
                                    processedCount++;

                                    if (processedCount === totalMessages) {
                                        // Sort by date - NEWEST FIRST
                                        emails.sort(
                                            (a, b) =>
                                                new Date(b.date) -
                                                new Date(a.date)
                                        );

                                        console.log(
                                            `✅ Successfully processed ${emails.length} emails by UID`
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
                                            cc: parsed.cc?.value || parsed.cc,
                                            bcc:
                                                parsed.bcc?.value || parsed.bcc,
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
        return this.getRecentEmails(limit, 30);
    }

    async getUnreadEmails(limit = 120) {
        try {
            await this.connect();

            return new Promise((resolve, reject) => {
                this.imap.openBox("INBOX", true, (err, box) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    this.imap.search(["UNSEEN"], (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        if (!results || results.length === 0) {
                            console.log("No unread emails found");
                            this.disconnect();
                            resolve([]);
                            return;
                        }

                        const recentUnread = results.slice(-limit);
                        const fetch = this.imap.fetch(recentUnread, {
                            bodies: "",
                            markSeen: false,
                            struct: true,
                        });

                        const emails = [];
                        let processedCount = 0;

                        fetch.on("message", (msg, seqno) => {
                            let emailData = { seqno: seqno };
                            let bodyProcessed = false;
                            let attributesProcessed = false;

                            const checkComplete = () => {
                                if (bodyProcessed && attributesProcessed) {
                                    emails.push(emailData);
                                    processedCount++;

                                    if (
                                        processedCount === recentUnread.length
                                    ) {
                                        emails.sort(
                                            (a, b) =>
                                                new Date(b.date) -
                                                new Date(a.date)
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
                                            cc: parsed.cc?.value || parsed.cc,
                                            bcc:
                                                parsed.bcc?.value || parsed.bcc,
                                            subject: parsed.subject,
                                            date: parsed.date,
                                            text: parsed.text,
                                            html: parsed.html,
                                        };
                                    } catch (parseErr) {
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
                            reject(err);
                        });

                        fetch.once("end", () => {
                            console.log(
                                `Processed ${recentUnread.length} unread messages`
                            );
                        });
                    });
                });
            });
        } catch (error) {
            console.error("Error getting unread emails:", error);
            this.disconnect();
            throw error;
        }
    }

    async getEmailsFromSender(fromEmail, limit = 120) {
        return this.searchEmailsWithCriteria([["FROM", fromEmail]], limit);
    }

    async getEmailsBySubject(subject, limit = 120) {
        return this.searchEmailsWithCriteria([["SUBJECT", subject]], limit);
    }

    /**
     * Retrieves emails within a specific date range using IMAP-style criteria.
     *
     * @async
     * @function
     * @param {Date} since - The start date (inclusive) to search for emails.
     * @param {Date|null} [before=null] - The end date (exclusive) to search for emails. If null, no upper bound is applied.
     * @param {number} [limit=120] - The maximum number of emails to retrieve.
     * @returns {Promise<Array>} A promise that resolves to an array of emails matching the date range and criteria.
     *
     * @example
     * const emails = await getEmailsByDateRange(new Date('2025-05-01'), new Date('2025-05-10'), 50);
     */
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

        return this.searchEmailsWithCriteria(criteria, limit);
    }

    async getEmailsByText(text, limit = 120) {
        return this.searchEmailsWithCriteria([["TEXT", text]], limit);
    }

    async getEmailsToRecipient(toEmail, limit = 120) {
        return this.searchEmailsWithCriteria([["TO", toEmail]], limit);
    }

    async searchEmailsWithCriteria(criteria, limit = 120) {
        try {
            await this.connect();

            return new Promise((resolve, reject) => {
                this.imap.openBox("INBOX", true, (err, box) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    this.imap.search(criteria, (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        if (!results || results.length === 0) {
                            this.disconnect();
                            resolve([]);
                            return;
                        }

                        const recentResults = results.slice(-limit);
                        const fetch = this.imap.fetch(recentResults, {
                            bodies: "",
                            markSeen: false,
                            struct: true,
                        });

                        const emails = [];
                        let processedCount = 0;

                        fetch.on("message", (msg, seqno) => {
                            let emailData = { seqno: seqno };
                            let bodyProcessed = false;
                            let attributesProcessed = false;

                            const checkComplete = () => {
                                if (bodyProcessed && attributesProcessed) {
                                    emails.push(emailData);
                                    processedCount++;

                                    if (
                                        processedCount === recentResults.length
                                    ) {
                                        emails.sort(
                                            (a, b) =>
                                                new Date(b.date) -
                                                new Date(a.date)
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
                                            cc: parsed.cc?.value ||
                                                parsed.cc || [{}],
                                            bcc: parsed.bcc?.value ||
                                                parsed.bcc || [{}],
                                            subject: parsed.subject,
                                            date: parsed.date,
                                            text: parsed.text,
                                            html: parsed.html,
                                        };
                                    } catch (parseErr) {
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
                            reject(err);
                        });

                        fetch.once("end", () => {
                            console.log(
                                `Processed ${recentResults.length} search results`
                            );
                        });
                    });
                });
            });
        } catch (error) {
            console.error("Error searching emails:", error);
            this.disconnect();
            throw error;
        }
    }
}

const gmailReceiveService = new GmailReceiveService();

module.exports = {
    GmailReceiveService,
    gmailReceiveService,

    // Use the new getRecentEmails method as default
    async getLastEmails(limit = 120) {
        return gmailReceiveService.getRecentEmails(limit, 30);
    },

    // Keep the old method available but fixed
    async getLastEmailsBySequence(limit = 120) {
        return gmailReceiveService.fetchLastEmails("INBOX", limit);
    },

    async getLastEmailsByUID(limit = 120) {
        return gmailReceiveService.fetchEmailsByUID("INBOX", limit);
    },

    async getRecentEmails(limit = 120, daysBack = 7) {
        return gmailReceiveService.getRecentEmails(limit, daysBack);
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

    async getEmailsByDateRange(since, before = null, limit = 120) {
        return gmailReceiveService.getEmailsByDateRange(since, before, limit);
    },
};
