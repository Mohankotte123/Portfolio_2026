import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { sendLeadNotificationEmail } from "@/lib/sendLeadEmail";
import { LEAD_SERVICE_TYPES, type LeadServiceType } from "@/constants/leadServiceTypes";
import Inquiry from "@/models/Inquiry";

const ALLOWED_SERVICES = new Set<string>(LEAD_SERVICE_TYPES);

function isNonEmptyString(v: unknown, max: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.trim().length <= max;
}

function trimString(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function validateRequirements(
  serviceType: LeadServiceType,
  raw: unknown,
): { ok: true; requirements: Record<string, unknown> } | { ok: false; message: string } {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, message: "requirements must be a JSON object." };
  }
  const o = raw as Record<string, unknown>;

  if (serviceType === "INFRASTRUCTURE") {
    const projectScale = o.projectScale;
    if (projectScale !== "Single" && projectScale !== "Franchise") {
      return { ok: false, message: "projectScale must be Single or Franchise." };
    }
    const currentBillingTech = trimString(o.currentBillingTech, 500);
    const requiredTimeline = trimString(o.requiredTimeline, 300);
    const budgetBracket = trimString(o.budgetBracket, 200);
    if (!currentBillingTech) return { ok: false, message: "Current billing tech is required." };
    if (!requiredTimeline) return { ok: false, message: "Required timeline is required." };
    if (!budgetBracket) return { ok: false, message: "Budget bracket is required." };
    return {
      ok: true,
      requirements: { projectScale, currentBillingTech, requiredTimeline, budgetBracket },
    };
  }

  if (serviceType === "EXPERT_SESSIONS") {
    const targetFocus = o.targetFocus;
    if (targetFocus !== "Security" && targetFocus !== "Full-Stack") {
      return { ok: false, message: "targetFocus must be Security or Full-Stack." };
    }
    const experienceLevel = trimString(o.experienceLevel, 200);
    const numberOfSessions = trimString(o.numberOfSessions, 100);
    const specificGoal = trimString(o.specificGoal, 2000);
    if (!experienceLevel) return { ok: false, message: "Experience level is required." };
    if (!numberOfSessions) return { ok: false, message: "Number of sessions is required." };
    if (!specificGoal) return { ok: false, message: "Specific goal is required." };
    return {
      ok: true,
      requirements: { targetFocus, experienceLevel, numberOfSessions, specificGoal },
    };
  }

  const platformType = trimString(o.platformType, 300);
  const techStack = trimString(o.techStack, 500);
  const briefProjectScope = trimString(o.briefProjectScope, 4000);
  if (!platformType) return { ok: false, message: "Platform type is required." };
  if (!techStack) return { ok: false, message: "Tech stack is required." };
  if (!briefProjectScope) return { ok: false, message: "Brief project scope is required." };
  return {
    ok: true,
    requirements: { platformType, techStack, briefProjectScope },
  };
}

function validatePayload(
  body: unknown,
):
  | {
      ok: true;
      data: {
        name: string;
        email: string;
        organization: string;
        serviceType: LeadServiceType;
        requirements: Record<string, unknown>;
        message: string;
      };
    }
  | { ok: false; message: string } {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, message: "Request body must be a JSON object." };
  }
  const o = body as Record<string, unknown>;
  const name = trimString(o.name, 120);
  const email = trimString(o.email, 200);
  const organization = trimString(o.organization, 200);
  const serviceTypeRaw = trimString(o.serviceType, 80);
  const message = trimString(o.message ?? "", 8000);

  if (!name) return { ok: false, message: "Name is required." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Valid email is required." };
  }
  if (!organization) return { ok: false, message: "Organization is required." };
  if (!serviceTypeRaw || !ALLOWED_SERVICES.has(serviceTypeRaw)) {
    return { ok: false, message: "Invalid or missing serviceType." };
  }
  const serviceType = serviceTypeRaw as LeadServiceType;

  const reqResult = validateRequirements(serviceType, o.requirements);
  if (!reqResult.ok) return reqResult;

  return {
    ok: true,
    data: {
      name,
      email,
      organization,
      serviceType,
      requirements: reqResult.requirements,
      message,
    },
  };
}

export async function POST(request: Request) {
  console.log("[api/connect] POST received");

  if (!process.env.MONGODB_URI) {
    console.error("[api/connect] MONGODB_URI is not set");
    return NextResponse.json(
      { error: "Database is not configured. Set MONGODB_URI." },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch (e) {
    console.error("[api/connect] Invalid JSON body:", e);
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const result = validatePayload(json);
  if (!result.ok) {
    console.warn("[api/connect] Validation failed:", result.message);
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  try {
    console.log("[api/connect] Calling connectDB() …");
    await connectDB();
    console.log("[api/connect] MongoDB connected, creating Inquiry …", {
      serviceType: result.data.serviceType,
      email: result.data.email,
    });

    const doc = await Inquiry.create({
      name: result.data.name,
      email: result.data.email,
      organization: result.data.organization,
      serviceType: result.data.serviceType,
      requirements: result.data.requirements,
      message: result.data.message,
      status: "pending",
    });

    console.log("[api/connect] Inquiry saved:", { id: String(doc._id), createdAt: doc.createdAt });

    try {
      await sendLeadNotificationEmail({
        name: result.data.name,
        email: result.data.email,
        organization: result.data.organization,
        serviceType: result.data.serviceType,
        requirements: result.data.requirements,
        message: result.data.message,
      });
    } catch (mailErr) {
      console.error("[api/connect] Email notification failed (lead still saved):", mailErr);
    }

    return NextResponse.json({ ok: true, id: String(doc._id) }, { status: 201 });
  } catch (err) {
    console.error("[api/connect] Database or server error:", err);
    if (err instanceof Error) {
      console.error("[api/connect] Error name:", err.name, "message:", err.message);
      console.error("[api/connect] Stack:", err.stack);
    }
    return NextResponse.json(
      { error: "Could not save inquiry. Check server logs and MongoDB configuration." },
      { status: 500 },
    );
  }
}
