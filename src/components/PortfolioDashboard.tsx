"use client";

import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Activity,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  Layers,
  Lock,
  Send,
  Server,
  ShieldCheck,
  Target,
} from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import type { LeadServiceType } from "@/constants/leadServiceTypes";
import ContactLeadModal from "@/components/ContactLeadModal";

const GOLD = "rgba(212, 175, 55, 0.85)";
const VIOLET = "rgba(124, 58, 237, 0.55)";

const SOCIAL_URLS = {
  linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? "https://linkedin.com",
  github: process.env.NEXT_PUBLIC_SOCIAL_GITHUB ?? "https://github.com",
  instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "https://instagram.com",
  x: process.env.NEXT_PUBLIC_SOCIAL_X ?? "https://x.com",
} as const;

function SocialBrandIcon({ brand }: { brand: keyof typeof SOCIAL_URLS }) {
  const common = "h-[18px] w-[18px] shrink-0";
  switch (brand) {
    case "linkedin":
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.064-2.065 2.064 2.064 0 1 1 4.127 0 2.062 2.062 0 0 1-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "github":
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
      );
      // case "instagram":
      //   return (
      //     <svg className={common} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      //       <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.35 3.608 1.326.974.974 1.264 2.242 1.326 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.069 4.85c-.062 1.366-.35 2.633-1.326 3.608-.974.974-2.242 1.264-3.608 1.326-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.069c-1.366-.062-2.633-.35-3.608-1.326-.974-.974-1.264-2.242-1.326-3.608-.058-1.266-.069-1.646-.069-4.85s.012-3.584.069-4.85c.062-1.366.35-2.633 1.326-3.608.974-.974 2.242-1.264 3.608-1.326 1.266-.057 1.646-.069 4.85-.069zM12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.936 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.914-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      //     </svg>
      //   );
      // case "x":
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    default:
      return null;
  }
}

const SOCIAL_ITEMS: { key: keyof typeof SOCIAL_URLS; label: string; accent: string }[] = [
  { key: "linkedin", label: "LinkedIn", accent: "from-sky-300/90 to-blue-500/80" },
  { key: "github", label: "GitHub", accent: "from-zinc-100 to-zinc-400/90" },
  // { key: "instagram", label: "Instagram", accent: "from-fuchsia-400/90 to-amber-400/85" },
  // { key: "x", label: "X", accent: "from-zinc-200 to-zinc-500" },
];

