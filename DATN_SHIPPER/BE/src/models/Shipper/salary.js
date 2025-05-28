import mongoose from "mongoose";

const SalarySchema = new mongoose.Schema({
  shipperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  month: { type: String, required: true },
  totalDistance: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  ratePerKm: { type: Number, default: 10000 }, // Tỷ lệ lương theo km
  totalSalary: { type: Number, default: 0 },
  monthlyBonus: { type: Number, default: 0 },
  totalPayment: { type: Number, default: 0 },
});

export default mongoose.model("Salary", SalarySchema);
