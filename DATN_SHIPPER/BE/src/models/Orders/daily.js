import mongoose from "mongoose";

const DailyOrderStatsSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Lưu ngày dưới dạng "YYYY-MM-DD"
  shipperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalDistance: { type: Number, required: true },
  orderCount: { type: Number, required: true },
});

export const DailyOrderStats = mongoose.model(
  "DailyOrderStats",
  DailyOrderStatsSchema
);
