import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const updatedFieldSchema = new mongoose.Schema({
  field: { type: String },
  time: { type: Date, default: Date.now },
  value: { type: String }
});
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String
    },
    userName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30
    },
    fullName: {
      type: String,
      minlength: 3,
      maxlength: 30
    },
    address: [
      {
        fullName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        address: { type: String, required: true },
        addressName: [
          {
            type: String
          }
        ],
        detailedAddress: { type: String },

        checked: { type: Boolean, default: false },
        coordinates: {
          lat: { type: Number },
          lng: { type: Number }
        }
      }
    ],
    phone: {
      type: String
    },
    role: {
      type: String,
      enum: ["user", "admin", "courier"],
      default: "user"
    },

    avatar: {
      type: String,
      default: "https://vectorified.com/images/default-avatar-icon-12.png"
    },

    birthDate: {
      type: String
    },
    updatedFields: { type: [updatedFieldSchema], default: [] }
  },
  { timestamps: true, versionKey: false }
);
userSchema.plugin(mongoosePaginate);
export default mongoose.model("User", userSchema);
