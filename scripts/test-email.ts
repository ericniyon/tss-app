import 'dotenv/config';
import * as SendGrid from '@sendgrid/mail';

const NotificationEmailTemplate = (msg: string): string => {
    const message = msg;
    const template = `
  <!DOCTYPE html>
  <html>
   <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="shortcut icon" href="https://res.cloudinary.com/cyimana/image/upload/v1646231161/icon_c4bbyp.png">
    <title>Trust seal Mailer</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  </head>
  <body style="margin: 0; padding: 0;">
   <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; max-width: 600px; border-color: #eee;">
    <tr>
     <td bgcolor="#0c5ab6" align="center" style="padding: 32px;">
      <img src="https://res.cloudinary.com/dbbs6psld/image/upload/v1668682711/dbi/white_i44ttx.png" alt="TRUST SEAL LOGO"  height="72px">
     </td>
    </tr>
    <tr >
     <td  style="padding: 72px 64px; background-color: rgba(226, 245, 238, 0.2); border-top: 1px solid #eeeeee;">
      <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
     <tr>
      <td style="text-align: left;">
       <b><span style="color: #000000; font-family: sans-serif; font-size: 32px; ">Notification from the Trust seal system</b>
      </td>
     </tr>
     <tr>
      <td style="color: #666666; font-family: sans-serif; font-size: 16px; padding:32px 0; line-height: 32px;">
        ${message} 
      </td>
     </tr>
    </table>
     </td>
    </tr>
  <td style="padding: 32px 56px; background-color: #F5F9FF">
       <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
        <tr>
         <td>
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
         <tbody><tr>
          <td width="20%" valign="top" style="padding: 8px; font-family: sans-serif; color: #0c5ab6; font-weight: bold; font-size: 14px ">
           Follow us:
          </td>
          <td width="50%" valign="top" style="text-align: right; padding: 8px; font-family: sans-serif; font-size: 12px ">
           <a href="" style="color: #111111">Twitter<a>
          </td>
          <td width="20%" valign="top" style="text-align: right; padding: 8px; font-family: sans-serif; font-size: 12px ">
           <a href="" style="color: #111111">Instagram</a>
          </td>
          <td width="20%" valign="top" style="text-align: right; padding: 8px; font-family: sans-serif; font-size: 12px ">
           <a href="" style="color: #111111">Facebook</a>
          </td>
          <td width="20%" valign="top" style="text-align: right; padding: 8px; font-family: sans-serif; font-size: 12px ">
           <a href="" style="color: #111111">LinkedIn</a>
          </td>
         </tr>
        </tbody>
        </table>
         </td>
        </tr>
       </tbody>
      </table>
      </td>
  
  
   </table>
  </body>
  </html>
    `;
    return template;
};

async function testEmail() {
    try {
        // Get email from command line argument or use default
        const email = process.argv[2] || 'niyoeri6@gmail.com';
        
        console.log('📧 Testing email sending...\n');
        console.log(`Recipient: ${email}`);
        
        // Check for required environment variables
        const sendGridApiKey = process.env.SENDGRID_API_KEY;
        const fromEmail = process.env.SENT_EMAIL_FROM;
        
        if (!sendGridApiKey) {
            console.error('❌ Error: SENDGRID_API_KEY is not set in environment variables');
            console.error('   Please set SENDGRID_API_KEY in your .env file');
            process.exit(1);
        }
        
        if (!fromEmail) {
            console.error('❌ Error: SENT_EMAIL_FROM is not set in environment variables');
            console.error('   Please set SENT_EMAIL_FROM in your .env file');
            process.exit(1);
        }
        
        console.log(`From: ${fromEmail}`);
        console.log(`SendGrid API Key: ${sendGridApiKey.substring(0, 10)}...\n`);
        
        // Initialize SendGrid
        SendGrid.setApiKey(sendGridApiKey);
        
        // Prepare email
        const testEmail = {
            to: email,
            subject: 'Test Email from Trust Seal System',
            from: fromEmail,
            text: 'This is a test email from the Trust Seal System API. If you received this email, the email service is working correctly!',
            html: NotificationEmailTemplate(
                'This is a test email from the Trust Seal System API. If you received this email, the email service is working correctly!',
            ),
        };
        
        console.log('Sending email...');
        
        // Send email
        const result = await SendGrid.send(testEmail);
        
        console.log('\n✅ Email sent successfully!');
        console.log(`Status Code: ${result[0].statusCode}`);
        console.log(`Response: ${JSON.stringify(result[0].body, null, 2)}`);
        console.log(`\n📬 Check the inbox at ${email} for the test email.`);
        
    } catch (error) {
        console.error('\n❌ Error sending email:');
        if (error.response) {
            console.error(`Status Code: ${error.response.statusCode}`);
            console.error(`Body: ${JSON.stringify(error.response.body, null, 2)}`);
        } else {
            console.error(error.message);
            console.error(error);
        }
        process.exit(1);
    }
}

testEmail();


