import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendOtpEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: `"Formly Studio" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email • Formly Studio",
    html: `
      <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:30px;">
        <div style="max-width:500px; margin:auto; background:white; padding:30px; border-radius:8px; text-align:center;">

          <h2 style="margin-bottom:10px; color:#1e293b;">Formly Studio</h2>

          <p style="color:#475569; font-size:15px;">
            Thank you for signing up.
          </p>

          <p style="color:#475569; font-size:15px;">
            Use the verification code below to complete your registration.
          </p>

          <div style="margin:25px 0; font-size:32px; letter-spacing:6px; font-weight:bold; color:#2563eb;">
            ${otp}
          </div>

          <p style="font-size:13px; color:#64748b;">
            This code will expire in 5 minutes.
          </p>

          <p style="font-size:13px; color:#64748b;">
            If you didn’t request this email, you can safely ignore it.
          </p>

          <hr style="margin:25px 0; border:none; border-top:1px solid #e2e8f0;">

          <p style="font-size:12px; color:#94a3b8;">
            © ${new Date().getFullYear()} Formly Studio. All rights reserved.
          </p>

        </div>
      </div>
    `
  });
}