function LuxurySocialLink({
  item,
  compact,
  onPick,
}: {
  item: (typeof SOCIAL_ITEMS)[number];
  compact?: boolean;
  onPick?: () => void;
}) {
  const href = SOCIAL_URLS[item.key];
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.label}
      onClick={() => onPick?.()}
      className={`group relative block rounded-xl p-[1px] [transform-style:preserve-3d] ${compact ? "" : "w-full"
        }`}
      style={{
        background: "linear-gradient(145deg, rgba(212,175,55,0.45), rgba(124,58,237,0.35), rgba(255,255,255,0.12))",
        boxShadow: "0 4px 14px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
      whileHover={{ y: -3, rotateX: -6, scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      <span
        className={`flex items-center justify-center gap-2 rounded-[11px] border border-white/10 bg-gradient-to-b from-white/[0.14] to-black/55 px-2.5 py-2 backdrop-blur-sm ${compact ? "min-h-[40px] min-w-[40px]" : "min-h-[44px] w-full justify-start px-3"
          }`}
        style={{
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -8px 16px rgba(0,0,0,0.35)",
        }}
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.accent} text-[#08050c] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_2px_6px_rgba(0,0,0,0.4)] [&_svg]:opacity-95`}
        >
          <SocialBrandIcon brand={item.key} />
        </span>
        {!compact ? (
          <span className="font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.18em] text-white/75">
            {item.label.toUpperCase()}
          </span>
        ) : null}
      </span>
    </motion.a>
  );
}

function HeaderSocialDock() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  const menuId = useId();

  const updateMenuPos = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMenuPos({ top: r.bottom + 8, right: Math.max(8, window.innerWidth - r.right) });
  }, []);

  useEffect(() => {
    if (!open) return;
    updateMenuPos();
    const onResize = () => updateMenuPos();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open, updateMenuPos]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative flex shrink-0 flex-col items-end gap-0 sm:gap-1">
      <motion.button
        ref={btnRef}
        type="button"
        className="flex h-8 shrink-0 items-center gap-1 rounded-lg border border-violet-400/25 bg-gradient-to-b from-white/[0.1] to-black/50 px-2 py-0 font-[family-name:var(--font-geist-mono)] text-[8px] tracking-[0.18em] text-violet-200/90 sm:hidden"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.14), 0 4px 16px rgba(0,0,0,0.45), 0 0 0 1px rgba(124,58,237,0.12)",
        }}
        whileTap={{ scale: 0.98 }}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={() => {
          if (!open) {
            const el = btnRef.current;
            if (el) {
              const r = el.getBoundingClientRect();
              setMenuPos({ top: r.bottom + 8, right: Math.max(8, window.innerWidth - r.right) });
            }
            setOpen(true);
          } else {
            setOpen(false);
          }
        }}
      >
        Connect
        <ChevronDown className={`h-3 w-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed z-[300] w-[min(calc(100vw-16px),260px)] rounded-2xl border border-white/12 p-3 shadow-[0_24px_60px_-8px_rgba(0,0,0,0.85)] sm:hidden"
            style={{
              top: menuPos?.top ?? 72,
              right: menuPos?.right ?? 12,
              background: "color-mix(in srgb, var(--mk-portfolio-ink) 96%, transparent)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
            role="menu"
            aria-label="Social links"
          >
            {/* <p className="mb-2 border-b border-white/10 pb-2 font-[family-name:var(--font-geist-mono)] text-[8px] tracking-[0.28em] text-white/40">
              SECURE RELAYS
            </p> */}
            <ul className="flex flex-col gap-2" role="none">
              {SOCIAL_ITEMS.map((item) => (
                <li key={item.key} role="none">
                  <LuxurySocialLink item={item} onPick={() => setOpen(false)} />
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div
        className="hidden items-center gap-2 [perspective:800px] sm:flex"
        style={{ transformStyle: "preserve-3d" }}
      >
        {SOCIAL_ITEMS.map((item) => (
          <LuxurySocialLink key={item.key} item={item} compact />
        ))}
      </div>
    </div>
  );
}

const portfolioMeshBg: CSSProperties = {
  backgroundImage: [
    "radial-gradient(ellipse 120% 90% at 100% -5%, rgba(124, 92, 220, 0.20) 0%, transparent 58%)",
    "radial-gradient(ellipse 100% 75% at 0% 105%, rgba(196, 150, 80, 0.10) 0%, transparent 55%)",
    "radial-gradient(900px 700px at 48% 42%, rgba(55, 32, 88, 0.38) 0%, transparent 62%)",
    "linear-gradient(165deg, var(--mk-portfolio-ink) 0%, transparent 42%)",
    "linear-gradient(180deg, var(--mk-portfolio-base) 0%, var(--mk-portfolio-deep) 100%)",
  ].join(","),
};

function GlassDockHeader() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1800);
    return () => window.clearInterval(id);
  }, []);
  const latency = 9 + (tick % 5);

  return (
    <header className="sticky top-0 z-50 px-3 pt-2 sm:px-6 sm:pt-4">
      <div className="relative mx-auto max-w-6xl overflow-visible rounded-2xl p-px sm:overflow-hidden">
        <div className="mk-border-beam absolute inset-0 rounded-2xl opacity-90" aria-hidden />
        <div
          className="relative grid min-h-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-2 gap-y-0 rounded-2xl border border-violet-400/[0.12] bg-white/[0.03] px-2.5 py-1.5 backdrop-blur-2xl sm:flex sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-3"
          style={{ backgroundColor: "color-mix(in srgb, var(--mk-portfolio-ink) 78%, transparent)" }}
        >
          <div className="flex min-w-0 items-center gap-1 font-[family-name:var(--font-geist-mono)] text-[8px] leading-tight tracking-[0.14em] text-amber-200/90 sm:gap-2 sm:text-[10px] sm:tracking-[0.2em]">
            <Lock className="h-3 w-3 shrink-0 opacity-80 sm:h-3.5 sm:w-3.5" aria-hidden />
            <span className="truncate">[PERSONAL BLOG]</span>
          </div>

          <div
            className="mx-auto flex h-10 items-center justify-center [perspective:420px] sm:absolute sm:left-1/2 sm:top-1/2 sm:h-14 sm:w-24 sm:-translate-x-1/2 sm:-translate-y-1/2"
            aria-hidden
          >
            <div className="mk-prism-spin relative h-12 w-10 origin-center scale-[0.78] [transform-style:preserve-3d] sm:scale-100">
              {[
                {
                  ry: 0,
                  bg: `linear-gradient(135deg, ${GOLD}, rgba(60,45,15,0.25) 48%, transparent 62%)`,
                  mkGradient:
                    "linear-gradient(168deg, #fffbf2 0%, #f0dfa8 32%, #c9a43a 55%, #8a6a1e 72%, #f5e8bc 100%)",
                  mkFilter:
                    "drop-shadow(0 1px 1px rgba(0,0,0,0.65)) drop-shadow(0 0 10px rgba(212,175,55,0.4))",
                },
                {
                  ry: 120,
                  bg: `linear-gradient(225deg, ${VIOLET}, rgba(40,20,70,0.35) 50%, transparent 58%)`,
                  mkGradient:
                    "linear-gradient(180deg, #ffffff 0%, #e9ddff 38%, #b8a0f0 58%, #ddd6fe 100%)",
                  mkFilter:
                    "drop-shadow(0 1px 2px rgba(0,0,0,0.7)) drop-shadow(0 0 14px rgba(167,139,250,0.5))",
                },
                {
                  ry: 240,
                  bg: `linear-gradient(315deg, rgba(236,240,252,0.35), rgba(180,190,215,0.12) 45%, transparent 55%)`,
                  mkGradient:
                    "linear-gradient(158deg, #ffffff 0%, #dce3f2 42%, #aeb8d4 68%, #f4f6fc 100%)",
                  mkFilter:
                    "drop-shadow(0 1px 2px rgba(0,0,0,0.55)) drop-shadow(0 0 12px rgba(255,255,255,0.25))",
                },
              ].map((face) => (
                <div
                  key={face.ry}
                  className="absolute inset-0 flex items-center justify-center rounded-sm border border-white/18 [transform-style:preserve-3d] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                  style={{
                    transform: `rotateY(${face.ry}deg) translateZ(28px)`,
                    background: face.bg,
                    backfaceVisibility: "hidden",
                  }}
                >
                  <span
                    className="select-none font-[family-name:var(--font-playfair)] text-[0.82rem] font-semibold uppercase leading-none tracking-[0.14em] sm:text-[1.05rem]"
                    style={{
                      backgroundImage: face.mkGradient,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                      filter: face.mkFilter,
                    }}
                  >
                    MK
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-w-0 justify-end justify-self-end sm:w-auto sm:justify-self-auto">
            <div className="flex items-center gap-2 sm:gap-4">
              <HeaderSocialDock />
              {/* <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1 font-[family-name:var(--font-geist-mono)] text-[9px] tracking-wide text-white/55 sm:flex">
                <Activity className="h-3 w-3 text-emerald-400/90" aria-hidden />
                <span>SYSTEM STATUS</span>
                <span className="text-emerald-400/90">NOMINAL</span>
                <span className="text-white/35">|</span>
                <span className="text-white/45">LAT {latency}ms</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function GlassNetworkCore({
  uid,
  sx,
  sy,
  verifyLift,
  verifyBloom,
}: {
  uid: string;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  verifyLift: MotionValue<number>;
  verifyBloom: MotionValue<number>;
}) {
  const refractX = useTransform(sy, (deg) => deg * 0.14);
  const refractY = useTransform(sx, (deg) => -deg * 0.11);
  const refractX2 = useTransform(sy, (deg) => -deg * 0.19);
  const refractY2 = useTransform(sx, (deg) => deg * 0.15);
  const shear = useTransform([sx, sy], ([x, y]) => (Number(x) + Number(y)) * 0.04);
  const counterShear = useTransform(shear, (s) => -s * 0.85);

  return (
    <div className="absolute inset-[5%] overflow-hidden rounded-[1.05rem] border border-white/[0.14] sm:inset-[5%] sm:rounded-[1.35rem]">
      <div
        className="absolute inset-0 bg-[#030208]"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(124,92,220,0.12), inset 0 12px 28px rgba(0,0,0,0.65)",
        }}
        aria-hidden
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id={`${uid}-void`} cx="50%" cy="42%" r="72%">
            <stop offset="0%" stopColor="#0b0714" />
            <stop offset="45%" stopColor="#06040c" />
            <stop offset="100%" stopColor="#020105" />
          </radialGradient>
          <radialGradient id={`${uid}-depth`} cx="50%" cy="55%" r="55%">
            <stop offset="0%" stopColor="rgba(124,58,237,0)" />
            <stop offset="100%" stopColor="rgba(124,58,237,0.22)" />
          </radialGradient>
          <linearGradient id={`${uid}-violetEdge`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(196,181,255,0.62)" />
            <stop offset="50%" stopColor="rgba(124,92,220,0.42)" />
            <stop offset="100%" stopColor="rgba(90,60,160,0.32)" />
          </linearGradient>
          <linearGradient id={`${uid}-violetGhost`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(180,160,255,0.58)" />
            <stop offset="100%" stopColor="rgba(100,70,200,0.32)" />
          </linearGradient>
          <linearGradient id={`${uid}-violetEdgeMain`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(220,210,255,0.82)" />
            <stop offset="100%" stopColor="rgba(124,92,220,0.52)" />
          </linearGradient>
          <filter id={`${uid}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`${uid}-refract`} x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="42" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <rect width="200" height="200" fill={`url(#${uid}-void)`} />
        <rect width="200" height="200" fill={`url(#${uid}-depth)`} />

        <g opacity="0.3" stroke="rgba(124,92,220,0.44)" strokeWidth="0.35" fill="none">
          <path d="M20 140 L100 95 L180 125 M30 165 L100 120 L170 155 M45 175 L100 145 L155 178" />
          <path d="M55 45 L100 75 L145 50 M70 30 L100 55 L130 32" />
        </g>

        <motion.g
          style={{
            x: refractX2,
            y: refractY2,
            rotate: shear,
            transformOrigin: "100px 100px",
            filter: `url(#${uid}-refract)`,
            opacity: 0.52,
          }}
        >
          <g stroke={`url(#${uid}-violetGhost)`} strokeWidth="1" fill="none" opacity="0.95">
            <path d="M38 52 L98 78 L158 48 M42 118 L98 92 L156 122 M52 148 L98 118 L146 152" />
          </g>
        </motion.g>

        <motion.g
          style={{
            x: refractX,
            y: refractY,
            rotate: counterShear,
            transformOrigin: "100px 100px",
            filter: `url(#${uid}-glow)`,
          }}
        >
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M42 48 L98 74 L154 44 M44 120 L98 94 L156 118 M54 150 L98 122 L144 154 M98 74 L98 94 M154 44 L156 118"
              stroke={`url(#${uid}-violetEdgeMain)`}
              strokeWidth="1.15"
            />
          </g>

          <g opacity="0.94">
            <rect x="36" y="38" width="28" height="22" rx="4" fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.24)" strokeWidth="0.6" />
            <rect x="84" y="64" width="30" height="24" rx="4" fill="rgba(255,255,255,0.072)" stroke="rgba(196,181,255,0.42)" strokeWidth="0.65" />
            <rect x="132" y="34" width="28" height="22" rx="4" fill="rgba(255,255,255,0.048)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.55" />
            <rect x="40" y="108" width="26" height="22" rx="3.5" fill="rgba(255,255,255,0.058)" stroke="rgba(124,92,220,0.4)" strokeWidth="0.55" />
            <rect x="88" y="86" width="22" height="20" rx="3.5" fill="rgba(255,255,255,0.065)" stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" />
            <rect x="130" y="104" width="30" height="24" rx="4" fill="rgba(255,255,255,0.055)" stroke="rgba(196,181,255,0.36)" strokeWidth="0.6" />
            <rect x="52" y="138" width="24" height="20" rx="3.5" fill="rgba(255,255,255,0.05)" stroke="rgba(124,92,220,0.34)" strokeWidth="0.5" />
            <rect x="96" y="112" width="26" height="22" rx="3.5" fill="rgba(255,255,255,0.075)" stroke="rgba(255,255,255,0.26)" strokeWidth="0.55" />
            <rect x="138" y="142" width="24" height="18" rx="3" fill="rgba(255,255,255,0.045)" stroke="rgba(180,160,255,0.3)" strokeWidth="0.45" />
          </g>
        </motion.g>

        <rect
          x="2"
          y="2"
          width="196"
          height="196"
          rx="14"
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="0.5"
        />
      </svg>

      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background:
            "radial-gradient(ellipse 85% 70% at 50% 38%, rgba(255,255,255,0.14) 0%, rgba(124,92,220,0.08) 35%, transparent 62%)",
          opacity: verifyBloom,
        }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          boxShadow: "inset 0 0 40px rgba(200,220,255,0.12)",
          opacity: verifyLift,
        }}
        aria-hidden
      />
    </div>
  );
}

