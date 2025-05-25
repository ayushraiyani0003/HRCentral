// services/demoEmailService.js
const emailService = require("./gmailSend.service");

class DemoEmailService {
    async sendDemoEmail() {
        try {
            // First verify the connection
            const connectionResult = await emailService.verifyConnection();
            if (!connectionResult.success) {
                console.error(
                    "SMTP connection failed:",
                    connectionResult.error
                );
                return connectionResult;
            }

            // Send demo email
            const result = await emailService.sendEmail({
                to: "apraiyani97@gmail.com",
                subject: "Demo Email - Test Message",
                cc: "",
                bcc: "illustratorbringyourownlaptop@gmail.com, ayushraiyani70@gmail.com",
                text: `Hello!

This is a demo email BCC from your Node.js application.
The email service is working correctly!

Best regards,
Your Email Service`,

                html: `
  <p>check only bcc from the email service</p>

`,
            });

            if (result.success) {
                console.log("Demo email sent successfully!");
                console.log("Message ID:", result.messageId);
            } else {
                console.error("Failed to send demo email:", result.error);
            }

            return result;
        } catch (error) {
            console.error("Error in sendDemoEmail:", error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
}

// Export instance and also provide a quick send function
const demoEmailService = new DemoEmailService();

// Quick function to send demo email
const sendDemo = () => {
    return demoEmailService.sendDemoEmail();
};

module.exports = {
    demoEmailService,
    sendDemo,
};

// Uncomment the line below if you want to send the demo email immediately when this file is run
sendDemo();
