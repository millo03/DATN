import Joi from "joi";

export const signUpSchema = Joi.object({
  email: Joi.string()
    .pattern(/^[^\u00C0-\u1EF9]+$/)
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "any.required": "Email bắt buộc phải nhập",
      "string.empty": "Email không được để trống",
      "string.email": "Email không hợp lệ",
      "string.pattern.base": "Email không được chứa ký tự có dấu",
    }),
  userName: Joi.string().min(3).max(30).required().messages({
    "any.required": "UserName bắt buộc phải nhập",
    "string.empty": "UserName không được để trống",
    "string.min": "UserName phải có ít nhất {#limit} ký tự",
    "string.max": "UserName không được vượt quá {#limit} ký tự",
  }),
  password: Joi.string().min(6).max(30).pattern(/^\S*$/).required().messages({
    "any.required": "Password bắt buộc phải nhập",
    "string.empty": "Password không được để trống",
    "string.min": "Password phải có ít nhất {#limit} ký tự",
    "string.max": "Password không được vượt quá {#limit} ký tự",
    "string.pattern.base": "Password không được chứa dấu cách",
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.required": "Confirmpassword bắt buộc phải nhập",
    "any.only": "Confirmpassword phải giống với password",
    "string.empty": "Confirmpassword không được để trống",
  }),
});
