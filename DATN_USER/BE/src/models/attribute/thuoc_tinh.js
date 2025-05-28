import mongoose from "mongoose";

const schema_thuoc_tinh = new mongoose.Schema(
    {
        ten_thuoc_tinh: {
            type: String,
            required: true,
        },
        the_loai_thuoc_tinh: {
            type: String,
            required: true,
        },
        id_account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        symbol_thuoc_tinh: String
    }, {
    timestamps: true, versionKey: false
}
)

export default mongoose.model('Thuoc_tinh', schema_thuoc_tinh)