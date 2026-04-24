"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { verifyOtpRequest } from "@/lib/api";

export default function VerifyOtpPage() {
  const router = useRouter();
//   const [otp, setOtp] = useState("");
const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
function handleChange(value: string, index: number) {
  if (!/^[0-9]?$/.test(value)) return;

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  if (value && index < 5) {
    const next = document.getElementById(`otp-${index + 1}`);
    next?.focus();
  }
}

function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
  if (e.key === "Backspace" && !otp[index] && index > 0) {
    const prev = document.getElementById(`otp-${index - 1}`);
    prev?.focus();
  }
}
  useEffect(() => {
    const storedEmail = localStorage.getItem("verified_email_temp");

    if (!storedEmail) {
      router.push("/verify-email");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
    const code = otp.join("");
await verifyOtpRequest(email, code);

      localStorage.setItem("verified_email", email);

      router.push("/register");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    }
  }

  return (
  <AppShell
  title="Enter Verification Code"
  subtitle="We've sent a secure 6-digit code to your email. Please enter it below to continue."
>
<form
  onSubmit={handleVerify}
  className="mt-8 w-full max-w-md flex flex-col items-start gap-6 rounded-2xl border border-slate-200 bg-white p-10 shadow-sm"
>
       <div className="flex justify-center gap-3">
  {otp.map((digit, index) => (
    <input
      key={index}
      id={`otp-${index}`}
      type="text"
      maxLength={1}
      value={digit}
      onChange={(e) => handleChange(e.target.value, index)}
      onKeyDown={(e) => handleKeyDown(e, index)}
    className="w-12 h-14 text-center text-xl font-semibold border-2 border-slate-300 rounded-lg focus:border-black focus:outline-none transition"
    />
  ))}
</div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

    <button className="mt-4 w-full rounded-full bg-black py-3 text-white font-medium hover:bg-slate-800 transition">
          Verify OTP
        </button>
      </form>
    </AppShell>
  );
}