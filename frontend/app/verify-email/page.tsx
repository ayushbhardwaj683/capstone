"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { sendOtpRequest } from "@/lib/api";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendOtpRequest(email);

      localStorage.setItem("verified_email_temp", email);

      router.push("/verify-otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  return (
   <AppShell
  title="Verify Your Email"
  subtitle="Enter your email address to receive a one-time verification code."
>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded-[2rem] border bg-white p-8 shadow-sm">
        <input
          type="email"
          placeholder="email@example.com"
          className="w-full rounded-2xl border px-4 py-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button className="rounded-full bg-ink px-5 py-3 text-white" disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </AppShell>
  );
}