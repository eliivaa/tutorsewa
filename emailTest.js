import nodemailer from "nodemailer";

async function sendTestEmail() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"TutorSewa Test" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "Test Email from TutorSewa",
    text: "If you got this, your email config is working!",
  });

  console.log("✅ Email sent:", info.response);
}

sendTestEmail().catch(console.error);
