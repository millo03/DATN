import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Hàm để sinh orderNumber
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${timestamp}-${random}`;
};

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    items: [],
    orderNumber: {
      type: String,
      auto: true,
      unique: true
    },
    customerInfo: {
      userName: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      payment: String,
      city: String,
      address: String,
      toa_do: {
        lat: Number,
        lng: Number
      },
    },
    totalPrice: {
      type: Number,
      required: true
    },
    discountCode: {
      type: String, // Thêm trường để lưu mã giảm giá
      default: null
    },
    discountAmount: {
      type: Number, // Thêm trường để lưu số tiền giảm giá
      default: 0
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
      }
    ],
    status: {
      type: String,
      enum: ["1", "2", "3", "4", "5", "6", "7"], //1.chờ xác nhận, 2.Đang chuẩn bị hàng, 3.Đang vận chuyển, 4. Giao hàng thành công, 5.Giao hàng thất bại, 6. Hoàn thành , 7. Hủy
      default: "1"
    },
    cancellationRequested: {
      type: Boolean,
      default: false
    },
    cancelledByAdmin: {
      type: Boolean,
      default: false
    },
    shipperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipper"
    },
    confirmationImage: String,
    deliveredAt: {
      type: Date,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    },
    failureReason: {
      type: String, // Lý do giao hàng thất bại (nếu có)
      default: null
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["1", "2", "3", "4", "5", "6", "7"],
          required: true
        },
        updatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    delivery_fee: {
      type: Number,
      default: 0
    },
    deliveryDistance: { type: String, default: null }
  },
  { timestamps: true, versionKey: false }
);
// Tạo pre-save hook để sinh orderNumber trước khi lưu vào cơ sở dữ liệu
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = generateOrderNumber();
  }
  next();
});
orderSchema.statics.findByOrderNumber = function (orderNumber) {
  return this.findOne({ orderNumber }).exec();
};

orderSchema.plugin(mongoosePaginate);

export default mongoose.model("Order", orderSchema);
