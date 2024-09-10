import nodemailer from "nodemailer";
import { config } from "dotenv";
config();

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Đảm bảo chứng chỉ SSL không bị từ chối (chỉ nên sử dụng nếu cần thiết)
  },
});

export const sendResetCodeEmail = async (email: string, resetCode: string) => {
  await transporter.sendMail({
    from: "Threads@offical.com",
    to: email,
    subject: "Password Reset Code",
    text: `You requested a password reset. Use the following code to reset your password: ${resetCode}`,
    html: `<p><strong>You requested a password reset. Use the following code to reset your password: ${resetCode}</strong></p>`,
  });
};