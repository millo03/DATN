import { Schema, mongoose } from "mongoose";

const cozeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    conversationId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);
export default mongoose.model("Coze", cozeSchema);
