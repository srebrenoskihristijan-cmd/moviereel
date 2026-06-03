import nodemailer from "nodemailer";

// Optional: sends a welcome email after registration. If SMTP_HOST is not set,
// this is a no-op so the app runs fine without mail configured.
export const sendWelcomeEmail = async (to, username) => {
  if (!process.env.SMTP_HOST) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || "MovieReel <no-reply@moviereel.app>",
    to,
    subject: "Welcome to MovieReel",
    text: `Hi ${username}, thanks for registering at MovieReel! Enjoy the show.`,
  });
};
