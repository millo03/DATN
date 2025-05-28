// import mongoose from "mongoose";

// const messagesSchema = new mongoose.Schema(
//   {
//     senderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
//     receiverId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
//     content: { type: String, default: "" },
//     attachments: [
//       {
//         url: {
//           type: String,
//           required: false
//         },
//         type: {
//           type: String,
//           enum: ["image", "video", "file"],
//           default: "image"
//         }
//       }
//     ],
//     icons: {
//       type: [String],
//       default: false
//     },
//     seen: {
//       type: Boolean,
//       default: false
//     }
//   },
//   { timestamps: true, versionKey: false }
// );
// const messageGroupSchema = new mongoose.Schema(
//   {
//     senderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
//     receiverId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
//     messages: [messagesSchema]
//   },
//   { timestamps: true, versionKey: false }

// );

// export default mongoose.model("Messages", messageGroupSchema);
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: { type: String, default: "" },
    attachments: [
      {
        url: { type: String, required: false },
        type: {
          type: String,
          enum: ["image", "video", "file"],
          default: "image"
        }
      }
    ],
    icons: { type: [String], default: [] },
    seen: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

const messageGroupSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    messages: [messageSchema]
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Messages", messageGroupSchema);
