"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationStatusUpdateEmailTemplate = void 0;
const enums_1 = require("../../application/enums");
const ApplicationStatusUpdateEmailTemplate = (applicant, status, category, msg) => {
    const message = `Dear Applicant<br/>
    ${[
        enums_1.EApplicationStatus.FIRST_STAGE_PASSED,
        enums_1.EApplicationStatus.APPROVED,
    ].includes(status)
        ? status === enums_1.EApplicationStatus.FIRST_STAGE_PASSED
            ? 'We are pleased to announce to you'
            : 'We are pleased to inform you'
        : 'We are sorry to inform you'} ${status === enums_1.EApplicationStatus.FIRST_STAGE_PASSED
        ? `that you have completed the 1st Phase Certification.<br/>${msg}`
        : `that your application for a Trust Seal in the ${category} category ${msg}`}
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
       <b><span style="color: #000000; font-family: sans-serif; font-size: 32px; ">DBI Trust Seal Account Notification</b>
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
exports.ApplicationStatusUpdateEmailTemplate = ApplicationStatusUpdateEmailTemplate;
//# sourceMappingURL=application-status-update-email.js.map