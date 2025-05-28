import mongoose from "mongoose";

const monthlySummarySchema = new mongoose.Schema({
  shipperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Hoặc tên model shipper tương ứng
    required: true,
  },
  month: {
    type: String,
    required: true, // Định dạng YYYY-MM
  },
  totalDistance: {
    type: Number,
    default: 0,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model từ schema
const MonthlySummary = mongoose.model("MonthlySummary", monthlySummarySchema);

export default MonthlySummary;
