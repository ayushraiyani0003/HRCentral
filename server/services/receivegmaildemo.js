/* 
GMAIL DEBUG DEMO - Comprehensive Debugging
*/
const {
    getLastEmails,
    getLastEmailsByUID,
    debugMailbox,
    getMailboxes,
    gmailReceiveService,
    getEmailsByDateRange,
} = require("./gmailReceive.service");

async function debugMailboxInfo() {
    console.log("=== DEBUGGING MAILBOX INFORMATION ===");
    try {
        const info = await debugMailbox();

        console.log("\n📊 Key Information:");
        console.log(`- Total messages: ${info.messages.total}`);
        console.log(`- New messages: ${info.messages.new}`);
        console.log(`- Unseen messages: ${info.messages.unseen}`);
        console.log(`- UID next: ${info.uidnext}`);
        console.log(`- Read only: ${info.readOnly}`);

        return info;
    } catch (error) {
        console.error("Error debugging mailbox:", error);
    }
}

async function listAllMailboxes() {
    console.log("\n=== LISTING ALL MAILBOXES ===");
    try {
        const boxes = await getMailboxes();

        function printBoxes(boxes, indent = "") {
            for (const [name, box] of Object.entries(boxes)) {
                console.log(`${indent}📁 ${name}`);
                if (box.children) {
                    printBoxes(box.children, indent + "  ");
                }
            }
        }

        printBoxes(boxes);
    } catch (error) {
        console.error("Error listing mailboxes:", error);
    }
}

async function testDifferentFetchMethods(limit = 10) {
    console.log(`\n=== TESTING DIFFERENT FETCH METHODS (${limit} emails) ===`);

    try {
        console.log("\n1️⃣ Method 1: Standard fetch");
        const emails1 = await getLastEmails(limit);
        console.log(`✅ Standard fetch: ${emails1.length} emails`);
        if (emails1.length > 0) {
            console.log(
                `   Latest: ${emails1[0].subject} (${emails1[0].date})`
            );
            console.log(
                `   Oldest: ${emails1[emails1.length - 1].subject} (${
                    emails1[emails1.length - 1].date
                })`
            );
        }

        console.log("\n2️⃣ Method 2: UID-based fetch");
        const emails2 = await getLastEmailsByUID(limit);
        console.log(`✅ UID-based fetch: ${emails2.length} emails`);
        if (emails2.length > 0) {
            console.log(
                `   Latest: ${emails2[0].subject} (${emails2[0].date})`
            );
            console.log(
                `   Oldest: ${emails2[emails2.length - 1].subject} (${
                    emails2[emails2.length - 1].date
                })`
            );
        }

        console.log("\n3️⃣ Method 3: Fetch from different mailboxes");
        await testSpecificMailboxes(limit);
    } catch (error) {
        console.error("Error testing fetch methods:", error);
    }
}

async function testSpecificMailboxes(limit = 5) {
    const mailboxesToTest = ["INBOX", "[Gmail]/All Mail", "[Gmail]/Sent Mail"];

    for (const mailbox of mailboxesToTest) {
        try {
            console.log(`\n📮 Testing mailbox: ${mailbox}`);
            const emails = await gmailReceiveService.fetchLastEmails(
                mailbox,
                limit
            );
            console.log(`   Found ${emails.length} emails in ${mailbox}`);

            if (emails.length > 0) {
                console.log(
                    `   Latest: ${emails[0].subject || "No Subject"} (${
                        emails[0].date
                    })`
                );
            }
        } catch (error) {
            console.log(`   ❌ Error accessing ${mailbox}: ${error.message}`);
        }
    }
}

async function searchRecentEmails() {
    console.log("\n=== SEARCHING FOR RECENT EMAILS ===");

    try {
        // Get emails from last 7 days
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        console.log(`🔍 Searching for emails since ${lastWeek.toDateString()}`);
        const recentEmails = await gmailReceiveService.getEmailsByDateRange(
            lastWeek,
            null,
            50
        );
        console.log(`Found ${recentEmails.length} emails from last 7 days`);

        if (recentEmails.length > 0) {
            console.log("\n📧 Recent emails:");
            recentEmails.slice(0, 10).forEach((email, index) => {
                console.log(
                    `   ${index + 1}. ${email.subject || "No Subject"} - ${
                        email.date
                    }`
                );
                console.log(
                    `      From: ${
                        email.from?.text ||
                        email.from?.[0]?.address ||
                        "Unknown"
                    }`
                );
            });
        }

        // Search for all emails (no date filter)
        console.log("\n🔍 Searching ALL emails with no filters");
        const allEmails = await gmailReceiveService.searchEmails(["ALL"], 20);
        console.log(`Found ${allEmails.length} emails (showing last 20)`);

        if (allEmails.length > 0) {
            console.log("\n📧 All emails (last 20):");
            allEmails.forEach((email, index) => {
                console.log(
                    `   ${index + 1}. ${email.subject || "No Subject"} - ${
                        email.date
                    }`
                );
            });
        }
    } catch (error) {
        console.error("Error searching emails:", error);
    }
}

