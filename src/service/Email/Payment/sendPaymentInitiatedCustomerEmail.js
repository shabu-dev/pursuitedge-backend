const sendPaymentInitiatedCustomerEmail = async ({
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

        subject: 'Payment Initiated - Pursuit Edge',

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

<!-- HEADER -->

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


<!-- CONTENT -->

<tr>

<td style="padding:35px;">

<h2 style="
margin:0 0 12px;
color:#172b2d;
">

Payment Initiated

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

Your payment has been initiated successfully.
We are waiting for the payment confirmation from
our payment provider.

</p>


<!-- PAYMENT DETAILS -->

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
width:40%;
">

Course

</td>

<td style="
padding:13px 18px;
color:#172b2d;
font-weight:600;
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

Status

</td>

<td style="
padding:13px 18px;
color:#f57c20;
font-weight:bold;
">

Payment Initiated

</td>

</tr>

</table>


<p style="
color:#555;
font-size:14px;
line-height:1.7;
margin-top:25px;
">

You will receive another email once your payment
has been successfully completed.

</p>


<p style="
color:#555;
font-size:14px;
line-height:1.7;
">

Thank you for choosing <strong>Pursuit Edge</strong>.

</p>

</td>

</tr>


<!-- FOOTER -->

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