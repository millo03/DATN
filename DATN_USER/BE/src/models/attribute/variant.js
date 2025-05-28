import mongoose, { Schema } from "mongoose";

const AttributeSchema = new Schema(
    {
        values: [
            {
                color: {
                    type: String,
                },
                symbol: String,
                size: [
                    {
                        name_size: String,
                        stock_attribute: {
                            type: Number,
                            min: 0
                        },
                        price_attribute: Number,
                        // price_sale: Number
                    }
                ],
            },
        ],
    },
    { timestamps: false, versionKey: false }
);

// AttributeSchema.pre('save', function (next) {
//     this.values.forEach(value => {
//         value.size.forEach(size => {
//             if (size.price_attribute && size.sale >= 0) {
//                 size.price_sale = size.price_attribute * (1 - size.sale / 100)
//             }
//         })
//     })
//     next();
// })

export default mongoose.model("Attributes", AttributeSchema);