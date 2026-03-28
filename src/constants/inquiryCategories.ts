export const INQUIRY_CATEGORIES = [
  "POS Infrastructure",
  "Smart Contract Audit",
  "Full Stack Dev",
  "Mentorship",
] as const;

export type InquiryCategory = (typeof INQUIRY_CATEGORIES)[number];
