"use client";

import {
  Suspense,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CSSProperties, MutableRefObject, PointerEvent } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { PortfolioContent } from "./PortfolioContent";
import {
  MkLuxuryLandingCanvas,
  type LandingPointerPayload,
  type LuxuryLandingPhase,
} from "./MkLuxuryLandingCanvas";

const VIDEO_SRC = "/Landing_Page/Landing_Video.mp4";
const TRANSITION_SEC = 2.6;
const WHITEOUT_AT_SEC = 9.5;
const VIEWPORT_W = 0.92;
const VIEWPORT_H = 0.82;

function CornerHud({
  position,
  delay,
}: {
  position: "tl" | "tr" | "bl" | "br";
  delay: number;
}) {
  const edge =
    position === "tl"
      ? "left-5 top-5 sm:left-8 sm:top-8"
      : position === "tr"
        ? "right-5 top-5 sm:right-8 sm:top-8"
        : position === "bl"
          ? "bottom-5 left-5 sm:bottom-8 sm:left-8"
          : "bottom-5 right-5 sm:bottom-8 sm:right-8";

  const hBar =
    position === "tl" || position === "bl"
      ? "left-0 bg-gradient-to-r"
      : "right-0 bg-gradient-to-l";
  const vBar =
    position === "tl" || position === "tr"
      ? "top-0 bg-gradient-to-b"
      : "bottom-0 bg-gradient-to-t";

  return (
    <motion.div
      className={`pointer-events-none absolute z-[25] ${edge} h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`absolute ${hBar} top-0 h-[0.5px] w-10 from-[#d4d8e0] to-transparent sm:w-12`}
        aria-hidden
      />
      <div
        className={`absolute ${vBar} left-0 h-10 w-[0.5px] from-[#d4d8e0] to-transparent sm:h-12`}
        aria-hidden
      />
    </motion.div>
  );
}

function VideoSceneBridge({
  videoPromise,
  phase,
  pointerRef,
}: {
  videoPromise: Promise<HTMLVideoElement>;
  phase: LuxuryLandingPhase;
  pointerRef: MutableRefObject<LandingPointerPayload>;
}) {
  const video = use(videoPromise);
  return (
    <MkLuxuryLandingCanvas
      video={video}
      phase={phase}
      pointerRef={pointerRef}
      className="pointer-events-none absolute inset-0 z-[12] h-full w-full [&_canvas]:pointer-events-auto"
    />
  );
}

export function LandingExperience() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const whiteCoreRef = useRef<HTMLDivElement>(null);
  const exitStartedRef = useRef(false);
  const revealPortfolioRef = useRef(false);

  const resolveVideoRef = useRef<((el: HTMLVideoElement) => void) | null>(null);
  const videoPromise = useMemo(
    () =>
      new Promise<HTMLVideoElement>((resolve) => {
        resolveVideoRef.current = resolve;
      }),
    [],
  );

  const [revealPortfolio, setRevealPortfolio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [luxuryPhase, setLuxuryPhase] = useState<LuxuryLandingPhase>("intro");
  const [cursor, setCursor] = useState({ x: 0, y: 0, on: false });

  const pointerRef = useRef<LandingPointerPayload>({
    nx: 0,
    ny: 0,
    inLogo: false,
  });

  const [intrinsic, setIntrinsic] = useState<{ w: number; h: number } | null>(
    null,
  );
  const [recessSize, setRecessSize] = useState<{ w: number; h: number }>({
    w: 320,
    h: 180,
  });

  const attachVideoRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (!el || !resolveVideoRef.current) return;
    const resolve = resolveVideoRef.current;
    resolveVideoRef.current = null;
    const ready = () => resolve(el);
    if (el.readyState >= 2) ready();
    else {
      el.addEventListener("loadeddata", ready, { once: true });
      el.addEventListener("error", ready, { once: true });
    }
  }, []);

  const beginReveal = useCallback(
    (fast?: boolean) => {
      if (exitStartedRef.current) return;
      exitStartedRef.current = true;
      videoRef.current?.pause();
      setLuxuryPhase("shatter");
      const core = whiteCoreRef.current;
      if (core) {
        gsap.fromTo(
          core,
          { scale: 0, opacity: 0 },
          {
            scale: 3.2,
            opacity: 1,
            duration: fast ? 0.5 : 0.92,
            ease: "power2.in",
            onComplete: () => {
              revealPortfolioRef.current = true;
              setRevealPortfolio(true);
            },
          },
        );
      } else {
        revealPortfolioRef.current = true;
        setRevealPortfolio(true);
      }
    },
    [],
  );

  revealPortfolioRef.current = revealPortfolio;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const play = () => {
      v.volume = 1;
      v.muted = false;
      setIsMuted(false);
      void v.play().catch(() => {
        v.volume = 1;
        v.muted = true;
        setIsMuted(true);
        void v.play().catch(() => {
          beginReveal(true);
        });
      });
    };
    if (v.readyState >= 2) play();
    else v.addEventListener("canplay", play, { once: true });
    return () => v.removeEventListener("canplay", play);
  }, [beginReveal]);

  useEffect(() => {
    if (!isMuted || revealPortfolio) return;
    const unlock = () => {
      if (revealPortfolioRef.current) return;
      const el = videoRef.current;
      if (!el) return;
      el.volume = 1;
      el.muted = false;
      setIsMuted(false);
      void el.play().catch(() => {});
    };
    window.addEventListener("pointerdown", unlock, true);
    return () => window.removeEventListener("pointerdown", unlock, true);
  }, [isMuted, revealPortfolio]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      if (exitStartedRef.current || revealPortfolioRef.current) return;
      if (v.currentTime >= WHITEOUT_AT_SEC) beginReveal(false);
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [beginReveal, revealPortfolio]);

  useEffect(() => {
    const fit = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const capW = vw * VIEWPORT_W;
      const capH = vh * VIEWPORT_H;

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
      if (hFromW <= capH) {
        setRecessSize({ w, h: hFromW });
      } else {
        setRecessSize({ w: (capH * 16) / 9, h: capH });
      }
    };

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [intrinsic]);

  const recessStyle: CSSProperties = {
    width: recessSize.w,
    height: recessSize.h,
  };

  const onLandingPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      pointerRef.current.nx = (e.clientX / w) * 2 - 1;
      pointerRef.current.ny = -((e.clientY / h) * 2 - 1);
      setCursor({ x: e.clientX, y: e.clientY, on: true });
    },
    [],
  );

  const onLandingPointerLeave = useCallback(() => {
    setCursor((c) => ({ ...c, on: false }));
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#0A0A0B]">
      <motion.div
        className="relative z-0 min-h-[100dvh]"
        initial={false}
        animate={{ opacity: revealPortfolio ? 1 : 0 }}
        transition={{
          duration: TRANSITION_SEC,
          ease: [0.45, 0, 0.15, 1],
        }}
        style={{ pointerEvents: revealPortfolio ? "auto" : "none" }}
        aria-hidden={!revealPortfolio}
      >
        <PortfolioContent />
      </motion.div>

      <motion.div
        className="fixed inset-0 z-20 flex items-center justify-center px-3 py-12 sm:px-6 sm:py-16"
        initial={false}
        animate={{
          opacity: revealPortfolio ? 0 : 1,
          pointerEvents: revealPortfolio ? "none" : "auto",
        }}
        transition={{
          duration: TRANSITION_SEC,
          ease: [0.45, 0, 0.15, 1],
        }}
        onPointerMove={onLandingPointerMove}
        onPointerLeave={onLandingPointerLeave}
        style={{ cursor: revealPortfolio ? "auto" : "none" }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[#0A0A0B]" />
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 42%, rgba(255,255,255,0.07) 0%, transparent 62%)",
            }}
          />
        </div>

        <Suspense fallback={null}>
          <VideoSceneBridge
            videoPromise={videoPromise}
            phase={luxuryPhase}
            pointerRef={pointerRef}
          />
        </Suspense>

        <CornerHud position="tl" delay={0.15} />
        <CornerHud position="tr" delay={0.22} />
        <CornerHud position="bl" delay={0.29} />
        <CornerHud position="br" delay={0.36} />

        <div className="pointer-events-none absolute left-0 right-0 top-6 z-[26] flex flex-col items-center gap-1 px-4 text-center sm:top-8">
          <motion.p
            className="font-[family-name:var(--font-geist-mono)] text-[10px] font-medium uppercase tracking-[0.42em] text-[#9aa3b2]/90 sm:text-[11px]"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9 }}
          >
            MK // LUXURY_GATE // v1.0
          </motion.p>
          <motion.h1
            className="font-[family-name:var(--font-cormorant)] text-3xl font-semibold tracking-[0.28em] text-[#f2f4f8] sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 1 }}
          >
            MK
          </motion.h1>
        </div>

        {!revealPortfolio && cursor.on ? (
          <div
            className="pointer-events-none fixed z-[40] h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: cursor.x,
              top: cursor.y,
              background:
                "radial-gradient(circle, rgba(0,255,65,0.45) 0%, rgba(0,255,65,0.08) 55%, transparent 72%)",
              boxShadow:
                "0 0 28px rgba(0,255,65,0.35), 0 0 64px rgba(0,255,65,0.12)",
            }}
            aria-hidden
          />
        ) : null}

        <div
          className="pointer-events-none fixed inset-0 z-[34] flex items-center justify-center"
          aria-hidden
        >
          <div
            ref={whiteCoreRef}
            className="origin-center rounded-full bg-white"
            style={{
              width: "min(140vw, 140vh)",
              height: "min(140vw, 140vh)",
              transform: "scale(0)",
              opacity: 0,
            }}
          />
        </div>

        <figure className="relative z-10 mx-auto w-fit max-w-full transform-gpu shadow-[0_40px_100px_-24px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.05)_inset]">
          <div className="rounded-[1.1rem] bg-gradient-to-b from-[#2e323c] via-[#1c1e24] to-[#121318] p-[7px] sm:rounded-[1.35rem] sm:p-2">
            <div
              className="relative overflow-hidden rounded-lg bg-[#020203] ring-1 ring-white/[0.06] sm:rounded-xl"
              style={recessStyle}
            >
              <div
                className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),inset_0_18px_40px_-12px_rgba(255,255,255,0.03)]"
                aria-hidden
              />
              <video
                ref={attachVideoRef}
                className="relative z-0 h-full w-full [backface-visibility:hidden] [transform:translate3d(0,0,0)] object-contain contrast-[1.06] saturate-[1.05] brightness-[1.02]"
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
            </div>
          </div>
          <figcaption className="sr-only">Intro reel</figcaption>
        </figure>

        <motion.p
          className="pointer-events-none absolute bottom-24 left-0 right-0 z-[26] px-4 text-center font-[family-name:var(--font-geist-mono)] text-[10px] tabular-nums tracking-[0.2em] text-[#7d8696] sm:bottom-28 sm:text-[11px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          ENV_MAP: LIVE // T_MINUS: {WHITEOUT_AT_SEC.toFixed(1)}S
        </motion.p>

        <button
          type="button"
          onClick={() => beginReveal(true)}
          className="pointer-events-auto absolute right-3 top-4 z-[28] rounded-full border border-white/15 bg-black/55 px-4 py-2 font-[family-name:var(--font-geist-mono)] text-[10px] font-medium tracking-[0.18em] text-white/90 backdrop-blur-md transition-colors hover:bg-black/70 sm:right-6 sm:top-6 sm:text-xs"
        >
          Skip intro
        </button>

        {isMuted ? (
          <p className="pointer-events-none absolute bottom-5 left-0 right-0 z-10 px-4 text-center font-[family-name:var(--font-geist-mono)] text-[10px] font-normal tracking-wide text-white/45 sm:bottom-8 sm:text-xs">
            Tap anywhere for audio
          </p>
        ) : null}
      </motion.div>
    </div>
  );
}
