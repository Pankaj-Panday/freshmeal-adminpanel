import nodemailer from "nodemailer";
import logger from "./logger.js";
import sleep from "./sleep.js";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  // secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) {
    logger.error("Error in email transporter:", err);
  } else {
    logger.info("Email transporter is ready");
  }
});

export async function sendMailWithRetry(mailOptions, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await transporter.sendMail(mailOptions);
      logger.info(
        `Email sent successfully to ${mailOptions.to} with subject: ${mailOptions.subject}`,
      );
      return;
    } catch (error) {
      logger.error(`Failed to send email (attempt ${attempt}):`, error);
      if (attempt === maxRetries) {
        throw error;
      }
      await sleep(1000 * attempt);
    }
  }
}
