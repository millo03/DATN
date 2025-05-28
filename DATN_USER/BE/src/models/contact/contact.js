import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    response_message: {
      type: String,
    },
    responder_email: {
      type: String,
    },
    response_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false, // Loại bỏ versionKey tự động tạo
  }
);

export default mongoose.model("Contact", contactSchema);
