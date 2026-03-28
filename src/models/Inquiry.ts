import mongoose, { Schema, models, model } from "mongoose";
import { LEAD_SERVICE_TYPES, LEAD_STATUS_VALUES } from "@/constants/leadServiceTypes";

export type { LeadServiceType } from "@/constants/leadServiceTypes";

const InquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    organization: { type: String, required: true, trim: true, maxlength: 200 },
    serviceType: {
      type: String,
      required: true,
      enum: [...LEAD_SERVICE_TYPES],
    },
    requirements: { type: Schema.Types.Mixed, default: {} },
    message: { type: String, trim: true, maxlength: 8000, default: "" },
    status: {
      type: String,
      enum: [...LEAD_STATUS_VALUES],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "inquiries" },
);

const InquiryModel = models.Inquiry ?? model("Inquiry", InquirySchema);

export default InquiryModel;
