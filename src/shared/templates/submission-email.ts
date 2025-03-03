export const SubmissionEmailTemplate = (): string => {
    const message = `Dear Applicant,<br/>
    Thank you for completing your self-assessment and application for the DBI Trust Seal. This marks the first step in the Trust Seal certification process, which is conducted in two phases.
    <br/>
    <h2>Phase 1: Certification Review</h2>
    <br/>
    You are now in the first phase of the process. During this phase, a certification specialist will review your self-assessment / Trust seal application and evaluate its compliance with the Trust Seal requirements. The outcomes of this review will be communicated to you within 3 days or less.
    <br/>
    <h2>Phase 2: Verification and Implementation</h2>
    <br/>
    Following the first phase:
    <br/>
    <ul>
      <li>If necessary, a verification check will be conducted by a certification specialist to ensure all requirements are met.</li>
      <li>Based on the evaluation, the certification (Trust seal) will either be awarded or denied.</li>
      <li>If awarded, our technical team will provide assistance in implementing and integrating the Trust Seal to your website.</li>
    </ul>
    Thank you for your commitment to excellence.
    For any clarifications or inquiries, please feel free to contact us via:
    <br/>
    E-mail: info@dbi.rw
    <br/>
    Telephone: +250789597531

    <br/><br/>
    `;
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
       <b><span style="color: #000000; font-family: sans-serif; font-size: 32px; ">DBI Trust Seal Notification</b>
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

export const AdminSubmissionNotificationEmailTemplate = (
    adminUsername: string,
    applicantUsername: string,
    url: string,
): string => {
    const message = `Dear ${adminUsername},<br/>
  An application for a Trust Seal by <b>${applicantUsername}</b> has been submitted. You can now log in and assign it to a DBI Expert for review. <br/>
  Best Regards.
  `;
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
    <img src="logo" alt="TRUST SEAL LOGO"  height="72px">
   </td>
  </tr>
  <tr >
   <td  style="padding: 72px 64px; background-color: rgba(226, 245, 238, 0.2); border-top: 1px solid #eeeeee;">
    <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
   <tr>
    <td style="text-align: left;">
     <b><span style="color: #000000; font-family: sans-serif; font-size: 32px; ">DBI Trust Seal Notification</b>
    </td>
   </tr>
   <tr>
    <td style="color: #666666; font-family: sans-serif; font-size: 16px; padding:32px 0; line-height: 32px;">
      ${message} 
    </td>
   </tr>
   <tr>
      <td style="padding:32px 0;">
       <a href="${url}" style="border-radius: 4px; padding: 16px 64px; font-size: 14px; color: #ffffff; font-weight: bold; background: #0c5ab6; text-decoration: none; font-family: sans-serif; text-transform: capitalize;">Login</a>
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
