import mongoose from "mongoose";

const screenSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

screenSchema.index({ name: "text" });
screenSchema.index({ name: 1 });

export const Screen = mongoose.model("Screen", screenSchema);
