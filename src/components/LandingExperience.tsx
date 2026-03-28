"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import gsap from "gsap";
import { PortfolioContent } from "./PortfolioContent";

const VIDEO_SRC = "/Landing_Page/Landing_Video.mp4";
const TRANSITION_SEC = 2.6;
const VIEWPORT_W = 0.94;
const VIEWPORT_H = 0.86;
const IMPACT_LINES = [
  "Securing protocols with Foundry & Slither",
  "Architecting Enterprise POS Systems & Global Franchises",
  "Bridging Web3 Innovation with Real-World Commerce",
  "Strategic Mentorship for the Decentralized Era",
];

function SpeakerIcon({ muted }: { muted: boolean }) {
  // Simple inline icon to avoid adding new deps.
  return muted ? (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5L7 9H4v6h3l4 4V5z" />
      <path d="M16 9l4 6" />
      <path d="M20 9l-4 6" />
    </svg>
  ) : (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5L7 9H4v6h3l4 4V5z" />
      <path d="M15.5 8.5a5 5 0 010 7" />
      <path d="M18.2 6.2a8 8 0 010 11.6" />
    </svg>
  );
}

function PlayPauseIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 6v12" />
      <path d="M17 6v12" />
    </svg>
  ) : (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 5l12 7-12 7V5z" />
    </svg>
  );
}

