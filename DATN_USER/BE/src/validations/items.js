import Joi from "joi";

export const validate_items = Joi.object({
  name_product: Joi.string().trim().required().messages({
    "any.required": "Tên là bắt buộc!",
    "string.empty": "Tên không được để khoảng trống!",
  }),
  price_product: Joi.number().min(1).optional(),
  image_product: Joi.optional(),
  gallery_product: Joi.required().messages({
    "any.required": "gallery_product là bắt buộc!",
    "string.empty": "gallery_product không được để khoảng trắng!",
    "string.min": "gallery_product tối thiểu là 6 kí tự!",
    "string.max": "gallery_product tối đa 5000 kí tự!",
  }),
  description_product: Joi.string().min(6).max(5000).required().messages({
    "any.required": "Mô tả là bắt buộc!",
    "string.empty": "Mô tả không được để khoảng trắng!",
    "string.min": "Mô tả tối thiểu là 6 kí tự!",
    "string.max": "Mô tả tối đa 5000 kí tự!",
  }),
  category_id: Joi.string().optional(),
  sale: Joi.number().optional(),
  attributes: Joi.optional(),
  stock: Joi.optional(),
  featured_product: Joi.boolean(),
  tag_product: Joi.optional(),
});