function ScrollGlassCube({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const rotateX = useTransform(scrollYProgress, [0, 0.45, 1], [8, -32, -58]);
  const rotateY = useTransform(scrollYProgress, [0, 0.45, 1], [-14, 48, 96]);
  const rotateZ = useTransform(scrollYProgress, [0, 0.55, 1], [0, 6, 14]);
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.85, 1], [1, 1.06, 0.92, 0.78]);
  const unfold = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.55, 1]);
  const faceRotX = useTransform(unfold, [0, 1], [0, -78]);
  const innerRotY = useTransform(unfold, [0, 1], [0, 72]);

  const verifyBloom = useTransform(scrollYProgress, [0, 0.5, 0.62, 0.88, 1], [0, 0, 0.35, 0.62, 0.78]);
  const verifyLift = useTransform(scrollYProgress, [0, 0.5, 0.65, 1], [0, 0, 0.55, 0.85]);

  const sx = useSpring(rotateX, { stiffness: 44, damping: 22 });
  const sy = useSpring(rotateY, { stiffness: 44, damping: 22 });
  const sz = useSpring(rotateZ, { stiffness: 44, damping: 22 });
  const sc = useSpring(scale, { stiffness: 50, damping: 20 });
  const sFaceX = useSpring(faceRotX, { stiffness: 38, damping: 20 });
  const sInnerY = useSpring(innerRotY, { stiffness: 38, damping: 20 });
  const sVerifyBloom = useSpring(verifyBloom, { stiffness: 28, damping: 24 });
  const sVerifyLift = useSpring(verifyLift, { stiffness: 28, damping: 24 });

  const cubeUid = useId().replace(/:/g, "");

  return (
    <div className="relative mx-auto mt-4 flex min-h-[min(200px,42vw)] w-full max-w-md items-center justify-center sm:mt-8 sm:min-h-[280px] [perspective:900px]">
      <motion.div
        className="relative h-40 w-40 [transform-style:preserve-3d] sm:h-48 sm:w-48"
        style={{ rotateX: sx, rotateY: sy, rotateZ: sz, scale: sc }}
      >
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-2xl border border-white/22 shadow-[0_0_60px_-12px_rgba(124,58,237,0.38)]"
          style={{
            rotateX: sFaceX,
            transformOrigin: "center bottom",
            transformStyle: "preserve-3d",
          }}
        >
          <GlassNetworkCore
            uid={`g${cubeUid}`}
            sx={sx}
            sy={sy}
            verifyLift={sVerifyLift}
            verifyBloom={sVerifyBloom}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background: [
                "linear-gradient(155deg, rgba(255,255,255,0.085) 0%, transparent 40%)",
                "linear-gradient(325deg, rgba(124,58,237,0.09) 0%, transparent 50%)",
                "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.12) 100%)",
              ].join(","),
              backdropFilter: "blur(8px) saturate(1.12)",
              WebkitBackdropFilter: "blur(8px) saturate(1.12)",
            }}
            aria-hidden
          />
        </motion.div>

        <motion.div
          className="absolute inset-[5%] rounded-[1.05rem] border border-amber-400/18 sm:rounded-[1.35rem]"
          style={{
            rotateY: sInnerY,
            transformOrigin: "left center",
            background: "linear-gradient(105deg, rgba(0,0,0,0.12) 0%, transparent 45%)",
            boxShadow: "inset 0 0 0 1px rgba(212,175,55,0.12)",
            pointerEvents: "none",
          }}
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "radial-gradient(circle at 28% 22%, rgba(212,175,55,0.12), transparent 42%), radial-gradient(circle at 72% 72%, rgba(124,58,237,0.14), transparent 48%)",
            opacity: 0.5,
          }}
          aria-hidden
        />
      </motion.div>
    </div>
  );
}

type TrinityRayAccent = "violet" | "gold" | "dual";

function TrinityLightRays({ accent, active }: { accent: TrinityRayAccent; active: boolean }) {
  const violetCone =
    "conic-gradient(from 252deg at 50% 100%, transparent 0deg, rgba(124,58,237,0.22) 5deg, transparent 11deg, transparent 58deg, rgba(139,92,246,0.18) 64deg, transparent 72deg, transparent 118deg, rgba(167,139,250,0.16) 125deg, transparent 133deg)";
  const goldCone =
    "conic-gradient(from 252deg at 50% 100%, transparent 0deg, rgba(212,175,55,0.2) 5deg, transparent 11deg, transparent 62deg, rgba(245,208,96,0.16) 69deg, transparent 77deg, transparent 112deg, rgba(212,175,55,0.14) 119deg, transparent 127deg)";

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-full z-0 hidden h-[min(200%,420px)] w-[min(240%,520px)] -translate-x-1/2 -translate-y-[12%] sm:block"
      aria-hidden
    >
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={
          active
            ? { opacity: 1, rotate: 360 }
            : { opacity: 0, rotate: 0 }
        }
        transition={{
          opacity: { duration: 0.4 },
          rotate: active
            ? { duration: 22, repeat: Infinity, ease: "linear" }
            : { duration: 0.35 },
        }}
        style={{
          backgroundImage:
            accent === "violet"
              ? violetCone
              : accent === "gold"
                ? goldCone
                : `${violetCone}, ${goldCone}`,
          backgroundBlendMode: accent === "dual" ? "screen" : undefined,
        }}
      />
      <motion.div
        className="absolute inset-0 blur-3xl"
        initial={false}
        animate={active ? { opacity: 1, scale: [1, 1.06, 1] } : { opacity: 0, scale: 1 }}
        transition={{
          opacity: { duration: 0.45 },
          scale: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{
          background:
            accent === "gold"
              ? "radial-gradient(ellipse 55% 40% at 50% 100%, rgba(212,175,55,0.35), transparent 72%)"
              : accent === "violet"
                ? "radial-gradient(ellipse 55% 40% at 50% 100%, rgba(124,58,237,0.38), transparent 72%)"
                : "radial-gradient(ellipse 55% 40% at 50% 100%, rgba(124,58,237,0.28), transparent 65%), radial-gradient(ellipse 45% 35% at 50% 100%, rgba(212,175,55,0.22), transparent 70%)",
        }}
      />
    </div>
  );
}

