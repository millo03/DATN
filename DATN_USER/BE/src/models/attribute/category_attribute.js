import mongoose from "mongoose";

const Category_attribute_Schema = new mongoose.Schema(
    {
        name_attribute: {
            type: String,
            required: true,
        },
        category_attribute: {
            type: String,
            required: true,
        },
        id_account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }, { timestamps: true, versionKey: false }
);

export default mongoose.model('Category_attribute', Category_attribute_Schema)