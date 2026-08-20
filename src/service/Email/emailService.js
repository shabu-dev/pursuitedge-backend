const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

// Verify SMTP

const verifyEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log('Google SMTP connection successful');
        return true;
    } catch (error) {
        console.error(  'Google SMTP connection failed:',  error.message);
        return false;

    }
};

//Escape HTML

const escapeHtml = (value = '') => {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};



//Admin Email
const sendContactEnquiryEmail = async (data) => {

    const { firstname, email, phonenumber, enquiry, company, message } = data;
    const mailOptions = {
        from: `"PursuitEdge Website" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_RECEIVER,
        replyTo: email,
        subject: `New Website Enquiry - ${enquiry || 'General Enquiry'}`,
        html: `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Website Enquiry</title>
                </head>
                <body style="margin:0; padding:0; background:#f4f7f8; font-family:Arial,Helvetica,sans-serif;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;">
                        <tr>
                            <td align="center">
                                <table width="650" cellpadding="0" cellspacing="0" style=" max-width:650px; width:100%; background:#ffffff; border-radius:14px; overflow:hidden; " >
                                    <!-- HEADER -->
                                    <tr>
                                        <td style="background:#062f33; padding:30px; text-align:center;">

                                            <div style=" color:#ffffff; font-size:28px; font-weight:bold; letter-spacing:1px;"> PursuitEdge </div>
                                            <div style="color:#c8d6d8;font-size:14px;margin-top:8px;"> New Website Enquiry</div>
                                        </td>
                                    </tr>

                                    <!-- CONTENT -->

                                    <tr>
                                        <td style="padding:35px;">
                                            <h2 style=" margin:0 0 10px; color:#172b2d; font-size:24px; "> New Contact Enquiry </h2>
                                            <p style=" color:#667; font-size:14px; line-height:1.6; "> A new enquiry has been submitted through the PursuitEdge website. </p>

                                            <!-- CONTACT DETAILS -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style=" margin-top:25px; background:#f7fafb; border-radius:10px; border:1px solid #e6eeee; " >
                                                <tr>
                                                    <td style=" padding:13px 18px; color:#6b7280; width:35%;"> Name </td>
                                                    <td style=" padding:13px 18px; color:#172b2d; font-weight:600; "> ${escapeHtml(firstname)} </td>
                                                </tr>


                                                <tr>
                                                    <td style=" padding:13px 18px; color:#6b7280;"> Email </td>
                                                    <td style="padding:13px 18px;">
                                                        <a href="mailto:${escapeHtml(email)}" style=" color:#f57c20; text-decoration:none;"> ${escapeHtml(email)} </a>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style=" padding:13px 18px; color:#6b7280;">Phone</td>
                                                    <td style="padding:13px 18px;color:#172b2d;"> ${escapeHtml(phonenumber)} </td>
                                                </tr>

                                                <tr>
                                                    <td style=" padding:13px 18px; color:#6b7280;"> Company</td>
                                                    <td style=" padding:13px 18px; color:#172b2d;"> ${escapeHtml( company || 'Not provided')} </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding:13px 18px;color:#6b7280;"> Enquiry</td>
                                                    <td style="padding:13px 18px; color:#172b2d; font-weight:600; "> ${escapeHtml(enquiry || 'General Enquiry' )} </td>
                                                </tr>

                                            </table>

                                            <!-- MESSAGE -->
                                            <div style="margin-top:30px;">
                                                <div style="color:#172b2d; font-size:16px; font-weight:bold; margin-bottom:12px; "> Message </div>
                                                <div style="background:#f7fafb; border-left:4px solid #f57c20; padding:18px; border-radius:6px; color:#4b5563; font-size:14px; line-height:1.7; white-space:pre-line; "> ${escapeHtml(message)} </div>
                                            </div>
                                            <!-- REPLY BUTTON -->
                                            <div style="text-align:center; margin-top:30px;"> <a href="mailto:${escapeHtml(email)}" style="display:inline-block; background:#f57c20; color:#ffffff; text-decoration:none; padding:13px 25px; border-radius:7px; font-size:14px; font-weight:bold;"> Reply to Customer </a> </div>
                                        </td>
                                    </tr>

                                    <!-- FOOTER -->

                                    <tr>
                                        <td style="background:#062f33; padding:22px; text-align:center;">
                                            <div style="color:#ffffff;font-size:14px;font-weight:bold;">PursuitEdge</div>
                                            <div style="color:#aebfc1;font-size:12px;margin-top:7px;">Website Contact Enquiry</div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
            </html>
        `
    };
    return await transporter.sendMail( mailOptions);
};

// Customer Confirmation

const sendCustomerConfirmationEmail = async ({ firstname, email, enquiry}) => {
    const mailOptions = {
        from:`"PursuitEdge" <${process.env.SMTP_USER}>`,
        to:email,
        subject: 'Thank You for Contacting PursuitEdge',
        html: `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>

                <body style="margin:0;padding:0;background:#f4f7f8;font-family:Arial,Helvetica,sans-serif;">

                    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style=" max-width:600px; width:100%; background:#ffffff; border-radius:14px; overflow:hidden;">
                                    <tr>
                                        <td style="background:#062f33; padding:30px; text-align:center;">
                                            <div style="color:#ffffff; font-size:27px; font-weight:bold;"> PursuitEdge </div>
                                        </td>
                                    </tr>


                                    <tr>
                                        <td style="padding:40px 35px;">
                                            <h2 style=" color:#172b2d; margin-top:0;"> Thank You, ${escapeHtml(firstname)} </h2>
                                            <p style="color:#555; font-size:15px; line-height:1.7;"> Thank you for contacting <strong>PursuitEdge</strong>. We have successfully received your enquiry.</p>
                                            <div style="background:#f7fafb; border-left:4px solid #f57c20; padding:18px; margin:25px 0; color:#555; line-height:1.6;"> <strong>Enquiry:</strong> ${escapeHtml(enquiry || 'General Enquiry' )} </div>
                                            <p style="color:#555;font-size:14px;line-height:1.7;"> Our team will review your enquiry and get back to you as soon as possible.</p>
                                            <p style=" color:#555; font-size:14px; "> Best regards,<br> <strong>PursuitEdge Team</strong> </p>
                                        </td>
                                    </tr>


                                    <tr>
                                        <td style="background:#062f33; padding:20px; text-align:center; color:#aebfc1; font-size:12px;"> © 2026 PursuitEdge. All Rights Reserved. </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
            </html>

        `
    };

    return await transporter.sendMail(mailOptions);

};

module.exports = {
    verifyEmailConnection,
    sendContactEnquiryEmail,
    sendCustomerConfirmationEmail
};