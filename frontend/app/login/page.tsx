"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { loginRequest } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = await loginRequest({ email, password });
      login(payload.token);
      router.push("/dashboard");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Failed to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
   <AppShell
  title="Welcome back to Formly Studio"
  subtitle="Sign in to create, manage, and analyze your forms in one place."
>
      <form className="max-w-xl space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm text-slate-600">
          <span>Email</span>
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" type="email" placeholder="founder@formly.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="block space-y-2 text-sm text-slate-600">
          <span>Password</span>
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" type="password" placeholder="********" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AppShell>
  );
}
