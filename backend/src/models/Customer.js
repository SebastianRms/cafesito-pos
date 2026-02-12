import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone_or_email: {
      type: String,
      required: true,
      unique: true,
      match: [/^(\d{10}|[^\s@]+@[^\s@]+\.[^\s@]+)$/, "phone (10 digits) or valid email required"],
    },
    purchases_count: {
      type: Number,
      default: 0,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

export default mongoose.model("Customer", customerSchema);