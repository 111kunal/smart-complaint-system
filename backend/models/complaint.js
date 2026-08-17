// backend/models/Complaint.js
import { Schema, model } from "mongoose";

const complaintSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Billing", "Technical", "Refund", "Delivery", "Service", "Other"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Pending", "Resolved"],
      default: "Open",
    },
    submitter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedAgent: {
      type: Schema.Types.ObjectId,
      ref: "User", // still User, just filtered by role: "agent"
      default: null,
    },
    assignedDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true } // createdAt replaces your old manual "date" field
);

const Complaint = model("Complaint", complaintSchema);
export default Complaint;