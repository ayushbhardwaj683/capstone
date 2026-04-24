import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Form Builder SaaS",
  description: "Capstone scaffold for a Google Forms-like SaaS"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={cn("font-sans", jakarta.variable, display.variable)}>
      <body>{children}</body>
    </html>
  );
}
