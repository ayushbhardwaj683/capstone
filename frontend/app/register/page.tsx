"use client";

// import { useState } from "react";
// import { useEffect } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { registerRequest } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  // const [verifiedEmail, setVerifiedEmail] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  // const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
  const email = localStorage.getItem("verified_email");

  if (!email) {
    router.push("/verify-email");
  } else {
    setVerifiedEmail(email);
  }
}, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // const payload = await registerRequest({ name, email, password });
    if (!verifiedEmail) {
  setError("Email verification required.");
  return;
}

const payload = await registerRequest({
  name,
  email: verifiedEmail,
  password
});
    login(payload.token);

localStorage.removeItem("verified_email");

router.push("/dashboard");
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : "Failed to create account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
   <AppShell
  title="Create your Formly Studio Account"
  subtitle="Start building powerful online forms, collect responses, and manage your data effortlessly."
>
      <form className="max-w-xl space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm text-slate-600">
          <span>Name</span>
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Your Name" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        {/* <label className="block space-y-2 text-sm text-slate-600">
          <span>Email</span>
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" type="email" placeholder="mail@formly.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label> */}

        <label className="block space-y-2 text-sm text-slate-600">
          <span>Password</span>
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" type="password" placeholder="Choose a strong password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AppShell>
  );
}
