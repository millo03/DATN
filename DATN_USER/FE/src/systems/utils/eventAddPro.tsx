// utils/handleImageChange.ts
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { UseFormSetValue } from "react-hook-form";
import { IAttribute, IProduct, ISize } from "../../common/interfaces/Product";
export const handleImageChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setImagePreview: Dispatch<SetStateAction<string | null>>,
  setImageSelected: Dispatch<SetStateAction<boolean>>
) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setImageSelected(true);
  } else {
    setImageSelected(false);
  }
};

// utils/handleGalleryChange.ts

export const handleGalleryChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setGalleryPreview: React.Dispatch<React.SetStateAction<string[]>>,
  setValue: UseFormSetValue<IProduct>
) => {
  const files = e.target.files;
  if (files) {
    const previews = Array.from(files).map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise<string>((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      });
    });

    Promise.all(previews).then((newImages) => {
      setGalleryPreview((prevGallery) => {
        const updatedGallery = [...prevGallery, ...newImages];
        setValue("gallery_product", updatedGallery);
        return updatedGallery;
      });
    });
  }
};

// utils/removeGalleryImage.ts

export const removeGalleryImage = (
  index: number,
  setGalleryPreview: Dispatch<SetStateAction<string[]>>,
  galleryInputRef: MutableRefObject<HTMLInputElement | null>
) => {
  setGalleryPreview((prev) => prev.filter((_, i) => i !== index));
  if (galleryInputRef.current) {
    galleryInputRef.current.value = "";
  }
};

// utils/removeImagePreview.ts
export const removeImagePreview = (
  setImagePreview: Dispatch<SetStateAction<string | null>>,
  setImageSelected: Dispatch<SetStateAction<boolean>>,
  setValue: UseFormSetValue<IProduct>
) => {
  setImagePreview(null);
  setImageSelected(false);
  setValue("image_product", []);
};

// Hàm xử lý thay đổi thuộc tính
export const handleAttributeChange = (
  index: number,
  event: React.ChangeEvent<HTMLInputElement>,
  attributes: IAttribute[],
  setAttributes: React.Dispatch<React.SetStateAction<IAttribute[]>>
) => {
  const { name, value } = event.target;
  const updatedAttributes = [...attributes];
  updatedAttributes[index][name as keyof IAttribute] = value;
  setAttributes(updatedAttributes);
};

// Hàm xử lý thay đổi kích thước
export const handleSizeChange = (
  attributeIndex: number,
  sizeIndex: number,
  event: React.ChangeEvent<HTMLInputElement>,
  attributes: IAttribute[],
  setAttributes: React.Dispatch<React.SetStateAction<IAttribute[]>>
) => {
  const { name, value } = event.target;
  const updatedAttributes = [...attributes];
  updatedAttributes[attributeIndex].size[sizeIndex][name as keyof ISize] =
    value;
  setAttributes(updatedAttributes);
};

// Hàm thêm thuộc tính
export const handleAddAttribute = (
  attributes: IAttribute[],
  setAttributes: React.Dispatch<React.SetStateAction<IAttribute[]>>
) => {
  setAttributes([
    ...attributes,
    { color: "", size: [{ name_size: "", stock_attribute: 0 }] }
  ]);
};

// Hàm thêm kích thước
export const handleAddSize = (
  index: number,
  attributes: IAttribute[],
  setAttributes: React.Dispatch<React.SetStateAction<IAttribute[]>>
) => {
  const updatedAttributes = [...attributes];
  updatedAttributes[index].size.push({ name_size: "", stock_attribute: 0 });
  setAttributes(updatedAttributes);
};

// Hàm xóa kích thước
export const handleRemoveSize = (
  attributeIndex: number,
  sizeIndex: number,
  attributes: IAttribute[],
  setAttributes: React.Dispatch<React.SetStateAction<IAttribute[]>>
) => {
  const updatedAttributes = [...attributes];
  updatedAttributes[attributeIndex].size.splice(sizeIndex, 1);
  setAttributes(updatedAttributes);
};

// Hàm xóa thuộc tính
export const handleRemoveAttribute = (
  index: number,
  attributes: IAttribute[],
  setAttributes: React.Dispatch<React.SetStateAction<IAttribute[]>>
) => {
  const updatedAttributes = attributes.filter((_, i) => i !== index);
  setAttributes(updatedAttributes);
};
