const sendPaymentSuccessCustomerEmail = async ({
    customerName,
    customerEmail,
    courseName,
    amount,
    currency,
    paymentId,
    stripePaymentIntentId
}) => {

    const mailOptions = {

        from: `"Pursuit Edge" <${process.env.SMTP_USER}>`,

        to: customerEmail,

        subject:
            'Payment Successful - Pursuit Edge',

        html: `
<!DOCTYPE html>

<html>

<body style="
margin:0;
padding:0;
background:#f4f7f8;
font-family:Arial,Helvetica,sans-serif;
">

<table width="100%"
cellpadding="0"
cellspacing="0"
style="padding:40px 15px;">

<tr>

<td align="center">

<table width="600"
cellpadding="0"
cellspacing="0"
style="
max-width:600px;
width:100%;
background:#ffffff;
border-radius:14px;
overflow:hidden;
">

<tr>

<td style="
background:#062f33;
padding:30px;
text-align:center;
">

<div style="
color:#ffffff;
font-size:28px;
font-weight:bold;
">

Pursuit Edge

</div>

<div style="
color:#c8d6d8;
font-size:14px;
margin-top:8px;
">

Payment Confirmation

</div>

</td>

</tr>


<tr>

<td style="padding:40px 35px;">

<div style="
text-align:center;
font-size:48px;
">

✓

</div>

<h2 style="
text-align:center;
color:#16a34a;
margin:10px 0 20px;
">

Payment Successful

</h2>

<p style="
color:#555;
font-size:15px;
line-height:1.7;
">

Hello <strong>${escapeHtml(customerName)}</strong>,

</p>

<p style="
color:#555;
font-size:15px;
line-height:1.7;
">

Your payment has been successfully completed.
Thank you for choosing Pursuit Edge.

</p>


<table width="100%"
cellpadding="0"
cellspacing="0"
style="
margin-top:25px;
background:#f7fafb;
border-radius:10px;
border:1px solid #e6eeee;
">

<tr>

<td style="
padding:13px 18px;
color:#6b7280;
">

Course

</td>

<td style="
padding:13px 18px;
color:#172b2d;
font-weight:600;
">

${escapeHtml(courseName || '-')}

</td>

</tr>


<tr>

<td style="
padding:13px 18px;
color:#6b7280;
">

Amount

</td>

<td style="
padding:13px 18px;
color:#172b2d;
font-weight:600;
">

${escapeHtml(currency || 'INR')}
 ${escapeHtml(amount)}

</td>

</tr>


<tr>

<td style="
padding:13px 18px;
color:#6b7280;
">

Payment ID

</td>

<td style="
padding:13px 18px;
color:#172b2d;
">

${escapeHtml(paymentId)}

</td>

</tr>


<tr>

<td style="
padding:13px 18px;
color:#6b7280;
">

Status

</td>

<td style="
padding:13px 18px;
color:#16a34a;
font-weight:bold;
">

SUCCESSFUL

</td>

</tr>

</table>


<p style="
color:#555;
font-size:14px;
line-height:1.7;
margin-top:25px;
">

Your payment has been recorded successfully.
Our team will proceed with the next steps related
to your course enrollment.

</p>

<p style="
color:#555;
font-size:14px;
">

Best regards,<br>

<strong>Pursuit Edge Team</strong>

</p>

</td>

</tr>


<tr>

<td style="
background:#062f33;
padding:20px;
text-align:center;
color:#aebfc1;
font-size:12px;
">

© ${new Date().getFullYear()}
Pursuit Edge. All Rights Reserved.

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

    return await transporter.sendMail(mailOptions);
};