function TrinityGridNetwork({ visible, filterId }: { visible: boolean; filterId: string }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <filter id={filterId} x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="0.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <motion.g
        initial={false}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <path
          d="M 16.67 52 L 50 36 L 83.33 52"
          fill="none"
          stroke="rgba(167, 139, 250, 0.72)"
          strokeWidth={1}
          vectorEffect="nonScalingStroke"
          filter={`url(#${filterId})`}
        />
        <path
          d="M 16.67 52 L 83.33 52"
          fill="none"
          stroke="rgba(139, 92, 246, 0.5)"
          strokeWidth={1}
          vectorEffect="nonScalingStroke"
          filter={`url(#${filterId})`}
        />
      </motion.g>
    </svg>
  );
}

function TrinityCard({
  title,
  body,
  delay,
  rayAccent,
  onCardPointerEnter,
  onCardPointerLeave,
}: {
  title: string;
  body: string;
  delay: number;
  rayAccent: TrinityRayAccent;
  onCardPointerEnter: () => void;
  onCardPointerLeave: (e: React.PointerEvent<HTMLElement>) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [rayOn, setRayOn] = useState(false);
  const [tiltEnabled, setTiltEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const sync = () => setTiltEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!tiltEnabled) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      setTilt({ x: py * -18, y: px * 22 });
    },
    [tiltEnabled],
  );

  const onEnter = useCallback(() => {
    setRayOn(true);
    onCardPointerEnter();
  }, [onCardPointerEnter]);

  const onLeave = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      setTilt({ x: 0, y: 0 });
      setRayOn(false);
      onCardPointerLeave(e);
    },
    [onCardPointerLeave],
  );

  const rx = tiltEnabled ? tilt.x : 0;
  const ry = tiltEnabled ? tilt.y : 0;

  return (
    <motion.article
      ref={ref}
      className="group relative h-full cursor-default overflow-visible sm:isolate sm:[perspective:1200px]"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={tiltEnabled ? onMove : undefined}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <TrinityLightRays accent={rayAccent} active={rayOn && tiltEnabled} />

      <motion.div
        className="relative z-[1] overflow-hidden rounded-2xl border border-white/14 bg-zinc-950/[0.88] p-5 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.65)] sm:border-white/10 sm:bg-white/[0.03] sm:p-6 sm:backdrop-blur-2xl"
        style={{
          rotateX: rx,
          rotateY: ry,
          transformStyle: tiltEnabled ? "preserve-3d" : "flat",
        }}
        transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.65 }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-90"
          style={{
            background: [
              "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 42%)",
              "linear-gradient(315deg, rgba(124,58,237,0.08) 0%, transparent 55%)",
              "linear-gradient(180deg, transparent 50%, rgba(212,175,55,0.05) 100%)",
            ].join(","),
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(ellipse 90% 65% at 50% 110%, rgba(124,58,237,0.22), transparent 55%), radial-gradient(ellipse 70% 50% at 80% 20%, rgba(212,175,55,0.12), transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative">
          <h3 className="font-[family-name:var(--font-inter)] text-lg font-semibold tracking-tight text-white/92">
            {title}
          </h3>
          <p className="mt-3 text-sm font-light leading-relaxed text-white/65 sm:text-white/58">{body}</p>
        </div>
      </motion.div>
    </motion.article>
  );
}

function TrinityOfExpertiseSection() {
  const lineFilterId = useId().replace(/:/g, "");
  const gridRef = useRef<HTMLDivElement>(null);
  const [linked, setLinked] = useState(false);

  const onCardPointerEnter = useCallback(() => setLinked(true), []);

  const onCardPointerLeave = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const next = e.relatedTarget;
    if (next instanceof Node && gridRef.current?.contains(next)) return;
    setLinked(false);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-5 pb-12 pt-5 sm:px-8 sm:py-12 sm:pt-12">
      {/* <p className="mk-trinity-shimmer font-mono font-[family-name:var(--font-geist-mono)] text-[10px] font-medium uppercase tracking-[0.4em]">
        TRINITY OF EXPERTISE
      </p> */}
      <motion.h2
        className="mt-1 font-[family-name:var(--font-inter)] text-2xl font-semibold text-white/90 sm:mt-3 sm:text-3xl"
        initial={{ opacity: 0, y: 20, scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ type: "spring", stiffness: 280, damping: 26, mass: 0.85 }}
      >
        Absolute Secured Unified Systems.
      </motion.h2>

      <div className="relative mt-10 min-h-[12rem]">
        <TrinityGridNetwork visible={linked} filterId={`trinity-glow-${lineFilterId}`} />
        <div ref={gridRef} className="relative z-10 grid gap-5 lg:grid-cols-3">
          <TrinityCard
            title="Security"
            body="Protocol Hardening: 50+ Contracts Audited. Specialist in Foundry, Slither, and DApp Automation (Playwright/Synpress)."
            delay={0}
            rayAccent="violet"
            onCardPointerEnter={onCardPointerEnter}
            onCardPointerLeave={onCardPointerLeave}
          />
          <TrinityCard
            title="Product"
            body="Engineering Lead specializing in high-performance Web3 ecosystems. Focused on optimizing user-centric interfaces with Next.js"
            delay={0.08}
            rayAccent="gold"
            onCardPointerEnter={onCardPointerEnter}
            onCardPointerLeave={onCardPointerLeave}
          />
          <TrinityCard
            title="Infrastructure"
            body="Enterprise Systems: Bespoke Billing & POS Infrastructure for Franchises. Bridging digital logic with real-world commerce."
            delay={0.16}
            rayAccent="dual"
            onCardPointerEnter={onCardPointerEnter}
            onCardPointerLeave={onCardPointerLeave}
          />
        </div>
      </div>
    </section>
  );
}

type VaultProjectAccent = "gold" | "violet";

type VaultProjectMedia = { kind: "video" | "image"; src: string };

type VaultProjectEntry = {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  accent: VaultProjectAccent;
  media: VaultProjectMedia;
  category: string;
};

const VAULT_MEDIA_H = "h-[118px] sm:h-[136px]";

function VaultProjectMediaStrip({ media, title }: { media: VaultProjectMedia; title: string }) {
  if (media.kind === "video") {
    return (
      <video
        className="h-full w-full object-cover object-center"
        src={media.src}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-label={`${title} preview video`}
      />
    );
  }
  return (
    <img
      src={media.src}
      alt={`${title} — project preview`}
      className="h-full w-full object-cover object-center"
      loading="lazy"
      decoding="async"
    />
  );
}