function TiltCard({
  category,
  title,
  subtext,
  index,
  imageSrc,
  imageOpacity,
}: {
  category: string;
  title: string;
  subtext: string;
  index: number;
  imageSrc: string;
  imageOpacity: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(my, { stiffness: 180, damping: 20, mass: 0.65 });
  const ry = useSpring(mx, { stiffness: 180, damping: 20, mass: 0.65 });
  const rotateX = useMotionTemplate`${rx}deg`;
  const rotateY = useMotionTemplate`${ry}deg`;
  const [tiltEnabled, setTiltEnabled] = useState(false);
  const themes = [
    {
      border: "rgba(107,114,128,0.45)",
      base: "linear-gradient(160deg, rgba(120,128,145,0.22) 0%, rgba(25,28,36,0.55) 52%, rgba(10,12,18,0.82) 100%)",
      glow:
        "radial-gradient(circle at 18% 18%, rgba(232,236,245,0.34), transparent 46%), radial-gradient(circle at 80% 82%, rgba(148,163,184,0.20), transparent 54%)",
      chip: "text-[#E8ECF5]",
      title: "text-[#EEF2FF]",
      body: "text-[#C7CFDF]",
    },
    {
      border: "rgba(245,158,11,0.45)",
      base: "linear-gradient(160deg, rgba(120,53,15,0.22) 0%, rgba(35,23,15,0.58) 55%, rgba(14,10,8,0.86) 100%)",
      glow:
        "radial-gradient(circle at 22% 20%, rgba(251,191,36,0.30), transparent 48%), radial-gradient(circle at 84% 82%, rgba(245,158,11,0.18), transparent 56%)",
      chip: "text-[#FDE68A]",
      title: "text-[#FFF4D6]",
      body: "text-[#F3D8A5]",
    },
    {
      border: "rgba(20,184,166,0.45)",
      base: "linear-gradient(160deg, rgba(15,118,110,0.22) 0%, rgba(14,35,33,0.60) 56%, rgba(8,16,15,0.86) 100%)",
      glow:
        "radial-gradient(circle at 20% 16%, rgba(45,212,191,0.30), transparent 48%), radial-gradient(circle at 82% 84%, rgba(20,184,166,0.18), transparent 55%)",
      chip: "text-[#99F6E4]",
      title: "text-[#ECFEFF]",
      body: "text-[#B8EDE8]",
    },
  ] as const;
  const theme = themes[index % themes.length];

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    const sync = () => setTiltEnabled(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <div className="group sm:[perspective:1200px]">
    <motion.div
      ref={ref}
      className="relative overflow-hidden rounded-2xl p-5 backdrop-blur-[2px] transition-shadow duration-300 group-hover:shadow-[0_34px_80px_-38px_rgba(0,0,0,0.88)] sm:p-6 sm:backdrop-blur-xl"
      style={{
        transformStyle: "preserve-3d",
        rotateX: tiltEnabled ? rotateX : "0deg",
        rotateY: tiltEnabled ? rotateY : "0deg",
        border: `1px solid ${theme.border}`,
        backgroundImage: theme.base,
        boxShadow:
          "0 22px 48px -34px rgba(0,0,0,0.92), 0 0 0 1px rgba(255,255,255,0.05) inset, 0 10px 28px -20px rgba(255,255,255,0.16)",
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={(e) => {
        if (!tiltEnabled) return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        mx.set((px - 0.5) * 9);
        my.set(-(py - 0.5) * 9);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: imageOpacity,
          filter: "saturate(1.08) contrast(1.02)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(180deg, rgba(4,6,10,0.40) 0%, rgba(6,8,14,0.62) 52%, rgba(6,8,14,0.78) 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -inset-24 z-[3] hidden opacity-60 blur-2xl sm:block"
        style={{ background: theme.glow }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-5 bottom-0 z-[3] hidden h-8 rounded-full opacity-75 blur-xl sm:block"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 50%, rgba(0,0,0,0.55) 0%, transparent 100%)",
          transform: "translateZ(-8px)",
        }}
        aria-hidden
      />
      <div className="relative z-[4] [transform:translateZ(0px)] sm:[transform:translateZ(24px)]">
        <p
          className={`font-[family-name:var(--font-geist-mono)] text-[10px] font-medium tracking-[0.34em] ${theme.chip}`}
          style={{
            textShadow:
              "0 0 1px rgba(0,0,0,0.9), 0 0 10px rgba(124,58,237,0.22), 0 0 14px rgba(255,255,255,0.08)",
            letterSpacing: "0.36em",
          }}
        >
          {category}
        </p>
        <h3
          className={`mt-3 font-[family-name:var(--font-inter)] text-lg font-semibold tracking-wide sm:text-xl ${theme.title}`}
          style={{ textShadow: "0 0 1px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.35)" }}
        >
          {title}
        </h3>
        <p
          className={`mt-2 text-sm font-light leading-relaxed ${theme.body}`}
          style={{ textShadow: "0 0 1px rgba(0,0,0,0.82), 0 0 8px rgba(0,0,0,0.28)" }}
        >
          {subtext}
        </p>
        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" aria-hidden />
      </div>
    </motion.div>
    </div>
  );
}

function BridgeBanner({ onEnter }: { onEnter: () => void }) {
  const [tickerIdx, setTickerIdx] = useState(0);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bx = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.6 });
  const by = useSpring(my, { stiffness: 220, damping: 18, mass: 0.6 });

  useEffect(() => {
    const id = window.setInterval(() => {
      setTickerIdx((i) => (i + 1) % IMPACT_LINES.length);
    }, 2300);
    return () => window.clearInterval(id);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${6 + ((i * 91) % 88)}%`,
        top: `${8 + ((i * 37) % 80)}%`,
        size: 2 + ((i * 3) % 3),
        dur: 4.5 + (i % 4) * 1.2,
        delay: (i % 5) * 0.35,
      })),
    [],
  );

  return (
    <motion.div
      className="fixed inset-0 z-[25] grid place-items-center overflow-hidden px-4 sm:px-8"
      initial={{ opacity: 0, scale: 0.985, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[#07070A]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          background:
            "radial-gradient(1200px 700px at 15% 10%, rgba(17,19,34,0.95) 0%, transparent 58%), radial-gradient(1000px 680px at 85% 20%, rgba(124,58,237,0.20) 0%, transparent 55%), radial-gradient(900px 640px at 50% 90%, rgba(10,14,26,0.95) 0%, transparent 56%)",
        }}
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-cyan-200/45"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              boxShadow: "0 0 10px rgba(125,211,252,0.35)",
            }}
            animate={{ y: [0, -14, 0], opacity: [0.2, 0.65, 0.2] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      <motion.section
        className="relative w-full max-w-[980px] overflow-hidden rounded-3xl border border-white/15 bg-white/[0.04] p-7 backdrop-blur-[40px] sm:p-11"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-16"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(232,236,245,0.00), rgba(232,236,245,0.32), rgba(124,58,237,0.30), rgba(232,236,245,0.00))",
            filter: "blur(24px)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative">
          <motion.p
            className="font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.34em] text-white/55"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Hey Buddy, Welcome!
          </motion.p>

          <motion.h2
            className="mt-4 max-w-3xl font-[family-name:var(--font-inter)] text-[clamp(1.65rem,4.4vw,3.2rem)] font-semibold leading-[1.08] tracking-[0.03em] text-white/92"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Beyond the Code. Into the Infrastructure.
          </motion.h2>

          <motion.p
            className="mt-4 font-[family-name:var(--font-inter)] text-sm tracking-[0.14em] text-white/64 sm:text-base"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Full-Stack Architect & Smart Contract Security Specialist.
          </motion.p>

          <motion.div
            className="mt-7 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 sm:px-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <p className="font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.3em] text-white/50">
              IMPACT
            </p>
            <div className="mt-2 min-h-[1.7rem] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={tickerIdx}
                  className="text-sm font-light tracking-[0.03em] text-white/78 sm:text-base"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.38, ease: "easeOut" }}
                >
                  {IMPACT_LINES[tickerIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.button
            ref={btnRef}
            type="button"
            onMouseMove={(e) => {
              const b = btnRef.current;
              if (!b) return;
              const r = b.getBoundingClientRect();
              const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
              const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
              mx.set(dx * 12);
              my.set(dy * 10);
            }}
            onMouseLeave={() => {
              mx.set(0);
              my.set(0);
            }}
            onClick={onEnter}
            className="relative mt-8 inline-flex items-center rounded-full px-8 py-4 font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.24em] text-white/92"
            style={{
              x: bx,
              y: by,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 40%, rgba(124,58,237,0.22) 100%)",
              boxShadow:
                "0 0 0 1px rgba(232,236,245,0.35) inset, 0 20px 52px -30px rgba(124,58,237,0.64)",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.985 }}
          >
            Explore More
          </motion.button>
        </div>
      </motion.section>
    </motion.div>
  );
}

export function LandingExperience() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const landingScrollRef = useRef<HTMLDivElement>(null);
  const exitStartedRef = useRef(false);
  const revealPortfolioRef = useRef(false);

  const [revealPortfolio, setRevealPortfolio] = useState(false);
  const [showBridge, setShowBridge] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [intrinsic, setIntrinsic] = useState<{ w: number; h: number } | null>(null);
  const [recessSize, setRecessSize] = useState<{ w: number; h: number }>({
    w: 320,
    h: 180,
  });
  const markerX = useMotionValue(0);
  const markerY = useMotionValue(0);
  const markerSX = useSpring(markerX, { stiffness: 120, damping: 18, mass: 0.7 });
  const markerSY = useSpring(markerY, { stiffness: 120, damping: 18, mass: 0.7 });

  const attachVideoRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
  }, []);

  const scrollMainToTop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    landingScrollRef.current?.scrollTo(0, 0);
  }, []);

  const beginReveal = useCallback((fast?: boolean) => {
    if (exitStartedRef.current) return;
    exitStartedRef.current = true;

    const v = videoRef.current;
    if (v) {
      const startVol = typeof v.volume === "number" ? v.volume : 1;
      const fadeDur = fast ? 0.38 : 0.7;
      if (startVol > 0.01 && !Number.isNaN(startVol)) {
        gsap.to(v, {
          volume: 0,
          duration: fadeDur,
          ease: "power2.inOut",
          onComplete: () => {
            try {
              v.pause();
            } catch {
              // noop
            }
            setShowBridge(true);
          },
        });
      } else {
        v.pause();
        setShowBridge(true);
      }
    } else {
      setShowBridge(true);
    }
  }, []);

  const toggleSound = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const nextMuted = !v.muted;
    v.muted = nextMuted;
    if (!nextMuted) {
      v.volume = 1;
      void v.play().catch(() => {
        // If autoplay with sound is blocked, keep UI consistent with actual state.
        v.muted = true;
        setIsMuted(true);
      });
    }
    setIsMuted(nextMuted);
  }, []);

  const togglePlayPause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  }, []);

  useEffect(() => {
    revealPortfolioRef.current = revealPortfolio;
  }, [revealPortfolio]);

  useEffect(() => {
    if (!revealPortfolio) return;
    scrollMainToTop();
  }, [revealPortfolio, scrollMainToTop]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const sync = () => setIsPlaying(!v.paused);
    sync();
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    v.addEventListener("ended", sync);
    const play = () => {
      v.volume = 1;
      v.muted = false;
      setIsMuted(false);
      void v.play().catch(() => {
        v.volume = 1;
        v.muted = true;
        setIsMuted(true);
        sync();
        void v.play().catch(() => beginReveal(true));
      });
    };
    if (v.readyState >= 2) play();
    else v.addEventListener("canplay", play, { once: true });
    return () => {
      v.removeEventListener("canplay", play);
      v.removeEventListener("play", sync);
      v.removeEventListener("pause", sync);
      v.removeEventListener("ended", sync);
    };
  }, [beginReveal]);

  useEffect(() => {
    // Sound is controlled explicitly via the speaker toggle.
    // (We intentionally avoid a global "tap anywhere to unmute" handler,
    // because it can conflict with the toggle click on some browsers.)
    return;
  }, [isMuted, revealPortfolio]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      markerX.set(-dx * 10);
      markerY.set(-dy * 8);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [markerX, markerY]);

  useEffect(() => {
    const fit = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isDesktop = vw >= 1024;
      const capW = vw * (isDesktop ? 0.78 : VIEWPORT_W);
      const capH = vh * (isDesktop ? 0.58 : VIEWPORT_H);

      if (intrinsic) {
        const maxW = Math.min(capW, intrinsic.w);
        const maxH = Math.min(capH, intrinsic.h);
        const scale = Math.min(maxW / intrinsic.w, maxH / intrinsic.h, 1);
        setRecessSize({
          w: Math.max(1, Math.round(intrinsic.w * scale * 100) / 100),
          h: Math.max(1, Math.round(intrinsic.h * scale * 100) / 100),
        });
        return;
      }

      const w = capW;
      const hFromW = (w * 9) / 16;
      if (hFromW <= capH) setRecessSize({ w, h: hFromW });
      else setRecessSize({ w: (capH * 16) / 9, h: capH });
    };

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [intrinsic]);

  const recessStyle: CSSProperties = {
    width: recessSize.w,
    height: recessSize.h,
  };

  const meshBg = useMemo(
    () => ({
      backgroundImage: [
        "radial-gradient(1200px 800px at 15% 10%, rgba(17,19,34,0.95) 0%, transparent 60%)",
        "radial-gradient(1000px 700px at 85% 25%, rgba(124,58,237,0.20) 0%, transparent 55%)",
        "radial-gradient(900px 700px at 50% 85%, rgba(10,14,26,0.95) 0%, transparent 58%)",
        "linear-gradient(180deg, rgba(7,7,10,1) 0%, rgba(7,7,10,1) 40%, rgba(4,4,6,1) 100%)",
      ].join(","),
    }),
    [],
  );

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#07070A]">
      <motion.div
        className={`relative min-h-[100dvh] w-full bg-[var(--mk-portfolio-base)] ${
          revealPortfolio ? "z-30" : "z-0"
        }`}
        initial={false}
        animate={{ opacity: revealPortfolio ? 1 : 0 }}
        transition={{ duration: TRANSITION_SEC, ease: [0.45, 0, 0.15, 1] }}
        style={{ pointerEvents: revealPortfolio ? "auto" : "none" }}
        aria-hidden={!revealPortfolio}
      >
        <PortfolioContent />
      </motion.div>

      {!revealPortfolio ? (
      <motion.div
        ref={landingScrollRef}
        className="fixed inset-0 z-20 overflow-y-auto overscroll-contain"
        initial={false}
        style={{
          pointerEvents: showBridge ? "none" : "auto",
        }}
        animate={{
          opacity: showBridge ? 0 : 1,
        }}
        transition={{ duration: TRANSITION_SEC, ease: [0.45, 0, 0.15, 1] }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={meshBg}
          initial={false}
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
        />

        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        </div>

        {/* Cinematic light fall (title + video area) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[6] h-[56vh]"
          initial={false}
          animate={{ opacity: [0.68, 0.86, 0.68] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className="absolute inset-x-[2%] top-0 h-full"
            style={{
              background: [
                "radial-gradient(ellipse 22% 65% at 7% 10%, rgba(72,226,255,0.62) 0%, rgba(72,226,255,0.24) 26%, transparent 64%)",
                "radial-gradient(ellipse 24% 72% at 26% 6%, rgba(72,226,255,0.66) 0%, rgba(72,226,255,0.26) 28%, transparent 66%)",
                "radial-gradient(ellipse 26% 76% at 49% 4%, rgba(72,226,255,0.72) 0%, rgba(72,226,255,0.30) 30%, transparent 67%)",
                "radial-gradient(ellipse 24% 72% at 71% 6%, rgba(72,226,255,0.66) 0%, rgba(72,226,255,0.26) 28%, transparent 66%)",
                "radial-gradient(ellipse 22% 65% at 93% 10%, rgba(72,226,255,0.60) 0%, rgba(72,226,255,0.24) 26%, transparent 64%)",
              ].join(", "),
              filter: "blur(10px)",
            }}
          />
          <div
            className="absolute inset-x-[8%] top-[3%] h-full opacity-70"
            style={{
              background:
                "linear-gradient(180deg, rgba(92,236,255,0.20) 0%, rgba(92,236,255,0.11) 34%, rgba(92,236,255,0.03) 62%, transparent 100%)",
              maskImage:
                "radial-gradient(120% 90% at 50% 0%, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.65) 48%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(120% 90% at 50% 0%, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.65) 48%, transparent 100%)",
            }}
          />
        </motion.div>

        <div className="relative z-[10] mx-auto flex min-h-[100dvh] w-full max-w-[1140px] flex-col px-4 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-10">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <p
              className="font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.3em] text-transparent sm:text-[11px]"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(214,224,248,0.86) 58%, rgba(138,157,214,0.78) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                textShadow: "0 0 14px rgba(124,58,237,0.28)",
              }}
            >
              PERSONAL BLOG
            </p>
            <motion.div
              className="relative mx-auto overflow-hidden rounded-full border border-white/15 bg-white/[0.08] px-3 py-2 backdrop-blur-[20px] sm:px-5"
              style={{ x: markerSX, y: markerSY }}
            >
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 w-1/3"
                style={{
                  background:
                    "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.34) 50%, transparent 100%)",
                }}
                animate={{ x: ["-130%", "240%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative flex items-center gap-3 sm:gap-4">
                <span
                  className="hidden text-[10px] font-normal tracking-[0.3em] text-transparent sm:inline"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(219,229,249,0.88) 64%, rgba(164,183,230,0.72) 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    textShadow: "0 0 12px rgba(124,58,237,0.22)",
                  }}
                >
                  ENTERPRISE UTILITY
                </span>
                <div className="relative grid h-6 w-6 place-items-center sm:h-7 sm:w-7">
                  <motion.div
                    className="absolute h-4 w-4 border border-white/70"
                    style={{
                      transformStyle: "preserve-3d",
                      boxShadow: "0 0 14px rgba(124,58,237,0.45)",
                    }}
                    animate={{ rotate: [45, 405], rotateY: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute h-3.5 w-3.5 border border-[#c9d0e8]/65"
                    style={{ boxShadow: "0 0 10px rgba(124,58,237,0.35)" }}
                    animate={{ rotate: [0, -360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <span
                  className="hidden text-[10px] font-normal tracking-[0.3em] text-transparent sm:inline"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(219,229,249,0.88) 64%, rgba(164,183,230,0.72) 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    textShadow: "0 0 12px rgba(124,58,237,0.22)",
                  }}
                >
                  PRODUCTION READY
                </span>
              </div>
            </motion.div>
            <p
              className="text-right font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.24em] text-transparent sm:text-[11px]"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(214,224,248,0.86) 58%, rgba(138,157,214,0.78) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                textShadow: "0 0 14px rgba(124,58,237,0.26)",
              }}
            >
              COLLECTION 2026
            </p>
          </div>

          <div className="relative mx-auto mt-10 w-full max-w-4xl sm:mt-8">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -top-8 left-1/2 h-16 w-[72%] -translate-x-1/2 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,0.22) 0%, rgba(232,236,245,0.10) 42%, transparent 74%)",
              }}
              initial={false}
              animate={{ opacity: [0.5, 0.9, 0.5], x: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-3 mx-auto h-10 w-[86%] rounded-full blur-xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.12) 52%, transparent 82%)",
              }}
            />
            <p
              className="relative text-center font-[family-name:var(--font-cormorant)] text-[clamp(1.6rem,5.4vw,2.75rem)] font-semibold leading-[1.14] tracking-[0.02em] text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(232,236,245,0.9) 40%, rgba(185,194,214,0.76) 72%, rgba(124,58,237,0.72) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                filter: "drop-shadow(0 10px 22px rgba(124,58,237,0.18))",
              }}
            >
              Merging Hardened Blockchain Architecture With Rigorous Auditing.
            </p>
          </div>

          <div className="mt-12 flex items-start justify-center sm:mt-10">
            <div className="mx-auto w-fit max-w-full">
              <div className="relative" style={recessStyle}>
                <div
                  className="pointer-events-none absolute -inset-10 -z-10 rounded-[2rem] opacity-90 blur-2xl"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.28) 0%, transparent 55%)",
                  }}
                  aria-hidden
                />

                <div className="group relative h-full w-full rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-[10px] backdrop-blur-xl">
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[1.35rem]"
                    style={{
                      boxShadow:
                        "0 0 0 1px rgba(232,236,245,0.22) inset, 0 26px 80px -35px rgba(124,58,237,0.35)",
                    }}
                    aria-hidden
                  />

                  <div
                    className="relative h-full w-full overflow-hidden rounded-[1.05rem] bg-black"
                    onPointerDown={(e) => {
                      const t = e.target as HTMLElement | null;
                      if (t?.closest("button")) return;
                      togglePlayPause();
                    }}
                  >
                    <video
                      ref={attachVideoRef}
                      className="h-full w-full object-contain"
                      autoPlay
                      muted={isMuted}
                      playsInline
                      preload="auto"
                      src={VIDEO_SRC}
                      onLoadedMetadata={(e) => {
                        const v = e.currentTarget;
                        if (v.videoWidth && v.videoHeight) {
                          setIntrinsic({ w: v.videoWidth, h: v.videoHeight });
                        }
                      }}
                      onEnded={() => beginReveal(false)}
                      onError={() => beginReveal(true)}
                    />

                    <button
                      type="button"
                      onClick={togglePlayPause}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="pointer-events-auto absolute left-3 top-3 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/35 text-white/85 backdrop-blur-md hover:bg-black/55 sm:left-4 sm:top-4"
                      aria-label={isPlaying ? "Pause intro" : "Play intro"}
                    >
                      <PlayPauseIcon playing={isPlaying} />
                    </button>

                    <button
                      type="button"
                      onClick={toggleSound}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="pointer-events-auto absolute right-3 top-3 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/35 text-white/85 backdrop-blur-md hover:bg-black/55 sm:right-4 sm:top-4"
                      aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
                    >
                      <SpeakerIcon muted={isMuted} />
                    </button>

                    {/* Minimal controls removed (dedicated buttons + tap-to-toggle). */}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center sm:mt-7">
                <motion.button
                  type="button"
                  onClick={() => beginReveal(true)}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3 font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.24em] text-white/90 sm:px-8 sm:py-3.5 sm:text-[11px]"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 42%, rgba(124,58,237,0.16) 100%)",
                    boxShadow:
                      "0 0 0 1px rgba(232,236,245,0.34) inset, 0 20px 46px -28px rgba(124,58,237,0.62), 0 8px 30px -20px rgba(255,255,255,0.35)",
                  }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <span
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.28) 48%, transparent 72%)",
                    }}
                    aria-hidden
                  />
                  <span className="relative">SKIP INTRO</span>
                </motion.button>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5">
            <TiltCard
              index={0}
              category="Engineering"
              title="Blockchain Architecture"
              subtext="Specialist in Solidity and Web3 development, crafting high-performance and scalable dApps."
              imageSrc="/Landing_Page/BlockchainArchCard.jpg"
              imageOpacity={0.36}
            />
            <TiltCard
              index={1}
              category="Security"
              title="Security Auditing & QA"
              subtext="Comprehensive protocol testing and vulnerability research, 50+ audits completed with a focus on bulletproof logic"
              imageSrc="/Landing_Page/SecurityAuditCard.jpg"
              imageOpacity={0.34}
            />
            <TiltCard
              index={2}
              category="Expertise Delivery"
              title="Technical Mentor & Speaker"
              subtext="Led specialized Full-Stack development programs for 500+ developers. Delivered expert sessions on Blockchain development"
              imageSrc="/Landing_Page/ExpSessionCard.jpg"
              imageOpacity={0.33}
            />
          </div>

    
        </div>
      </motion.div>
      ) : null}

      <AnimatePresence>
        {showBridge && !revealPortfolio ? (
          <BridgeBanner
            onEnter={() => {
              revealPortfolioRef.current = true;
              setShowBridge(false);
              setRevealPortfolio(true);
              scrollMainToTop();
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
