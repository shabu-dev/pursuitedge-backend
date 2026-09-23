const sendPaymentFailedCompanyEmail = async ({
    customerName,
    customerEmail,
    customerPhone,
    courseName,
    amount,
    currency,
    paymentId,
    stripePaymentIntentId,
    failureReason
}) => {

    const receiver =
        process.env.PAYMENT_RECEIVER ||
        process.env.CONTACT_RECEIVER;

    const mailOptions = {

        from:
            `"Pursuit Edge Website" <${process.env.SMTP_USER}>`,

        to: receiver,

        replyTo: customerEmail,

        subject:
            `Payment Failed - ${customerName}`,

        html: `
<!DOCTYPE html>

<html>

<body style="
margin:0;
padding:40px 15px;
background:#f4f7f8;
font-family:Arial,Helvetica,sans-serif;
">

<table width="650"
align="center"
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
color:#dc2626;
margin-top:0;
">

Payment Failed

</h2>

<p style="
color:#555;
font-size:14px;
line-height:1.6;
">

A customer payment has failed.

</p>


<table width="100%"
cellpadding="10"
style="
background:#f7fafb;
border:1px solid #e6eeee;
border-radius:10px;
">

<tr>

<td style="color:#6b7280;">
Customer
</td>

<td>
<strong>${escapeHtml(customerName)}</strong>
</td>

</tr>

<tr>

<td style="color:#6b7280;">
Email
</td>

<td>
${escapeHtml(customerEmail)}
</td>

</tr>

<tr>

<td style="color:#6b7280;">
Phone
</td>

<td>
${escapeHtml(customerPhone || '-')}
</td>

</tr>

<tr>

<td style="color:#6b7280;">
Course
</td>

<td>
${escapeHtml(courseName || '-')}
</td>

</tr>

<tr>

<td style="color:#6b7280;">
Amount
</td>

<td>
${escapeHtml(currency || 'INR')}
${escapeHtml(amount)}
</td>

</tr>

<tr>

<td style="color:#6b7280;">
Payment ID
</td>

<td>
${escapeHtml(paymentId)}
</td>

</tr>

<tr>

<td style="color:#6b7280;">
Stripe Payment Intent
</td>

<td style="font-size:12px;">
${escapeHtml(stripePaymentIntentId || '-')}
</td>

</tr>

<tr>

<td style="color:#6b7280;">
Status
</td>

<td style="
color:#dc2626;
font-weight:bold;
">

FAILED

</td>

</tr>

</table>


<div style="
margin-top:25px;
padding:18px;
background:#fff7f7;
border-left:4px solid #dc2626;
border-radius:6px;
color:#555;
">

<strong>
Failure Reason
</strong>

<br><br>

${escapeHtml(
    failureReason ||
    'Unknown payment failure'
)}

</div>

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

Pursuit Edge Payment System

</td>

</tr>

</table>

</body>

</html>
`
    };

    return await transporter.sendMail(mailOptions);
};