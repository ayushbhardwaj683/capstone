import { OtpModel } from "../models/Otp";
import { sendOtpEmail } from "../utils/email";

export async function sendOtp(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await OtpModel.deleteMany({ email });

  await OtpModel.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  });

  await sendOtpEmail(email, otp);

  return { message: "OTP sent successfully." };
}

export async function verifyOtp(email: string, otp: string) {
  const record = await OtpModel.findOne({ email, otp });

  if (!record) {
    throw new Error("Invalid OTP");
  }

  if (record.expiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  await OtpModel.deleteMany({ email });

  return { verified: true };
}