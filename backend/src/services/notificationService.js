const emailService = require("./emailService");

const leaveApprovedTemplate = require(
  "../templates/emails/leaveApproved"
);
const leaveRejectedTemplate = require("../templates/emails/leaveRejected");

const sendLeaveApprovedNotification = async ({
  employeeEmail,
  employeeName,
  leaveType,
  startDate,
  endDate,
  totalDays,
  reviewerName,
  reviewComment,
}) => {
  const html = leaveApprovedTemplate({
    employeeName,
    leaveType,
    startDate,
    endDate,
    totalDays,
    reviewerName,
    reviewComment,
  });

  await emailService.sendEmail({
    to: employeeEmail,
    subject: "Leave Request Approved",
    html,
    text: `
Dear ${employeeName},

Your ${leaveType} leave request has been approved.

Leave Period:
${startDate} - ${endDate}

Total Working Days: ${totalDays}

Approved By: ${reviewerName}

${
  reviewComment
    ? `Comment: ${reviewComment}`
    : ""
}

Regards,
Human Resources Department
`,
  });
};

const sendLeaveRejectedNotification = async ({
  employeeEmail,
  employeeName,
  leaveType,
  startDate,
  endDate,
  totalDays,
  reviewerName,
  reviewComment,
}) => {

  const html = leaveRejectedTemplate({
    employeeName,
    leaveType,
    startDate,
    endDate,
    totalDays,
    reviewerName,
    reviewComment,
  });

  return await emailService.sendEmail({
    to: employeeEmail,

    subject: "Leave Request Rejected",

    html,

    text: `
Dear ${employeeName},

Your leave request has been rejected.

Leave Type: ${leaveType}
Start Date: ${startDate}
End Date: ${endDate}
Total Working Days: ${totalDays}
Reviewed By: ${reviewerName}

${
  reviewComment
    ? `Reason / Comment: ${reviewComment}`
    : "No additional comment was provided."
}

Please contact the Human Resources Department if you have any questions.

Kind regards,
Human Resources Department
`,
  });
};

module.exports = {
  sendLeaveApprovedNotification,
  sendLeaveRejectedNotification
};