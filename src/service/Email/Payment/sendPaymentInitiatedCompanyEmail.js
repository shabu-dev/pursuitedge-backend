const sendPaymentInitiatedCompanyEmail = async ({
    customerName,
    customerEmail,
    customerPhone,
    courseName,
    amount,
    currency,
    paymentId,
    stripePaymentIntentId
}) => {

    const receiver =
        process.env.PAYMENT_RECEIVER ||
        process.env.CONTACT_RECEIVER;

    const mailOptions = {

        from: `"Pursuit Edge Website" <${process.env.SMTP_USER}>`,

        to: receiver,

        replyTo: customerEmail,

        subject:
            `New Payment Initiated - ${customerName}`,

        html: `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width,initial-scale=1.0">

</head>

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

<table width="650"
cellpadding="0"
cellspacing="0"
style="
max-width:650px;
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

Payment Notification

</div>

</td>

</tr>


<tr>

<td style="padding:35px;">

<h2 style="
margin:0 0 10px;
color:#172b2d;
">

New Payment Initiated

</h2>

<p style="
color:#667;
font-size:14px;
line-height:1.6;
">

A customer has initiated a payment through
the Pursuit Edge website.

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
width:35%;
">

Customer Name

</td>

<td style="
padding:13px 18px;
color:#172b2d;
font-weight:600;
">

${escapeHtml(customerName)}

</td>

</tr>


<tr>

<td style="
padding:13px 18px;
color:#6b7280;
">

Email

</td>

<td style="padding:13px 18px;">

<a href="mailto:${escapeHtml(customerEmail)}"
style="
color:#f57c20;
text-decoration:none;
">

${escapeHtml(customerEmail)}

</a>

</td>

</tr>


<tr>

<td style="
padding:13px 18px;
color:#6b7280;
">

Phone

</td>

<td style="
padding:13px 18px;
color:#172b2d;
">

${escapeHtml(customerPhone || 'Not provided')}

</td>

</tr>


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
">

${escapeHtml(courseName || 'Not provided')}

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

Stripe Payment Intent

</td>

<td style="
padding:13px 18px;
color:#172b2d;
font-size:12px;
">

${escapeHtml(stripePaymentIntentId || '-')}

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
color:#f57c20;
font-weight:bold;
">

INITIATED

</td>

</tr>

</table>


<div style="text-align:center;margin-top:30px;">

<a href="mailto:${escapeHtml(customerEmail)}"
style="
display:inline-block;
background:#f57c20;
color:#ffffff;
text-decoration:none;
padding:13px 25px;
border-radius:7px;
font-size:14px;
font-weight:bold;
">

Contact Customer

</a>

</div>

</td>

</tr>


<tr>

<td style="
background:#062f33;
padding:22px;
text-align:center;
">

<div style="
color:#ffffff;
font-size:14px;
font-weight:bold;
">

Pursuit Edge

</div>

<div style="
color:#aebfc1;
font-size:12px;
margin-top:7px;
">

Payment Notification

</div>

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