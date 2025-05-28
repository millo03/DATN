import mongoose from "mongoose";
const VoucherSchema = new mongoose.Schema(
  {
    name_voucher: { type: String, required: true },
    code_voucher: { type: String, required: true, unique: true },
    description_voucher: { type: String, required: true },
    quantity_voucher: {
      type: Number, // Số lượng voucher có thể được sử dụng
      default: 0,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    }, //Loại giảm giá % hoặc trừ bao nhiêu tiền
    discountValue: { type: Number, required: true }, // Giá trị giảm giá
    maxDiscount: { type: Number, default: 0 }, // Số tiền tối đa giảm cho loại percentage
    applyType: {
      type: String,
      enum: ["product", "total", "category", "shipping_free"], // Chọn giữa sản phẩm hoặc tổng số tiền
      required: true,
    },
    appliedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products", // Liên kết tới bảng sản phẩm
      },
    ], // Danh sách sản phẩm áp dụng nếu chọn product
    appliedCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Tham chiếu đến bảng danh mục
      },
    ],
    minimumSpend: {
      required: true,
      type: Number, // Số tiền tối thiểu để sử dụng mã giảm giá nếu chọn "totalAmount"
      default: 0,
    },

    allowedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Liên kết tới bảng người dùng (User)
      },
    ], //
    startDate: {
      type: Date,
      default: Date.now,
    }, //Ngày bắt đầu

    expirationDate: { type: Date }, // Ngày hết hạn
    isActive: { type: Boolean, default: false }, // Voucher còn khả dụng không
    usedCount: {
      type: Number,
      default: 0, // Số lần voucher đã được sử dụng
    },
  },
  { timestamps: true }
);
export default mongoose.model("Voucher", VoucherSchema);
