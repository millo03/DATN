import Joi from "joi";

export const signupSchema = Joi.object({
  userName: Joi.string().min(3).max(30).messages({
    "string.min": "Trường Name phải có ít nhất {#limit} ký tự",
    "string.max": "Trường Name không được vượt quá {#limit} ký tự",
  }),
  email: Joi.string()
    .email()
    .pattern(/^[^\u00C0-\u1EF9]+$/)
    .required()
    .messages({
      "any.required": "Trường Email là bắt buộc",
      "string.empty": "Trường Email không được để trống",
      "string.email": "Trường Email phải là email hợp lệ",
      "string.pattern.base": "Trường Email không được chứa ký tự có dấu",
    }),
  password: Joi.string()
    .min(6)
    .max(30)
    .pattern(/^\S*$/) // Cấm dấu cách
    .required()
    .messages({
      "any.required": "Trường Password là bắt buộc",
      "string.empty": "Trường Password không được để trống",
      "string.min": "Trường Password phải có ít nhất {#limit} ký tự",
      "string.max": "Trường Password không được vượt quá {#limit} ký tự",
      "string.pattern.base": "Trường Password không được chứa dấu cách",
    }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.required": "Trường Confirm Password là bắt buộc",
    "any.only": "Mật khẩu không trùng khớp",
  }),
  avatar: Joi.string().uri().messages({
    "string.uri": "Trường Avatar phải là đường dẫn hợp lệ",
  }),
});

export const signInpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Trường email bắt buộc phải nhập",
    "string.empty": "Trường email không được để trống",
    "string.email": "Trường email không hợp lệ",
  }),
  password: Joi.string().min(6).max(30).required().messages({
    "any.required": "Trường password bắt buộc phải nhập",
    "string.empty": "Trường password không được để trống",
    "string.min": "Trường password phải có ít nhất {#limit} ký tự",
    "string.max": "Trường password không được vượt quá {#limit} ký tự",
  }),
});
