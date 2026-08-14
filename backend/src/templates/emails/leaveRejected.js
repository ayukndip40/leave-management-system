const leaveRejectedTemplate = ({
  employeeName,
  leaveType,
  startDate,
  endDate,
  totalDays,
  reviewerName,
  reviewComment,
}) => {
  return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8" />
<title>Leave Request Rejected</title>
</head>

<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">

<tr>
<td align="center">

<table
width="650"
cellpadding="0"
cellspacing="0"
style="
background:#ffffff;
border-radius:12px;
overflow:hidden;
box-shadow:0 4px 12px rgba(0,0,0,.08);
">

<tr>
<td
style="
background:#dc2626;
padding:30px;
text-align:center;
color:white;
font-size:28px;
font-weight:bold;
">
Leave Request Rejected
</td>
</tr>

<tr>
<td style="padding:35px;">

<p style="font-size:16px;">
Dear <strong>${employeeName}</strong>,
</p>

<p style="font-size:16px;line-height:28px;">
We regret to inform you that your leave request has been
<strong>rejected</strong>.
</p>

<table
width="100%"
cellpadding="10"
style="
margin-top:25px;
border-collapse:collapse;
background:#fafafa;
">

<tr>
<td><strong>Leave Type</strong></td>
<td>${leaveType}</td>
</tr>

<tr>
<td><strong>Start Date</strong></td>
<td>${startDate}</td>
</tr>

<tr>
<td><strong>End Date</strong></td>
<td>${endDate}</td>
</tr>

<tr>
<td><strong>Total Working Days</strong></td>
<td>${totalDays}</td>
</tr>

<tr>
<td><strong>Reviewed By</strong></td>
<td>${reviewerName}</td>
</tr>

${
  reviewComment
    ? `
<tr>
<td><strong>Reason / Comment</strong></td>
<td>${reviewComment}</td>
</tr>
`
    : `
<tr>
<td><strong>Reason / Comment</strong></td>
<td>No additional comment was provided.</td>
</tr>
`
}

</table>

<p
style="
margin-top:30px;
line-height:28px;
font-size:16px;
">
If you have any questions regarding this decision, please contact the
Human Resources Department for further clarification.
</p>

<p
style="
margin-top:30px;
font-size:16px;
">
You may submit another leave request if appropriate after discussing the
matter with your supervisor or HR.
</p>

<p style="margin-top:35px;">
Kind regards,<br/>
<strong>Human Resources Department</strong>
</p>

</td>
</tr>

<tr>
<td
style="
background:#f5f5f5;
padding:18px;
text-align:center;
font-size:13px;
color:#777;
">
Leave Management System © ${new Date().getFullYear()}
</td>
</tr>

</table>

</td>
</tr>

</table>

</body>

</html>
`;
};

module.exports = leaveRejectedTemplate;