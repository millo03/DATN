import mongoose from "mongoose";

export async function connectDB (uri) {
  try {
    await mongoose.connect(uri);
    console.log('Connect db success !')
  } catch (error) {
    console.error(error)
  }
}

