export const AssignmentEmailTemplate = (
    assigneeName: string,
    webUrl: string,
): string => {
    const message = `
    Hello ${assigneeName},<br/>

    a new application has been assigned to you for Certification.<br/>
    
    Please go to the dashboard to view the application and start the certification process.
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
       <b><span style="color: #000000; font-family: sans-serif; font-size: 32px; ">New Client Notification</b>
      </td>
     </tr>
     <tr>
      <td style="color: #666666; font-family: sans-serif; font-size: 16px; padding:32px 0; line-height: 32px;">
        ${message} 
      </td>
     </tr>
     <tr>
      <td style="padding:32px 0;">
       <a href="${webUrl}" style="border-radius: 4px; padding: 16px 64px; font-size: 14px; color: #ffffff; font-weight: bold; background: #00A082; text-decoration: none; font-family: sans-serif; text-transform: capitalize;">Login</a>
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
