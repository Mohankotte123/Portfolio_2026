export const LEAD_SERVICE_TYPES = ["INFRASTRUCTURE", "EXPERT_SESSIONS", "GENERAL_FULL_STACK"] as const;

export type LeadServiceType = (typeof LEAD_SERVICE_TYPES)[number];

export const LEAD_STATUS_VALUES = ["pending", "reviewed", "archived"] as const;

export type LeadStatus = (typeof LEAD_STATUS_VALUES)[number];
