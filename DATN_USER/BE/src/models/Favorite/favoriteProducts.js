import mongoose, { Schema } from "mongoose";

const favoriteProductSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Products"
        },
        status: {
          type: String,
          enum: ["available", "unavailable"],
          default: "available"
        }
        // attributeId: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: "Attributes"
        // }
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model("FavoriteProducts", favoriteProductSchema);