function VaultProjectCard({
  index,
  title,
  subtitle,
  description,
  accent,
  media,
  category,
}: VaultProjectEntry) {
  const isGold = accent === "gold";
  const border = isGold
    ? "border-amber-400/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_16px_56px_-28px_rgba(212,175,55,0.2)]"
    : "border-violet-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_16px_56px_-28px_rgba(124,58,237,0.32)]";

  return (
    <article
      className={`vault-card relative flex h-[min(68dvh,480px)] w-[min(92vw,360px)] shrink-0 flex-col overflow-hidden rounded-[1.35rem] border bg-zinc-950/80 sm:h-[500px] sm:w-[min(88vw,400px)] ${border}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: isGold
            ? "radial-gradient(ellipse 90% 70% at 10% 0%, rgba(212,175,55,0.18), transparent 52%), radial-gradient(ellipse 70% 50% at 100% 100%, rgba(124,58,237,0.08), transparent 45%)"
            : "radial-gradient(ellipse 90% 70% at 90% 0%, rgba(124,58,237,0.22), transparent 50%), radial-gradient(ellipse 60% 45% at 0% 100%, rgba(212,175,55,0.06), transparent 42%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      <div className="relative flex min-h-0 flex-1 flex-col p-3 sm:p-4">
        <div className="flex h-[36px] shrink-0 items-start justify-between gap-2">
          <span className="font-[family-name:var(--font-geist-mono)] text-[9px] tracking-[0.32em] text-white/35">
            {category}
          </span>
          <span
            className={`font-[family-name:var(--font-geist-mono)] text-3xl font-light tabular-nums sm:text-4xl ${isGold ? "text-amber-200/25" : "text-violet-400/30"
              }`}
            aria-hidden
          >
            {index}
          </span>
        </div>

        <div
          className={`mt-2 shrink-0 overflow-hidden rounded-lg border border-white/[0.12] bg-black/60 ${VAULT_MEDIA_H}`}
        >
          <VaultProjectMediaStrip media={media} title={title} />
        </div>

        <div className="mt-2 flex min-h-0 flex-1 flex-col">
          <div
            className="flex min-h-0 flex-1 flex-col rounded-xl border border-white/[0.12] bg-black/25 p-3 sm:p-3.5"
            style={{ backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)" }}
          >
            <p className="line-clamp-2 min-h-[2rem] shrink-0 font-[family-name:var(--font-geist-mono)] text-[9px] leading-snug tracking-[0.26em] text-white/50">
              {subtitle}
            </p>
            <div className="mt-1.5 flex h-[3.65rem] shrink-0 items-start sm:mt-2 sm:h-[4.1rem]">
              <h3 className="line-clamp-3 font-[family-name:var(--font-inter)] text-[clamp(1rem,2.8vw,1.35rem)] font-semibold leading-[1.12] tracking-tight text-white/95 sm:text-[clamp(1.1rem,2.6vw,1.5rem)]">
                {title}
              </h3>
            </div>
            <div className="mt-1.5 flex h-[6.35rem] shrink-0 items-start overflow-hidden sm:mt-2 sm:h-[6.75rem]">
              <p className="line-clamp-5 text-[12px] font-light leading-relaxed text-white/62 sm:text-[13px]">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`pointer-events-none h-1 w-full ${isGold ? "bg-gradient-to-r from-amber-400/50 via-amber-200/20 to-transparent" : "bg-gradient-to-r from-transparent via-violet-400/40 to-violet-500/30"}`}
        aria-hidden
      />
    </article>
  );
}

const VAULT_PROJECTS: VaultProjectEntry[] = [
  {
    index: "01",
    title: "Polynado",
    subtitle: "MARKET INTELLIGENCE LAYER",
    description:
      "AI-driven mispricing analysis surfaces edge in prediction markets. Conversational intelligence woven into the trading loop—chatbot integration for rapid scenario exploration and execution context.",
    accent: "gold",
    media: { kind: "video", src: "/MainPortfolio/Polynadoprojectcard.mp4" },
    category: "Workspace",
  },
  {
    index: "02",
    title: "Nexora",
    subtitle: "TRANSACTION ECOSYSTEMS",
    description:
      "MLM-grade swap logic with referral mechanics engineered for composability. Incentives, routing, and growth loops orchestrated as a coherent on-chain economy.",
    accent: "violet",
    media: { kind: "image", src: "/MainPortfolio/Nexoraprojectcard.jpg" },
    category: "Workspace"
  },
  {
    index: "03",
    title: " Smart Entry",
    subtitle: "ACCESS CONTROL · SMART INFRASTRUCTURE",
    description:
      "A blockchain-powered August Locks Access Control, ensuring tamper-proof security for August Smart Locks.",
    accent: "gold",
    media: { kind: "video", src: "/MainPortfolio/DALProjectcard.mp4" },
    category: "Personal"
  },
  {
    index: "04",
    title: "Trusted Ballot",
    subtitle: "GOVERNANCE · IDENTITY",
    description:
      "A secure, transparent, and decentralized voting system designed to eliminate fraud and ensure fair elections through dual-factor authentication.",
    accent: "violet",
    media: { kind: "image", src: "/MainPortfolio/votingprojectcard.jpg" },
    category: "Freelance"
  },
  {
    index: "05",
    title: "Health Chain",
    subtitle: "HEALTH DATA · VERIFICATION",
    description:
      "Implementation of role-based doctor-patient verification with Web3 authentication for secure and private medical record management.",
    accent: "gold",
    media: { kind: "video", src: "/MainPortfolio/healthProjectcard.mp4" },
    category: "Freelance"
  },
  {
    index: "06",
    title: "AI Contract Auditor",
    subtitle: "SECURITY AUTOMATION · AI",
    description:
      "A diagnostic tool that leverages Slither for static analysis and Generative AI for actionable audit summaries. Currently seeking collaborators to scale this into a comprehensive security platform.",
    accent: "violet",
    media: { kind: "image", src: "/MainPortfolio/auditprojectcard.jpg" },
    category: "Personal"
  },
];

function ProjectVaultSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const total = VAULT_PROJECTS.length;
  const rafRef = useRef<number | null>(null);

  const syncActiveFromScroll = useCallback(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const mid = root.getBoundingClientRect().left + root.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    const items = root.querySelectorAll<HTMLElement>("[data-vault-slide]");
    items.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = Math.abs(c - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  }, []);

  const onScroll = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      syncActiveFromScroll();
    });
  }, [syncActiveFromScroll]);

  useEffect(() => {
    syncActiveFromScroll();
  }, [syncActiveFromScroll]);

  const goTo = useCallback((index: number) => {
    const root = scrollerRef.current;
    if (!root) return;
    const clamped = Math.max(0, Math.min(index, total - 1));
    const target = root.querySelectorAll<HTMLElement>("[data-vault-slide]")[clamped];
    target?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [total]);

  const current = VAULT_PROJECTS[active] ?? VAULT_PROJECTS[0];
  const progressPct = total > 0 ? ((active + 1) / total) * 100 : 0;

  return (
    <section className="relative py-16 sm:py-24" aria-label="Project vault">
      <div
        className="relative z-10 border-b border-violet-500/[0.08] px-5 pb-6 pt-2 backdrop-blur-md sm:px-10 sm:pb-8"
        style={{ backgroundColor: "var(--mk-portfolio-header-bg)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {/* <p className="font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.3em] text-violet-300/85">
              PROJECT VAULT
            </p> */}
            <h2 className="mt-2 font-[family-name:var(--font-inter)] text-2xl font-semibold tracking-tight text-[var(--mk-portfolio-fg)] sm:text-3xl">
              Top Projects
            </h2>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <p className="max-w-[220px] text-right font-[family-name:var(--font-geist-mono)] text-[9px] leading-relaxed tracking-[0.18em] text-[var(--mk-portfolio-fg-muted)] sm:max-w-xs">
              <span className={current.accent === "gold" ? "text-amber-200/85" : "text-violet-300/85"}>
                {current.title.toUpperCase()}
              </span>
              <span className="text-[var(--mk-portfolio-fg-dim)]"> · </span>
              <span className="text-[var(--mk-portfolio-fg-dim)]">
                {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </p>
            <div className="h-1 w-full min-w-[160px] max-w-[220px] overflow-hidden rounded-full bg-white/[0.06] sm:w-[220px]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-400/70 via-amber-200/40 to-violet-500/80"
                initial={false}
                animate={{ width: `${progressPct}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 28 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[100vw]">
        <div
          className="pointer-events-none absolute inset-y-12 left-0 z-20 w-16 bg-gradient-to-r from-[var(--mk-portfolio-base)] to-transparent sm:left-2 sm:w-24"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-12 right-0 z-20 w-16 bg-gradient-to-l from-[var(--mk-portfolio-base)] to-transparent sm:right-2 sm:w-24"
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-y-16 left-3 w-px bg-gradient-to-b from-transparent via-amber-400/20 to-transparent sm:left-8"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-16 right-3 w-px bg-gradient-to-b from-transparent via-violet-500/20 to-transparent sm:right-8"
          aria-hidden
        />

        <button
          type="button"
          onClick={() => goTo(active - 1)}
          disabled={active <= 0}
          className="absolute left-1 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/60 text-white/80 backdrop-blur-md transition hover:border-amber-400/35 hover:text-white disabled:pointer-events-none disabled:opacity-25 sm:left-4 sm:h-12 sm:w-12"
          aria-label="Previous project"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          disabled={active >= total - 1}
          className="absolute right-1 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/60 text-white/80 backdrop-blur-md transition hover:border-violet-400/35 hover:text-white disabled:pointer-events-none disabled:opacity-25 sm:right-4 sm:h-12 sm:w-12"
          aria-label="Next project"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>

        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="vault-carousel flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden scroll-smooth py-8 pl-[max(1.25rem,calc(50vw-min(46vw,11.25rem)))] pr-[max(1.25rem,calc(50vw-min(46vw,11.25rem)))] [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-8 sm:py-10 sm:pl-[max(1.25rem,calc(50vw-min(44vw,12.5rem)))] sm:pr-[max(1.25rem,calc(50vw-min(44vw,12.5rem)))] [&::-webkit-scrollbar]:hidden"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Project dossiers"
        >
          {VAULT_PROJECTS.map((p) => (
            <div
              key={`${p.index}-${p.title}`}
              data-vault-slide
              className="snap-center shrink-0"
            >
              <VaultProjectCard {...p} />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 pb-2 pt-2">
          {VAULT_PROJECTS.map((p, i) => (
            <button
              key={`dot-${p.index}-${p.title}`}
              type="button"
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${i === active ? "w-8 bg-gradient-to-r from-amber-400/80 to-violet-500/80" : "w-2 bg-white/20 hover:bg-white/35"
                }`}
              aria-label={`Go to ${p.title}`}
              {...(i === active ? { "aria-current": "true" as const } : {})}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const PLAYBOOK_CORE_FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Layers,
    title: "Skill Aggregation",
    body: "Grouping fragmented knowledge into high-demand engineering stacks.",
  },
  {
    icon: Send,
    title: "Direct Outreach",
    body: "Tactical strategies for recruiter engagement on elite platforms.",
  },
  {
    icon: Target,
    title: "Market Architecture",
    body: "Beyond applications—building a professional presence that scales.",
  },
];

const WORKSHOP_ENTERPRISE_FEATURES: { title: string; body: string }[] = [
  {
    title: "Architectural Consultation",
    body: "Initial stakeholder requirement mapping and system logic design.",
  },
  {
    title: "End-to-End Deployment",
    body: "Full-cycle delivery of hardened, scalable billing ecosystems for franchises.",
  },
  {
    title: "Infrastructure Audit",
    body: "Post-deployment security verification and high-availability database (MongoDB) optimization.",
  },
];

const WORKSHOP_EXPERT_FEATURES: { title: string; body: string }[] = [
  {
    title: "Architecture Intensives",
    body: "Deep dives into Blockchain systems and Full-Stack performance optimization.",
  },
  {
    title: "Market Calibration",
    body: "Real-world insights on bridging technical logic with commercial utility.",
  },
  {
    title: "Professional Scaling",
    body: "Strategic mentorship for high-stakes recruiter outreach and profile architecture.",
  },
];

function PlaybookGlassModuleCard({
  moduleIndex,
  hovered,
  setHovered,
  headerIcon: HeaderIcon,
  headline,
  subline,
  features,
  featureRowsWithIcons,
  cta,
  onLeadCta,
  pricingTag,
}: {
  moduleIndex: number;
  hovered: number | null;
  setHovered: (i: number | null) => void;
  headerIcon?: LucideIcon;
  headline: string;
  subline?: string;
  features?: { title: string; body: string }[];
  featureRowsWithIcons?: { icon: LucideIcon; title: string; body: string }[];
  cta: string;
  onLeadCta?: () => void;
  pricingTag?: { label: string; kind: "paid" | "free" };
}) {
  const isActive = hovered === moduleIndex;
  const dim = hovered !== null && !isActive;
  const iconBoxClass =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-gradient-to-br from-white/[0.1] to-black/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_6px_16px_rgba(0,0,0,0.55)] sm:h-12 sm:w-12";
  const iconBoxStyle: CSSProperties = {
    transform: "perspective(420px) rotateY(-10deg) rotateX(4deg)",
    transformStyle: "preserve-3d",
  };

  return (
    <motion.article
      className="flex h-full min-h-0 flex-col [transform-style:preserve-3d] will-change-transform"
      style={{
        transform: `perspective(1200px) translateZ(${isActive ? 15 : 0}px)`,
        transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      animate={{ opacity: dim ? 0.55 : 1 }}
      transition={{ duration: 0.35 }}
      onPointerEnter={() => setHovered(moduleIndex)}
    >
      <div className="relative flex h-full min-h-[26rem] flex-1 flex-col overflow-hidden rounded-[1.35rem] p-px sm:min-h-0">
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-square h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2 opacity-[0.92]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 58deg, rgba(124,58,237,0.2) 66deg, rgba(147,197,253,0.95) 74deg, rgba(124,58,237,0.75) 82deg, rgba(96,165,250,0.65) 88deg, transparent 98deg, transparent 360deg)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          aria-hidden
        />
        <div
          className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.3rem] border border-white/[0.07] bg-[#080808] px-6 py-8 sm:px-9 sm:py-10"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
        >
          <div className="mk-playbook-system-scan" aria-hidden />

          {pricingTag ? (
            <span
              className={`absolute right-4 top-4 z-[8] rounded-full border px-2.5 py-1 font-[family-name:var(--font-geist-mono)] text-[9px] tracking-[0.14em] backdrop-blur-md sm:right-5 sm:top-5 sm:px-3 sm:text-[10px] ${pricingTag.kind === "free"
                  ? "border-emerald-400/35 bg-emerald-500/[0.12] text-emerald-200/95 shadow-[0_0_20px_-6px_rgba(52,211,153,0.45)]"
                  : "border-amber-400/40 bg-amber-500/[0.1] text-amber-200/95 shadow-[0_0_20px_-6px_rgba(245,158,11,0.35)]"
                }`}
            >
              {pricingTag.label}
            </span>
          ) : null}

          <div
            className={`relative z-[2] flex min-h-0 flex-1 flex-col space-y-6 ${pricingTag ? "pr-[3.25rem] sm:pr-[3.75rem]" : ""
              }`}
          >
            {HeaderIcon ? (
              <div className="flex gap-4">
                <div className={iconBoxClass} style={iconBoxStyle} aria-hidden>
                  <HeaderIcon className="h-[18px] w-[18px] text-sky-200/90 sm:h-5 sm:w-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 pt-0.5">
                  <h3 className="font-[family-name:var(--font-syne)] text-lg font-bold uppercase leading-tight tracking-tight text-white sm:text-xl">
                    {headline}
                  </h3>
                  {subline ? (
                    <p className="mt-2 font-[family-name:var(--font-inter)] text-sm font-light leading-relaxed tracking-normal text-[var(--mk-portfolio-fg-muted)]">
                      {subline}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-[family-name:var(--font-syne)] text-lg font-bold uppercase leading-tight tracking-tight text-white sm:text-xl">
                  {headline}
                </h3>
                {subline ? (
                  <p className="mt-2 font-[family-name:var(--font-inter)] text-sm font-light leading-relaxed tracking-normal text-[var(--mk-portfolio-fg-muted)]">
                    {subline}
                  </p>
                ) : null}
              </div>
            )}

            <ul className="min-h-0 flex-1 space-y-5">
              {features
                ? features.map(({ title, body }) => (
                  <li key={title}>
                    <p className="font-[family-name:var(--font-inter)] text-sm font-semibold tracking-tight text-white/92 sm:text-[15px]">
                      {title}
                    </p>
                    <p className="mt-1.5 text-[13px] font-light leading-relaxed tracking-normal text-white/58 sm:text-sm">
                      {body}
                    </p>
                  </li>
                ))
                : null}
              {featureRowsWithIcons
                ? featureRowsWithIcons.map(({ icon: RowIcon, title, body }) => (
                  <li key={title} className="flex gap-4">
                    <div className={iconBoxClass} style={iconBoxStyle} aria-hidden>
                      <RowIcon className="h-[18px] w-[18px] text-sky-200/90 sm:h-5 sm:w-5" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="font-[family-name:var(--font-inter)] text-sm font-semibold tracking-tight text-white/92 sm:text-[15px]">
                        {title}
                      </p>
                      <p className="mt-1.5 text-[13px] font-light leading-relaxed tracking-normal text-white/58 sm:text-sm">
                        {body}
                      </p>
                    </div>
                  </li>
                ))
                : null}
            </ul>

            {/* <div className="relative z-20 pt-2">
              {onLeadCta ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onLeadCta();
                  }}
                  className="group/btn relative z-30 inline-flex w-full cursor-pointer touch-manipulation items-center justify-center overflow-hidden rounded-xl border border-white/75 bg-white/[0.03] px-6 py-2.5 font-[family-name:var(--font-inter)] text-[13px] font-medium tracking-wide text-white/90 backdrop-blur-md transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-sky-200/55 active:scale-[0.98] sm:text-sm"
                  style={{
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  <span className="relative z-[1] inline-block transition-[text-shadow,color,transform] duration-300 ease-out group-hover/btn:-translate-y-px group-hover/btn:text-white group-hover/btn:[text-shadow:0_0_18px_rgba(147,197,253,0.35)]">
                    {cta}
                  </span>
                  <span
                    className="pointer-events-none absolute inset-0 rounded-[11px] opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"
                    style={{
                      boxShadow:
                        "0 0 0 1px rgba(147,197,253,0.5), 0 0 28px rgba(124,58,237,0.4), 0 0 56px rgba(96,165,250,0.12)",
                    }}
                    aria-hidden
                  />
                </button>
              ) : (
                <motion.a
                  href="#enterprise-nexus"
                  className="group/btn relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl border border-white/75 bg-white/[0.03] px-6 py-2.5 font-[family-name:var(--font-inter)] text-[13px] font-medium tracking-wide text-white/90 backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-sky-200/55 sm:text-sm"
                  style={{
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                  whileHover={{
                    y: -2,
                    transition: { type: "spring", stiffness: 420, damping: 26 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-[1] inline-block transition-[text-shadow,color,transform] duration-300 ease-out group-hover/btn:-translate-y-px group-hover/btn:text-white group-hover/btn:[text-shadow:0_0_18px_rgba(147,197,253,0.35)]">
                    {cta}
                  </span>
                  <span
                    className="pointer-events-none absolute inset-0 rounded-[11px] opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"
                    style={{
                      boxShadow:
                        "0 0 0 1px rgba(147,197,253,0.5), 0 0 28px rgba(124,58,237,0.4), 0 0 56px rgba(96,165,250,0.12)",
                    }}
                    aria-hidden
                  />
                </motion.a>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function WorkshopSection({ onOpenLead }: { onOpenLead: (t: LeadServiceType) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const onGridLeave = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const next = e.relatedTarget;
    if (next instanceof Node && gridRef.current?.contains(next)) return;
    setHovered(null);
  }, []);

  return (
    <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <p className="font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.28em] text-violet-300/80">
        SOLUTIONS & STRATEGY
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-syne)] text-[clamp(1.35rem,4.5vw,2.25rem)] font-bold uppercase leading-[1.08] tracking-tight text-white">
        Active Services
      </h2>
      <p className="mt-4 max-w-3xl font-[family-name:var(--font-inter)] text-base font-light leading-relaxed text-[var(--mk-portfolio-fg-muted)] sm:text-lg">
        End-to-End Infrastructure & Strategic Technical Mentorship.
      </p>

      <div
        ref={gridRef}
        className="relative mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-10 [perspective:1400px] [perspective-origin:50%_40%]"
        style={{ transformStyle: "preserve-3d" }}
        onPointerLeave={onGridLeave}
      >
        <PlaybookGlassModuleCard
          moduleIndex={0}
          hovered={hovered}
          setHovered={setHovered}
          headerIcon={Server}
          headline="Enterprise Infrastructure"
          subline="POS & billing pipeline · consultation through hardened production."
          features={WORKSHOP_ENTERPRISE_FEATURES}
          cta="Request Infrastructure Quote"
          onLeadCta={() => onOpenLead("INFRASTRUCTURE")}
          pricingTag={{ label: "paid", kind: "paid" }}
        />
        <PlaybookGlassModuleCard
          moduleIndex={1}
          hovered={hovered}
          setHovered={setHovered}
          headerIcon={Cpu}
          headline="Expert Sessions"
          subline="Strategic engineering intensives · professional calibration."
          features={WORKSHOP_EXPERT_FEATURES}
          cta="Schedule a Session"
          onLeadCta={() => onOpenLead("EXPERT_SESSIONS")}
          pricingTag={{ label: "paid", kind: "paid" }}
        />
        <PlaybookGlassModuleCard
          moduleIndex={2}
          hovered={hovered}
          setHovered={setHovered}
          headline="Graduate Strategy"
          subline="Core program · Tips to get into your First Job."
          featureRowsWithIcons={PLAYBOOK_CORE_FEATURES}
          cta="Request a Session"
          onLeadCta={() => onOpenLead("GENERAL_FULL_STACK")}
          pricingTag={{ label: "Free", kind: "free" }}
        />
      </div>
    </section>
  );
}

function EnterpriseNexusForm({ onOpenLead }: { onOpenLead: (t: LeadServiceType) => void }) {
  const channels: { type: LeadServiceType; label: string; blurb: string; icon: LucideIcon }[] = [
    {
      type: "INFRASTRUCTURE",
      label: "Infrastructure quote",
      blurb: "Scale, billing stack, timeline, and budget in one structured brief.",
      icon: Server,
    },
    {
      type: "EXPERT_SESSIONS",
      label: "Expert sessions",
      blurb: "Security or full-stack focus, experience level, and session goals.",
      icon: Cpu,
    },
    {
      type: "GENERAL_FULL_STACK",
      label: "Full-stack build",
      blurb: "Platform, stack, and scope — ideal for product and greenfield work.",
      icon: Layers,
    },
  ];

  return (
    <section
      id="enterprise-nexus"
      className="relative mx-auto max-w-3xl scroll-mt-24 px-5 py-24 sm:scroll-mt-28 sm:px-8"
    >
      <p className="font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.28em] text-amber-200/75">
        ENTERPRISE NEXUS
      </p>
      <h2 className="mt-4 font-[family-name:var(--font-inter)] text-2xl font-semibold text-white/90 sm:text-3xl">
        Connection portal
      </h2>
      <p className="mt-3 max-w-2xl text-sm font-light text-white/55">
        Open the secure inquiry channel that matches your engagement. Each path collects the technical fields your
        team needs.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-1 sm:gap-5">
        {channels.map(({ type, label, blurb, icon: Icon }) => (
          <motion.button
            key={type}
            type="button"
            onClick={() => onOpenLead(type)}
            className="group relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border border-white/12 bg-white/[0.05] p-5 text-left shadow-[0_0_60px_-20px_rgba(124,58,237,0.35)] backdrop-blur-2xl transition-[border-color,box-shadow] duration-300 hover:border-violet-400/45 sm:p-6"
            style={{ transformStyle: "preserve-3d" }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.995 }}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-gradient-to-br from-white/[0.1] to-black/50"
              style={{ transform: "perspective(420px) rotateY(-8deg) rotateX(4deg)" }}
              aria-hidden
            >
              <Icon className="h-5 w-5 text-sky-200/90" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-[family-name:var(--font-syne)] text-base font-bold uppercase tracking-tight text-white sm:text-lg">
                {label}
              </p>
              <p className="mt-1.5 font-[family-name:var(--font-inter)] text-sm font-light leading-relaxed text-white/55">
                {blurb}
              </p>
            </div>
            <Send className="mt-1 h-4 w-4 shrink-0 text-violet-300/70 transition group-hover:text-violet-200" aria-hidden />
            <span
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                boxShadow:
                  "inset 0 0 0 1px rgba(167,139,250,0.35), 0 0 32px rgba(124,58,237,0.22)",
              }}
              aria-hidden
            />
          </motion.button>
        ))}
      </div>
    </section>
  );
}

const FOOTER_TECH_COLUMNS: {
  title: string;
  icon: LucideIcon;
  iconFrame: string;
  titleClass: string;
  items: string[];
}[] = [
    {
      title: "Blockchain & Smart Contracts",
      icon: Code2,
      iconFrame: "border-sky-400/40 bg-sky-500/10 text-sky-200",
      titleClass: "text-sky-200/95",
      items: [
        "Solidity, Ethereum, Hyperledger Fabric",
        "Smart contract development & auditing",
        "ERC-20, ERC-721, ERC-1155 token standards",
        "Chainlink oracles & automation",
        "Foundry, Truffle, Hardhat",
        "Gas optimization with zkSync",
      ],
    },
    {
      title: "DApp Development",
      icon: Layers,
      iconFrame: "border-fuchsia-400/35 bg-fuchsia-500/10 text-fuchsia-200",
      titleClass: "text-fuchsia-200/95",
      items: [
        "Web3.js & Ethers.js",
        "React.js & Next.js",
        "IPFS & decentralized storage",
        "MetaMask & wallet integration",
      ],
    },
    {
      title: "DeFi & NFT Projects",
      icon: Database,
      iconFrame: "border-violet-400/40 bg-violet-500/12 text-violet-200",
      titleClass: "text-violet-200/95",
      items: [
        "Liquidity pools & yield farming",
        "NFT metadata storage (IPFS & on-chain SVGs)",
        "Smart contract security & fuzz testing",
      ],
    },
    {
      title: "Other Technologies",
      icon: ShieldCheck,
      iconFrame: "border-amber-400/40 bg-amber-500/10 text-amber-200",
      titleClass: "text-amber-200/95",
      items: [
        "Node.js, Express.js",
        "Docker, WSL, Linux",
        "GraphQL, Firebase, MongoDB",
        "Playwright (QA automation testing)",
      ],
    },
  ];

function CarvedFooter() {
  return (
    <footer className="mx-4 mb-8 mt-8 sm:mx-8">
      <div
        className="mx-auto max-w-6xl rounded-2xl border border-white/[0.06] px-5 py-8 text-center shadow-[inset_0_2px_24px_rgba(0,0,0,0.65)] sm:px-6"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--mk-portfolio-ink) 92%, transparent) 0%, color-mix(in srgb, var(--mk-portfolio-deep) 96%, transparent) 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(40,25,70,0.35)",
        }}
      >
        <p className="font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.28em] text-violet-300/75">
          TECHNOLOGY MATRIX
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-syne)] text-lg font-bold uppercase tracking-tight text-white/92 sm:text-xl">
          Stack & tooling
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-left text-sm font-light leading-relaxed text-white/50 sm:text-center">
          Core technologies, protocols, and platforms this practice ships with — from chain logic to full-stack delivery
          and QA.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {FOOTER_TECH_COLUMNS.map((col) => {
            const Icon = col.icon;
            return (
              <div
                key={col.title}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${col.iconFrame}`}
                    aria-hidden
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                  </div>
                  <h3
                    className={`pt-1 font-[family-name:var(--font-inter)] text-[13px] font-semibold leading-snug tracking-tight sm:text-sm ${col.titleClass}`}
                  >
                    {col.title}
                  </h3>
                </div>
                <ul className="mt-4 space-y-2.5 border-t border-white/[0.06] pt-4">
                  {col.items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[12px] font-light leading-snug text-white/65 sm:text-[13px]">
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-400/90"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 border-t border-white/[0.06] pt-8 sm:flex-row sm:gap-10">
          <div className="font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.2em] text-white/40">
            Email
            <a
              href="mailto:mohankrish.kotte@gmail.com"
              className="mt-1 block text-sm tracking-normal text-white/70 hover:text-white transition-colors duration-300"
            >
              mohankrish.kotte@gmail.com
            </a>
          </div>
          <div className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden />
          <div className="font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.2em] text-white/40">
            Contact
            <span className="mt-1 block text-sm tracking-normal text-white/70">8008164509</span>
          </div>

          <div className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden />
          <div className="font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.2em] text-white/40">
            LIVE LOCATION
            <span className="mt-1 block text-sm tracking-normal text-white/70">Ongole, AP</span>
          </div>

          {/* <div className="flex items-center gap-2 font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.18em] text-white/50">
            <span className="mk-network-pulse h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
            NETWORK STATUS: OPTIMAL
          </div> */}
        </div>
        <p className="mt-6 text-[10px] tracking-[0.2em] text-white/30">
          © {new Date().getFullYear()} — Mohan kotte
        </p>
      </div>
    </footer>
  );
}

export function PortfolioDashboard() {
  const [welcome, setWelcome] = useState(true);
  const [leadModal, setLeadModal] = useState<{ open: boolean; type: LeadServiceType | null }>({
    open: false,
    type: null,
  });
  const openLead = useCallback((type: LeadServiceType) => setLeadModal({ open: true, type }), []);
  const closeLead = useCallback(() => setLeadModal({ open: false, type: null }), []);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const cubeProgress = useTransform(heroProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const t = window.setTimeout(() => setWelcome(false), 3200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      className="portfolio-plane relative min-h-[100dvh] w-full text-[var(--mk-portfolio-fg)] antialiased"
      style={{ backgroundColor: "var(--mk-portfolio-base)" }}
    >
      <div className="pointer-events-none fixed inset-0 opacity-[0.97]" style={portfolioMeshBg} aria-hidden />

      <AnimatePresence>
        {welcome ? (
          <motion.div
            className="fixed inset-x-0 top-0 z-[60] flex justify-center px-4 pt-6"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex max-w-lg items-center gap-4 rounded-2xl border border-amber-400/25 bg-black/70 px-5 py-3 backdrop-blur-xl">
              <p className="font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.2em] text-amber-100/90">
                WELCOME — MAIN PORTFOLIO DASHBOARD ONLINE
              </p>
              <button
                type="button"
                onClick={() => setWelcome(false)}
                className="shrink-0 rounded-lg border border-white/15 px-2 py-1 text-[9px] tracking-widest text-white/60 hover:bg-white/5"
              >
                DISMISS
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <GlassDockHeader />

      <ContactLeadModal open={leadModal.open} serviceType={leadModal.type} onClose={closeLead} />

      <main className="relative z-10">
        <section
          ref={heroRef}
          className="relative min-h-0 px-5 pb-12 pt-2 max-md:pb-10 md:min-h-[115vh] md:pb-24 sm:px-8 sm:pt-3"
        >
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.3em] text-violet-300/75">
              ARCHITECT
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-inter)] text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.06] tracking-tight text-[var(--mk-portfolio-fg)]">
              Architecting Resilient Digital Ecosystems.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-[var(--mk-portfolio-fg-muted)] sm:text-lg">
              From securing protocols to scaling enterprise-grade POS infrastructure. Precision-built for the
              decentralized era.
            </p>
          </div>

          <ScrollGlassCube scrollYProgress={cubeProgress} />
        </section>

        <TrinityOfExpertiseSection />

        <ProjectVaultSection />

        <WorkshopSection onOpenLead={openLead} />
        <EnterpriseNexusForm onOpenLead={openLead} />
        <CarvedFooter />
      </main>
    </div>
  );
}
