"use client";

import { Mail, MapPin } from "lucide-react";

const projects = [
  {
    title: "Aurora Atelier",
    role: "Brand identity",
    year: "2025",
    blurb: "Visual system and digital presence for a boutique studio.",
  },
  {
    title: "Northline",
    role: "Web experience",
    year: "2024",
    blurb: "Immersive product storytelling with restrained motion.",
  },
  {
    title: "Velum",
    role: "Art direction",
    year: "2024",
    blurb: "Campaign lookbook and editorial layout for a seasonal drop.",
  },
];

export function PortfolioContent() {
  return (
    <div className="relative min-h-[100dvh] w-full bg-[#f7f6f3] text-[#141820]">
      <header className="sticky top-0 z-10 border-b border-[#1a2744]/8 bg-[#f7f6f3]/85 px-6 py-5 backdrop-blur-md sm:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <span className="font-[family-name:var(--font-playfair)] text-xl font-semibold tracking-[0.2em] text-[#0a0f18] sm:text-2xl">
            MK
          </span>
          <nav className="hidden items-center gap-8 text-sm font-medium tracking-wide text-[#4a5568] sm:flex">
            <span className="cursor-default">Work</span>
            <span className="cursor-default">About</span>
            <span className="cursor-default">Contact</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
        <section className="max-w-3xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-[#6b7280]">
            Portfolio
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold leading-tight tracking-tight text-[#0a0f18] sm:text-5xl md:text-6xl">
            Luxury branding &amp; digital craft
          </h1>
          <p className="mt-6 max-w-xl text-base font-light leading-relaxed tracking-wide text-[#4a5568] sm:text-lg">
            Placeholder copy for your main portfolio — swap projects, narrative,
            and links when you are ready.
          </p>
        </section>

        <section className="mt-20 sm:mt-28">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#0a0f18] sm:text-3xl">
            Selected work
          </h2>
          <p className="mt-2 text-sm text-[#6b7280]">
            Dummy entries for layout preview.
          </p>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <li
                key={p.title}
                className="group flex flex-col rounded-2xl border border-[#1a2744]/10 bg-white/60 p-6 shadow-[0_20px_50px_-24px_rgba(15,31,58,0.18)] transition-shadow hover:shadow-[0_28px_60px_-20px_rgba(15,31,58,0.22)]"
              >
                <div className="mb-4 aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-[#e8e6e1] to-[#d4d0c8]" />
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#0a0f18]">
                    {p.title}
                  </h3>
                  <span className="shrink-0 text-xs tabular-nums text-[#9ca3af]">
                    {p.year}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#6b7280]">
                  {p.role}
                </p>
                <p className="mt-3 text-sm font-light leading-relaxed text-[#4a5568]">
                  {p.blurb}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-24 rounded-2xl border border-[#1a2744]/10 bg-[#0f1f3a] px-8 py-12 text-[#f7f6f3] sm:mt-32 sm:px-12">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold sm:text-3xl">
            Let&apos;s talk
          </h2>
          <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-[#c8cdd8]">
            Replace with your real email, calendar link, or form. This block
            is only here to show the transition landing.
          </p>
          <div className="mt-8 flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:gap-10">
            <span className="inline-flex items-center gap-2 text-[#e8eaf0]">
              <Mail className="h-4 w-4 opacity-80" aria-hidden />
              hello@example.com
            </span>
            <span className="inline-flex items-center gap-2 text-[#e8eaf0]">
              <MapPin className="h-4 w-4 opacity-80" aria-hidden />
              Remote / Worldwide
            </span>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1a2744]/8 px-6 py-10 text-center text-xs tracking-wide text-[#9ca3af] sm:px-10">
        © {new Date().getFullYear()} MK — Portfolio placeholder
      </footer>
    </div>
  );
}
