

// "use client";

// import type { ReactNode } from "react";
// import Link from "next/link";
// import { useRouter, usePathname } from "next/navigation";
// import { useAuth } from "@/hooks/useAuth";

// interface AppShellProps {
//   title: string;
//   subtitle?: string; // Made optional so pages without subtitles don't break
//   children: ReactNode;
// }

// export function AppShell({ title, subtitle, children }: AppShellProps) {
//   const { isAuthenticated, logout } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname(); // Added to track the current active route

//   function handleLogout() {
//     logout();
//     router.push("/login");
//   }

//   // Helper function to apply a subtle underline to the active link
//   const getLinkStyle = (path: string) => {
//     const isActive = pathname === path;
//     return isActive
//       ? "border-b border-slate-800 pb-1 text-slate-900 font-medium transition-colors"
//       : "pb-1 text-slate-600 hover:text-slate-900 transition-colors";
//   };

//   return (
//     <div className="min-h-screen">
//       <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
//         <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
//           <Link className="text-xl font-semibold tracking-tight" href="/">
//             Formly Studio
//           </Link>

//           <nav className="flex gap-6 text-sm items-center">
//             {isAuthenticated ? (
//               <>
//                 <Link href="/dashboard" className={getLinkStyle("/dashboard")}>
//                   Dashboard
//                 </Link>
//                 <Link href="/forms/create" className={getLinkStyle("/forms/create")}>
//                   Create Form
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="pb-1 text-red-600 hover:text-red-800 transition-colors"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link href="/login" className={getLinkStyle("/login")}>
//                   Login
//                 </Link>
//                 {/* <Link href="/register" className={getLinkStyle("/register")}>
//                   Register
//                 </Link> */}
//                 <Link href="/verify-email" className={getLinkStyle("/verify-email")}>
//   Register
// </Link>
//               </>
//             )}
//           </nav>
//         </div>
//       </header>

//       <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
//         <section className="space-y-3">
//          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
//   Formly Studio Platform
// </p>
//           <h1 className="text-4xl font-semibold tracking-tight text-ink">
//             {title}
//           </h1>
//           {subtitle && (
//             <p className="max-w-3xl text-base text-slate-600">{subtitle}</p>
//           )}
//         </section>

//         {children}
//       </main>
//     </div>
//   );
// }







"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface AppShellProps {
  title: string;
  subtitle?: string; // Made optional so pages without subtitles don't break
  children: ReactNode;
}

export function AppShell({ title, subtitle, children }: AppShellProps) {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Added to track the current active route
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Tracks mobile menu state

  function handleLogout() {
    logout();
    setIsMobileMenuOpen(false); // Close menu on logout
    router.push("/login");
  }

  // Helper function to apply a subtle underline to the active link
  // Removed padding to decrease space between text and line, making it look thinner and sharper
  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;
    return isActive
      ? "border-b-[1px] border-slate-800 text-slate-900 font-medium transition-colors w-max"
      : "border-b-[1px] border-transparent text-slate-600 hover:text-slate-900 transition-colors w-max";
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_26%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.16),transparent_22%),linear-gradient(180deg,#f8fbff_0%,#fff9f4_56%,#f8fafc_100%)]">
      {/* Added relative and z-50 to ensure the header stays on top of the full-screen menu */}
      <header className={`relative z-50 transition-colors duration-300 ${isMobileMenuOpen ? "bg-white" : "bg-transparent"}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xl font-semibold tracking-tight shadow-sm backdrop-blur-xl" href="/">
            Formly Studio
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-3 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm shadow-sm backdrop-blur-xl md:flex">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className={getLinkStyle("/dashboard")}>
                  Dashboard
                </Link>
                <Link href="/forms/create" className={getLinkStyle("/forms/create")}>
                  Create Form
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 transition-colors border-b-[1px] border-transparent"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={getLinkStyle("/login")}>
                  Login
                </Link>
                <Link href="/verify-email" className={getLinkStyle("/verify-email")}>
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Hamburger Button (2 Lines to Cross) */}
          <button
            className="relative h-5 w-6 md:hidden focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span
              className={`absolute left-0 block h-[1.5px] w-full bg-slate-800 transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? "top-2 rotate-45" : "top-1"
              }`}
            />
            <span
              className={`absolute left-0 block h-[1.5px] w-full bg-slate-800 transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? "top-2 -rotate-45" : "bottom-1"
              }`}
            />
          </button>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-white pt-20 pb-12 md:hidden">
          
          {/* Centered Middle Options */}
          <nav className="flex flex-grow flex-col items-center justify-center gap-8 text-lg">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={getLinkStyle("/dashboard")}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/forms/create"
                  className={getLinkStyle("/forms/create")}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create Form
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={getLinkStyle("/login")}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/verify-email"
                  className={getLinkStyle("/verify-email")}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Logout anchored at the bottom */}
          {isAuthenticated && (
            <div className="flex justify-center mt-auto">
              <button
                onClick={handleLogout}
                className="w-max border-b-[1px] border-transparent text-lg text-red-600 transition-colors hover:text-red-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/75 px-7 py-8 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="absolute inset-y-0 right-0 w-64 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.18),transparent_58%)]" />
          <p className="relative text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            Formly Studio Platform
          </p>
          <h1 className="relative mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="relative mt-3 max-w-3xl text-base leading-7 text-slate-600">{subtitle}</p>
          )}
        </section>

        {children}
      </main>
    </div>
  );
}
