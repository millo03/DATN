import { required } from "joi";
import mongoose, { Schema } from "mongoose";

const AttributeSchema = new Schema(
    {
        id_item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },
        values: [
            {
                color: {
                    type: String,
                },
                size: [
                    {
                        name_size: String,
                        stock_attribute: {
                            type: Number,
                            min: 0
                        },
                        price_attribute: Number

                    }
                ],
            },
        ],
    },
    { timestamps: false, versionKey: false }
);
export default mongoose.model("Attributes", AttributeSchema);