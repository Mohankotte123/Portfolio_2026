"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  visible: boolean;
  onContinue: () => void;
};

const gradientTextStyle = {
  // Ice-silver chrome gradient tuned to the parent dark blue-black palette.
  backgroundImage:
    "linear-gradient(180deg, #D7E2FF 0%, #FFFFFF 28%, #C9D3EA 58%, #8D9BC2 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

const letterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: "blur(10px)",
  },
  show: {
    opacity: 0.8,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function MagneticButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 22, mass: 0.55 });
  const sy = useSpring(my, { stiffness: 220, damping: 22, mass: 0.55 });

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        // Small, heavy-feeling magnet motion.
        mx.set(dx * 0.04);
        my.set(dy * 0.04);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      layout
      className="relative z-[2] inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/50 px-4 py-2 backdrop-blur-md sm:px-6 sm:py-3"
      style={{
        transform: "translateZ(0)",
        x: sx,
        y: sy,
      }}
    >
      <span className="h-px w-8 bg-gradient-to-r from-transparent via-white/35 to-transparent" aria-hidden />
      <span className="font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.22em] text-white/90 sm:text-[12px]">
        {children}
      </span>
      <span className="h-px w-8 bg-gradient-to-l from-transparent via-white/20 to-transparent" aria-hidden />

      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[-1] rounded-full bg-[radial-gradient(circle_at_50%_20%,rgba(120,175,255,0.18),transparent_60%)] opacity-0 transition-opacity duration-200"
        initial={false}
        animate={{ opacity: 1 }}
      />
    </motion.button>
  );
}

function AnimatedLetters({
  text,
  indexToFont,
  trackingEm,
  motionContainerVariants,
}: {
  text: string;
  indexToFont: (index: number) => string;
  trackingEm?: number;
  motionContainerVariants: Variants;
}) {
  const letters = useMemo(() => Array.from(text), [text]);
  const track = trackingEm ?? 0;

  return (
    <motion.span
      layout
      style={{
        display: "inline-block",
        whiteSpace: "pre-wrap",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
        // Note: trackingEm is approximated via spacing on each glyph span for precision.
      }}
      variants={motionContainerVariants}
      initial="hidden"
      animate="show"
    >
      {letters.map((ch, i) => {
        // Use regular spaces so the browser can wrap naturally on mobile.
        const displayCh = ch === " " ? " " : ch;
        const isLast = i === letters.length - 1;
        const fontFamily = indexToFont(i);
        const isMono = fontFamily === "var(--font-geist-mono)";
        return (
          <motion.span
            key={`${ch}-${i}`}
            variants={letterVariants}
            style={{
              ...gradientTextStyle,
              fontFamily,
              fontWeight: isMono ? 800 : 600,
              display: "inline-block",
              marginRight: isLast ? 0 : `${track}em`,
              lineHeight: 1,
            }}
          >
            {displayCh}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

export default function LuxuriousWelcomeReveal({ visible, onContinue }: Props) {
  const monoPrefix = "MK —";
  const serifPart = "THE INTELLIGENT LAYER";
  const primaryText = `${monoPrefix} ${serifPart}`;
  const serifStartIndex = monoPrefix.length + 1;

  const secondaryText = "SECURED SCALABILITY & WEB3 INFRASTRUCTURE";
  const [isNarrow, setIsNarrow] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const continueTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => setIsNarrow(window.innerWidth < 430);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    return () => {
      if (continueTimerRef.current) {
        window.clearTimeout(continueTimerRef.current);
      }
    };
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const staggerContainerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.035,
        delayChildren: 0.12,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {visible ? (
        <motion.div
          key="lux-reveal"
          className="relative z-[2] w-full px-3 py-4 text-center sm:px-4 sm:py-6"
          initial="hidden"
          animate="show"
          exit="exit"
          variants={containerVariants}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          layout
          onAnimationStart={() => {
            setShowContinue(false);
            if (continueTimerRef.current) {
              window.clearTimeout(continueTimerRef.current);
              continueTimerRef.current = null;
            }
          }}
        >
          <LayoutGroup>
            <motion.div
              className="relative mx-auto w-full max-w-[720px]"
              onAnimationComplete={() => {
                if (continueTimerRef.current) {
                  window.clearTimeout(continueTimerRef.current);
                  continueTimerRef.current = null;
                }
                continueTimerRef.current = window.setTimeout(() => {
                  setShowContinue(true);
                }, 1500);
              }}
            >
              {/* Audit Glow (sapphire) */}
              <motion.div
                aria-hidden
                className="absolute left-1/2 top-[54%] z-[-1] h-[90px] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-[20px]"
                style={{
                  filter: "blur(20px)",
                  opacity: 0.1,
                  background:
                    "radial-gradient(circle at 50% 40%, rgba(120,175,255,0.55) 0%, rgba(120,175,255,0.18) 42%, rgba(120,175,255,0.0) 74%)",
                }}
                animate={{ opacity: [0.06, 0.13, 0.06] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              />

              {/* Shimmer sweep */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0"
                style={{ height: "140px", overflow: "hidden" }}
              >
                <motion.div
                  className="absolute left-[-20%] top-0 w-[140%] h-full"
                  initial={{ x: "-60%" }}
                  animate={{ x: "60%" }}
                  transition={{ duration: 1.4, ease: "easeInOut", delay: 0.25 }}
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(155,200,255,0.75) 42%, rgba(120,175,255,0.12) 52%, transparent 100%)",
                    mixBlendMode: "screen",
                    filter: "blur(0.45px)",
                  }}
                />
              </motion.div>

              {/* Primary */}
              <div
                className="mx-auto w-full"
                style={{
                  fontSize: "clamp(22px, 3.1vw, 44px)",
                  lineHeight: 1.05,
                  letterSpacing: "0.02em",
                }}
              >
                <div className="flex flex-wrap items-baseline justify-center gap-x-2">
                  <AnimatedLetters
                    text={primaryText}
                    indexToFont={(idx) =>
                      idx < serifStartIndex
                        ? "var(--font-geist-mono)"
                        : '"Times New Roman", Georgia, serif'
                    }
                    motionContainerVariants={staggerContainerVariants}
                    trackingEm={isNarrow ? 0.015 : 0.02}
                  />
                </div>
              </div>

              {/* Secondary */}
              <div className="mt-3" style={{ fontSize: "clamp(10px, 1.45vw, 14px)" }}>
                <AnimatedLetters
                  text={secondaryText}
                  indexToFont={() => "var(--font-geist-mono)"}
                  motionContainerVariants={staggerContainerVariants}
                  trackingEm={isNarrow ? 0.18 : 0.22}
                />
              </div>

              {/* Signature */}
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="mx-auto h-px w-[78%] bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  style={{ transformOrigin: "center" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                />

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <motion.div
                    initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
                    className="inline-flex items-center rounded-full border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-md"
                  >
                    <span className="font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.18em] text-[#D4DAF0]/85">
                      [ 0x_AUDIT ]
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.62 }}
                    className="inline-flex items-center rounded-full border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-md"
                  >
                    <span className="font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.18em] text-[#D4DAF0]/85">
                      [ SCALE_INFRA ]
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.69 }}
                    className="inline-flex items-center rounded-full border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-md"
                  >
                    <span className="font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.18em] text-[#D4DAF0]/85">
                      [ AI_ENGINEERING ]
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {showContinue ? (
                <motion.div
                  initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 6, filter: "blur(6px)" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-6 flex w-full items-center justify-center"
                >
                  <MagneticButton onClick={onContinue}>
                    Continue to Experience
                  </MagneticButton>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </LayoutGroup>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

