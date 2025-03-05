"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmailVerificationTemplate = exports.VerificationEmailTemplate = void 0;
const VerificationEmailTemplate = (name, verificationLink, otp) => {
    const message = `Welcome ${name} Team to the DBI certification system. You have successfully created an account. Please use the following code <b> <font color="#0c5ab6";>${otp},</font></b> to verify your account. Remember this email is only valid for one day.
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
      <img src="https://lh3.googleusercontent.com/ktsB3-nbOaLiBdQESKvR-bso1HhHPY7oO-s9pQsYKOcXd-OQouKFvOVgzSiL13NPAubLJiP6uVvqz7uNu3YjwUR8NRR8gyPkT5KB9FizYxn2ZoT1SOHLmtnqHFvvZfgcE4ZwJ9y33VoijMEbX5TuZcsBnIqYqs8ZVUQW2to14sJU_6MS3iD254yjcKsrB0M7vM5Dyy2bmBMBoWIRW6SWsnCcXF0HDT9FrRe9fV-QQKMJs-8yAytmQwgGH6WpOcuCWbMKyLef8pC6R3POmTP3RkvFs6Ej4XWit5iMLG9n6KzP6B9D3FO9tjZmY4FY68YgZYbRCpNyQvz0ZUEruA5p6qy0K4rcG4q3tPovtKzsysDw0iErywlpFPYGeFxNkFmxO3Xuy5ijDcZB3l0rPUEHQi9ZqIr7qRFvrEBhuavmM_k1hMwjR83lBud5WJMPwZsS7yMksx025E7QZ7K4IWRJAA4T5rOnQo89GIu01nA7ALRllFte4ZVhbTpeKTU9tO-LZtsY_ykV0WXYFSTDoV24glH_mBFvc1UvDhQKdg-c_K-5i-2HYmbJO8lpwiZLzI3G6rn-NHHl7A9a-4JMGwk6i35Z-2V2OA-X0VaSvYi40MWQ_eQi2QkAFC3EsfNpCNuNvRTFAyxHfqcCHUEE-uBkvjNqY-vy43ArbUbfevF8X1vpa09V6GwQW_bh1IfvWv5MKFrGJbh8YVAJUuvrC82X3bN_EVJ_2GU0VIoGsPDy7fKvqpGe-G2bs1xqulLTmPdyeix-gcc2sIYtRyezkQGyFta2bJIOOHyi192C-rnCic6__vJrwjxCS-9d_N5WWF_0PY_m0bE488Bl8nnwkia_KG1RWUKWAFr431H3DPv3TzhaeUzFM90stDihxgrl8hbWuHD-ZAMYwRJzatJnvk-wWhI7rXe_XJf7IgxBn6hWMz8520OlULqPm9vJ1o8kEQaB1uPndOQFA7b3uUdaulorFSf1-xKL-8tsotwH3L5EJW2scw3uO7EGkhCBHg=w1678-h936-no?authuser=0" alt="TRUST SEAL LOGO"  height="72px">
     </td>
    </tr>
    <tr >
     <td  style="padding: 72px 64px; background-color: #F5F9FF; border-top: 1px solid #eeeeee;">
      <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
     <tr>
      <td style="text-align: left;">
       <b><span style="color: #000000; font-family: sans-serif; font-size: 32px; ">Verify account</b>
      </td>
     </tr>
     <tr>
      <td style="color: #666666; font-family: sans-serif; font-size: 16px; padding:32px 0; line-height: 32px;">
        ${message} 
      </td>
     </tr>
     <tr>
      <td style="padding:32px 0;">
       <a href="${verificationLink}" style="border-radius: 4px; padding: 16px 64px; font-size: 14px; color: #ffffff; font-weight: bold; background: #0c5ab6; text-decoration: none; font-family: sans-serif; text-transform: capitalize;">Verify</a>
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
exports.VerificationEmailTemplate = VerificationEmailTemplate;
const UpdateEmailVerificationTemplate = (name, verificationLink) => {
    const message = `Hello,<b> <font color="#0c5ab6";>${name},</font></b><br>
    Please verify your email by clicking on the Verify button below.
    Or paste this link in the browser:
    ${verificationLink}`;
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
      <img src="https://res.cloudinary.com/dbbs6psld/image/upload/v1668682711/dbi/white_i44ttx.png" alt="TRUST SEAL LOGO" height="72px">
     </td>
    </tr>
    <tr >
     <td  style="padding: 72px 64px; background-color: #F5F9FF; border-top: 1px solid #eeeeee;">
      <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
     <tr>
      <td style="text-align: left;">
       <b><span style="color: #000000; font-family: sans-serif; font-size: 32px; ">Verify account</b>
      </td>
     </tr>
     <tr>
      <td style="color: #666666; font-family: sans-serif; font-size: 16px; padding:32px 0; line-height: 32px;">
        ${message} 
      </td>
     </tr>
     <tr>
      <td style="padding:32px 0;">
       <a href="${verificationLink}" style="border-radius: 4px; padding: 16px 64px; font-size: 14px; color: #ffffff; font-weight: bold; background: #0c5ab6; text-decoration: none; font-family: sans-serif; text-transform: capitalize;">Verify</a>
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
exports.UpdateEmailVerificationTemplate = UpdateEmailVerificationTemplate;
//# sourceMappingURL=verification-email.js.map