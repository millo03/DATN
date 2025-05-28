import mongoose from "mongoose";
import slug from "mongoose-slug-updater";
mongoose.plugin(slug);

const categorySchema = mongoose.Schema(
  {
    name_category: {
      type: String,
      required: true,
      unique: true,
    },
    image_category: {
      type: String,
    },
    slug: {
      type: String,
      slug: "name_category",
      unique: true,
    },
    published: { type: Boolean, default: true },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model("Category", categorySchema);
