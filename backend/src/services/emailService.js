const transporter = require("../config/mail");

const sendEmail = async ({
  to,
  subject,
  html,
  text,
}) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      text,
      html,
    });

    console.log(
      `📧 Email sent successfully: ${info.messageId}`
    );

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(
      "❌ Failed to send email:",
      error.message
    );

    throw error;
  }
};

module.exports = {
  sendEmail,
};