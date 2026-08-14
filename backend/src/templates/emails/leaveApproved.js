const leaveApprovedTemplate = ({
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
<title>Leave Request Approved</title>
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
background:#16a34a;
padding:30px;
text-align:center;
color:white;
font-size:28px;
font-weight:bold;
">
Leave Request Approved
</td>
</tr>

<tr>
<td style="padding:35px;">

<p style="font-size:16px;">
Dear <strong>${employeeName}</strong>,
</p>

<p style="font-size:16px;line-height:28px;">
We are pleased to inform you that your leave request has been
<strong>approved</strong>.
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
<td><strong>Approved By</strong></td>
<td>${reviewerName}</td>
</tr>

${
  reviewComment
    ? `
<tr>
<td><strong>Comment</strong></td>
<td>${reviewComment}</td>
</tr>
`
    : ""
}

</table>

<p
style="
margin-top:30px;
line-height:28px;
font-size:16px;
">
Please ensure that all necessary work handovers are completed before
your leave begins.
</p>

<p
style="
margin-top:30px;
font-size:16px;
">
We wish you a pleasant leave.
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

module.exports = leaveApprovedTemplate;