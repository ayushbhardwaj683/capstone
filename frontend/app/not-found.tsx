import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_26%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_22%),linear-gradient(180deg,#f8fbff_0%,#fff9f4_56%,#f8fafc_100%)] px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-[2.25rem] border border-white/70 bg-white/80 p-10 text-center shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Page not found</h1>
        <p className="mt-4 text-base text-slate-600">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white" href="/">
            Go home
          </Link>
          <Link className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700" href="/dashboard">
            Open dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
