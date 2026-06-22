import 'dotenv/config';
import { MailtrapClient } from 'mailtrap';
import { NotificationEmailTemplate } from '../src/shared/templates/notification-email';

async function testEmail() {
    const email = process.argv[2];
    const token = process.env.MAILTRAP_API_TOKEN;
    const fromEmail = process.env.SENT_EMAIL_FROM;
    const testInboxId = process.env.MAILTRAP_TEST_INBOX_ID
        ? parseInt(process.env.MAILTRAP_TEST_INBOX_ID)
        : undefined;

    if (!token) {
        console.error('MAILTRAP_API_TOKEN is not set in .env');
        process.exit(1);
    }
    if (!fromEmail) {
        console.error('SENT_EMAIL_FROM is not set in .env');
        process.exit(1);
    }

    console.log(`Sending test email to: ${email}`);
    console.log(`From: ${fromEmail}`);
    console.log(`Test inbox ID: ${testInboxId ?? 'none (sending for real)'}\n`);

    const client = new MailtrapClient({ token, testInboxId });

    const result = await client.send({
        to: [{ email }],
        from: { email: fromEmail },
        subject: 'Test Email from Trust Seal System',
        text: 'This is a test email from the Trust Seal System API.',
        html: NotificationEmailTemplate(
            'This is a test email from the Trust Seal System API. If you received this email, the email service is working correctly!',
        ),
    });

    console.log('Email sent successfully!');
    console.log(result);
}

testEmail().catch((err) => {
    console.error('Error sending email:', err?.response?.data ?? err.message ?? err);
    process.exit(1);
});
