import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseDelete from "mongoose-delete";

const productSchema = new mongoose.Schema(
  {
    name_product: {
      type: String,
      required: true,
      trim: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    price_product: {
      type: Number,
      min: 1,
    },
    sale: {
      type: Number,
      default: 0,
      max: 50,
    },
    image_product: {
      type: String,
      required: true,
    },
    gallery_product: {
      type: [String],
    },
    description_product: {
      type: String,
      minlength: 6,
      maxlength: 5000,
    },
    stock_product: {
      type: Number,
      default: 0,
    },
    stock: Number,
    attributes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attributes",
    },
    featured_product: {
      type: Boolean,
      default: false,
    },
    tag_product: {
      type: [String],
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

productSchema.plugin(mongoosePaginate);
productSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

// Phương thức cập nhật đánh giá trung bình
productSchema.statics.updateAverageRating = async function (productId) {
  try {
    const result = await this.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(productId) } },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "productId",
          as: "reviewDetails",
        },
      },
      { $unwind: "$reviewDetails" },
      {
        $group: {
          _id: "$_id",
          averageRating: { $avg: "$reviewDetails.rating_review" },
        },
      },
    ]);

    if (result.length > 0) {
      await this.findByIdAndUpdate(productId, {
        averageRating: result[0].averageRating,
      });
    } else {
      await this.findByIdAndUpdate(productId, { averageRating: 0 });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật trung bình sao:", error);
  }
};

export default mongoose.model("Products", productSchema);
