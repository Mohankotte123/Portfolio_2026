"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useEffect, useId, useState, type ReactNode } from "react";
import type { LeadServiceType } from "@/constants/leadServiceTypes";

const glassInput =
  "w-full rounded-xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white/92 outline-none backdrop-blur-xl transition-[border-color,box-shadow] duration-200 placeholder:text-white/35 focus:border-violet-400/70 focus:shadow-[0_0_0_1px_rgba(167,139,250,0.45),0_0_24px_rgba(124,58,237,0.28)] focus:ring-2 focus:ring-violet-500/35";

const glassLabel = "mb-1.5 block font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.2em] text-violet-200/75";

function LeadSubmitSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 [perspective:240px]">
      <div className="relative h-14 w-14 [transform-style:preserve-3d]">
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-violet-400/60"
          animate={{ rotateY: 360, rotateX: 18 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
        />
        <motion.div
          className="absolute inset-[6px] rounded-lg border-2 border-amber-400/45"
          animate={{ rotateY: -360, rotateX: -12 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
        />
        <motion.div
          className="absolute inset-[12px] rounded-md border border-sky-400/40"
          animate={{ rotateX: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
        />
      </div>
      <p className="font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.28em] text-white/50">
        SECURE UPLINK…
      </p>
    </div>
  );
}

function ModalShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      className="relative z-[10] mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-white/12 bg-zinc-950/90 shadow-[0_0_80px_-20px_rgba(124,58,237,0.45)] backdrop-blur-2xl sm:mx-0"
      initial={{ opacity: 0, scale: 0.94, rotateX: 8 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] px-5 py-4 sm:px-6">
        <h2 id="lead-modal-title" className="font-[family-name:var(--font-syne)] text-lg font-bold uppercase tracking-tight text-white">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-white/15 p-2 text-white/60 transition hover:border-violet-400/40 hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="max-h-[min(78dvh,640px)] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">{children}</div>
    </motion.div>
  );
}

export default function ContactLeadModal({
  open,
  serviceType,
  onClose,
}: {
  open: boolean;
  serviceType: LeadServiceType | null;
  onClose: () => void;
}) {
  const formId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const reset = useCallback(() => {
    setName("");
    setEmail("");
    setOrganization("");
    setMessage("");
    setError(null);
    setDone(false);
    setSubmitting(false);
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const title =
    serviceType === "INFRASTRUCTURE"
      ? "Infrastructure quote"
      : serviceType === "EXPERT_SESSIONS"
        ? "Expert sessions"
        : "Full-stack inquiry";

  const [infra, setInfra] = useState({
    projectScale: "Single" as "Single" | "Franchise",
    currentBillingTech: "",
    requiredTimeline: "",
    budgetBracket: "",
  });
  const [expert, setExpert] = useState({
    targetFocus: "Security" as "Security" | "Full-Stack",
    experienceLevel: "",
    numberOfSessions: "",
    specificGoal: "",
  });
  const [fullstack, setFullstack] = useState({
    platformType: "",
    techStack: "",
    briefProjectScope: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceType) return;
    setError(null);
    setSubmitting(true);
    let requirements: Record<string, unknown> = {};
    if (serviceType === "INFRASTRUCTURE") {
      requirements = { ...infra };
    } else if (serviceType === "EXPERT_SESSIONS") {
      requirements = { ...expert };
    } else {
      requirements = { ...fullstack };
    }
    try {
      const res = await fetch("/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          organization,
          serviceType,
          requirements,
          message,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Request failed.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && serviceType ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(ev) => {
            if (ev.target === ev.currentTarget) onClose();
          }}
        >
          <ModalShell title={title} onClose={onClose}>
            {done ? (
              <div className="py-8 text-center">
                <p className="font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.3em] text-emerald-400/85">
                  UPLINK SECURE
                </p>
                <p className="mt-3 font-[family-name:var(--font-inter)] text-white/90">Received. You&apos;ll hear back shortly.</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 rounded-xl border border-white/20 px-5 py-2 text-sm text-white/80 hover:bg-white/5"
                >
                  Close
                </button>
              </div>
            ) : submitting ? (
              <LeadSubmitSpinner />
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label htmlFor={`${formId}-name`} className={glassLabel}>
                    NAME
                  </label>
                  <input
                    id={`${formId}-name`}
                    className={glassInput}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-email`} className={glassLabel}>
                    EMAIL
                  </label>
                  <input
                    id={`${formId}-email`}
                    type="email"
                    className={glassInput}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-org`} className={glassLabel}>
                    ORGANIZATION
                  </label>
                  <input
                    id={`${formId}-org`}
                    className={glassInput}
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    autoComplete="organization"
                    required
                  />
                </div>

                {serviceType === "INFRASTRUCTURE" ? (
                  <>
                    <div>
                      <span className={glassLabel}>PROJECT SCALE</span>
                      <div className="mt-2 flex gap-3">
                        {(["Single", "Franchise"] as const).map((v) => (
                          <label
                            key={v}
                            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition ${
                              infra.projectScale === v
                                ? "border-violet-400/55 bg-violet-500/15 text-white"
                                : "border-white/12 bg-white/[0.04] text-white/65"
                            }`}
                          >
                            <input
                              type="radio"
                              name="projectScale"
                              className="sr-only"
                              checked={infra.projectScale === v}
                              onChange={() => setInfra((s) => ({ ...s, projectScale: v }))}
                            />
                            {v}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={glassLabel} htmlFor={`${formId}-bill`}>
                        CURRENT BILLING TECH
                      </label>
                      <input
                        id={`${formId}-bill`}
                        className={glassInput}
                        value={infra.currentBillingTech}
                        onChange={(e) => setInfra((s) => ({ ...s, currentBillingTech: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className={glassLabel} htmlFor={`${formId}-time`}>
                        REQUIRED TIMELINE
                      </label>
                      <input
                        id={`${formId}-time`}
                        className={glassInput}
                        value={infra.requiredTimeline}
                        onChange={(e) => setInfra((s) => ({ ...s, requiredTimeline: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className={glassLabel} htmlFor={`${formId}-budget`}>
                        BUDGET BRACKET
                      </label>
                      <input
                        id={`${formId}-budget`}
                        className={glassInput}
                        value={infra.budgetBracket}
                        onChange={(e) => setInfra((s) => ({ ...s, budgetBracket: e.target.value }))}
                        required
                      />
                    </div>
                  </>
                ) : null}

                {serviceType === "EXPERT_SESSIONS" ? (
                  <>
                    <div>
                      <span className={glassLabel}>TARGET FOCUS</span>
                      <div className="mt-2 flex flex-wrap gap-3">
                        {(["Security", "Full-Stack"] as const).map((v) => (
                          <label
                            key={v}
                            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition ${
                              expert.targetFocus === v
                                ? "border-violet-400/55 bg-violet-500/15 text-white"
                                : "border-white/12 bg-white/[0.04] text-white/65"
                            }`}
                          >
                            <input
                              type="radio"
                              name="targetFocus"
                              className="sr-only"
                              checked={expert.targetFocus === v}
                              onChange={() => setExpert((s) => ({ ...s, targetFocus: v }))}
                            />
                            {v}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={glassLabel} htmlFor={`${formId}-exp`}>
                        EXPERIENCE LEVEL
                      </label>
                      <input
                        id={`${formId}-exp`}
                        className={glassInput}
                        value={expert.experienceLevel}
                        onChange={(e) => setExpert((s) => ({ ...s, experienceLevel: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className={glassLabel} htmlFor={`${formId}-sessions`}>
                        NUMBER OF SESSIONS
                      </label>
                      <input
                        id={`${formId}-sessions`}
                        className={glassInput}
                        value={expert.numberOfSessions}
                        onChange={(e) => setExpert((s) => ({ ...s, numberOfSessions: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className={glassLabel} htmlFor={`${formId}-goal`}>
                        SPECIFIC GOAL
                      </label>
                      <textarea
                        id={`${formId}-goal`}
                        className={`${glassInput} min-h-[88px] resize-y`}
                        value={expert.specificGoal}
                        onChange={(e) => setExpert((s) => ({ ...s, specificGoal: e.target.value }))}
                        required
                        rows={3}
                      />
                    </div>
                  </>
                ) : null}

                {serviceType === "GENERAL_FULL_STACK" ? (
                  <>
                    <div>
                      <label className={glassLabel} htmlFor={`${formId}-plat`}>
                        PLATFORM TYPE
                      </label>
                      <input
                        id={`${formId}-plat`}
                        className={glassInput}
                        value={fullstack.platformType}
                        onChange={(e) => setFullstack((s) => ({ ...s, platformType: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className={glassLabel} htmlFor={`${formId}-stack`}>
                        TECH STACK
                      </label>
                      <input
                        id={`${formId}-stack`}
                        className={glassInput}
                        value={fullstack.techStack}
                        onChange={(e) => setFullstack((s) => ({ ...s, techStack: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className={glassLabel} htmlFor={`${formId}-scope`}>
                        BRIEF PROJECT SCOPE
                      </label>
                      <textarea
                        id={`${formId}-scope`}
                        className={`${glassInput} min-h-[100px] resize-y`}
                        value={fullstack.briefProjectScope}
                        onChange={(e) => setFullstack((s) => ({ ...s, briefProjectScope: e.target.value }))}
                        required
                        rows={4}
                      />
                    </div>
                  </>
                ) : null}

                <div>
                  <label className={glassLabel} htmlFor={`${formId}-msg`}>
                    MESSAGE <span className="text-white/35">(OPTIONAL)</span>
                  </label>
                  <textarea
                    id={`${formId}-msg`}
                    className={`${glassInput} min-h-[80px] resize-y`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                {error ? (
                  <p className="text-sm text-red-400/90" role="alert">
                    {error}
                  </p>
                ) : null}

                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl border border-violet-400/35 bg-gradient-to-r from-violet-600/25 to-amber-500/20 py-3.5 font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.22em] text-white/95 transition-shadow hover:shadow-[0_0_32px_-8px_rgba(124,58,237,0.5)] disabled:opacity-50"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                >
                  TRANSMIT INQUIRY
                </motion.button>
              </form>
            )}
          </ModalShell>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
