import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const uploadFileCloudinary = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "demo-upload"); // Thay bằng upload preset của bạn
    formData.append("folder", "reactjs");
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/ecommercer2021/upload", // Thay bằng cloudinary name của bạn
      formData
    );
    return response.data.url;
  } catch (error) {
    // handle error here
    console.error(error);
  }
};

export { uploadFileCloudinary };

// utils/uploadImage.ts

export const UploadImage = async (file: File): Promise<string> => {
  const CLOUD_NAME = "dwya9mxip";
  const PRESET_NAME = "upImgProduct";
  const FOLDER_NAME = "PRODUCTS";
  const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", PRESET_NAME);
  formData.append("folder", FOLDER_NAME);

  try {
    const response = await axios.post(api, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.secure_url;
  } catch (error) {
    console.error("Failed to upload image");
  }
};

///uploadGallery.ts

export const UploadGallery = async (
  files: FileList | null
): Promise<string[]> => {
  if (!files) return [];

  const CLOUD_NAME = "dwya9mxip";
  const PRESET_NAME = "upImgProduct";
  const FOLDER_NAME = "PRODUCTS";
  const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const uploadPromises = Array.from(files).map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", PRESET_NAME);
    formData.append("folder", FOLDER_NAME);
    const response = await axios.post(api, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.secure_url;
  });
  try {
    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw new Error("Failed to upload images");
  }
};

// export const UploadGalleryBlog = async (
//   files: any, content: string
// )=> {
//   if (!files) return [];

//   const CLOUD_NAME = "dwya9mxip";
//   const PRESET_NAME = "upImgProduct";
//   const FOLDER_NAME = "PRODUCTS";
//   const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

//   const uploadPromises = Array.from(files).map(async (file: any) => {

//     const src = file.src;
//     const res = await fetch(src);
//     const fileBlob = await res.blob();
//     const formData = new FormData();
//     formData.append("file", fileBlob);
//     formData.append("upload_preset", PRESET_NAME);
//     formData.append("folder", FOLDER_NAME);

//     const response = await axios.post(api, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     // console.log(response.data.secure_url);
//     return { originalSrc: src, newSrc: response.data.secure_url };

//   });

//   try {
//     const uploadedUrls = await Promise.all(uploadPromises);
//     let contentNew = content;
//     uploadedUrls.forEach((img) => {
//         contentNew = contentNew.replace(img.originalSrc, img.newSrc);
//       });
//       setContentNew(contentNew);
//       console.log(contentNew);

//   } catch (error) {
//     console.error("Error uploading images:", error);
//     throw new Error("Failed to upload images");
//   }
// };
