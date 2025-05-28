import mongoose, { Schema } from "mongoose";


const blogSchema = new Schema({
    // title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    // createdAt: { type: Date, default: Date.now } uh huhu,
    // createdAt: { type: Date, default: Date.now } uh huhu,
    // createdAt: { type: Date, default: Date.now } uh huhu,
    // createdAt: { type: Date, default: Date.now } uh huhu,
    slug: { type: String, required: true, unique: true },
    published: { type: Boolean, default: true },
    // imageUrl: { type: String},
},{timestamps: true, versionKey: false});

export default mongoose.model('blogs', blogSchema);