async function checkSpecificIssues() {
    console.log("\n=== CHECKING FOR SPECIFIC ISSUES ===");

    try {
        // Check if there are any unread emails
        console.log("🔍 Checking unread emails...");
        const unreadEmails = await gmailReceiveService.getUnreadEmails(10);
        console.log(`Found ${unreadEmails.length} unread emails`);

        // Check emails from a specific recent timeframe
        console.log("\n🔍 Checking emails from last 24 hours...");
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const recentEmails = await gmailReceiveService.getEmailsByDateRange(
            yesterday,
            null,
            50
        );
        console.log(`Found ${recentEmails.length} emails from last 24 hours`);

        if (recentEmails.length > 0) {
            console.log("Recent emails:");
            recentEmails.slice(0, 5).forEach((email, index) => {
                console.log(
                    `   ${index + 1}. ${email.subject || "No Subject"}`
                );
                console.log(`      Date: ${email.date}`);
                console.log(
                    `      From: ${
                        email.from?.text ||
                        email.from?.[0]?.address ||
                        "Unknown"
                    }`
                );
            });
        }
    } catch (error) {
        console.error("Error checking specific issues:", error);
    }
}

async function runComprehensiveDebug() {
    console.log("🔧 GMAIL COMPREHENSIVE DEBUG STARTED\n");
    console.log(
        "This will help identify why you're only getting 1 email instead of more recent ones.\n"
    );

    try {
        // Step 1: Check mailbox info
        await debugMailboxInfo();

        // Step 2: List available mailboxes
        await listAllMailboxes();

        // Step 3: Test different fetch methods
        await testDifferentFetchMethods(10);

        // Step 4: Search for recent emails
        await searchRecentEmails();

        // Step 5: Check for specific issues
        await checkSpecificIssues();

        console.log("\n✅ COMPREHENSIVE DEBUG COMPLETED");
        console.log("\n💡 ANALYSIS:");
        console.log(
            "1. Check if the total message count matches what you see in Gmail"
        );
        console.log(
            "2. Look at the dates of emails being fetched vs what you expect"
        );
        console.log(
            "3. Check if emails are in different folders (like [Gmail]/All Mail)"
        );
        console.log(
            "4. Verify if recent emails are actually in INBOX or other folders"
        );
    } catch (error) {
        console.error("❌ Comprehensive debug failed:", error);
    }
}

// Quick test function for immediate issues
async function quickTest(limit = 5) {
    console.log(`🚀 QUICK TEST - Fetching ${limit} emails`);

    try {
        const emails = await getLastEmails(limit);
        console.log(`Found ${emails.length} emails:`);

        emails.forEach((email, index) => {
            console.log(`${index + 1}. ${email.subject || "No Subject"}`);
            console.log(`   Date: ${email.date}`);
            console.log(
                `   From: ${
                    email.from?.text || email.from?.[0]?.address || "Unknown"
                }`
            );
            console.log(`   UID: ${email.attributes?.uid}`);
            console.log("---");
        });
    } catch (error) {
        console.error("Quick test failed:", error);
    }
}

// use getEmailsByDateRange
// async getEmailsByDateRange(since, before = null, limit = 120) {
//     return gmailReceiveService.getEmailsByDateRange(since, before, limit);
// },

async function dateRangeEmails(since, before = null, limit = 10) {
    console.log(`🚀 QUICK TEST - Fetching ${limit} emails`);

    try {
        const emails = await getEmailsByDateRange(since, before, limit);
        console.log(`Found ${emails.length} emails:`);

        emails.forEach((email, index) => {
            // console.log(`${index + 1}. ${email.subject || "No Subject"}`);
            // console.log(`   Date: ${email.date}`);
            // console.log(
            //     `   From: ${
            //         email.from?.text || email.from?.[0]?.address || "Unknown"
            //     }`
            // );
            // console.log(`   UID: ${email.attributes?.uid}`);
            // console.log("---");
            console.log(email);
        });
    } catch (error) {
        console.error("Quick test failed:", error);
    }
}

// Export functions
module.exports = {
    debugMailboxInfo,
    listAllMailboxes,
    testDifferentFetchMethods,
    searchRecentEmails,
    checkSpecificIssues,
    runComprehensiveDebug,
    quickTest,
};

// Run comprehensive debug if this file is executed directly
if (require.main === module) {
    // You can uncomment one of these based on what you want to test:

    // Quick test (recommended first)
    // quickTest((limit = 1));
    dateRangeEmails(new Date(2025, 4, 25), new Date(2025, 5, 25), 1);

    // Full comprehensive debug (if quick test shows issues)
    // runComprehensiveDebug();
}
